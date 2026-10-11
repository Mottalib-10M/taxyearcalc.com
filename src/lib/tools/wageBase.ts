/** When Social Security tax stops on a paycheck, and the excess withheld by two employers. */
import type { ToolSpec } from './types';
import { excessSocialSecurity, Y, S } from '../engine/tax';
import { usd } from './_kit';
export default (): ToolSpec => ({
  title: 'When you reach the 2026 wage base',
  fields: [
    { id: 'salary', label: 'Salary at your main job', def: 210000, unit: '$', max: 100_000_000 },
    { id: 'periods', label: 'Paychecks a year', def: 26, options: [{ value: '52', label: '52' }, { value: '26', label: '26' }, { value: '24', label: '24' }, { value: '12', label: '12' }] },
    { id: 'second', label: 'Wages from a second employer', def: 0, unit: '$', max: 100_000_000 },
  ],
  run: (v) => {
    const base = Y(2026).ssWageBase;
    const per = v.salary / v.periods;
    const n = per > 0 ? Math.ceil(base / per) : 0;
    const x = excessSocialSecurity([v.salary, v.second]);
    return {
      head: ['Social Security stops after paycheck', v.salary > base ? `#${n} of ${v.periods}` : 'never reached'],
      sub: v.salary > base ? `The remaining ${v.periods - n} paychecks are ${usd((Math.min(v.salary - base, per * (v.periods - n)) * S.fica.socialSecurity) / 100 / Math.max(1, v.periods - n))} larger each` : `Your salary stays under ${usd(base)}`,
      rows: [
        { label: 'Wage base', value: usd(base) },
        { label: 'Social Security withheld by all employers', value: usd(x.withheld) },
        { label: 'Social Security actually due', value: usd(x.due) },
        { label: 'Excess to claim on your return (Schedule 3)', value: usd(x.excess), strong: true },
      ],
      note: 'Medicare tax has no wage base. The excess credit works only across different employers; one employer that over-withholds must refund you itself.',
    };
  },
});
