/** When the refund should arrive: filing date, e-file or paper, EITC/ACTC, direct deposit. */
import type { ToolSpec } from './types';
import { refundDate, daysBetween } from '../engine/tax';
import { day, yesNo } from './_kit';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export default (arg?: string): ToolSpec => {
  const a = (() => { try { return arg ? JSON.parse(arg) as { season?: number; month?: number; day?: number } : {}; } catch { return {}; } })();
  return {
    title: 'Your expected refund date',
    fields: [
      { id: 'season', label: 'Filing season', def: a.season ?? 2027, options: [{ value: '2027', label: '2027 (2026 returns)' }, { value: '2026', label: '2026 (2025 returns)' }] },
      { id: 'month', label: 'Month the IRS accepts your return', def: a.month ?? 2, options: MONTHS.map((m, i) => ({ value: String(i + 1), label: m })) },
      { id: 'day', label: 'Day of the month', def: a.day ?? 10, max: 31 },
      { id: 'efile', label: 'How you file', def: 1, options: [{ value: '1', label: 'E-file' }, { value: '0', label: 'Paper, by mail' }] },
      { id: 'credits', label: 'Claiming the EITC or the ACTC?', def: 0, options: yesNo },
      { id: 'dd', label: 'Direct deposit?', def: 1, options: yesNo },
    ],
    run: (v) => {
      const m = Math.min(Math.max(Math.round(v.month), 1), 12);
      const last = new Date(Date.UTC(v.season, m, 0)).getUTCDate();
      const d = Math.min(Math.max(Math.round(v.day) || 1, 1), last);
      const filed = `${v.season}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const r = refundDate(filed, v.efile === 1, v.credits === 1, v.dd === 1);
      return {
        head: ['Refund expected around', day(r.date)],
        sub: `${daysBetween(filed, r.date)} days after ${v.efile ? 'acceptance' : 'mailing'} on ${day(filed)}`,
        rows: [
          { label: 'Rule applied', value: r.rule },
          { label: "Where's My Refund shows a status from", value: day(r.statusFrom) },
          { label: 'Season', value: v.season === 2027 ? 'projection: the IRS announces the 2027 opening in January' : 'dates published by the IRS for 2026' },
        ],
        note: 'Most refunds come within 21 days of an accepted e-file; a return pulled for review, an offset for a past-due debt or an identity check takes longer.',
      };
    },
  };
};
