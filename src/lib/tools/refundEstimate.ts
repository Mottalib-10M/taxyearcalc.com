/** Whole-return estimate: tax, credits and withholding → refund or balance due. */
import type { ToolSpec } from './types';
import { fullReturn } from '../engine/tax';
import { usd, rate, statusField, statusOf, yearField, yearOf, share } from './_kit';
export default (): ToolSpec => ({
  title: 'Estimate your federal refund',
  fields: [
    yearField(2026), statusField('single'),
    { id: 'wages', label: 'Wages (Form W-2, box 1)', def: 58000, unit: '$', max: 50_000_000 },
    { id: 'other', label: 'Other income (interest, side work)', def: 0, unit: '$', max: 50_000_000 },
    { id: 'withheld', label: 'Federal tax withheld (box 2)', def: 6200, unit: '$', max: 50_000_000 },
    { id: 'kids', label: 'Children under 17', def: 0, options: [0, 1, 2, 3, 4].map((n) => ({ value: String(n), label: n === 4 ? '4 or more' : String(n) })) },
    { id: 'tips', label: 'Qualified tips', def: 0, unit: '$', max: 10_000_000 },
    { id: 'ot', label: 'Overtime premium (the "half")', def: 0, unit: '$', max: 10_000_000 },
    { id: 'age65', label: 'People aged 65 or older', def: 0, options: [{ value: '0', label: 'None' }, { value: '1', label: 'One' }, { value: '2', label: 'Two (joint)' }] },
    { id: 'item', label: 'Itemized deductions, if larger', def: 0, unit: '$', max: 50_000_000 },
  ],
  run: (v) => {
    const st = statusOf(v.status);
    const r = fullReturn({ year: yearOf(v.year), status: st, wages: v.wages, otherIncome: v.other, adjustments: 0, itemized: v.item, age65: Math.min(v.age65, st === 'mfj' ? 2 : 1), kids: v.kids, tips: v.tips, overtimePremium: v.ot, withholding: v.withheld });
    const big = Math.max(r.taxBefore, r.withholding + r.refundable, 1);
    return {
      head: [r.refund > 0 ? 'Estimated refund' : r.owe > 0 ? 'Estimated balance due' : 'Even', usd(r.refund > 0 ? r.refund : r.owe)],
      sub: `Taxable income ${usd(r.taxable)} · marginal bracket ${r.marginal}% · effective rate ${rate(r.effective)}`,
      rows: [
        { label: 'Adjusted gross income', value: usd(r.agi) },
        { label: r.usedItemized ? 'Itemized deductions' : 'Standard deduction', value: usd(r.below) },
        { label: 'Schedule 1-A deductions (tips, overtime, seniors)', value: usd(r.extra) },
        { label: 'Tax before credits', value: usd(r.taxBefore), bar: share(r.taxBefore, big) },
        { label: 'Child tax credit used against tax', value: usd(r.ctcNonrefundable) },
        { label: 'Refundable credits (ACTC, EITC)', value: usd(r.refundable) },
        { label: 'Withholding', value: usd(r.withholding), bar: share(r.withholding + r.refundable, big) },
      ],
      note: 'Wage earner return: no self-employment tax, education credits, AMT or state tax. The EITC also assumes no investment income.',
    };
  },
});
