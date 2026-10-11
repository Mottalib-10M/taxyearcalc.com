import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const e6 = Y(2026).eitc; const e5 = Y(2025).eitc;
const two = E.eitc(2026, 2, 30000, 30000, false);
const zero = E.eitc(2026, 0, 12000, 12000, false);

export default definePage({
  id: 'earned-income-credit',
  group: 'credits',
  kind: 'tool',
  order: 20,
  slug: 'earned-income-credit',
  nav: 'Earned income credit',
  card: 'The 2026 EITC by number of children: maximum, plateau and phase-out, computed for you.',
  title: `Earned Income Credit 2026: Up to ${usd(e6.maxCredit[3])}, Your Amount`,
  description: `Earned income credit 2026: up to ${usd(e6.maxCredit[0])} with no child, ${usd(e6.maxCredit[1])} with one, ${usd(e6.maxCredit[2])} with two and ${usd(e6.maxCredit[3])} with three or more. Estimate your own EITC in seconds.`,
  h1: 'Earned income credit for 2026',
  intro: 'A refundable credit that rises with earnings, levels off, then fades: where your income sits on that curve.',
  resume: `The earned income credit is a refundable credit for workers with low to moderate earnings. For tax year 2026 its maximum is ${usd(e6.maxCredit[0])} with no qualifying child, ${usd(e6.maxCredit[1])} with one, ${usd(e6.maxCredit[2])} with two and ${usd(e6.maxCredit[3])} with three or more, according to section 4.06 of Rev. Proc. 2025-32 (${usd(e5.maxCredit[3])} was the 2025 maximum). The credit grows with each dollar earned until earned income reaches ${usd(e6.earnedAmount[1])} with one child or ${usd(e6.earnedAmount[2])} with two or more, stays flat, then shrinks once income passes ${usd(e6.phaseStart[1])} (${usd(e6.phaseStartMfj[1])} for a joint return). A single parent of two earning ${usd(30000)} gets about ${usd(two.credit)}; a worker without children earning ${usd(12000)} gets ${usd(zero.credit)}. Investment income above ${usd(e6.investmentLimit)} rules the credit out. Because it is refundable, it is paid even when no income tax is owed, but the IRS cannot release refunds that include it before mid-February.`,
  tool: 'eitc',
  toolArg: { kids: 2 },
  faqs: [
    { q: 'How is the earned income credit calculated between the plateau and the phase-out?', a: `The credit equals the phase-in rate times earned income up to the earned income amount, ${usd(e6.earnedAmount[2])} with two children in 2026, then stays at the maximum, ${usd(e6.maxCredit[2])}. Once AGI or earned income, whichever is larger, passes ${usd(e6.phaseStart[2])} (${usd(e6.phaseStartMfj[2])} joint), it falls steadily and reaches zero at ${usd(e6.phaseEnd[2])} (${usd(e6.phaseEndMfj[2])} joint).` },
    { q: 'Can I get the earned income credit with no children in 2026?', a: `Yes, if you are at least 25 and under 65, not claimed as a dependent, and your income stays under ${usd(e6.phaseEnd[0])} single or ${usd(e6.phaseEndMfj[0])} on a joint return. The maximum is ${usd(e6.maxCredit[0])}, reached at ${usd(e6.earnedAmount[0])} of earned income. It is small, but refundable, so it adds to the refund of a low-wage worker who owes no income tax.` },
    { q: 'Do tips count as earned income for the EITC after the tips deduction?', a: `Yes. The no tax on tips deduction reduces taxable income below AGI, but tips remain earned income for the earned income credit. A server earning ${usd(18000)} in wages and tips with one child computes the EITC on the full ${usd(18000)}, so the new deduction does not cut the credit. The same holds for overtime pay.` },
  ],
  body: (h) => `
<h2>The 2026 parameters, by family</h2>
${h.table(['Qualifying children', 'Maximum credit', 'Earned income to reach it', 'Phase-out starts (other / joint)', 'Credit ends (other / joint)'], [0, 1, 2, 3].map((k) => [k === 3 ? '3 or more' : String(k), usd(e6.maxCredit[k]), usd(e6.earnedAmount[k]), `${usd(e6.phaseStart[k])} / ${usd(e6.phaseStartMfj[k])}`, `${usd(e6.phaseEnd[k])} / ${usd(e6.phaseEndMfj[k])}`]), 'Rev. Proc. 2025-32 section 4.06', ['l', 'r', 'r', 'r', 'r'])}
<p>The full limits by family, for 2025 as well, are on the ${h.a('eitc-income-limits', 'EITC income limits')} page. The calculator uses the section 32 amounts directly; the official EITC table of the Form 1040 instructions works in $50 bands, so the credit on a return can differ by a few dollars.</p>
<h2>Earned income, AGI and investment income</h2>
<p>Earned income means wages, salaries, tips, union strike benefits, long-term disability benefits received before minimum retirement age and net self-employment earnings. Unemployment compensation, Social Security, pensions, child support and alimony do not count. During the phase-out, the credit is computed on the larger of AGI and earned income, so interest or a capital gain can reduce it. Investment income above ${usd(e6.investmentLimit)} for 2026 (${usd(e5.investmentLimit)} for 2025) removes the credit entirely, whatever the earnings.</p>
<h2>Common reasons for a denied credit</h2>
<p>The IRS reviews many EITC claims. The usual problems are a child who did not live with the taxpayer for more than half the year, two people claiming the same child, a filing status that does not fit (married people must generally file jointly, with an exception for separated spouses) and self-employment income that is overstated to reach the plateau. Each child needs a Social Security number valid for work. Refunds that include the credit are held until mid-February under the PATH Act; the ${h.a('when-will-i-get-my-refund', 'refund timing guide')} has the dates.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('rp2440')}; ${h.src('refunds')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['eitc-income-limits', 'child-tax-credit', 'when-will-i-get-my-refund', 'tax-refund-calculator', 'no-tax-on-tips'],
  sources: ['rp2532', 'rp2440', 'refunds'],
});
