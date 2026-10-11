/** Where an income lands in the brackets: marginal and average rate, tax per bracket, room before the next one.
 *  arg: { year?, status?, income? } (filing-status and 2025 pages preselect their case). */
import type { ToolSpec } from './types';
import { incomeTax, standardDeduction, STATUS_LABEL } from '../engine/tax';
import { usd, rate, statusField, statusOf, yearField, yearOf, parseArg, yesNo, share } from './_kit';
import type { Status, Year } from '../engine/tax';
export default (arg?: string): ToolSpec => {
  const a = parseArg<{ year: Year; status: Status; income: number }>(arg, { year: 2026, status: 'single', income: 85000 });
  return {
    title: 'Find your federal tax bracket',
    fields: [
      yearField(a.year), statusField(a.status),
      { id: 'income', label: 'Total income before deductions', def: a.income, unit: '$', max: 50_000_000, help: 'Wages, interest, business profit: line 9 of Form 1040' },
      { id: 'std', label: 'Take the standard deduction?', def: 1, options: [{ value: '1', label: 'Yes, standard deduction' }, { value: '0', label: 'No, income is already taxable' }] },
    ],
    run: (v) => {
      const year = yearOf(v.year); const st = statusOf(v.status);
      const ded = v.std ? standardDeduction(year, st).total : 0;
      const taxable = Math.max(0, v.income - ded);
      const r = incomeTax(year, st, taxable);
      const rows = r.rows.filter((x) => x.taxed > 0).map((x) => ({ label: `${x.rate}% on ${usd(x.taxed)}`, value: usd(x.tax), bar: share(x.tax, r.tax) }));
      return {
        head: [`${year} marginal bracket, ${STATUS_LABEL[st].toLowerCase()}`, `${r.marginal}%`],
        sub: `Federal income tax ${usd(r.tax)} on ${usd(taxable)} of taxable income`,
        rows: [
          ...(ded ? [{ label: 'Standard deduction subtracted', value: usd(ded) }] : []),
          ...rows,
          { label: 'Average rate on taxable income', value: rate(r.average), strong: true },
          { label: 'Average rate on total income', value: rate(v.income > 0 ? (r.tax / v.income) * 100 : 0) },
          ...(r.roomInBracket !== null ? [{ label: `Room before the ${r.marginal === 10 ? 12 : r.marginal === 12 ? 22 : r.marginal === 22 ? 24 : r.marginal === 24 ? 32 : r.marginal === 32 ? 35 : 37}% bracket`, value: usd(r.roomInBracket) }] : []),
        ],
        note: 'Rate schedule of the IRS revenue procedure. Credits, the Schedule 1-A deductions and capital gains rates are not applied here.',
      };
    },
  };
};
void yesNo;
