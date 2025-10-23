import { Router } from 'express';
import { emitTicket, TicketType } from '../services/queue.service';

export const ticketsRouter = Router();

ticketsRouter.post('/emit', (req, res) => {
  const { type } = req.body as { type: TicketType };
  if (!type || !['SP','SG','SE'].includes(type)) {
    res.status(400).json({ error: 'type inválido (SP|SG|SE)' });
    return; 
  }

  const t = emitTicket(type);
  return res.json({ 
    id: t.id,
    code: t.code,
    type: t.type,
    issued_at: t.issued_at,
    status: t.status
  });
});
