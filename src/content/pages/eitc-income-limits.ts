import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const e6 = Y(2026).eitc; const e5 = Y(2025).eitc;
const lbl = (k: number) => (k === 0 ? 'No child' : k === 3 ? 'Three or more' : k === 1 ? 'One child' : 'Two children');

export default definePage({
  id: 'eitc-income-limits',
  group: 'credits',
  kind: 'tool',
  order: 30,
  slug: 'eitc-income-limits',
  nav: 'EITC income limits',
  card: 'The maximum income for the EITC in 2026 and 2025, by children and filing status.',
  title: `EITC Income Limits 2026: Under ${usd(e6.phaseEndMfj[3])} Joint With 3 Kids`,
  description: `EITC income limits 2026: income must stay under ${usd(e6.phaseEnd[0])} with no child up to ${usd(e6.phaseEndMfj[3])} for a couple with three, and investment income under ${usd(e6.investmentLimit)} a year.`,
  h1: 'Earned income credit income limits for 2026 and 2025',
  intro: 'The income ceilings that decide whether you can claim the EITC at all, before computing the amount.',
  resume: `To claim the earned income credit for 2026, both your earned income and your adjusted gross income must stay below a ceiling that depends on the number of qualifying children and on whether you file jointly. The limits from section 4.06 of Rev. Proc. 2025-32 are ${usd(e6.phaseEnd[0])} with no child, ${usd(e6.phaseEnd[1])} with one, ${usd(e6.phaseEnd[2])} with two and ${usd(e6.phaseEnd[3])} with three or more for single filers, heads of household and qualifying separated spouses; for married couples filing jointly they are ${usd(e6.phaseEndMfj[0])}, ${usd(e6.phaseEndMfj[1])}, ${usd(e6.phaseEndMfj[2])} and ${usd(e6.phaseEndMfj[3])}. For the 2025 return the joint limit with three children was ${usd(e5.phaseEndMfj[3])}. A second test applies to everyone: investment income (interest, dividends, capital gains, rents) cannot exceed ${usd(e6.investmentLimit)} for 2026, ${usd(e5.investmentLimit)} for 2025. Being under the limit only opens the door; near the ceiling the credit is small, since it phases out gradually from a lower threshold.`,
  tool: 'eitcLimits',
  faqs: [
    { q: 'What is the maximum income to qualify for the EITC with two children in 2026?', a: `${usd(e6.phaseEnd[2])} of earned income and AGI for a single parent or head of household, and ${usd(e6.phaseEndMfj[2])} for a married couple filing jointly. At those amounts the credit has fully phased out; a family just below receives only a few dollars. The full credit of ${usd(e6.maxCredit[2])} goes to families with income between ${usd(e6.earnedAmount[2])} and ${usd(e6.phaseStart[2])}.` },
    { q: 'Does a large tax refund or savings account interest affect EITC eligibility?', a: `A refund is not income. Interest, dividends and other investment income count toward the ${usd(e6.investmentLimit)} investment income limit for 2026, and above it no credit is allowed, whatever your wages. Savings themselves, a house or a car do not matter; the EITC has no asset test, only the investment income test.` },
    { q: 'Why is the EITC income limit higher for married couples?', a: `The law adds a fixed amount to the phase-out thresholds for joint returns, adjusted for inflation, to soften the marriage penalty. In 2026 the phase-out for families with children starts at ${usd(e6.phaseStartMfj[1])} instead of ${usd(e6.phaseStart[1])}, which pushes each ceiling up by ${usd(e6.phaseEndMfj[1] - e6.phaseEnd[1])} for one child. The maximum credits are the same for both.` },
  ],
  body: (h) => `
<h2>All the ceilings, 2026 and 2025</h2>
${h.table(['Children', '2026 single or HOH', '2026 joint', '2025 single or HOH', '2025 joint'], [0, 1, 2, 3].map((k) => [lbl(k), usd(e6.phaseEnd[k]), usd(e6.phaseEndMfj[k]), usd(e5.phaseEnd[k]), usd(e5.phaseEndMfj[k])]), 'Completed phase-out amounts, Rev. Proc. 2025-32 and Rev. Proc. 2024-40', ['l', 'r', 'r', 'r', 'r'])}
<h2>How close to the ceiling the credit runs out</h2>
<p>The credit does not drop from its maximum to zero at the ceiling; it slides down over the phase-out range. For a single parent of one child in 2026, it is ${usd(e6.maxCredit[1])} up to ${usd(e6.phaseStart[1])} of income, about ${usd(E.eitc(2026, 1, 40000, 40000, false).credit)} at ${usd(40000)}, about ${usd(E.eitc(2026, 1, 48000, 48000, false).credit)} at ${usd(48000)} and zero at ${usd(e6.phaseEnd[1])}. Use the ${h.a('earned-income-credit', 'EITC calculator')} for an exact figure on your income.</p>
${h.table(['Income (one child, single)', 'Credit'], [15000, 23890, 30000, 40000, 48000, 51593].map((i) => [usd(i), usd(E.eitc(2026, 1, i, i, false).credit)]), 'Earned income equals AGI, 2026', ['l', 'r'])}
<h2>Self-employed workers and the limits</h2>
<p>For a self-employed worker, earned income is net profit minus the deductible half of self-employment tax, so a sole proprietor with ${usd(30000)} of gross receipts and ${usd(12000)} of expenses starts from ${usd(18000)} of profit, not from receipts. Both sides of the limit move with business results: a good year can push income past the ceiling, a loss can reduce earned income below the plateau. Gig workers paid through apps should keep records of their expenses, because the Form 1099-K shows gross payments only.</p>
<h2>The tests besides income</h2>
<p>Age: without a qualifying child you must be at least 25 and under 65 at the end of the year. Filing status: married people file jointly, except separated spouses who meet the rules of section 32(d). Residence: you must live in the United States for more than half the year. Identification: you, your spouse and each child need a Social Security number valid for work. A child counted for the credit must meet the relationship, age and residence tests, which the ${h.a('child-tax-credit', 'child tax credit')} page also describes.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('rp2440')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['earned-income-credit', 'child-tax-credit', 'head-of-household-brackets', 'tax-refund-calculator', 'when-will-i-get-my-refund'],
  sources: ['rp2532', 'rp2440'],
});
