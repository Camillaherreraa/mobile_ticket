import db from '../db';

export type TicketType = 'SP' | 'SG' | 'SE';
export type TicketStatus = 'queued' | 'called' | 'served' | 'discarded';

export interface Ticket {
  id: number;
  code: string;
  type: TicketType;
  issued_at: Date;
  status: TicketStatus;
  called_at?: Date | null;
  served_at?: Date | null;
  counter?: number | null;
}

export interface CallRow {
  ticket_id: number;
  code: string;
  type: TicketType;
  counter: number;
  called_at: Date;
}

let lastPriorityCalled: TicketType | null = null;

function todayYYMMDD() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

function nextSeq(pp: TicketType) {
  const key = `${todayYYMMDD()}-${pp}`;
  const stmt = db.prepare('SELECT value FROM sequences WHERE key = ?');
  let row = stmt.get(key) as { value: number } | undefined;
  if (row) {
    const newValue = row.value + 1;
    const updateStmt = db.prepare('UPDATE sequences SET value = ? WHERE key = ?');
    updateStmt.run(newValue, key);
    return newValue;
  } else {
    const insertStmt = db.prepare('INSERT INTO sequences (key, value) VALUES (?, ?)');
    insertStmt.run(key, 1);
    return 1;
  }
}

function buildCode(pp: TicketType) {
  const yymmdd = todayYYMMDD();
  const sq = String(nextSeq(pp)).padStart(3, '0');
  return `${yymmdd}-${pp}${sq}`;
}

export function emitTicket(type: TicketType): Ticket {
  const code = buildCode(type);
  const issued_at = new Date();
  const stmt = db.prepare(`
    INSERT INTO tickets (code, type, issued_at, status)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(code, type, issued_at.toISOString(), 'queued');
  const id = result.lastInsertRowid as number;
  return {
    id,
    code,
    type,
    issued_at,
    status: 'queued',
  };
}

function popFromQueue(t: TicketType, counter: number): Ticket | null {
  const stmt = db.prepare(`
    SELECT * FROM tickets
    WHERE type = ? AND status = 'queued'
    ORDER BY issued_at ASC
    LIMIT 1
  `);
  const row = stmt.get(t) as any;
  if (!row) return null;

  // Update status to called
  const updateStmt = db.prepare(`
    UPDATE tickets SET status = 'called', called_at = ?, counter = ?
    WHERE id = ?
  `);
  updateStmt.run(new Date().toISOString(), counter, row.id);

  // Insert into calls
  const callStmt = db.prepare(`
    INSERT INTO calls (ticket_id, code, type, counter, called_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  callStmt.run(row.id, row.code, row.type, counter, new Date().toISOString());

  lastPriorityCalled = t;

  return {
    id: row.id,
    code: row.code,
    type: row.type,
    issued_at: new Date(row.issued_at),
    status: 'called',
    called_at: new Date(),
    counter,
  };
}

export function callNext(counter: number): Ticket | null {
  const pick = (): Ticket | null => {
    if (lastPriorityCalled === 'SP') {
      return popFromQueue('SE', counter) ?? popFromQueue('SG', counter) ?? popFromQueue('SP', counter);
    }
    return popFromQueue('SP', counter) ?? popFromQueue('SE', counter) ?? popFromQueue('SG', counter);
  };

  return pick();
}

export function finishTicket(id: number) {
  const stmt = db.prepare(`
    UPDATE tickets SET status = 'served', served_at = ?
    WHERE id = ?
  `);
  const result = stmt.run(new Date().toISOString(), id);
  return result.changes > 0;
}

export function lastCalls(limit = 5): CallRow[] {
  const stmt = db.prepare(`
    SELECT ticket_id, code, type, counter, called_at
    FROM calls
    ORDER BY called_at DESC
    LIMIT ?
  `);
  const rows = stmt.all(limit) as CallRow[];
  return rows;
}




function ymd(d: Date) { return d.toISOString().slice(0,10); }
function sameMonth(d: Date, y: number, m: number) {
  return d.getFullYear() === y && (d.getMonth()+1) === m;
}

export function reportDaily(dateStr: string) {
  // tickets emitidos no dia
  const stmt = db.prepare(`
    SELECT * FROM tickets
    WHERE DATE(issued_at) = ?
  `);
  const issued = stmt.all(dateStr) as Ticket[];

  // chamadas no dia
  const callStmt = db.prepare(`
    SELECT * FROM calls
    WHERE DATE(called_at) = ?
  `);
  const inDayCalls = callStmt.all(dateStr) as CallRow[];

  const tipos: Record<TicketType, number> = { SP:0, SG:0, SE:0 };
  issued.forEach(t => tipos[t.type]++);

  return {
    totais: {
      emitidas: issued.length,
      atendidas: inDayCalls.length,
      descartadas: 0
    },
    tipos,
    detalhado: issued
      .map(t => ({ code: t.code, type: t.type, issued_at: new Date(t.issued_at), counter: t.counter ?? null }))
      .sort((a,b) => +new Date(b.issued_at) - +new Date(a.issued_at))
  };
}

export function reportMonthly(year: number, month: number) {
  const stmt = db.prepare(`
    SELECT * FROM tickets
    WHERE strftime('%Y', issued_at) = ? AND strftime('%m', issued_at) = ?
  `);
  const monthTickets = stmt.all(String(year), String(month).padStart(2, '0')) as Ticket[];

  const callStmt = db.prepare(`
    SELECT * FROM calls
    WHERE strftime('%Y', called_at) = ? AND strftime('%m', called_at) = ?
  `);
  const monthCalls = callStmt.all(String(year), String(month).padStart(2, '0')) as CallRow[];

  const tipos: Record<TicketType, number> = { SP:0, SG:0, SE:0 };
  monthTickets.forEach(t => tipos[t.type]++);

  return {
    totais: {
      emitidas: monthTickets.length,
      atendidas: monthCalls.length,
      descartadas: 0
    },
    tipos
  };
}
