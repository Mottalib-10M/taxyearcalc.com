/** Section 179 limit with its phase-out, and 100% bonus depreciation on the rest. */
import type { ToolSpec } from './types';
import { section179 } from '../engine/tax';
import { usd, yearField, yearOf } from './_kit';
export default (): ToolSpec => ({
  title: 'First-year write-off of business equipment',
  fields: [
    yearField(2026),
    { id: 'cost', label: 'Cost of the equipment', def: 180000, unit: '$', max: 1_000_000_000 },
    { id: 'all', label: 'All section 179 property placed in service', def: 180000, unit: '$', max: 1_000_000_000 },
    { id: 'after', label: 'Acquired after January 19, 2025?', def: 1, options: [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }] },
  ],
  run: (v) => {
    const s = section179(yearOf(v.year), v.cost, Math.max(v.all, v.cost));
    const rest = Math.max(0, v.cost - s.expensed);
    const bonus = v.after ? rest : 0;
    return {
      head: ['Deductible in the first year', usd(s.expensed + bonus)],
      sub: v.after ? 'Section 179, then 100% bonus depreciation on any rest' : 'Section 179 only; older acquisitions follow the phase-down rates',
      rows: [
        { label: 'Section 179 limit after the phase-out', value: usd(s.limit) },
        { label: 'Expensed under section 179', value: usd(s.expensed) },
        { label: 'Bonus depreciation', value: usd(bonus) },
      ],
      note: 'Section 179 is also limited to business taxable income; bonus depreciation is not. Heavy SUVs have a separate section 179 cap.',
    };
  },
});
