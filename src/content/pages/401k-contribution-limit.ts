import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const r = Y(2026).retirement; const r5 = Y(2025).retirement;
const at = (age: number) => E.k401Limit(2026, age).total;

export default definePage({
  id: '401k-contribution-limit',
  group: 'accounts',
  kind: 'tool',
  order: 10,
  slug: '401k-contribution-limit',
  nav: '401(k) limit',
  card: 'The 2026 deferral limit, the catch-up at 50 and the larger one from 60 to 63.',
  title: `401k Contribution Limit 2026: ${usd(r.k401)}, Catch-Up ${usd(r.catchUp50)}`,
  description: `401k contribution limit 2026: ${usd(r.k401)} of employee deferrals, ${usd(at(55))} at 50 or older, ${usd(at(61))} at ages 60 to 63, and ${usd(r.total415c)} in total with employer money.`,
  h1: '401(k) contribution limits for 2026',
  intro: 'How much you can defer from your pay in 2026, with the age-based catch-ups and the new Roth rule.',
  resume: `For 2026 an employee can defer up to ${usd(r.k401)} of salary into a 401(k), 403(b), governmental 457 plan or the Thrift Savings Plan, up from ${usd(r5.k401)} in 2025, according to IRS Notice 2025-67. Workers aged 50 or older by the end of the year can add a catch-up of ${usd(r.catchUp50)}, for ${usd(at(55))} in all, and those who turn 60, 61, 62 or 63 in 2026 get a larger catch-up of ${usd(r.catchUp6063)} instead, for ${usd(at(61))}. At 64 the catch-up falls back to ${usd(r.catchUp50)}. Employer matching and profit-sharing contributions come on top, but employee and employer money together cannot exceed ${usd(r.total415c)}, plus catch-ups, under section 415(c). New for 2026: an employee whose Social Security wages for 2025 exceeded ${usd(r.rothCatchUpWage)} must make any catch-up contributions as Roth contributions. The limit is per person across all plans, and it runs on the calendar year of payroll, closing on December 31; a 401(k) cannot be funded after year-end for 2026.`,
  tool: 'k401',
  faqs: [
    { q: 'What is the 401k limit for someone turning 60 in 2026?', a: `${usd(at(60))}: the ${usd(r.k401)} base limit plus the special catch-up of ${usd(r.catchUp6063)} for participants who attain age 60, 61, 62 or 63 during the year, set by Notice 2025-67. The plan must offer catch-up contributions. Someone turning 64 in 2026 is back to the regular ${usd(r.catchUp50)} catch-up, ${usd(at(64))} in total.` },
    { q: 'Do my catch-up contributions have to be Roth in 2026?', a: `Only if your Social Security wages from the employer sponsoring the plan exceeded ${usd(r.rothCatchUpWage)} in 2025, the threshold Notice 2025-67 gives under section 414(v)(7). Above it, catch-ups must be designated Roth, paid with after-tax money. Below it, you can choose pre-tax or Roth catch-ups if the plan allows both. The ${usd(r.k401)} base deferral is not affected.` },
    { q: 'Does the 401k limit apply separately to each job?', a: `No. The ${usd(r.k401)} employee deferral limit, plus any catch-up, is per person for the year, across all 401(k), 403(b) and similar plans. Someone who changes jobs in 2026 and defers ${usd(15000)} at the first employer can defer only ${usd(r.k401 - 15000)} at the second. Governmental 457(b) plans are the exception: they have their own separate limit.` },
  ],
  body: (h) => `
<h2>Limits by age for 2026</h2>
${h.table(['Age at December 31, 2026', 'Base deferral', 'Catch-up', 'Employee total'], [[40, 'under 50'], [52, '50 to 59'], [61, '60 to 63'], [66, '64 or older']].map(([a, l]) => { const k = E.k401Limit(2026, a as number); return [l as string, usd(k.base), usd(k.catchUp), usd(k.total)]; }), 'IRS Notice 2025-67', ['l', 'r', 'r', 'r'])}
<p>SIMPLE plans have their own limits: ${usd(r.simple)} of salary deferrals for 2026, plus ${usd(r.simpleCatchUp50)} at 50. The compensation that a plan can take into account is capped at ${usd(r.compLimit)}.</p>
<h2>What a deferral saves in tax</h2>
<p>A traditional pre-tax deferral lowers taxable income at your ${h.a('marginal-vs-effective-tax-rate', 'marginal rate')}: ${usd(10000)} deferred by someone in the 22% bracket saves ${usd(2200)} of federal income tax this year, and the money is taxed when withdrawn. Social Security and Medicare are still due on deferred wages. Roth deferrals save nothing now but come out tax-free in retirement. A deferral also lowers AGI, which can help with the ${h.a('roth-ira-income-limit', 'Roth IRA income limit')} or the phase-outs of the ${h.a('no-tax-on-overtime', 'overtime deduction')} and the ${h.a('senior-deduction', 'senior deduction')}.</p>
<h2>Employer contributions and the overall cap</h2>
<p>Matching and profit-sharing contributions do not count against the ${usd(r.k401)} employee limit, but everything added to the account for the year, employee and employer together, cannot exceed ${usd(r.total415c)} or 100% of compensation, catch-ups excluded. Self-employed people with a solo 401(k) play both roles: ${usd(r.k401)} as the employee, plus an employer contribution based on net earnings, within the same overall cap. After-tax contributions, where the plan allows them, also count toward it.</p>
<h2>Spreading the deferral over the year</h2>
<p>The calculator divides what is left of your limit by the paychecks left in the year. Front-loading early in the year can cost part of the employer match if the plan matches per paycheck without a true-up, because contributions stop once the limit is reached. Late in the year, the per-paycheck amount needed to reach the maximum can exceed what the plan or your take-home pay allows; a raise in the deferral percentage takes effect only on future paychecks.</p>
<p>Source: ${h.src('n2567')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['ira-contribution-limit', 'roth-ira-income-limit', 'hsa-contribution-limit', 'marginal-vs-effective-tax-rate', 'tax-brackets'],
  sources: ['n2567', 'rp2532'],
});
