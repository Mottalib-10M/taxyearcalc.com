/** Earned income credit by number of children, with the phase-in, plateau and phase-out. arg: { kids? } */
import type { ToolSpec } from './types';
import { eitc } from '../engine/tax';
import { usd, yearField, yearOf, parseArg, share } from './_kit';
const STAGE: Record<string, string> = { 'phase-in': 'rising with each dollar earned', plateau: 'at the maximum', 'phase-out': 'shrinking as income rises', none: 'income too high', investment: 'investment income above the limit' };
export default (arg?: string): ToolSpec => {
  const a = parseArg<{ kids: number }>(arg, { kids: 1 });
  return {
    title: 'Earned income credit estimate',
    fields: [
      yearField(2026),
      { id: 'kids', label: 'Qualifying children', def: a.kids, options: [0, 1, 2, 3].map((n) => ({ value: String(n), label: n === 3 ? '3 or more' : String(n) })) },
      { id: 'mfj', label: 'Filing status', def: 0, options: [{ value: '0', label: 'Single, head of household or separated' }, { value: '1', label: 'Married filing jointly' }] },
      { id: 'earned', label: 'Earned income', def: 24000, unit: '$', max: 10_000_000 },
      { id: 'agi', label: 'Adjusted gross income', def: 24000, unit: '$', max: 10_000_000 },
      { id: 'inv', label: 'Investment income', def: 0, unit: '$', max: 10_000_000 },
    ],
    run: (v) => {
      const y = yearOf(v.year);
      const e = eitc(y, v.kids, v.earned, v.agi, v.mfj === 1, v.inv);
      return {
        head: [`${y} earned income credit`, usd(e.credit)],
        sub: `Credit ${STAGE[e.stage]}`,
        rows: [
          { label: 'Maximum for this family', value: usd(e.max), bar: share(e.credit, e.max) },
          { label: 'Phase-out starts at', value: usd(e.phaseStart) },
          { label: 'No credit at or above', value: usd(e.phaseEnd) },
        ],
        note: 'Computed from the section 32 amounts; the IRS table works in $50 bands, so the return can differ by a few dollars.',
      };
    },
  };
};
