/** Charitable deduction under the 2026 rules: non-itemizer deduction and the 0.5% floor. */
import type { ToolSpec } from './types';
import { charity, incomeTax, standardDeduction } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf } from './_kit';
export default (): ToolSpec => ({
  title: 'What your donations are worth on the return',
  fields: [
    yearField(2026), statusField('single'),
    { id: 'cash', label: 'Cash gifts to charities', def: 2500, unit: '$', max: 100_000_000 },
    { id: 'agi', label: 'Adjusted gross income', def: 90000, unit: '$', max: 100_000_000 },
    { id: 'item', label: 'Do you itemize?', def: 0, options: [{ value: '0', label: 'No, standard deduction' }, { value: '1', label: 'Yes, Schedule A' }] },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = statusOf(v.status);
    const c = charity(y, st, v.cash, v.agi);
    const ded = v.item ? c.itemized : c.nonItemizer;
    const taxable = Math.max(0, v.agi - standardDeduction(y, st).total);
    const saved = incomeTax(y, st, taxable).tax - incomeTax(y, st, Math.max(0, taxable - ded)).tax;
    return {
      head: ['Charitable deduction', usd(ded)],
      sub: `About ${usd(saved)} of federal tax saved`,
      rows: v.item ? [
        { label: '0.5% floor of AGI', value: y === 2026 ? usd(c.floor) : 'none in 2025' },
        { label: 'Gifts above the floor', value: usd(c.itemized) },
      ] : [
        { label: 'Non-itemizer limit', value: y === 2026 ? usd(st === 'mfj' ? 2000 : 1000) : 'no deduction in 2025' },
        { label: 'Gifts not deductible', value: usd(Math.max(0, v.cash - c.nonItemizer)) },
      ],
      note: 'Cash gifts to public charities. Donor-advised funds and supporting organizations do not qualify for the non-itemizer deduction. The tax saved assumes the standard deduction for comparison.',
    };
  },
});
