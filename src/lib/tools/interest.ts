/** IRS interest on an unpaid balance at the quarterly underpayment rate. */
import type { ToolSpec } from './types';
import { underpaymentInterest } from '../engine/tax';
import { usd } from './_kit';
export default (): ToolSpec => ({
  title: 'Interest the IRS charges on a balance',
  fields: [
    { id: 'amount', label: 'Unpaid tax', def: 5000, unit: '$', max: 100_000_000 },
    { id: 'days', label: 'Days unpaid', def: 180, max: 3650 },
    { id: 'rate', label: 'Underpayment rate', def: 7, options: [{ value: '7', label: '7% (2025, Q1, Q3 and Q4 2026)' }, { value: '6', label: '6% (Q2 2026)' }] },
  ],
  run: (v) => {
    const i = underpaymentInterest(v.amount, v.days, v.rate);
    return {
      head: ['Interest owed', usd(i)],
      sub: `${usd(i / Math.max(1, v.days) * 30)} a month on average`,
      rows: [
        { label: 'Balance with interest', value: usd(v.amount + i) },
        { label: 'Simple interest for comparison', value: usd((v.amount * v.rate * v.days) / 36500) },
      ],
      note: 'Rate = federal short-term rate + 3 points, reset every quarter, compounded daily. Penalties are added separately and also bear interest.',
    };
  },
});
