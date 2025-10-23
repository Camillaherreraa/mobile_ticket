import { Router } from 'express';
import { lastCalls } from '../services/queue.service';

export const panelRouter = Router();

panelRouter.get('/last', (_req, res) => {
  res.json(lastCalls(5));
});
