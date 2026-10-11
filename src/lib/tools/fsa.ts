/** Health FSA and dependent care FSA limits for 2026. */
import type { ToolSpec } from './types';
import { Y } from '../engine/tax';
import { usd } from './_kit';
export default (): ToolSpec => ({
  title: 'FSA limits for your 2026 election',
  fields: [
    { id: 'health', label: 'Health FSA election', def: 2800, unit: '$', max: 100_000 },
    { id: 'spent', label: 'Expected eligible spending', def: 2500, unit: '$', max: 100_000 },
    { id: 'dc', label: 'Dependent care FSA election', def: 5000, unit: '$', max: 100_000 },
    { id: 'mfs', label: 'Married filing separately?', def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
  ],
  run: (v) => {
    const f = Y(2026).fsa;
    const health = Math.min(v.health, f.health);
    const left = Math.max(0, health - v.spent);
    const dcMax = v.mfs ? f.dependentCareMfs : f.dependentCare;
    return {
      head: ['Health FSA you can elect', usd(health)],
      sub: `Dependent care FSA up to ${usd(dcMax)}`,
      rows: [
        { label: 'Health FSA cap', value: usd(f.health) },
        { label: 'Left unspent at year end', value: usd(left) },
        { label: 'Carryover allowed (if the plan offers it)', value: usd(Math.min(left, f.carryover)) },
        { label: 'Dependent care election above the cap', value: usd(Math.max(0, v.dc - dcMax)) },
      ],
      note: 'The dependent care cap rose for 2026 under P.L. 119-21. Plans choose between a carryover and a grace period, or neither.',
    };
  },
});
