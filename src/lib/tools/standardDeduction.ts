/** Standard deduction with the 65-or-older and blind amounts, the dependent rule and the $6,000 senior deduction. */
import type { ToolSpec } from './types';
import { standardDeduction, seniorDeduction } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf, yesNo } from './_kit';
export default (): ToolSpec => ({
  title: 'Your standard deduction',
  fields: [
    yearField(2026), statusField('single'),
    { id: 'age65', label: 'People on the return aged 65 or older', def: 0, options: [{ value: '0', label: 'None' }, { value: '1', label: 'One' }, { value: '2', label: 'Two (joint return)' }] },
    { id: 'blind', label: 'People on the return who are blind', def: 0, options: [{ value: '0', label: 'None' }, { value: '1', label: 'One' }, { value: '2', label: 'Two (joint return)' }] },
    { id: 'dep', label: 'Can someone claim you as a dependent?', def: 0, options: yesNo },
    { id: 'earned', label: 'Your earned income (dependents only)', def: 4000, unit: '$', max: 10_000_000 },
    { id: 'magi', label: 'Modified AGI (for the senior deduction)', def: 60000, unit: '$', max: 50_000_000 },
  ],
  run: (v) => {
    const year = yearOf(v.year); const st = statusOf(v.status);
    const two = st === 'mfj';
    const age65 = Math.min(v.age65, two ? 2 : 1); const blind = Math.min(v.blind, two ? 2 : 1);
    const d = standardDeduction(year, st, { age65, blind, dependent: v.dep === 1, earned: v.earned });
    const s = seniorDeduction(year, st, v.magi, age65);
    return {
      head: [`${year} standard deduction`, usd(d.total)],
      sub: s.deduction > 0 ? `${usd(d.total + s.deduction)} with the senior deduction of Schedule 1-A` : undefined,
      rows: [
        { label: v.dep === 1 ? 'Basic amount, dependent rule' : 'Basic amount', value: usd(d.basic), bar: 1 },
        { label: `Additional amount (${usd(d.per)} per box)`, value: usd(d.additional), bar: d.total ? d.additional / d.total : 0 },
        { label: 'Senior deduction (Schedule 1-A, 2025 to 2028)', value: st === 'mfs' && age65 ? 'not on a separate return' : usd(s.deduction) },
        { label: 'Total subtracted before the brackets', value: usd(d.total + s.deduction), strong: true },
      ],
      note: 'Ages and blindness are judged on December 31. The senior deduction is claimed on Schedule 1-A even if you itemize.',
    };
  },
});
