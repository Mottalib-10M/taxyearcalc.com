import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const c = Y(2026).carLoan;
const ex = E.carLoanDeduction(2026, 'single', 2400, 104500);
const exJ = E.carLoanDeduction(2026, 'mfj', 3200, 180000);

export default definePage({
  id: 'car-loan-interest-deduction',
  group: 'deductions',
  kind: 'tool',
  order: 50,
  slug: 'car-loan-interest-deduction',
  nav: 'Car loan interest',
  card: 'Up to $10,000 of interest on a new US-assembled car, and the steep $200 phase-out.',
  title: `Car Loan Interest Deduction 2026: Up to ${usd(c.max)} a Year`,
  description: `Car loan interest deduction for 2025 to 2028: up to ${usd(c.max)} a year on a new vehicle assembled in the US, minus $200 per $1,000 of MAGI over ${usd(c.phaseStart.single)}. See yours.`,
  h1: 'Deducting car loan interest on a new vehicle',
  intro: 'Interest on a loan for a new, US-assembled personal vehicle, with a phase-out twice as steep as the tips rule.',
  resume: `The car loan interest deduction lets you subtract up to ${usd(c.max)} a year of interest paid on a loan used to buy a new passenger vehicle for personal use, for tax years 2025 through 2028 (section 70203 of Public Law 119-21, Schedule 1-A Part IV). The loan must be originated after December 31, 2024 and secured by the vehicle, the vehicle must be new, weigh under 14,000 pounds and have its final assembly in the United States, and its VIN goes on the return. Leases and used cars do not qualify. The deduction falls by $200 for each $1,000 or part of $1,000 of modified AGI above ${usd(c.phaseStart.single)}, or ${usd(c.phaseStart.mfj)} on a joint return, so even ${usd(c.max)} of interest is gone ${usd((c.max / c.per1000) * 1000)} above the threshold. A single buyer with ${usd(104500)} of modified AGI and ${usd(2400)} of interest deducts ${usd(ex.deduction)}. It is available with the standard deduction, but married couples must file jointly.`,
  tool: 'carLoan',
  faqs: [
    { q: 'Does interest on my used car loan qualify for the new deduction?', a: `No. The original use of the vehicle has to start with you, so a used car never qualifies, even if the loan is new. The vehicle must also have its final assembly in the United States, which is printed on the window label at the dealer or can be checked from the plant code in the VIN with the NHTSA decoder. Leases are excluded too.` },
    { q: 'Why does the car loan interest phase-out round up when the tips phase-out rounds down?', a: `Because Schedule 1-A writes it that way. Line 28 tells you to divide the excess modified AGI by $1,000 and raise any fraction to the next whole number, then multiply by $200. One dollar above ${usd(c.phaseStart.single)} already costs ${usd(c.per1000)} of deduction. On the tips and overtime lines the fraction is dropped and each step costs $100.` },
    { q: 'If I refinance my car loan, can I keep deducting the interest?', a: `Generally yes. The IRS says interest on a refinanced qualifying vehicle loan remains eligible, as long as the refinancing is secured by the same vehicle and the original loan met the conditions: originated after 2024, used to buy a new personal-use vehicle assembled in the United States. A cash-out portion used for something else would not be vehicle purchase debt.` },
    { q: 'How much car loan interest can a married couple earning $180,000 deduct?', a: `All of it, up to ${usd(c.max)}. Their modified AGI is below the ${usd(c.phaseStart.mfj)} joint threshold, so with ${usd(3200)} of interest paid in 2026 the deduction is ${usd(exJ.deduction)}. At ${usd(210000)} the same couple would lose ${usd(E.carLoanDeduction(2026, 'mfj', 3200, 210000).reduction)}. They must file jointly and list the VIN.` },
  ],
  body: (h) => `
<h2>Every condition, from the loan to the vehicle</h2>
<ul>
<li>Loan originated after December 31, 2024, used to buy the vehicle and secured by a lien on it.</li>
<li>New vehicle: car, minivan, van, SUV, pickup truck or motorcycle, gross vehicle weight rating under 14,000 pounds.</li>
<li>Final assembly in the United States, shown on the dealer label or by the VIN plant code.</li>
<li>Personal use; interest already deducted on Schedule C, E or F does not count twice (Schedule 1-A line 22, column ii).</li>
<li>VIN reported on the return for each year the deduction is claimed; up to two vehicles fit on the form.</li>
</ul>
<h2>A phase-out that moves fast</h2>
${h.table(['Modified AGI (single)', 'Interest paid', 'Reduction', 'Deduction'], [95000, 100001, 104500, 120000, 140000, 160000].map((m) => { const d = E.carLoanDeduction(2026, 'single', 6000, m); return [usd(m), usd(6000), usd(d.reduction), usd(d.deduction)]; }), 'Schedule 1-A Part IV for 2026, single filer with $6,000 of interest', ['l', 'r', 'r', 'r'])}
<p>Two features make this phase-out harsher than the one for ${h.a('no-tax-on-tips', 'tips')}: each step costs $200 instead of $100, and partial steps count as full ones. A single filer with ${usd(6000)} of interest loses it all ${usd((6000 / c.per1000) * 1000)} above the threshold.</p>
<h2>Business use and mixed use</h2>
<p>A vehicle bought for a business or rented out does not qualify, because the deduction is for personal-use vehicles. A sole proprietor who drives the same car for clients and for the family deducts the business share of the interest on Schedule C and reports it in column ii of Schedule 1-A line 22; only the remaining personal share can be claimed on the new deduction, in column iii.</p>
<h2>What it saves</h2>
<p>As with every deduction, the saving is the deducted interest times your marginal rate. A typical new-car loan of ${usd(40000)} at a rate of 7% generates around ${usd(2700)} of interest in its first year; at 22% that is about ${usd(600)} of federal income tax. The interest itself is on the statement the lender must now send you. Combined effects with the other new deductions are in the ${h.a('schedule-1-a', 'Schedule 1-A calculator')}.</p>
<p>Sources: ${h.src('sch1a')}; ${h.src('wftc')}; ${h.src('fs2503')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['schedule-1-a', 'no-tax-on-tips', 'one-big-beautiful-bill-tax-changes', 'tax-brackets', 'standard-deduction'],
  sources: ['sch1a', 'wftc', 'fs2503', 'law'],
});
