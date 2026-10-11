import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const r = Y(2026).retirement; const r5 = Y(2025).retirement;
const rp = r.rothPhase;
const ex = E.rothLimit('single', 160500, 35);
const exJ = E.rothLimit('mfj', 247000, 55);

export default definePage({
  id: 'roth-ira-income-limit',
  group: 'accounts',
  kind: 'tool',
  order: 30,
  slug: 'roth-ira-income-limit',
  nav: 'Roth IRA income limit',
  card: 'The 2026 Roth IRA income ranges and the reduced contribution inside them.',
  title: `Roth IRA Income Limit 2026: ${usd(rp.single[0])} to ${usd(rp.single[1])} Single`,
  description: `Roth IRA income limit 2026: full contribution under ${usd(rp.single[0])} single or ${usd(rp.mfj[0])} joint, none above ${usd(rp.single[1])} or ${usd(rp.mfj[1])}. Compute your reduced amount now.`,
  h1: 'Roth IRA income limits for 2026',
  intro: 'Above a certain modified AGI, the amount you may put into a Roth IRA shrinks, then disappears.',
  resume: `For 2026 you can make the full Roth IRA contribution, ${usd(r.ira)} or ${usd(r.ira + r.iraCatchUp50)} at 50 or older, if your modified AGI is below ${usd(rp.single[0])} as a single filer or head of household, or below ${usd(rp.mfj[0])} as a married couple filing jointly. The allowed amount then shrinks across the range and reaches zero at ${usd(rp.single[1])} and ${usd(rp.mfj[1])}, according to IRS Notice 2025-67 (the 2025 ranges were ${usd(r5.rothPhase.single[0])} to ${usd(r5.rothPhase.single[1])} and ${usd(r5.rothPhase.mfj[0])} to ${usd(r5.rothPhase.mfj[1])}). Married people filing separately who lived with their spouse at any time in the year face a range of ${usd(rp.mfs[0])} to ${usd(rp.mfs[1])}. Inside the range, the reduced amount is rounded up to the next $10, and anything between $0 and $200 becomes $200. A single saver of 35 with ${usd(160500)} of modified AGI can put ${usd(ex.limit)} in a Roth; a couple of 55 with ${usd(247000)} can put ${usd(exJ.limit)}. Above the range, many people use a non-deductible traditional contribution followed by a conversion.`,
  tool: 'roth',
  faqs: [
    { q: 'What happens if I contribute to a Roth IRA and my income ends up too high?', a: `The excess contribution is taxed at 6% a year until corrected. You can avoid that by withdrawing the excess and its earnings before the return due date, including extensions, or by recharacterizing it as a traditional IRA contribution. Because modified AGI is only known at year end, many people with income near ${usd(rp.single[0])} wait until they file before contributing.` },
    { q: 'How is modified AGI computed for the Roth IRA limit?', a: `Start from AGI, subtract any income from a Roth conversion and add back deductions such as the traditional IRA deduction, the student loan interest deduction and excluded foreign income. For most wage earners Roth modified AGI is close to AGI. The new Schedule 1-A deductions for tips and overtime come after AGI, so they do not lower it.` },
    { q: 'Is there an income limit for a Roth 401k in 2026?', a: `No. The income limits apply only to Roth IRAs. Designated Roth contributions to a 401(k), 403(b) or governmental 457 plan are open at any income, within the ${usd(r.k401)} deferral limit for 2026. Since 2026, catch-up contributions of workers whose 2025 FICA wages exceeded ${usd(r.rothCatchUpWage)} must go in as Roth.` },
  ],
  body: (h) => `
<h2>The 2026 ranges</h2>
${h.table(['Filing status', 'Full contribution below', 'Reduced between', 'No contribution from'], [
  ['Single, head of household', usd(rp.single[0]), `${usd(rp.single[0])} and ${usd(rp.single[1])}`, usd(rp.single[1])],
  ['Married filing jointly', usd(rp.mfj[0]), `${usd(rp.mfj[0])} and ${usd(rp.mfj[1])}`, usd(rp.mfj[1])],
  ['Married filing separately, lived together', usd(rp.mfs[0]), `${usd(rp.mfs[0])} and ${usd(rp.mfs[1])}`, usd(rp.mfs[1])],
], 'IRS Notice 2025-67', ['l', 'r', 'r', 'r'])}
<h2>The reduction, computed</h2>
${h.table(['MAGI (single, under 50)', 'Allowed Roth contribution'], [150000, 155000, 158000, 160500, 165000, 167500, 167900, 168000].map((m) => [usd(m), usd(E.rothLimit('single', m, 35).limit)]), 'Publication 590-A worksheet: proportional reduction, rounded up to $10, $200 minimum', ['l', 'r'])}
<p>The last rows show the ${usd(200)} floor: just below the top of the range, the formula would give a few dollars, and the rule lifts it to ${usd(200)}.</p>
<h2>Roth contributions and age</h2>
<p>There is no age limit for contributing to a Roth IRA, and no required withdrawals during the owner's life, so a retiree with part-time wages can keep contributing as long as income stays under the range. The ${usd(r.iraCatchUp50)} catch-up applies from the year you turn 50. Contributions, unlike earnings, can be withdrawn at any time without tax or penalty, which makes a Roth IRA a common second emergency fund for younger savers.</p>
<h2>Married filing separately</h2>
<p>The ${usd(rp.mfs[0])} to ${usd(rp.mfs[1])} range for separate filers applies when the spouses lived together at any time during the year; spouses who lived apart all year use the single range. Even ${usd(5000)} of modified AGI cuts a separate filer's contribution in half. This is one of the reasons the ${h.a('married-filing-separately-brackets', 'separate return')} rarely pays.</p>
<h2>The backdoor route</h2>
<p>Above the range, a direct Roth contribution is not allowed, but a non-deductible traditional IRA contribution can be converted to a Roth, since conversions have no income limit. The pro-rata rule taxes part of the conversion if you hold other pre-tax IRA money, and Form 8606 tracks the basis. The ${h.a('ira-contribution-limit', 'IRA page')} explains the deduction ranges that make a traditional contribution non-deductible in the first place.</p>
<p>Source: ${h.src('n2567')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['ira-contribution-limit', '401k-contribution-limit', 'marginal-vs-effective-tax-rate', 'married-filing-separately-brackets', 'tax-brackets'],
  sources: ['n2567', 'iralimits'],
});
