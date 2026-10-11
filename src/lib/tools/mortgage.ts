/** Deductible mortgage interest under the $750,000 limit, and whether itemizing pays. */
import type { ToolSpec } from './types';
import { mortgageInterest, saltDeduction, standardDeduction } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf, yesNo } from './_kit';
export default (): ToolSpec => ({
  title: 'Mortgage interest you can deduct',
  fields: [
    yearField(2026), statusField('mfj'),
    { id: 'balance', label: 'Average mortgage balance', def: 520000, unit: '$', max: 100_000_000 },
    { id: 'interest', label: 'Interest paid (Form 1098)', def: 31000, unit: '$', max: 10_000_000 },
    { id: 'old', label: 'Mortgage taken before December 16, 2017?', def: 0, options: yesNo },
    { id: 'salt', label: 'State, local and property taxes paid', def: 14000, unit: '$', max: 10_000_000 },
    { id: 'magi', label: 'Modified AGI', def: 190000, unit: '$', max: 100_000_000 },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = statusOf(v.status);
    const m = mortgageInterest(st, v.balance, v.interest, v.old === 1);
    const s = saltDeduction(y, st, v.salt, v.magi);
    const std = standardDeduction(y, st).total;
    const item = m.deductible + s.deduction;
    return {
      head: ['Deductible mortgage interest', usd(m.deductible)],
      sub: item > std ? `Itemizing gives ${usd(item)}: ${usd(item - std)} more than the standard deduction` : `Itemizing (${usd(item)}) loses to the standard deduction (${usd(std)})`,
      rows: [
        { label: 'Debt limit that applies', value: usd(m.limit) },
        { label: 'Share of interest deductible', value: `${Math.round(m.share * 1000) / 10}%`, bar: m.share },
        { label: 'SALT deduction alongside', value: usd(s.deduction) },
        { label: 'Standard deduction', value: usd(std) },
      ],
      note: 'Acquisition debt on a main or second home. From 2026 mortgage insurance premiums count as interest again (P.L. 119-21 §70108); they are not included here.',
    };
  },
});
