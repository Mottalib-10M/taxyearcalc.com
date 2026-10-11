/** No tax on tips (Schedule 1-A, Part II). */
import type { ToolSpec } from './types';
import { tipsDeduction, S } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf, taxSaved, share } from './_kit';
export default (): ToolSpec => ({
  title: 'No tax on tips: your deduction and what it saves',
  fields: [
    yearField(2026), statusField('single', ['single', 'mfj', 'hoh', 'mfs']),
    { id: 'tips', label: 'Qualified tips for the year', def: 18000, unit: '$', max: 10_000_000, help: 'W-2 box 7 or code TP' },
    { id: 'magi', label: 'Modified AGI (Form 1040 line 11b)', def: 52000, unit: '$', max: 50_000_000, help: 'Tips included' },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = statusOf(v.status);
    const d = tipsDeduction(y, st, v.tips, v.magi);
    const s = taxSaved(y, st, v.magi, d.deduction);
    const fica = (Math.max(0, v.tips) * (S.fica.socialSecurity + S.fica.medicare)) / 100;
    return {
      head: ['Tips deduction (Schedule 1-A line 13)', usd(d.deduction)],
      sub: st === 'mfs' ? 'Married filing separately: the deduction is not allowed' : `Federal income tax saved: about ${usd(s.saved)}`,
      rows: [
        { label: 'Tips counted (capped at the maximum)', value: usd(d.capped), bar: share(d.capped, 25000) },
        { label: 'Phase-out reduction', value: usd(d.reduction) },
        { label: 'Your marginal bracket before the deduction', value: `${s.marginal}%` },
        { label: 'Social Security and Medicare still withheld on these tips', value: usd(fica) },
      ],
      note: 'Only tips received in an occupation on the IRS list of tipped occupations count. A valid SSN is required, and a married couple must file jointly.',
    };
  },
});
