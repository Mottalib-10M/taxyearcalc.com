import type { ToolSpec } from './types';
import { kiddieTax } from '../engine/tax';
import { usd, yearField, yearOf } from './_kit';
/** Kiddie tax on a child's unearned income. */
export default (): ToolSpec => ({
  title: 'Kiddie tax on investment income',
  fields: [
    yearField(2026),
    { id: 'income', label: "Child's interest, dividends and gains", def: 6000, unit: '$', max: 100_000_000 },
    { id: 'rate', label: "Parents' marginal rate", def: 24, options: [10, 12, 22, 24, 32, 35, 37].map((r) => ({ value: String(r), label: `${r}%` })) },
  ],
  run: (v) => {
    const k = kiddieTax(yearOf(v.year), v.income, v.rate);
    return {
      head: ['Tax on the child’s income', usd(k.tax)],
      rows: [{ label: 'Tax-free', value: usd(k.free) }, { label: "At the child's 10%", value: usd(k.atChild) }, { label: "At the parents' rate", value: usd(k.atParent) }],
      note: 'Children under 19, or full-time students under 24, with unearned income only. Qualified dividends and gains would keep their lower rates.',
    };
  },
});
