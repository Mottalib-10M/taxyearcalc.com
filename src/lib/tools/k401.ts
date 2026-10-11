/** 401(k) limit by age, and the deferral per paycheck that reaches it. */
import type { ToolSpec } from './types';
import { k401Limit, Y } from '../engine/tax';
import { usd, rate } from './_kit';
export default (): ToolSpec => ({
  title: '401(k) limit and the contribution per paycheck',
  fields: [
    { id: 'age', label: 'Your age on December 31, 2026', def: 45, max: 120 },
    { id: 'salary', label: 'Annual salary', def: 95000, unit: '$', max: 10_000_000 },
    { id: 'periods', label: 'Paychecks a year', def: 26, options: [{ value: '52', label: 'Weekly (52)' }, { value: '26', label: 'Every two weeks (26)' }, { value: '24', label: 'Twice a month (24)' }, { value: '12', label: 'Monthly (12)' }] },
    { id: 'already', label: 'Already deferred this year', def: 0, unit: '$', max: 1_000_000 },
    { id: 'left', label: 'Paychecks left this year', def: 26, max: 52 },
  ],
  run: (v) => {
    const l = k401Limit(2026, v.age);
    const remaining = Math.max(0, l.total - v.already);
    const per = v.left > 0 ? remaining / v.left : 0;
    const perGross = v.salary > 0 ? v.salary / v.periods : 0;
    const wageRule = Y(2026).retirement.rothCatchUpWage;
    return {
      head: ['Your 2026 employee deferral limit', usd(l.total)],
      sub: `${usd(per)} per paycheck for the ${v.left} paychecks left`,
      rows: [
        { label: 'Base limit', value: usd(l.base) },
        { label: l.catchUp ? `Catch-up at age ${v.age}` : 'Catch-up (from age 50)', value: usd(l.catchUp) },
        { label: 'Share of each gross paycheck', value: perGross > 0 ? rate(Math.min(100, (per / perGross) * 100)) : '-' },
        { label: 'Employee + employer cap (section 415(c))', value: usd(l.total415c) },
        { label: 'Catch-up must be Roth if 2025 FICA wages exceeded', value: usd(wageRule) },
      ],
      note: 'Ages 60 to 63 get the larger catch-up; at 64 it falls back to the age-50 amount.',
    };
  },
});
