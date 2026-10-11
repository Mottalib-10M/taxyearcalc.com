/** Social Security and Medicare taxes on wages or self-employment income. */
import type { ToolSpec } from './types';
import { fica } from '../engine/tax';
import { usd, rate, statusField, statusOf, share } from './_kit';
export default (): ToolSpec => ({
  title: 'FICA tax on your 2026 earnings',
  fields: [
    { id: 'wages', label: 'Wages or net self-employment profit', def: 120000, unit: '$', max: 100_000_000 },
    statusField('single'),
    { id: 'se', label: 'Type of income', def: 0, options: [{ value: '0', label: 'Employee wages' }, { value: '1', label: 'Self-employment' }] },
  ],
  run: (v) => {
    const f = fica(statusOf(v.status), v.wages, v.se === 1);
    return {
      head: [v.se ? 'Self-employment tax' : 'Your share of FICA', usd(f.total)],
      sub: `${rate(v.wages > 0 ? (f.total / v.wages) * 100 : 0)} of ${usd(v.wages)}`,
      rows: [
        { label: 'Social Security', value: usd(f.ss), bar: share(f.ss, f.total) },
        { label: 'Medicare', value: usd(f.medicare), bar: share(f.medicare, f.total) },
        { label: 'Additional Medicare tax (0.9%)', value: usd(f.additional), bar: share(f.additional, f.total) },
        { label: 'Earnings above the wage base', value: usd(f.overBase) },
      ],
      note: v.se ? 'Self-employment tax applies to 92.35% of net profit; half of it is deductible as an adjustment to income.' : 'Your employer pays the same 6.2% and 1.45% on top; the additional 0.9% is employee-only.',
    };
  },
});
