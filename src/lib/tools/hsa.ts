/** HSA limit for 2026: coverage type, catch-up at 55, months covered, employer money. */
import type { ToolSpec } from './types';
import { hsaLimit } from '../engine/tax';
import { usd } from './_kit';
export default (): ToolSpec => ({
  title: 'Your 2026 HSA contribution limit',
  fields: [
    { id: 'family', label: 'Coverage', def: 0, options: [{ value: '0', label: 'Self-only' }, { value: '1', label: 'Family' }] },
    { id: 'age', label: 'Your age on December 31, 2026', def: 45, max: 120 },
    { id: 'months', label: 'Months with HSA-eligible coverage', def: 12, max: 12 },
    { id: 'employer', label: 'Employer contributions', def: 600, unit: '$', max: 100_000 },
  ],
  run: (v) => {
    const h = hsaLimit(v.family === 1, v.age, v.months);
    const you = Math.max(0, h.limit - v.employer);
    return {
      head: ['You can still contribute', usd(you)],
      sub: `Total limit ${usd(h.limit)}, employer money included`,
      rows: [
        { label: v.family ? 'Family limit' : 'Self-only limit', value: usd(h.base) },
        { label: 'Catch-up at 55 or older', value: usd(h.catchUp) },
        { label: 'Prorated for months covered', value: usd(h.limit), bar: h.limit / (h.base + h.catchUp || 1) },
        { label: 'Employer contributions', value: usd(v.employer) },
      ],
      note: 'Monthly proration shown; the last-month rule can allow the full amount if you are covered on December 1 and stay covered through 2027.',
    };
  },
});
