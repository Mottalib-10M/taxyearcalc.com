import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, day, P } from '../../lib/kit';

const base = Y(2026).ssWageBase; const base5 = Y(2025).ssWageBase;
const max = (base * S.fica.socialSecurity) / 100;
const two = E.excessSocialSecurity([130000, 90000]);
const per = 210000 / 26; const n = Math.ceil(base / per);

export default definePage({
  id: 'social-security-wage-base',
  group: 'rates',
  kind: 'tool',
  order: 100,
  slug: 'social-security-wage-base',
  nav: 'Social Security wage base',
  card: 'The 2026 wage base, the paycheck where the tax stops, and the excess with two employers.',
  title: `Social Security Wage Base 2026: ${usd(base)}, Then the Tax Stops`,
  description: `Social Security wage base 2026: ${usd(base)} (${usd(base5)} in 2025), so the most an employee pays is ${usd(max)}. See the paycheck where the tax stops for the year.`,
  h1: 'The 2026 Social Security wage base',
  intro: 'The earnings ceiling for the 6.2% Social Security tax, and what it means for high earners and people with two jobs.',
  resume: `The Social Security wage base for 2026 is ${usd(base)}: wages and self-employment earnings up to that amount pay the ${S.fica.socialSecurity}% Social Security tax, and nothing above it does, according to the 2026 Form 1040-ES. In 2025 the ceiling was ${usd(base5)}. The most an employee can owe for 2026 is therefore ${usd(max)}, matched by the employer; a self-employed person pays up to twice that. Medicare has no ceiling. For someone paid ${usd(210000)} a year in 26 paychecks, Social Security stops after paycheck number ${n}, and each later paycheck is larger by the ${S.fica.socialSecurity}% no longer withheld. A worker with two employers often has too much withheld, because each employer applies the ceiling separately: with ${usd(130000)} and ${usd(90000)} of wages, ${usd(two.excess)} of excess Social Security comes back as a credit on Schedule 3 of the return. A single employer that over-withholds must correct it itself, not through the return.`,
  tool: 'wageBase',
  faqs: [
    { q: 'How do I get back excess Social Security tax withheld by two employers?', a: `Claim it on your federal return: the excess goes on Schedule 3 as a credit and adds to your refund or reduces your balance due. For 2026, any Social Security withheld on more than ${usd(base)} of combined wages from two or more employers is excess, up to ${usd(max)} of tax due in total. On a joint return each spouse computes it separately.` },
    { q: 'Does the wage base apply to self-employment income too?', a: `Yes. Self-employment tax applies the 12.4% Social Security part to net earnings up to ${usd(base)}, minus any wages already subject to Social Security from a job. Someone with ${usd(100000)} of wages and ${usd(120000)} of freelance profit pays Social Security self-employment tax only on the remaining ${usd(base - 100000)} of the ceiling.` },
    { q: 'Why does my paycheck get bigger in the fall?', a: `Because your year-to-date wages passed the ${usd(base)} wage base and your employer stopped withholding the ${S.fica.socialSecurity}% Social Security tax. Medicare keeps being withheld. The increase lasts until the first paycheck of January, when the count restarts. It is not a refund and does not change your income tax.` },
  ],
  body: (h) => `
<h2>Paychecks before and after the ceiling</h2>
${h.table(['Annual salary', 'Paychecks', 'Social Security stops after paycheck', 'Social Security for the year'], [[200000, 26], [250000, 24], [300000, 26], [400000, 12]].map(([s, p]) => [usd(s), String(p), `#${Math.ceil(base / (s / p))}`, usd(max)]), `Employee share, ${S.fica.socialSecurity}% up to ${usd(base)} in 2026`, ['l', 'r', 'r', 'r'])}
<p>Bonuses count toward the ceiling in the paycheck where they are paid, so a large year-end bonus can move the stopping point earlier. Pre-tax 401(k) deferrals do not reduce wages for Social Security, but cafeteria-plan health premiums do.</p>
<h2>Two employers, one ceiling</h2>
<p>The law caps the tax per person, not per job, but employers cannot see each other's payroll. The calculator above adds the wages, applies one ceiling and compares with what both employers withheld. The credit is refundable: it comes back even if you owe no income tax. It does not apply to a single employer, or to employers that are related and treated as one, which must fix over-withholding through payroll. Employers' own matching tax is never refunded.</p>
<h2>Planning a bonus or a job change</h2>
<p>A worker who changes employers in the middle of the year restarts the count with the new employer, which withholds Social Security again from the first dollar. Someone earning ${usd(150000)} at each of two successive jobs will have Social Security withheld on ${usd(300000)}, and the excess over ${usd(base)} becomes a credit when the return is filed, often a welcome part of the refund. Nothing needs to be done in the meantime; the W-2s show the amounts withheld in box 4.</p>
<h2>What the ceiling does not affect</h2>
<p>Medicare tax continues on all wages, and the 0.9% Additional Medicare Tax begins above ${usd(S.fica.additionalThreshold.single)} of wages; see the ${h.a('fica-tax-rate', 'FICA rate page')}. Income tax brackets are unaffected. For future benefits, earnings above the ceiling do not count either: Social Security computes benefits only on earnings up to each year's wage base. The 2025 figure of ${usd(base5)} also appears on the 2025 Schedule 1-A, as the box 5 amount above which tips need a special computation.</p>
<p>Sources: ${h.src('es2026')}; ${h.src('tc751')}; ${h.src('sch1a')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['fica-tax-rate', 'tax-refund-calculator', 'estimated-tax-payments', 'marginal-vs-effective-tax-rate', 'no-tax-on-tips'],
  sources: ['es2026', 'tc751', 'sch1a'],
});
