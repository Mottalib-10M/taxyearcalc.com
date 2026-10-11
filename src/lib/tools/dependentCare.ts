/** Child and dependent care credit, 2026 rate schedule. */
import type { ToolSpec } from './types';
import { dependentCareCredit } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf } from './_kit';
export default (): ToolSpec => ({
  title: 'Child and dependent care credit',
  fields: [
    yearField(2026), statusField('mfj', ['single', 'mfj', 'hoh']),
    { id: 'agi', label: 'Adjusted gross income', def: 70000, unit: '$', max: 50_000_000 },
    { id: 'exp', label: 'Care costs paid (minus FSA money)', def: 8000, unit: '$', max: 1_000_000 },
    { id: 'people', label: 'Children under 13 or dependents', def: 2, options: [{ value: '1', label: 'One' }, { value: '2', label: 'Two or more' }] },
  ],
  run: (v) => {
    const c = dependentCareCredit(yearOf(v.year), statusOf(v.status), v.agi, v.exp, v.people);
    return {
      head: ['Credit', usd(c.credit)],
      sub: `${c.rate}% of ${usd(c.counted)}`,
      rows: [
        { label: 'Expense cap', value: usd(c.cap) },
        { label: 'Your rate at this AGI', value: `${c.rate}%`, bar: c.rate / 50 },
      ],
      note: 'Nonrefundable: it cannot exceed your income tax. Expenses are limited to the lower earnings of the two spouses.',
    };
  },
});
