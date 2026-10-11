import type { ToolSpec } from './types';
import { qbiDeduction } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf } from './_kit';
/** Qualified business income deduction below the threshold. */
export default (): ToolSpec => ({
  title: 'Qualified business income deduction',
  fields: [
    yearField(2026), statusField('single'),
    { id: 'qbi', label: 'Qualified business income', def: 60000, unit: '$', max: 100_000_000 },
    { id: 'taxable', label: 'Taxable income before this deduction', def: 70000, unit: '$', max: 100_000_000 },
  ],
  run: (v) => {
    const q = qbiDeduction(yearOf(v.year), statusOf(v.status), v.qbi, v.taxable);
    return {
      head: ['QBI deduction', q.aboveThreshold ? 'limits apply' : usd(q.deduction)],
      sub: q.aboveThreshold ? 'Above the threshold: W-2 wage and property limits (Form 8995-A)' : '20% of business income, within 20% of taxable income',
      rows: [{ label: 'Threshold', value: q.threshold ? usd(q.threshold) : 'see Rev. Proc. 2024-40' }, { label: '20% of QBI', value: usd(v.qbi * 0.2) }],
      note: 'Below the threshold a service business qualifies like any other. Net capital gains are not separated here.',
    };
  },
});
