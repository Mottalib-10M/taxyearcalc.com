/** Failure-to-file and failure-to-pay penalties plus interest, by months late. arg: { months?, filedOnTime? } */
import type { ToolSpec } from './types';
import { latePenalties, underpaymentInterest, P } from '../engine/tax';
import { usd, yearField, yearOf, parseArg, share } from './_kit';
export default (arg?: string): ToolSpec => {
  const a = parseArg<{ months: number; filedOnTime: number }>(arg, { months: 3, filedOnTime: 0 });
  return {
    title: 'Cost of filing or paying late',
    fields: [
      yearField(2025),
      { id: 'owed', label: 'Tax unpaid on the due date', def: 4000, unit: '$', max: 100_000_000 },
      { id: 'file', label: 'Return filed', def: a.filedOnTime, options: [{ value: '1', label: 'On time or under a valid extension' }, { value: '0', label: 'Late, without extension' }] },
      { id: 'months', label: 'Months late (each part month counts)', def: a.months, max: 120 },
    ],
    run: (v) => {
      const y = yearOf(v.year);
      const m = Math.max(0, Math.round(v.months));
      const p = latePenalties(y, v.owed, v.file === 1 ? 0 : m, m, v.file === 1 ? 0 : m * 30);
      const q = (P.interest.underpayment as Record<string, number[]>)['2026'][3];
      const interest = underpaymentInterest(v.owed, m * 30, q);
      const total = p.total + interest;
      return {
        head: ['Penalties and interest', usd(total)],
        sub: `On ${usd(v.owed)} unpaid for ${m} month${m === 1 ? '' : 's'}`,
        rows: [
          { label: 'Failure-to-file penalty', value: usd(p.ftf), bar: share(p.ftf, total) },
          { label: 'Failure-to-pay penalty', value: usd(p.ftp), bar: share(p.ftp, total) },
          { label: `Interest at ${q}% a year, compounded daily`, value: usd(interest), bar: share(interest, total) },
        ],
        note: 'An extension moves the filing date, not the payment date. Interest uses the current quarterly rate for the whole period; the IRS applies each quarter’s rate.',
      };
    },
  };
};
