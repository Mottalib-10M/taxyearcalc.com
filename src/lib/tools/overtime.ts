/** No tax on overtime (Schedule 1-A, Part III): the FLSA premium inside overtime pay, then the cap and phase-out. */
import type { ToolSpec } from './types';
import { overtimeDeduction, overtimePremium } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf, taxSaved } from './_kit';
export default (): ToolSpec => ({
  title: 'No tax on overtime: your deduction',
  fields: [
    yearField(2026), statusField('single'),
    { id: 'pay', label: 'Overtime pay you received', def: 12000, unit: '$', max: 10_000_000, help: 'The amount on your pay stubs, or the premium alone' },
    { id: 'kind', label: 'What that amount is', def: 1.5, options: [{ value: '1.5', label: 'Total pay at time and a half' }, { value: '2', label: 'Total pay at double time' }, { value: '0.5', label: 'Premium only (the "half")' }] },
    { id: 'magi', label: 'Modified AGI', def: 78000, unit: '$', max: 50_000_000 },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = statusOf(v.status);
    const prem = v.kind === 0.5 ? Math.max(0, v.pay) : overtimePremium(v.pay, v.kind);
    const d = overtimeDeduction(y, st, prem, v.magi);
    const s = taxSaved(y, st, v.magi, d.deduction);
    return {
      head: ['Overtime deduction (Schedule 1-A line 21)', usd(d.deduction)],
      sub: st === 'mfs' ? 'Married filing separately: the deduction is not allowed' : `Federal income tax saved: about ${usd(s.saved)}`,
      rows: [
        { label: 'Qualified premium in that pay', value: usd(prem) },
        { label: 'After the cap ($12,500, or $25,000 joint)', value: usd(d.capped) },
        { label: 'Phase-out reduction', value: usd(d.reduction) },
        { label: 'Marginal bracket before the deduction', value: `${s.marginal}%` },
      ],
      note: 'Only overtime the Fair Labor Standards Act requires counts: pay above 40 hours for a non-exempt worker. Overtime paid by contract or state law alone does not.',
    };
  },
});
