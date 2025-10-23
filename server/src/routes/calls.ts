import { Router } from 'express';
import { callNext, finishTicket } from '../services/queue.service';

export const callsRouter = Router();

callsRouter.post('/call', (req, res) => {
  const { counter } = req.body as { counter: number };
  const c = Number(counter);
  if (!c || c < 1) {
    res.status(400).json({ error: 'counter inválido' });
    return; 
  }

  const t = callNext(c);
  if (!t) {
    return res.json(null); 
  }

  return res.json({
    id: t.id,
    code: t.code,
    type: t.type,
    issued_at: t.issued_at,
    status: t.status,
    called_at: t.called_at,
    counter: t.counter
  });
});

callsRouter.post('/finish', (req, res) => {
  const { ticketId } = req.body as { ticketId: number };
  if (!ticketId) {
    res.status(400).json({ error: 'ticketId obrigatório' });
    return;
  }

  finishTicket(Number(ticketId));
  return res.json({ ok: true }); 
});
