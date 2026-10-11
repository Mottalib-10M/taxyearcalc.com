import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const s6 = Y(2026).senior;
const one = (m: number) => E.seniorDeduction(2026, 'single', m, 1);
const two = (m: number) => E.seniorDeduction(2026, 'mfj', m, 2);
const goneSingle = one(0).gone; const goneJoint = two(0).gone;

export default definePage({
  id: 'senior-deduction',
  group: 'deductions',
  kind: 'tool',
  order: 40,
  slug: 'senior-deduction',
  nav: 'Senior deduction',
  card: 'The $6,000 deduction for people 65 and older: who gets it and how fast it phases out.',
  title: `Senior Deduction 2026: ${usd(s6.amount)} Each at 65 and Its Phase-Out`,
  description: `Senior deduction 2026: ${usd(s6.amount)} per person 65 or older for 2025 to 2028, minus 6% of MAGI over ${usd(s6.phaseStart.single)} (${usd(s6.phaseStart.mfj)} joint). Check the amount you keep on your return.`,
  h1: 'The senior deduction for people 65 and older',
  intro: 'A temporary deduction on top of the usual age addition, worth less with every dollar of income above the threshold.',
  resume: `The senior deduction gives ${usd(s6.amount)} to each taxpayer who is 65 or older by the last day of the year, ${usd(s6.amount * 2)} for a married couple where both qualify, for tax years 2025 through 2028 under section 70103 of Public Law 119-21. It is claimed on Part V of Schedule 1-A, on top of the regular additional standard deduction for age, and it works whether you itemize or not. It phases out at 6% of modified adjusted gross income above ${usd(s6.phaseStart.single)} for a single filer or head of household and ${usd(s6.phaseStart.mfj)} on a joint return: at ${usd(95000)} of modified AGI a single retiree keeps ${usd(one(95000).deduction)}, and nothing remains at ${usd(goneSingle)}. For a couple the reduction applies to each spouse's ${usd(s6.amount)}, so the deduction disappears at ${usd(goneJoint)}. Taxable Social Security counts in modified AGI, tax-free Social Security does not. Each qualifying spouse needs a valid Social Security number, and married couples must file a joint return; married filing separately gets nothing.`,
  tool: 'senior',
  faqs: [
    { q: 'Does the senior deduction mean Social Security is no longer taxed?', a: `No. The law did not change how Social Security benefits are taxed; up to 85% of benefits can still be taxable depending on income. The senior deduction is a flat amount, ${usd(s6.amount)} per person aged 65 or older, subtracted from taxable income. For many retirees it offsets the tax on part of their benefits, but someone with very high income gets no deduction at all.` },
    { q: 'I turn 65 on January 1, 2027. Do I get the senior deduction on my 2026 return?', a: `Yes. The IRS treats you as 65 on the day before your 65th birthday, and the 2026 Form 1040-ES says people born before January 2, 1962 may be eligible for 2026. Someone born on January 1, 1962 therefore counts as 65 at the end of 2026. Born on January 2, 1962 or later, you wait for the 2027 return.` },
    { q: 'How much senior deduction does a couple with $180,000 of income get?', a: `With ${usd(180000)} of modified AGI on a joint return, each spouse loses 6% of the ${usd(180000 - s6.phaseStart.mfj)} above the ${usd(s6.phaseStart.mfj)} threshold, ${usd(two(180000).reduction)} each. If both are 65 or older they deduct ${usd(two(180000).deduction)} together. Only one spouse past 65 means half that amount.` },
    { q: 'Can I claim the senior deduction if I itemize my deductions?', a: `Yes. Unlike the age addition to the standard deduction, which is lost when you itemize, the senior deduction sits on Schedule 1-A and is subtracted after either the standard deduction or Schedule A. It reduces taxable income but not AGI, so it does not help with income-based limits such as the taxation of Social Security or Medicare premiums.` },
  ],
  body: (h) => `
<h2>How the 6% phase-out bites</h2>
<p>Part V of Schedule 1-A subtracts ${usd(s6.phaseStart.single)} (${usd(s6.phaseStart.mfj)} joint) from modified AGI, multiplies the excess by 6% and takes that from ${usd(s6.amount)}. There is no rounding to thousands, unlike the tips and overtime lines: every extra dollar of income costs six cents of deduction. In the phase-out range, an additional ${usd(1000)} of IRA withdrawal therefore raises taxable income by ${usd(1060)}.</p>
${h.table(['Modified AGI', 'Single, one person 65+', 'Joint, both 65+'], [60000, 90000, 120000, 150000, 180000, 220000, 250000].map((m) => [usd(m), usd(one(m).deduction), usd(two(m).deduction)]), 'Senior deduction for 2026 computed with Schedule 1-A Part V', ['l', 'r', 'r'])}
<h2>Stacked with the age addition</h2>
<p>A single retiree aged 66 who takes the standard deduction subtracts ${usd(E.standardDeduction(2026, 'single', { age65: 1 }).total)} (the ${h.a('standard-deduction', 'standard deduction')} plus the ${usd(Y(2026).agedBlind.unmarried)} age amount), then up to ${usd(s6.amount)} more. With ${usd(40000)} of pension and taxable Social Security, taxable income falls to ${usd(Math.max(0, 40000 - E.standardDeduction(2026, 'single', { age65: 1 }).total - one(40000).deduction))}. A married couple both past 65 with ${usd(70000)} of modified AGI subtracts ${usd(E.standardDeduction(2026, 'mfj', { age65: 2 }).total)} plus ${usd(two(70000).deduction)}.</p>
<h2>Who qualifies, exactly</h2>
<p>The test is age, not retirement: a 66-year-old still working full time qualifies, a 62-year-old retiree does not. Being 65 is judged on December 31, and the IRS counts a birthday on January 1 as reached the day before. A surviving spouse files as single or qualifying surviving spouse and claims one deduction. The person must have a Social Security number valid for work, and the form asks for it on line 36. Nothing else is required: no income floor, no work history, no receipt of Social Security benefits.</p>
<h2>Planning around the threshold</h2>
<p>Because the deduction runs only through 2028 and depends on modified AGI, the timing of IRA withdrawals and Roth conversions matters more than usual for retirees near ${usd(s6.phaseStart.single)} or ${usd(s6.phaseStart.mfj)}. Qualified charitable distributions from an IRA stay out of AGI. The ${h.a('schedule-1-a', 'Schedule 1-A calculator')} combines this deduction with the three others, and the ${h.a('tax-refund-calculator', 'refund estimator')} applies it to a whole return.</p>
<p>Sources: ${h.src('sch1a')}; ${h.src('wftc')}; ${h.src('es2026', 'Form 1040-ES (2026), enhanced deduction for seniors')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['standard-deduction', 'schedule-1-a', 'one-big-beautiful-bill-tax-changes', 'ira-contribution-limit', 'tax-refund-calculator'],
  sources: ['sch1a', 'wftc', 'fs2503', 'es2026', 'law'],
});
