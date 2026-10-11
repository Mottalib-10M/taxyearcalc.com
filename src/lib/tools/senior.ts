/** Enhanced deduction for seniors (Schedule 1-A, Part V). */
import type { ToolSpec } from './types';
import { seniorDeduction } from '../engine/tax';
import { usd, yearField, yearOf, taxSaved } from './_kit';
export default (): ToolSpec => ({
  title: 'Senior deduction: your amount after the phase-out',
  fields: [
    yearField(2026),
    { id: 'status', label: 'Filing status', def: 0, options: [{ value: '0', label: 'Single or head of household' }, { value: '1', label: 'Married filing jointly' }] },
    { id: 'people', label: 'People aged 65 or older on December 31', def: 1, options: [{ value: '1', label: 'One' }, { value: '2', label: 'Two (joint return)' }] },
    { id: 'magi', label: 'Modified AGI', def: 92000, unit: '$', max: 50_000_000, help: 'Includes taxable Social Security' },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = v.status === 1 ? 'mfj' : 'single';
    const d = seniorDeduction(y, st, v.magi, v.people);
    const s = taxSaved(y, st, v.magi, d.deduction);
    return {
      head: ['Senior deduction (Schedule 1-A line 37)', usd(d.deduction)],
      sub: `About ${usd(s.saved)} less federal income tax`,
      rows: [
        { label: 'Per person after the 6% phase-out', value: usd(d.each), bar: d.each / 6000 },
        { label: 'Reduction per person', value: usd(d.reduction) },
        { label: 'Deduction gone entirely at a MAGI of', value: usd(d.gone) },
      ],
      note: 'On top of the regular additional standard deduction for age. Both spouses need a valid SSN, and a married couple must file jointly.',
    };
  },
});
