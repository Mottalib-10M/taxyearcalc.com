import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, day, P } from '../../lib/kit';

const s6 = Y(2026).salt; const s5 = Y(2025).salt;
const nj = E.saltDeduction(2026, 'mfj', 48000, 560000);
const floorAt6 = E.saltDeduction(2026, 'mfj', 0, 0).floorAt;

export default definePage({
  id: 'salt-deduction',
  group: 'deductions',
  kind: 'tool',
  order: 70,
  slug: 'salt-deduction',
  nav: 'SALT deduction',
  card: 'The $40,400 cap for 2026, its phase-down above $505,000 and the $10,000 floor.',
  title: `SALT Deduction 2026: ${usd(s6.cap)} Cap and the ${usd(s6.threshold)} Phase-Down`,
  description: `SALT deduction 2026: state and local taxes capped at ${usd(s6.cap)} (${usd(s5.cap)} for 2025), cut by 30% of MAGI over ${usd(s6.threshold)}, never under ${usd(s6.floor)}. Find your cap.`,
  h1: 'The SALT deduction cap for 2026 and 2025',
  intro: 'How much of your state income, sales and property taxes you can itemize, and how income shrinks the cap.',
  resume: `For 2026 the deduction for state and local taxes, the SALT deduction, is capped at ${usd(s6.cap)} per return (${usd(s6.cap / 2)} married filing separately), up from ${usd(s5.cap)} for 2025, under section 70120 of Public Law 119-21. The cap covers state and local income taxes or general sales taxes, plus real estate and personal property taxes, and it only helps if you itemize on Schedule A. Above ${usd(s6.threshold)} of modified AGI in 2026 (${usd(s5.threshold)} in 2025) the cap drops by 30% of the excess, but never below ${usd(s6.floor)}: a couple in New Jersey with ${usd(560000)} of modified AGI and ${usd(48000)} of state and property taxes can deduct ${usd(nj.deduction)} instead of ${usd(s6.cap)}. The cap reaches its floor at ${usd(floorAt6)} of modified AGI. The statute raises the cap and the threshold by 1% a year through 2029 and returns the cap to ${usd(S.saltRevert.cap)} in ${S.saltRevert.year}. The 2026 Form 1040-ES still repeats the 2025 figures in its reminders; this site follows the statute.`,
  tool: 'salt',
  faqs: [
    { q: 'Is the SALT cap $40,000 or $40,400 for 2026?', a: `${usd(s6.cap)}. Section 164(b)(7) as written by Public Law 119-21 sets ${usd(s5.cap)} for taxable years beginning in 2025 and ${usd(s6.cap)} for 2026, with a threshold of ${usd(s5.threshold)} then ${usd(s6.threshold)}. The reminders of the 2026 Form 1040-ES repeat the 2025 numbers, but the statute is the more specific text, and the 2026 Schedule A should carry ${usd(s6.cap)}.` },
    { q: 'What counts toward the state and local tax deduction limit?', a: `State and local income taxes withheld or paid during the year, or general sales taxes instead of income taxes, plus real estate taxes on your homes and personal property taxes based on value, such as some car registration fees. Foreign income taxes and taxes paid on business or rental property reported on Schedules C or E are not part of the SALT cap.` },
    { q: 'At what income does the SALT cap fall back to $10,000?', a: `When 30% of the modified AGI above the threshold equals the difference between the cap and ${usd(s6.floor)}. For 2026 that happens at ${usd(floorAt6)} of modified AGI; for 2025 it was ${usd(E.saltDeduction(2025, 'mfj', 0, 0).floorAt)}. The amount is the same for single and joint filers; married filing separately halves everything.` },
    { q: 'Does the higher SALT cap help if I take the standard deduction?', a: `No. SALT is an itemized deduction, so it matters only when your itemized total beats the ${usd(Y(2026).standard.mfj)} joint or ${usd(Y(2026).standard.single)} single standard deduction for 2026. Homeowners in high-tax states often cross that line now that the cap is above ${usd(40000)}; renters in low-tax states rarely do.` },
  ],
  body: (h) => `
<h2>The worksheet behind line 5e of Schedule A</h2>
<p>The Schedule A instructions turn the law into a ten-line worksheet. If your state and local taxes are ${usd(s6.floor)} or less, you deduct them all. Otherwise line 1 is the cap, lines 2 to 4 rebuild modified AGI (AGI plus excluded foreign and Puerto Rico income), line 5 is the threshold, line 7 takes 30% of the excess, line 9 keeps the larger of the reduced cap and ${usd(s6.floor)}, and line 10 keeps the smaller of that and the taxes you paid. Married filing separately halves the result. The calculator applies the same lines with the 2026 amounts from the statute.</p>
${h.table(['Modified AGI', '2025 cap', '2026 cap'], [400000, 505000, 550000, 600000, 650000, 700000].map((m) => [usd(m), usd(E.saltDeduction(2025, 'mfj', 1e6, m).cap), usd(E.saltDeduction(2026, 'mfj', 1e6, m).cap)]), 'SALT cap by modified AGI, computed with the Schedule A worksheet and section 164(b)(7)', ['l', 'r', 'r'])}
<h2>A 30% band that acts like a higher tax rate</h2>
<p>Between the threshold and the floor, each extra dollar of income removes 30 cents of deduction. A taxpayer in the 35% bracket inside that band pays 35% on the dollar plus 35% of the 30 cents lost, about 45.5% at the margin, as long as the full taxes paid exceed the reduced cap. Below the threshold, or above ${usd(floorAt6)}, the effect disappears. Pass-through owners in many states can still route state tax through the business, which this calculator does not model.</p>
<h2>Itemize or not</h2>
<p>The cap only matters for people who itemize. Add ${h.a('mortgage-interest-deduction', 'mortgage interest')}, ${h.a('charitable-deduction', 'charitable gifts')} above the 2026 floor and medical costs above 7.5% of AGI, then compare with the ${h.a('standard-deduction', 'standard deduction')}; the ${h.a('itemized-vs-standard-deduction', 'itemize-or-not calculator')} does it with the 2026 limit for the 37% bracket.</p>
<p>Sources: section 70120 of ${h.src('law', 'Public Law 119-21')}; ${h.src('ischa')}; ${h.src('scha')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['itemized-vs-standard-deduction', 'mortgage-interest-deduction', 'standard-deduction', 'one-big-beautiful-bill-tax-changes', 'charitable-deduction'],
  sources: ['law', 'ischa', 'scha', 'es2026'],
});
