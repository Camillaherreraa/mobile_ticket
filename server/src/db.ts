import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');
const db = new Database(dbPath);

// Criar tabelas se não existirem
db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    type TEXT NOT NULL,
    issued_at DATETIME NOT NULL,
    status TEXT NOT NULL,
    called_at DATETIME,
    served_at DATETIME,
    counter INTEGER
  );

  CREATE TABLE IF NOT EXISTS calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    code TEXT NOT NULL,
    type TEXT NOT NULL,
    counter INTEGER NOT NULL,
    called_at DATETIME NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
  );

  CREATE TABLE IF NOT EXISTS sequences (
    key TEXT PRIMARY KEY,
    value INTEGER NOT NULL
  );
`);

export default db;
