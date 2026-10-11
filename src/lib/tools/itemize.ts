/** Itemized deductions against the standard deduction, with the 2026 limit for the 37% bracket. */
import type { ToolSpec } from './types';
import { standardDeduction, saltDeduction, charity, brackets } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf } from './_kit';
export default (): ToolSpec => ({
  title: 'Itemize or take the standard deduction?',
  fields: [
    yearField(2026), statusField('mfj'),
    { id: 'agi', label: 'Adjusted gross income', def: 210000, unit: '$', max: 100_000_000 },
    { id: 'salt', label: 'State, local and property taxes', def: 19000, unit: '$', max: 10_000_000 },
    { id: 'mort', label: 'Mortgage interest', def: 14000, unit: '$', max: 10_000_000 },
    { id: 'gifts', label: 'Charitable gifts', def: 3000, unit: '$', max: 10_000_000 },
    { id: 'med', label: 'Medical costs', def: 0, unit: '$', max: 10_000_000 },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = statusOf(v.status);
    const s = saltDeduction(y, st, v.salt, v.agi).deduction;
    const g = charity(y, st, v.gifts, v.agi).itemized;
    const med = Math.max(0, v.med - v.agi * 0.075);
    let item = s + v.mort + g + med;
    const top = brackets(y, st)[5][0] as number;
    let cut = 0;
    if (y === 2026) { const over = Math.max(0, v.agi - item - top + item); cut = (2 / 37) * Math.min(item, Math.max(0, v.agi - top)); void over; item -= cut; }
    const std = standardDeduction(y, st).total;
    const nonItem = charity(y, st, v.gifts, v.agi).nonItemizer;
    return {
      head: [item > std + nonItem ? 'Itemize' : 'Take the standard deduction', usd(Math.max(item, std + nonItem))],
      sub: `Itemized ${usd(item)} against standard ${usd(std)}${nonItem ? ` + ${usd(nonItem)} for gifts` : ''}`,
      rows: [
        { label: 'SALT after the cap', value: usd(s) },
        { label: 'Charity above the 0.5% floor', value: usd(g) },
        { label: 'Medical above 7.5% of AGI', value: usd(med) },
        { label: '2/37 reduction (37% bracket only)', value: usd(cut) },
      ],
      note: 'The 2/37 reduction uses AGI as a stand-in for taxable income plus itemized deductions. In 2026 non-itemizers also deduct up to $1,000 ($2,000 joint) of cash gifts.',
    };
  },
});
