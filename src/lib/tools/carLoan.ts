/** No tax on car loan interest (Schedule 1-A, Part IV). */
import type { ToolSpec } from './types';
import { carLoanDeduction } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf, taxSaved } from './_kit';
export default (): ToolSpec => ({
  title: 'Car loan interest deduction',
  fields: [
    yearField(2026), statusField('single'),
    { id: 'interest', label: 'Interest paid on the loan this year', def: 2400, unit: '$', max: 1_000_000 },
    { id: 'magi', label: 'Modified AGI', def: 85000, unit: '$', max: 50_000_000 },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = statusOf(v.status);
    const d = carLoanDeduction(y, st, v.interest, v.magi);
    const s = taxSaved(y, st, v.magi, d.deduction);
    return {
      head: ['Car loan interest deduction', usd(d.deduction)],
      sub: st === 'mfs' ? 'Married filing separately: not allowed' : `About ${usd(s.saved)} less federal income tax`,
      rows: [
        { label: 'Interest counted (up to $10,000)', value: usd(d.capped) },
        { label: 'Phase-out: $200 per $1,000 or part of it', value: usd(d.reduction) },
        { label: 'Marginal bracket', value: `${s.marginal}%` },
      ],
      note: 'New vehicle bought after 2024 for personal use, final assembly in the United States, loan secured by the vehicle; the VIN goes on the return. Leases do not count.',
    };
  },
});
