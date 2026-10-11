import { definePage } from '../../lib/page-types';
import { E, Y, S, P, usd, day } from '../../lib/kit';

const y6 = Y(2026); const es = S.estimated;
const free = E.estimatedTax(24000, 20000, 95000, 4000);
const high = E.estimatedTax(60000, 48000, 210000, 20000);

export default definePage({
  id: 'estimated-tax-payments',
  group: 'calendar',
  kind: 'tool',
  order: 70,
  slug: 'estimated-tax-payments',
  nav: 'Estimated tax payments',
  card: 'The four 2026 due dates, the 90% / 100% / 110% safe harbors and the payment per quarter.',
  title: 'Quarterly Estimated Tax Payments 2026: Dates and Safe Harbor',
  description: `Quarterly estimated tax payments 2026: due ${day(y6.estimated[0])}, ${day(y6.estimated[1])}, ${day(y6.estimated[2])} and ${day(y6.estimated[3])}. Pay 90% of 2026 or 100% of 2025 tax.`,
  h1: 'Estimated tax payments for 2026',
  intro: 'Who must pay during the year, how much is enough to avoid a penalty, and when each installment is due.',
  resume: `You generally must pay estimated tax for 2026 if you expect to owe at least ${usd(es.owedThreshold)} after withholding and refundable credits, and if withholding and credits will cover less than the smaller of ${es.currentYearPct}% of your 2026 tax and ${es.priorYearPct}% of your 2025 tax, according to the 2026 Form 1040-ES. If your 2025 AGI was above ${usd(es.highIncomeAgi)} (${usd(es.highIncomeAgiMfs)} married filing separately), the prior-year test becomes ${es.highIncomePct}%. The four installments are due ${day(y6.estimated[0])}, ${day(y6.estimated[1])}, ${day(y6.estimated[2])} and ${day(y6.estimated[3])}; the last can be skipped if you file your 2026 return and pay in full by ${day(y6.estimatedSkipQ4IfFiledBy)}. A freelancer expecting ${usd(24000)} of 2026 tax, who owed ${usd(20000)} for 2025 with ${usd(95000)} of AGI and has ${usd(4000)} withheld from a part-time job, can stay safe by paying ${usd(free.toPay)} for the year, ${usd(free.quarterly)} a quarter. Someone with no tax liability for 2025 owes no estimated tax for 2026.`,
  tool: 'estimated',
  faqs: [
    { q: 'What is the safe harbor for estimated taxes in 2026?', a: `Pay, through withholding and estimated payments, at least the smaller of ${es.currentYearPct}% of your 2026 tax or ${es.priorYearPct}% of the tax on your 2025 return (${es.highIncomePct}% if 2025 AGI exceeded ${usd(es.highIncomeAgi)}). Meeting either amount, spread over the four due dates, avoids the underpayment penalty even if you owe more when you file. Farmers and fishermen use 66 2/3% instead of 90%.` },
    { q: 'Can I skip the January 15, 2027 estimated payment?', a: `Yes, if you file your 2026 return by ${day(y6.estimatedSkipQ4IfFiledBy)} and pay the entire balance due with it, as the 2026 Form 1040-ES allows. Otherwise the fourth installment is due ${day(y6.estimated[3])}, and missing it can bring an underpayment penalty for the period from that date until you pay.` },
    { q: 'How much estimated tax does a high earner need to pay for 2026?', a: `With 2025 AGI above ${usd(es.highIncomeAgi)}, the prior-year safe harbor is ${es.highIncomePct}% of 2025 tax. A consultant who owed ${usd(48000)} for 2025, expects ${usd(60000)} for 2026 and has ${usd(20000)} withheld needs ${usd(high.required)} in total: the smaller of 90% of ${usd(60000)} and 110% of ${usd(48000)}. That leaves ${usd(high.toPay)} to pay, ${usd(high.quarterly)} a quarter.` },
  ],
  body: (h) => `
<h2>The 2026 calendar</h2>
${h.table(['Installment', 'Income period it covers', 'Due date'], [
  ['1', 'January 1 to March 31, 2026', day(y6.estimated[0])],
  ['2', 'April 1 to May 31, 2026', day(y6.estimated[1])],
  ['3', 'June 1 to August 31, 2026', day(y6.estimated[2])],
  ['4', 'September 1 to December 31, 2026', day(y6.estimated[3])],
], 'Form 1040-ES (2026); the periods are uneven, the payments need not be', ['l', 'l', 'r'])}
<p>The periods have different lengths, but the required payments are equal quarters of the annual amount unless you use the annualized income method of Publication 505, which helps people whose income arrives late in the year, such as a capital gain in December or a seasonal business.</p>
<h2>Who usually needs to pay</h2>
<p>Self-employed people, gig workers and independent contractors whose payers withhold nothing; landlords and investors with large interest, dividends or gains; retirees whose pensions and Social Security withholding are too low. Employees with a second job can often avoid estimated payments by asking the main employer to withhold more on Form W-4, since withholding counts as if paid evenly through the year. Self-employment tax at 15.3% on ${S.fica.selfEmployedBase}% of profit is part of the tax to cover, see the ${h.a('fica-tax-rate', 'FICA page')}.</p>
<h2>How to pay</h2>
<p>Estimated payments can be made through IRS Direct Pay from a bank account, through your IRS online account, by card through an approved processor, or by check with a Form 1040-ES voucher. Payments are credited to the tax year you choose, so label each one 2026. Married couples can make joint estimated payments and split them later between separate returns if needed, except in the cases the form lists, such as a spouse who is a nonresident alien.</p>
<h2>The penalty if you fall short</h2>
<p>The underpayment penalty is computed like interest, at the quarterly underpayment rate (${P.interest.underpayment['2026'][3]}% for the last quarter of 2026), on the amount each installment was short and for the number of days it stayed short. It is figured on Form 2210 or by the IRS from your return. Paying a missed installment as soon as possible limits it. The ${h.a('irs-interest-rates', 'interest rate page')} gives the rates, and the ${h.a('tax-refund-calculator', 'refund estimator')} helps estimate the year's tax.</p>
<p>Sources: ${h.src('es2026')}; ${h.src('interest')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-deadline', 'irs-interest-rates', 'fica-tax-rate', 'tax-refund-calculator', 'capital-gains-tax-rates'],
  sources: ['es2026', 'interest'],
});
