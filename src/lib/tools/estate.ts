/** Federal estate tax above the basic exclusion. */
import type { ToolSpec } from './types';
import { estateTax } from '../engine/tax';
import { usd, yearField, yearOf, share } from './_kit';
export default (): ToolSpec => ({
  title: 'Federal estate tax estimate',
  fields: [
    { ...yearField(2026), label: 'Year of death', options: [{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }] },
    { id: 'estate', label: 'Taxable estate (after debts, charity, spouse)', def: 18000000, unit: '$', max: 10_000_000_000 },
    { id: 'gifts', label: 'Lifetime taxable gifts already made', def: 0, unit: '$', max: 10_000_000_000 },
    { id: 'dsue', label: "Late spouse's unused exclusion (portability)", def: 0, unit: '$', max: 100_000_000 },
  ],
  run: (v) => {
    const e = estateTax(yearOf(v.year), v.estate, v.gifts, v.dsue);
    return {
      head: ['Estimated federal estate tax', usd(e.tax)],
      sub: e.tax > 0 ? `40% of ${usd(e.over)} above the exclusion` : 'Below the exclusion: no federal estate tax',
      rows: [
        { label: 'Exclusion available', value: usd(e.exclusion), bar: share(e.exclusion, v.estate + v.gifts) },
        { label: 'Estate plus lifetime gifts', value: usd(v.estate + v.gifts) },
        { label: 'Amount above the exclusion', value: usd(e.over) },
      ],
      note: 'Simplified: assumes no gift tax paid earlier and no state estate tax. A Form 706 is required when the gross estate exceeds the exclusion, and to pass unused exclusion to a spouse.',
    };
  },
});
