/** Long-term capital gains stacked on ordinary income, plus the 3.8% net investment income tax. */
import type { ToolSpec } from './types';
import { capitalGainsTax, niit } from '../engine/tax';
import { usd, rate, statusField, statusOf, yearField, yearOf, share } from './_kit';
export default (): ToolSpec => ({
  title: 'Tax on your long-term capital gains',
  fields: [
    yearField(2026), statusField('single'),
    { id: 'ordinary', label: 'Taxable income without the gains', def: 40000, unit: '$', max: 100_000_000, help: 'After deductions' },
    { id: 'gains', label: 'Long-term gains and qualified dividends', def: 30000, unit: '$', max: 100_000_000 },
    { id: 'std', label: 'Standard deduction already subtracted', def: 16100, unit: '$', max: 1_000_000, help: 'For the 3.8% NIIT' },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = statusOf(v.status);
    const c = capitalGainsTax(y, st, v.ordinary, v.gains);
    const n = niit(st, v.ordinary + v.gains + v.std, v.gains);
    const total = c.tax + n.tax;
    return {
      head: ['Federal tax on the gains', usd(total)],
      sub: `Effective rate on the gains: ${rate(v.gains > 0 ? (total / v.gains) * 100 : 0)}`,
      rows: [
        { label: 'Taxed at 0%', value: usd(c.at0), bar: share(c.at0, v.gains) },
        { label: 'Taxed at 15%', value: usd(c.at15), bar: share(c.at15, v.gains) },
        { label: 'Taxed at 20%', value: usd(c.at20), bar: share(c.at20, v.gains) },
        { label: 'Net investment income tax (3.8%)', value: usd(n.tax) },
        { label: '0% band ends at taxable income of', value: usd(c.zeroTop) },
      ],
      note: 'Assets held more than one year. Short-term gains are ordinary income. Collectibles (28%) and unrecaptured section 1250 gain (25%) are not modeled.',
    };
  },
});
