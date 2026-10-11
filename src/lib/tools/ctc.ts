/** Child tax credit with the phase-out and the refundable additional child tax credit. */
import type { ToolSpec } from './types';
import { childTaxCredit, incomeTax, standardDeduction } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf, share } from './_kit';
export default (): ToolSpec => ({
  title: 'Child tax credit for your family',
  fields: [
    yearField(2026), statusField('mfj'),
    { id: 'kids', label: 'Qualifying children under 17', def: 2, options: [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) })) },
    { id: 'agi', label: 'Adjusted gross income', def: 65000, unit: '$', max: 50_000_000 },
    { id: 'earned', label: 'Earned income (wages, self-employment)', def: 65000, unit: '$', max: 50_000_000 },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = statusOf(v.status);
    const tax = incomeTax(y, st, Math.max(0, v.agi - standardDeduction(y, st).total)).tax;
    const c = childTaxCredit(y, st, v.kids, v.agi, tax, v.earned);
    return {
      head: ['Child tax credit', usd(c.total)],
      sub: `${usd(c.nonrefundable)} against tax + ${usd(c.refundable)} refundable`,
      rows: [
        { label: 'Before the phase-out', value: usd(c.gross), bar: 1 },
        { label: 'Phase-out reduction', value: usd(c.reduction), bar: share(c.reduction, c.gross) },
        { label: 'Income tax before the credit (standard deduction)', value: usd(tax) },
        { label: 'Refundable part (ACTC)', value: usd(c.refundable) },
        { label: 'Credit fully phased out at an AGI of', value: usd(c.goneAt) },
      ],
      note: 'Child under 17 at the end of the year with an SSN valid for work; one parent on a joint return needs a valid SSN. The $500 credit for other dependents is not included.',
    };
  },
});
