/** Roth IRA contribution allowed by income. */
import type { ToolSpec } from './types';
import { rothLimit } from '../engine/tax';
import { usd, statusField, statusOf, share } from './_kit';
export default (): ToolSpec => ({
  title: 'How much you can put in a Roth IRA for 2026',
  fields: [
    statusField('single'),
    { id: 'magi', label: 'Modified AGI for Roth purposes', def: 158000, unit: '$', max: 50_000_000 },
    { id: 'age', label: 'Your age on December 31, 2026', def: 35, max: 120 },
  ],
  run: (v) => {
    const r = rothLimit(statusOf(v.status), v.magi, v.age);
    return {
      head: ['Roth IRA contribution allowed', usd(r.limit)],
      sub: r.limit === r.full ? 'Full contribution' : r.limit === 0 ? 'Income above the range: direct contributions not allowed' : 'Reduced contribution',
      rows: [
        { label: 'Full limit at your age', value: usd(r.full), bar: 1 },
        { label: 'Allowed at your income', value: usd(r.limit), bar: share(r.limit, r.full) },
        { label: 'Phase-out range', value: `${usd(r.range[0])} to ${usd(r.range[1])}` },
      ],
      note: 'Reduced amounts are rounded up to the next $10, and any amount between $0 and $200 becomes $200 (IRS Publication 590-A worksheet).',
    };
  },
});
