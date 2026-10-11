/** SALT cap with the MAGI phase-down, and whether itemizing beats the standard deduction. */
import type { ToolSpec } from './types';
import { saltDeduction, standardDeduction } from '../engine/tax';
import { usd, statusField, statusOf, yearField, yearOf, share } from './_kit';
export default (): ToolSpec => ({
  title: 'Your SALT deduction under the new cap',
  fields: [
    yearField(2026), statusField('mfj'),
    { id: 'paid', label: 'State and local income (or sales) tax + property tax paid', def: 28000, unit: '$', max: 10_000_000 },
    { id: 'magi', label: 'Modified AGI', def: 240000, unit: '$', max: 100_000_000 },
    { id: 'other', label: 'Other itemized deductions (mortgage interest, gifts)', def: 12000, unit: '$', max: 50_000_000 },
  ],
  run: (v) => {
    const y = yearOf(v.year); const st = statusOf(v.status);
    const s = saltDeduction(y, st, v.paid, v.magi);
    const item = s.deduction + Math.max(0, v.other);
    const std = standardDeduction(y, st).total;
    return {
      head: [`${y} SALT deduction`, usd(s.deduction)],
      sub: item > std ? `Itemizing (${usd(item)}) beats the standard deduction by ${usd(item - std)}` : `The standard deduction (${usd(std)}) is larger than itemizing (${usd(item)})`,
      rows: [
        { label: 'Your cap at this income', value: usd(s.cap), bar: share(s.cap, s.fullCap) },
        { label: 'Full cap before the phase-down', value: usd(s.fullCap) },
        { label: 'Taxes paid above your cap', value: usd(Math.max(0, v.paid - s.cap)) },
        { label: 'Cap reaches its floor at a MAGI of', value: usd(st === 'mfs' ? s.floorAt : s.floorAt) },
      ],
      note: 'The cap drops by 30% of MAGI above the threshold but never below $10,000 ($5,000 married filing separately). It returns to $10,000 in 2030 under the statute.',
    };
  },
});
