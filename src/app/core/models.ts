export type TicketType = 'SP' | 'SG' | 'SE';

export interface Ticket {
  id: number;
  code: string;      // YYMMDD-PPSQ
  type: TicketType;
  issued_at: string;
  status: 'queued' | 'called' | 'served' | 'discarded';
  called_at?: string | null;
  served_at?: string | null;
  counter?: number | null;
}

export interface Call {
  ticket_id: number;
  code: string;
  type: TicketType;
  counter: number;
  called_at: string;
}
