import type { ToolSpec } from './types';
import { Y } from '../engine/tax';
import { usd, yearField, yearOf } from './_kit';
/** EITC income limits by family. */
export default (): ToolSpec => ({
  title: 'EITC income limit for your family',
  fields: [
    yearField(2026),
    { id: 'kids', label: 'Qualifying children', def: 2, options: [0, 1, 2, 3].map((n) => ({ value: String(n), label: n === 3 ? '3 or more' : String(n) })) },
    { id: 'mfj', label: 'Filing status', def: 0, options: [{ value: '0', label: 'Not married filing jointly' }, { value: '1', label: 'Married filing jointly' }] },
  ],
  run: (v) => {
    const e = Y(yearOf(v.year)).eitc; const k = v.kids;
    return {
      head: ['Income must stay under', usd(v.mfj ? e.phaseEndMfj[k] : e.phaseEnd[k])],
      rows: [{ label: 'Maximum credit', value: usd(e.maxCredit[k]) }, { label: 'Reached at earned income of', value: usd(e.earnedAmount[k]) }, { label: 'Phase-out starts at', value: usd(v.mfj ? e.phaseStartMfj[k] : e.phaseStart[k]) }, { label: 'Investment income limit', value: usd(e.investmentLimit) }],
    };
  },
});
