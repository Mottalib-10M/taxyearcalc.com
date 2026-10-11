import { definePage } from '../../lib/page-types';
import { E, Y, usd, num, day, P } from '../../lib/kit';

const ex = E.fullReturn({ year: 2026, status: 'single', wages: 58000, otherIncome: 0, adjustments: 0, itemized: 0, age65: 0, kids: 0, tips: 0, overtimePremium: 0, withholding: 6200 });
const fam = E.fullReturn({ year: 2026, status: 'mfj', wages: 85000, otherIncome: 0, adjustments: 0, itemized: 0, age65: 0, kids: 2, tips: 0, overtimePremium: 5000, withholding: 5200 });
const ex25 = E.fullReturn({ year: 2025, status: 'single', wages: 58000, otherIncome: 0, adjustments: 0, itemized: 0, age65: 0, kids: 0, tips: 0, overtimePremium: 0, withholding: 6200 });

export default definePage({
  id: 'tax-refund-calculator',
  group: 'calendar',
  kind: 'tool',
  order: 10,
  slug: 'tax-refund-calculator',
  nav: 'Refund estimator',
  card: 'Wages, withholding, children and the new deductions in; refund or balance due out.',
  title: 'Tax Refund Calculator 2026: Estimate Your Federal Refund Now',
  description: `Tax refund calculator for 2026 and 2025: wages, withholding, kids, tips and overtime go in. Example: ${usd(58000)} single, ${usd(6200)} withheld, ${usd(ex.refund)} back to you.`,
  h1: 'Federal tax refund estimator for 2026 and 2025',
  intro: 'The whole return in a few fields: income, deductions, credits, then the gap with what was withheld.',
  resume: `A federal refund is the difference between the tax withheld from your pay, plus refundable credits, and the tax your return finally shows. This estimator runs the same sequence as Form 1040 for a wage earner: wages and other income give AGI; the standard deduction (or itemized deductions if larger) and the new Schedule 1-A deductions for tips, overtime and seniors give taxable income; the 2026 or 2025 brackets give the tax; the child tax credit reduces it; the additional child tax credit and the earned income credit are added as refundable credits. A single filer with ${usd(58000)} of wages and ${usd(6200)} withheld in 2026 has ${usd(ex.taxable)} of taxable income, owes ${usd(ex.taxAfter)} and gets about ${usd(ex.refund)} back; on the 2025 return the same figures give ${usd(ex25.refund)}. A married couple with two children, ${usd(85000)} of wages, ${usd(5000)} of overtime premium and ${usd(5200)} withheld, would ${fam.refund > 0 ? `get about ${usd(fam.refund)}` : `owe about ${usd(fam.owe)}`}. Self-employment tax, education credits and state taxes are left out.`,
  tool: 'refundEstimate',
  faqs: [
    { q: 'Why is my refund smaller than last year with the same salary?', a: `The usual reasons are lower withholding after a new W-4, a child who turned 17 and no longer brings the ${usd(Y(2026).ctc.max)} credit, income that moved above a phase-out, or a refundable credit that shrank. The brackets and the standard deduction rise each year, which by itself lowers the tax. Comparing withholding on both years' W-2s, box 2, usually explains most of the gap.` },
    { q: 'Do the tips and overtime deductions increase my refund?', a: `For most workers, yes, because employers did not change income tax withholding when the law passed in July 2025, so the tax saved shows up when the return is filed. A server who deducts ${usd(12000)} of tips in the 12% bracket gets about ${usd(1440)} more back than without the deduction. The estimator includes both deductions with their phase-outs.` },
    { q: 'Is a big refund good tax planning?', a: `A refund is your own money returned without interest. A large one means more was withheld than needed during the year; adjusting Form W-4 would put that money in your paychecks instead. A small refund or a small balance due means withholding matched the tax closely. Owing more than ${usd(1000)} at filing can bring an estimated tax penalty in some cases.` },
  ],
  body: (h) => `
<h2>What the estimator computes, line by line</h2>
<p>Total income is wages, plus tips if they were not included in wages, plus other income such as interest or a side job. Adjusted gross income is that total; the estimator does not take adjustments such as deductible IRA contributions, which you can subtract from other income yourself. The deduction is the larger of the ${h.a('standard-deduction', 'standard deduction')}, with the age additions, and the itemized amount you enter. The ${h.a('schedule-1-a', 'Schedule 1-A')} deductions come next, each with its phase-out computed on AGI. The tax is computed with the rate schedule, then the ${h.a('child-tax-credit', 'child tax credit')} reduces it, and the refundable credits are added to withholding.</p>
${h.table(['Line', 'Single, $58,000, 2026'], [
  ['Adjusted gross income', usd(ex.agi)],
  ['Standard deduction', usd(ex.standard)],
  ['Taxable income', usd(ex.taxable)],
  ['Tax (marginal bracket ' + ex.marginal + '%)', usd(ex.taxBefore)],
  ['Withholding', usd(ex.withholding)],
  ['Refund', usd(ex.refund)],
], `Effective rate ${num(ex.effective, 1)}% of AGI`, ['l', 'r'])}
<h2>Where the estimate can differ from your return</h2>
<p>The IRS tax table used under ${usd(100000)} of taxable income rounds to ${usd(50)} bands, so the tax can differ by a few dollars. The earned income credit is computed from the section 32 amounts rather than the EITC table. The estimator does not include self-employment tax, the alternative minimum tax, education credits, the premium tax credit, retirement savings credits, excess Social Security from two employers or state income tax. A large difference with your return usually comes from one of those items or from income not entered.</p>
<h2>When the money arrives</h2>
<p>Once the return is accepted, most refunds arrive within 21 days with direct deposit; returns claiming the earned income credit or the additional child tax credit are held until mid-February by law. The ${h.a('irs-refund-schedule', 'refund schedule')} gives an expected date for your filing day, and the ${h.a('when-will-i-get-my-refund', 'refund timing guide')} explains each status of the IRS tracker. If the estimate shows a balance due for 2026, the ${h.a('estimated-tax-payments', 'estimated tax')} page says how to avoid a penalty next year.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('rp2440')}; ${h.src('sch1a')}; ${h.src('refunds')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['irs-refund-schedule', 'tax-brackets', 'child-tax-credit', 'no-tax-on-tips', 'estimated-tax-payments'],
  sources: ['rp2532', 'rp2440', 'sch1a', 'refunds'],
});
