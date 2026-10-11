/** Annual gift exclusion: what is taxable, whether Form 709 is due, and the lifetime exemption left. */
import type { ToolSpec } from './types';
import { giftTax } from '../engine/tax';
import { usd, yearField, yearOf, yesNo } from './_kit';
export default (): ToolSpec => ({
  title: 'Gift tax check for the year',
  fields: [
    yearField(2026),
    { id: 'gift', label: 'Gift to each person', def: 25000, unit: '$', max: 100_000_000 },
    { id: 'people', label: 'Number of people receiving it', def: 2, max: 100 },
    { id: 'split', label: 'Splitting gifts with your spouse?', def: 0, options: yesNo },
  ],
  run: (v) => {
    const y = yearOf(v.year);
    const g = giftTax(y, Array.from({ length: Math.max(0, Math.round(v.people)) }, () => v.gift), v.split === 1);
    return {
      head: ['Taxable gifts this year', usd(g.taxable)],
      sub: g.taxable > 0 || v.split === 1 ? 'A Form 709 gift tax return is required' : 'No gift tax return needed',
      rows: [
        { label: v.split ? 'Exclusion per person, split' : 'Exclusion per person', value: usd(g.exclusion) },
        { label: 'Lifetime exemption left after these gifts', value: usd(g.exemptionLeft) },
        { label: 'Gift tax to pay now', value: usd(0) },
      ],
      note: 'Tax is owed only once lifetime taxable gifts pass the basic exclusion. Tuition and medical bills paid directly to the school or provider are excluded without limit.',
    };
  },
});
