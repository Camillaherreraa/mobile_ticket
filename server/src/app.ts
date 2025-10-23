import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { ticketsRouter } from './routes/tickets';
import { callsRouter } from './routes/calls';
import { panelRouter } from './routes/panel';
import { reportsRouter } from './routes/reports';

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env['ALLOW_ORIGIN'] || 'http://localhost:8100' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/tickets', ticketsRouter);  
app.use('/attendant', callsRouter);      
app.use('/panel', panelRouter);
app.use('/reports', reportsRouter);           

const PORT = Number(process.env['PORT'] ?? 3333);
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
