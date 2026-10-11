/** Alternative minimum tax: exemption after the phase-out and tentative minimum tax vs. regular tax. */
import type { ToolSpec } from './types';
import { amt } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf } from './_kit';
export default (): ToolSpec => ({
  title: 'Alternative minimum tax check',
  fields: [
    yearField(2026), statusField('mfj'),
    { id: 'amti', label: 'Alternative minimum taxable income', def: 650000, unit: '$', max: 1_000_000_000, help: 'Taxable income plus AMT add-backs' },
    { id: 'regular', label: 'Regular income tax', def: 140000, unit: '$', max: 1_000_000_000 },
  ],
  run: (v) => {
    const a = amt(yearOf(v.year), statusOf(v.status), v.amti);
    const extra = Math.max(0, a.tentative - v.regular);
    return {
      head: ['AMT owed on top of regular tax', usd(extra)],
      sub: extra > 0 ? 'Tentative minimum tax exceeds regular tax' : 'Regular tax is higher: no AMT',
      rows: [
        { label: 'Exemption after phase-out', value: usd(a.exemption) },
        { label: 'AMT base', value: usd(a.base) },
        { label: 'Tentative minimum tax (26% / 28%)', value: usd(a.tentative) },
      ],
      note: 'Ordinary-income rates only; long-term gains keep their 0/15/20% rates inside the AMT and are not separated here (Form 6251 does it).',
    };
  },
});
