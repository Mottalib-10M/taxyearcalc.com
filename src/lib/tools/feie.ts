import type { ToolSpec } from './types';
import { feie } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf } from './_kit';
/** Foreign earned income exclusion with the stacking rule. */
export default (): ToolSpec => ({
  title: 'Foreign earned income exclusion',
  fields: [
    yearField(2026), statusField('single'),
    { id: 'foreign', label: 'Foreign earned income', def: 150000, unit: '$', max: 100_000_000 },
    { id: 'other', label: 'Other income (US interest, rent)', def: 0, unit: '$', max: 100_000_000 },
    { id: 'days', label: 'Qualifying days abroad in the year', def: 365, max: 365 },
  ],
  run: (v) => {
    const f = feie(yearOf(v.year), statusOf(v.status), v.foreign, v.other, v.days);
    return {
      head: ['US income tax after the exclusion', usd(f.tax)],
      sub: `${usd(f.withoutExclusion - f.tax)} less than without it`,
      rows: [{ label: 'Exclusion available', value: usd(f.max) }, { label: 'Excluded', value: usd(f.excluded) }, { label: 'Taxable income left', value: usd(f.taxableAfter) }],
      note: 'Taxed at the rates that would apply without the exclusion (stacking). Self-employment tax and foreign tax credits are not modeled.',
    };
  },
});
