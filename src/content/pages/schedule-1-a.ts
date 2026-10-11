import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const y = Y(2026);
const fam = { magi: 95000, ot: 6000, car: 1500 };
const famOt = E.overtimeDeduction(2026, 'single', fam.ot, fam.magi).deduction;
const famCar = E.carLoanDeduction(2026, 'single', fam.car, fam.magi).deduction;

export default definePage({
  id: 'schedule-1-a',
  group: 'deductions',
  kind: 'tool',
  order: 60,
  slug: 'schedule-1-a',
  nav: 'Schedule 1-A',
  card: 'The new form that gathers the tips, overtime, car loan and senior deductions.',
  title: 'Schedule 1-A 2026: Tips, Overtime, Car Loan and Senior Lines',
  description: `Schedule 1-A for 2025 and 2026 returns: the four new deductions, up to ${usd(y.tips.max)} of tips, ${usd(y.overtime.max.single)} of overtime, ${usd(y.carLoan.max)} of car interest and ${usd(y.senior.amount)} at age 65.`,
  h1: 'Schedule 1-A: the four new deductions on one form',
  intro: 'One form, four deductions, three different phase-out rules: what goes on each part and how the total reaches Form 1040.',
  resume: `Schedule 1-A, Additional Deductions, is the form the IRS created for the 2025 return to carry the four temporary deductions of Public Law 119-21, and it keeps that role for 2026 through 2028. Part I computes modified AGI, Form 1040 line 11b plus excluded foreign or Puerto Rico income. Part II deducts qualified tips up to ${usd(y.tips.max)}; Part III, the qualified overtime premium up to ${usd(y.overtime.max.single)} or ${usd(y.overtime.max.mfj)} joint; Part IV, interest on a new US-assembled vehicle up to ${usd(y.carLoan.max)}; Part V, ${usd(y.senior.amount)} per person aged 65 or older. Each part has its own phase-out: $100 per full $1,000 above ${usd(y.tips.phaseStart.single)} for tips and overtime, $200 per $1,000 or fraction above ${usd(y.carLoan.phaseStart.single)} for car interest, 6% of the excess above ${usd(y.senior.phaseStart.single)} for seniors (joint thresholds are twice as high). Line 38 adds the four results and goes to Form 1040 line 13b, below AGI, whether you itemize or take the standard deduction.`,
  tool: 'schedule1a',
  faqs: [
    { q: 'Where does the Schedule 1-A total go on Form 1040?', a: `Line 38 of Schedule 1-A goes to line 13b of Form 1040 or 1040-SR (line 13c of Form 1040-NR), next to the qualified business income deduction. It is subtracted after the standard or itemized deduction, so it lowers taxable income but leaves adjusted gross income on line 11b unchanged. Any limit based on AGI, such as the medical expense floor, ignores it.` },
    { q: 'Do I have to file Schedule 1-A if I only have tips?', a: `Yes, if you want the deduction. Fill in Part I for modified AGI, then Part II for tips, and leave the other parts blank; line 38 then equals line 13. Tax software generates the form when you enter qualified tips. Without the schedule the deduction is simply not taken, and the IRS will not add it for you.` },
    { q: 'Can someone filing married separately use any part of Schedule 1-A?', a: `No. All four deductions require a joint return for married taxpayers: the form repeats "if married, you must file jointly" in Parts II, III and V, and the car loan part allows the deduction only to you, or to you and your spouse filing jointly. Married filing separately therefore loses every Schedule 1-A deduction.` },
    { q: 'How much does Schedule 1-A save a worker with overtime and a new car loan?', a: `A single filer with ${usd(fam.magi)} of modified AGI, ${usd(fam.ot)} of overtime premium and ${usd(fam.car)} of interest on a new US-built car deducts ${usd(famOt)} on Part III and ${usd(famCar)} on Part IV. At a 22% marginal rate the ${usd(famOt + famCar)} total saves about ${usd(Math.round((famOt + famCar) * 0.22))} of federal income tax.` },
  ],
  body: (h) => `
<h2>Part by part</h2>
${h.table(['Part', 'Deduction', 'Cap', 'Phase-out starts (single / joint)', 'Rule'], [
  ['II', h.a('no-tax-on-tips', 'Qualified tips'), usd(y.tips.max), `${usd(y.tips.phaseStart.single)} / ${usd(y.tips.phaseStart.mfj)}`, '$100 per full $1,000'],
  ['III', h.a('no-tax-on-overtime', 'Qualified overtime premium'), `${usd(y.overtime.max.single)} / ${usd(y.overtime.max.mfj)}`, `${usd(y.overtime.phaseStart.single)} / ${usd(y.overtime.phaseStart.mfj)}`, '$100 per full $1,000'],
  ['IV', h.a('car-loan-interest-deduction', 'Car loan interest'), usd(y.carLoan.max), `${usd(y.carLoan.phaseStart.single)} / ${usd(y.carLoan.phaseStart.mfj)}`, '$200 per $1,000 or part'],
  ['V', h.a('senior-deduction', 'Seniors 65 and older'), `${usd(y.senior.amount)} each`, `${usd(y.senior.phaseStart.single)} / ${usd(y.senior.phaseStart.mfj)}`, '6% of the excess'],
], 'Schedule 1-A (Form 1040) 2025; the same amounts apply in 2026', ['l', 'l', 'r', 'r', 'l'])}
<p>The single thresholds also apply to heads of household. None of these amounts is indexed for inflation: the statute fixes them for the four years, which is why the 2026 figures equal the 2025 ones.</p>
<h2>Modified AGI, computed once</h2>
<p>Part I is shared: line 1 copies Form 1040 line 11b, lines 2a to 2d add income excluded from Puerto Rico or under the foreign earned income exclusion (Form 2555) and the possessions exclusion (Form 4563), and line 3 is the modified AGI that every part then uses. An American working abroad who excludes ${usd(Y(2026).feie)} of salary under the ${h.a('foreign-earned-income-exclusion', 'foreign earned income exclusion')} adds it back here, which can push the household past a threshold.</p>
<h2>Records to keep</h2>
<p>For tips, the W-2 boxes, Forms 4070 reported to the employer and Form 4137 for unreported tips, or a daily log for the self-employed. For overtime, the pay stubs showing hours and rates. For the car, the purchase contract, the lender's interest statement and the VIN. For the senior deduction, nothing beyond your Social Security number. The IRS can ask for these when it reviews a return.</p>
<h2>Why the four rarely add up to their caps</h2>
<p>The caps are high compared with what most claimants have: tipped workers in the IRS estimate number about six million, and many earn well under ${usd(y.tips.max)} in tips. The phase-outs then trim higher earners, and the saving is always the deduction times the marginal rate, so a household in the 12% bracket saves twelve cents per deducted dollar. For the full picture with credits and withholding, use the ${h.a('tax-refund-calculator', 'refund estimator')}.</p>
<p>Sources: ${h.src('sch1a')}; ${h.src('ir25114')}; ${h.src('season2026', 'IR-2026-02 on the new Schedule 1-A')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['no-tax-on-tips', 'no-tax-on-overtime', 'car-loan-interest-deduction', 'senior-deduction', 'one-big-beautiful-bill-tax-changes'],
  sources: ['sch1a', 'ir25114', 'wftc', 'season2026', 'law'],
});
