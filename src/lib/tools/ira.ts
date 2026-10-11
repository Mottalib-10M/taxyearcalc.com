/** Traditional IRA: contribution limit and the deductible part when a workplace plan covers you or your spouse. */
import type { ToolSpec } from './types';
import { iraDeduction } from '../engine/tax';
import { usd, statusField, statusOf, yesNo } from './_kit';
export default (): ToolSpec => ({
  title: 'IRA contribution limit and deduction for 2026',
  fields: [
    statusField('single'),
    { id: 'age', label: 'Your age on December 31, 2026', def: 40, max: 120 },
    { id: 'magi', label: 'Modified AGI', def: 86000, unit: '$', max: 50_000_000 },
    { id: 'covered', label: 'Covered by a plan at work?', def: 1, options: yesNo },
    { id: 'spouse', label: 'Spouse covered by a plan at work?', def: 0, options: yesNo },
  ],
  run: (v) => {
    const st = statusOf(v.status);
    const d = iraDeduction(st, v.magi, v.age, v.covered === 1, st === 'mfj' || st === 'mfs' ? v.spouse === 1 : false);
    return {
      head: ['Deductible traditional IRA contribution', usd(d.limit)],
      sub: `Contribution limit ${usd(d.full)} (all your IRAs combined)`,
      rows: [
        { label: 'Contribution limit', value: usd(d.full), bar: 1 },
        { label: 'Deductible part', value: usd(d.limit), bar: d.full ? d.limit / d.full : 0 },
        { label: 'Non-deductible part (Form 8606)', value: usd(d.full - d.limit) },
        { label: 'Deduction phase-out range', value: d.range ? `${usd(d.range[0])} to ${usd(d.range[1])}` : 'none: nobody covered' },
      ],
      note: 'You also need taxable compensation at least equal to the contribution. Contributions for 2026 can be made until the April 2027 filing deadline.',
    };
  },
});
