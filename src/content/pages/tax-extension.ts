import { definePage } from '../../lib/page-types';
import { E, Y, S, P, usd, day } from '../../lib/kit';

const y5 = Y(2025); const y6 = Y(2026);
const late = E.latePenalties(2025, 5000, 0, 6);
const noExt = E.latePenalties(2025, 5000, 6, 6);
const intr = E.underpaymentInterest(5000, 183, P.interest.underpayment['2026'][2]);

export default definePage({
  id: 'tax-extension',
  group: 'calendar',
  kind: 'tool',
  order: 60,
  slug: 'tax-extension',
  nav: 'Tax extension',
  card: 'October 15, 2026 for extended 2025 returns, and what an extension does not cover.',
  title: `Tax Extension Deadline 2026: File by ${day(y5.deadlines.extension)}`,
  description: `Tax extension deadline: extended 2025 returns are due ${day(y5.deadlines.extension)}; for 2026 returns, Form 4868 moves filing to ${day(y6.deadlines.extension)}. Payment is never delayed.`,
  h1: 'Tax extensions: October 15 and what it does not move',
  intro: 'The automatic six-month extension gives more time to file, never more time to pay.',
  resume: `If you requested an extension for your 2025 return, it is due ${day(y5.deadlines.extension)}: the automatic six-month extension moves the filing deadline from ${day(y5.deadlines.filing)} to that date, according to the IRS. For the 2026 return, the same request made by ${day(y6.deadlines.filing)} pushes filing to ${day(y6.deadlines.extension)}. There are three ways to get it: pay part or all of the tax online and check the box saying the payment is for an extension, request it through IRS Free File (no income limit for extensions), or file Form 4868 by mail or electronically. The extension covers the return only. Tax not paid by April accrues interest and a failure-to-pay penalty of ${S.penalties.ftpPerMonth}% a month, but you avoid the much larger failure-to-file penalty of ${S.penalties.ftfPerMonth}% a month. Someone who owed ${usd(5000)} on the 2025 return, filed by ${day(y5.deadlines.extension)} under extension and pays six months late owes about ${usd(late.ftp)} of penalty plus ${usd(intr)} of interest; without an extension, the penalties alone would reach ${usd(noExt.total)}. US citizens living abroad get an automatic two-month extension.`,
  tool: 'latePenalty',
  toolArg: { months: 6, filedOnTime: 1 },
  faqs: [
    { q: 'Is October 15, 2026 the last day to file a 2025 return on extension?', a: `Yes, for taxpayers who requested the automatic extension by ${day(y5.deadlines.filing)}. A return filed after ${day(y5.deadlines.extension)} is late, and if tax is owed the failure-to-file penalty applies from the original April date, ${S.penalties.ftfPerMonth}% a month up to ${S.penalties.ftfMax}%. People in a federally declared disaster area may have a later date set by the IRS.` },
    { q: 'Do I have to pay my taxes when I file for an extension?', a: `You should pay what you expect to owe by the April deadline, because the extension does not delay payment. Form 4868 asks for an estimate of your total tax and what you already paid. Tax paid after April accrues interest and a ${S.penalties.ftpPerMonth}% monthly failure-to-pay penalty until it is paid, even if the return is filed on time under the extension.` },
    { q: 'How do I get a tax extension without filing Form 4868?', a: `Pay all or part of your estimated tax electronically, through IRS Direct Pay, your IRS online account or a card payment, and indicate that the payment is for an extension. The IRS then treats the extension as requested and gives a confirmation number; no separate form is needed. Free File offers an electronic Form 4868 at any income.` },
  ],
  body: (h) => `
<h2>Extension dates for both returns</h2>
${h.table(['Return', 'Normal due date', 'Extension request by', 'Extended due date'], [
  ['Tax year 2025', day(y5.deadlines.filing), day(y5.deadlines.filing), day(y5.deadlines.extension)],
  ['Tax year 2026', day(y6.deadlines.filing), day(y6.deadlines.filing), day(y6.deadlines.extension)],
], 'IRS: Get an extension to file your tax return', ['l', 'r', 'r', 'r'])}
<h2>What an extension changes, and what it does not</h2>
<p>It moves the date your return is due, so no failure-to-file penalty applies if you file by the extended date. It does not move the payment date, so interest at the quarterly rate, ${P.interest.underpayment['2026'][3]}% a year in the last quarter of 2026, and the ${S.penalties.ftpPerMonth}% monthly failure-to-pay penalty run on any balance from April. It does not extend the deadline for 2026 IRA contributions, which closes on ${day(y6.deadlines.filing)} regardless; SEP and solo 401(k) employer contributions, by contrast, can generally wait until the extended due date. It does not delay a refund claim, but nothing is refunded before the return is filed.</p>
<h2>When an extension is worth it</h2>
<p>Waiting for a corrected Form 1099 or a Schedule K-1 from a partnership, sorting out records after a move or an illness, or making sure a new deduction is claimed correctly are all good reasons. The ${h.a('schedule-1-a', 'Schedule 1-A')} deductions for tips and overtime, for instance, rely on records that some employers did not provide separately for 2025. If you owe, pay your best estimate in April and file once the numbers are right. The ${h.a('tax-deadline', 'deadline page')} lists the other dates of the year, and the ${h.a('irs-interest-rates', 'interest rate page')} computes interest on a balance.</p>
<h2>After October 15</h2>
<p>A return still not filed after the extended date is late from the original April due date: the failure-to-file penalty is computed from April, not from October, and the minimum penalty for a return more than 60 days late applies. If you cannot finish by then, file with the information you have and amend later; a return filed on time and corrected afterwards costs far less than a late one.</p>
<h2>Abroad and in disaster areas</h2>
<p>US citizens and resident aliens living outside the United States on the regular due date get an automatic two-month extension, to mid-June, and can request more time with Form 4868. Taxpayers in areas covered by an IRS disaster declaration often receive later deadlines for both filing and payment, announced area by area.</p>
<p>Sources: ${h.src('extension')}; ${h.src('whenfile')}; ${h.src('ftp')}; ${h.src('interest')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-deadline', 'irs-interest-rates', 'estimated-tax-payments', 'prior-year-tax-brackets', 'tax-refund-calculator'],
  sources: ['extension', 'whenfile', 'ftp', 'interest'],
});
