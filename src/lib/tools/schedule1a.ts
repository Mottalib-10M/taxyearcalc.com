/** All four Schedule 1-A deductions at once, and the tax they save together. */
import type { ToolSpec } from './types';
import { tipsDeduction, overtimeDeduction, carLoanDeduction, seniorDeduction } from '../engine/tax';
import { usd, yearField, yearOf, taxSaved, share } from './_kit';
export default (): ToolSpec => ({
  title: 'Schedule 1-A: the four new deductions together',
  fields: [
    yearField(2026),
    { id: 'status', label: 'Filing status', def: 0, options: [{ value: '0', label: 'Single or head of household' }, { value: '1', label: 'Married filing jointly' }] },
    { id: 'magi', label: 'Modified AGI', def: 95000, unit: '$', max: 50_000_000 },
    { id: 'tips', label: 'Qualified tips', def: 0, unit: '$', max: 10_000_000 },
    { id: 'ot', label: 'Overtime premium', def: 6000, unit: '$', max: 10_000_000 },
    { id: 'car', label: 'Car loan interest', def: 1500, unit: '$', max: 1_000_000 },
    { id: 'seniors', label: 'People aged 65 or older', def: 0, options: [{ value: '0', label: 'None' }, { value: '1', label: 'One' }, { value: '2', label: 'Two (joint)' }] },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = v.status === 1 ? 'mfj' : 'single';
    const t = tipsDeduction(y, st, v.tips, v.magi).deduction;
    const o = overtimeDeduction(y, st, v.ot, v.magi).deduction;
    const c = carLoanDeduction(y, st, v.car, v.magi).deduction;
    const s = seniorDeduction(y, st, v.magi, v.seniors).deduction;
    const total = t + o + c + s;
    return {
      head: ['Schedule 1-A line 38', usd(total)],
      sub: `About ${usd(taxSaved(y, st, v.magi, total).saved)} of federal income tax saved`,
      rows: [
        { label: 'No tax on tips', value: usd(t), bar: share(t, total) },
        { label: 'No tax on overtime', value: usd(o), bar: share(o, total) },
        { label: 'Car loan interest', value: usd(c), bar: share(c, total) },
        { label: 'Enhanced deduction for seniors', value: usd(s), bar: share(s, total) },
      ],
      note: 'All four reduce taxable income, not AGI, and can be claimed with the standard deduction or itemizing. They run from 2025 through 2028.',
    };
  },
});
