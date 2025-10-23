import { Router, Request } from 'express';
import { reportDaily, reportMonthly } from '../services/queue.service';

export const reportsRouter = Router();

// Tipos das queries
type DailyQuery = { date?: string };
type MonthlyQuery = { year?: string; month?: string };

reportsRouter.get(
  '/daily',
  (req: Request<{}, {}, {}, DailyQuery>, res) => {
    const { date = '' } = req.query; // agora sem ts(4111)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Use date=YYYY-MM-DD' });
    }
    return res.json(reportDaily(date));
  }
);

reportsRouter.get(
  '/monthly',
  (req: Request<{}, {}, {}, MonthlyQuery>, res) => {
    const { year = '', month = '' } = req.query; // agora sem ts(4111)
    const y = Number(year);
    const m = Number(month);
    if (!y || !m) {
      return res.status(400).json({ error: 'Use year=YYYY&month=MM' });
    }
    return res.json(reportMonthly(y, m));
  }
);
