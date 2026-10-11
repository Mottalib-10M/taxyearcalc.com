import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, day, P } from '../../lib/kit';

const f = S.fica; const base = Y(2026).ssWageBase;
const emp = (w: number) => E.fica('single', w, false);
const se = E.fica('single', 80000, true);
const total = f.socialSecurity + f.medicare;

export default definePage({
  id: 'fica-tax-rate',
  group: 'rates',
  kind: 'tool',
  order: 90,
  slug: 'fica-tax-rate',
  nav: 'FICA tax rate',
  card: 'Social Security and Medicare rates for 2026, the wage base and the 0.9% surtax.',
  title: `FICA Tax Rate 2026: ${total}% for Employees, Wage Base ${usd(base)}`,
  description: `FICA tax rate 2026: ${f.socialSecurity}% Social Security up to ${usd(base)} plus ${f.medicare}% Medicare on all wages, 0.9% more above ${usd(f.additionalThreshold.single)}. The self-employed pay both halves.`,
  h1: 'FICA tax rates for 2026',
  intro: 'Social Security and Medicare taxes on wages and self-employment income, with the 2026 wage base.',
  resume: `FICA, the payroll tax that funds Social Security and Medicare, takes ${total}% of an employee's wages in 2026: ${f.socialSecurity}% for Social Security on wages up to the ${usd(base)} wage base and ${f.medicare}% for Medicare on all wages, with the employer paying the same amounts on top (IRS Topic 751). Wages above ${usd(f.additionalThreshold.single)} in a year also bear the 0.9% Additional Medicare Tax, which the employer withholds from the first paycheck past that amount regardless of filing status; on the return the threshold is ${usd(f.additionalThreshold.mfj)} for a joint return and ${usd(f.additionalThreshold.mfs)} married filing separately (IRS Topic 560). A worker earning ${usd(60000)} pays ${usd(emp(60000).total)} of FICA; one earning ${usd(250000)} pays ${usd(emp(250000).total)}, because Social Security stops at the wage base. Self-employed people pay both halves, 15.3% on ${f.selfEmployedBase}% of net profit: ${usd(se.total)} on ${usd(80000)} of profit, half of it deductible. FICA is due on tips and overtime even when the new income tax deductions apply.`,
  tool: 'fica',
  faqs: [
    { q: 'Do I pay FICA on tips and overtime under the new deductions?', a: `Yes. The tips and overtime deductions of Public Law 119-21 only reduce income subject to federal income tax. Social Security at ${f.socialSecurity}% and Medicare at ${f.medicare}% are still withheld on every reported tip and every hour of overtime, and the employer still pays its matching share. On ${usd(10000)} of overtime pay that is ${usd((10000 * total) / 100)} from the worker.` },
    { q: 'What is the self-employment tax rate for 2026?', a: `15.3%: twice the ${f.socialSecurity}% Social Security rate and twice the ${f.medicare}% Medicare rate, applied to ${f.selfEmployedBase}% of net earnings. The Social Security part stops at the ${usd(base)} wage base, counting any wages from a job first. Half of the self-employment tax is deducted as an adjustment to income on Schedule 1.` },
    { q: 'Why did my employer withhold the extra 0.9% Medicare tax if we file jointly under $250,000?', a: `Employers must withhold the Additional Medicare Tax on wages above ${usd(f.additionalThreshold.single)} paid to you in a year, without regard to filing status. If your joint wages stay under ${usd(f.additionalThreshold.mfj)}, the tax computed on Form 8959 is lower than what was withheld, and the difference comes back as a credit on the return.` },
  ],
  body: (h) => `
<h2>Rates and thresholds for 2026</h2>
${h.table(['Tax', 'Employee', 'Employer', 'Self-employed', 'On'], [
  ['Social Security (OASDI)', `${f.socialSecurity}%`, `${f.socialSecurity}%`, `${f.socialSecurity * 2}%`, `earnings up to ${usd(base)}`],
  ['Medicare (HI)', `${f.medicare}%`, `${f.medicare}%`, `${f.medicare * 2}%`, 'all earnings'],
  ['Additional Medicare', '0.9%', 'none', '0.9%', `above ${usd(f.additionalThreshold.single)} single, ${usd(f.additionalThreshold.mfj)} joint`],
], 'IRS Topics 751 and 560; wage base from Form 1040-ES (2026)', ['l', 'r', 'r', 'r', 'l'])}
<h2>FICA at different salaries</h2>
${h.table(['Wages', 'Social Security', 'Medicare', 'Additional Medicare', 'Total'], [40000, 90000, 184500, 250000, 400000].map((w) => { const r = emp(w); return [usd(w), usd(r.ss), usd(r.medicare), usd(r.additional), usd(r.total)]; }), 'Employee share for a single filer in 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>FICA is proportional below the wage base and falls as a share of pay above it, then rises slightly again when the 0.9% surtax starts. Unlike income tax, there is no standard deduction and no bracket: the first dollar of wages is taxed. Pre-tax 401(k) deferrals reduce income tax but not FICA; health insurance premiums and HSA contributions through a cafeteria plan reduce both.</p>
<h2>Who is exempt</h2>
<p>A few groups pay no FICA on some or all of their pay: students working for their own college, many state and local government workers covered by a public pension instead of Social Security, certain members of religious orders and nonresident aliens on some visas. Household employers must pay FICA on a nanny or housekeeper once cash wages pass the annual threshold, and report it on Schedule H with their own return.</p>
<h2>Two jobs and the wage base</h2>
<p>Each employer withholds Social Security up to the wage base on its own wages. A worker with two jobs paying ${usd(120000)} and ${usd(100000)} has Social Security withheld on ${usd(220000)} but owes it only on ${usd(base)}; the excess comes back as a credit on the return, computed on the ${h.a('social-security-wage-base', 'wage base page')}. Medicare has no cap, so nothing is refunded there. FICA also counts in the combined ${h.a('marginal-vs-effective-tax-rate', 'marginal rate')} on an extra dollar of pay, on top of the income tax bracket.</p>
<p>Sources: ${h.src('tc751')}; ${h.src('tc560')}; ${h.src('es2026', 'Form 1040-ES (2026), social security tax maximum')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['social-security-wage-base', 'marginal-vs-effective-tax-rate', 'no-tax-on-tips', 'estimated-tax-payments', 'tax-brackets'],
  sources: ['tc751', 'tc560', 'es2026'],
});
