/** Student loan interest deduction. */
import type { ToolSpec } from './types';
import { studentLoanInterest } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf, taxSaved } from './_kit';
export default (): ToolSpec => ({
  title: 'Student loan interest deduction',
  fields: [
    yearField(2026), statusField('single', ['single', 'mfj', 'hoh', 'mfs']),
    { id: 'paid', label: 'Interest paid (Form 1098-E)', def: 1800, unit: '$', max: 1_000_000 },
    { id: 'magi', label: 'Modified AGI', def: 70000, unit: '$', max: 50_000_000 },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = statusOf(v.status);
    const d = studentLoanInterest(y, st, v.paid, v.magi);
    return {
      head: ['Deductible interest', usd(d.deduction)],
      sub: st === 'mfs' ? 'Not allowed on a separate return' : `About ${usd(taxSaved(y, st, v.magi, d.deduction).saved)} of tax saved`,
      rows: [
        { label: 'Share kept after the phase-out', value: `${Math.round(d.share * 100)}%`, bar: d.share },
        { label: 'Phase-out range', value: d.range ? `${usd(d.range[0])} to ${usd(d.range[1])}` : '-' },
      ],
      note: 'Capped at $2,500 a year. The deduction is an adjustment to income, so it lowers AGI too.',
    };
  },
});
