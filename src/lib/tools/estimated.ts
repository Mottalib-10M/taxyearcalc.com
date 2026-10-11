/** Estimated tax: required annual payment under the safe harbors, and the four installments. */
import type { ToolSpec } from './types';
import { estimatedTax, Y } from '../engine/tax';
import { usd, day } from './_kit';
export default (): ToolSpec => ({
  title: '2026 estimated tax payments',
  fields: [
    { id: 'this', label: 'Expected 2026 total tax', def: 18000, unit: '$', max: 100_000_000 },
    { id: 'last', label: 'Total tax on your 2025 return', def: 15000, unit: '$', max: 100_000_000 },
    { id: 'agi', label: '2025 adjusted gross income', def: 120000, unit: '$', max: 100_000_000 },
    { id: 'wh', label: '2026 withholding expected', def: 4000, unit: '$', max: 100_000_000 },
  ],
  run: (v) => {
    const e = estimatedTax(v.this, v.last, v.agi, v.wh);
    const dates = Y(2026).estimated;
    return {
      head: ['Each quarterly payment', usd(e.quarterly)],
      sub: e.toPay > 0 ? `${usd(e.toPay)} for the year beyond withholding` : 'No estimated payments needed',
      rows: [
        { label: 'Safe harbor: required annual payment', value: usd(e.required) },
        { label: `Last-year test at ${e.priorPct}%`, value: usd((v.last * e.priorPct) / 100) },
        ...dates.map((d, i) => ({ label: `Payment ${i + 1} due`, value: day(d) })),
      ],
      note: 'The January 15, 2027 payment can be skipped if you file the 2026 return and pay the balance by February 1, 2027.',
    };
  },
});
