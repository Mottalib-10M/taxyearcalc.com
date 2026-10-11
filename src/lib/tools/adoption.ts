import type { ToolSpec } from './types';
import { adoptionCredit } from '../engine/tax';
import { usd, yearField, yearOf } from './_kit';
/** Adoption credit with the MAGI phase-out and the refundable part. */
export default (): ToolSpec => ({
  title: 'Adoption credit estimate',
  fields: [
    yearField(2026),
    { id: 'exp', label: 'Qualified adoption expenses', def: 15000, unit: '$', max: 1_000_000 },
    { id: 'magi', label: 'Modified AGI', def: 150000, unit: '$', max: 50_000_000 },
  ],
  run: (v) => {
    const a = adoptionCredit(yearOf(v.year), v.exp, v.magi);
    return {
      head: ['Adoption credit', usd(a.credit)],
      sub: `${usd(a.refundable)} of it refundable`,
      rows: [{ label: 'Share kept after the phase-out', value: `${Math.round(a.share * 100)}%`, bar: a.share }, { label: 'Nonrefundable part (5-year carryforward)', value: usd(a.credit - a.refundable) }],
      note: 'Per child. For a child with special needs the full amount is allowed whatever the expenses.',
    };
  },
});
