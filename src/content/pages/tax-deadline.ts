import { definePage } from '../../lib/page-types';
import { E, Y, S, P, usd, day } from '../../lib/kit';

const y5 = Y(2025); const y6 = Y(2026);
const pen = E.latePenalties(2026, 3000, 3, 3);
const ext = E.latePenalties(2025, 3000, 0, 6);

export default definePage({
  id: 'tax-deadline',
  group: 'calendar',
  kind: 'tool',
  order: 50,
  slug: 'tax-deadline',
  nav: 'Tax deadlines',
  card: 'Every federal deadline from now to April 2027, and what missing one costs.',
  title: `Tax Deadline 2026 and 2027: ${day(y6.deadlines.filing)} and Others`,
  description: `Tax deadline: 2025 returns on extension are due ${day(y5.deadlines.extension)}, 2026 returns ${day(y6.deadlines.filing)}, the last 2026 estimated payment ${day(y6.estimated[3])}. Late costs.`,
  h1: 'Federal tax deadlines for 2026 and 2027',
  intro: 'The dates that matter between now and the April 2027 filing deadline, and the penalties behind them.',
  resume: `The federal return for tax year 2025 was due ${day(y5.deadlines.filing)}; taxpayers who requested the automatic extension have until ${day(y5.deadlines.extension)} to file it, though any tax due should have been paid in April. The return for tax year 2026 is due ${day(y6.deadlines.filing)}, which is also the last day to request an extension to ${day(y6.deadlines.extension)}, to pay the 2026 balance and to make 2026 contributions to an IRA or HSA. Estimated tax for 2026 is paid in four installments, on ${day(y6.estimated[0])}, ${day(y6.estimated[1])}, ${day(y6.estimated[2])} and ${day(y6.estimated[3])}, according to the 2026 Form 1040-ES. Missing the filing deadline without an extension costs ${S.penalties.ftfPerMonth}% of the unpaid tax for each month or part of a month, up to ${S.penalties.ftfMax}%; paying late costs ${S.penalties.ftpPerMonth}% a month, also capped at ${S.penalties.ftpMax}%, plus interest compounded daily. Someone who owes ${usd(3000)} and files and pays three months late would face about ${usd(pen.total)} of penalties before interest. If no tax is owed, a late return brings no failure-to-file penalty, since it is computed on unpaid tax.`,
  tool: 'latePenalty',
  toolArg: { months: 3, filedOnTime: 0 },
  faqs: [
    { q: 'What happens if I miss the tax deadline but I am owed a refund?', a: `There is no failure-to-file penalty when no tax is owed, because the penalty is a percentage of unpaid tax. You still need to file to get the refund, and the sooner you file, the sooner it is paid; a refund is never sent without a return. A late return that owes tax, on the other hand, adds ${S.penalties.ftfPerMonth}% a month.` },
    { q: 'Is the April 15, 2027 deadline moved if it falls on a weekend?', a: `When the 15th falls on a Saturday, Sunday or legal holiday, the IRS moves the due date to the next business day, as its when-to-file page states. ${day(y6.deadlines.filing)} is a weekday, so it stands. Residents of areas hit by a declared disaster often receive later dates, announced on the IRS disaster relief page.` },
    { q: 'What is the minimum penalty for filing more than 60 days late?', a: `For returns due in 2027, if the return is more than 60 days late, the failure-to-file penalty is at least the smaller of ${usd(y6.ftfMinimum)} or 100% of the tax owed, under Rev. Proc. 2025-32 section 4.52. For returns due in 2026 the figure was ${usd(y5.ftfMinimum)}. Someone owing ${usd(300)} would pay ${usd(300)}, not more.` },
  ],
  body: (h) => `
<h2>The calendar from October 2026 to October 2027</h2>
${h.table(['Date', 'What is due'], [
  [day(y5.deadlines.extension), '2025 returns filed under an automatic extension (Form 4868)'],
  [day(y6.estimated[3]), 'Fourth 2026 estimated payment (skip it if you file and pay by ' + day(y6.estimatedSkipQ4IfFiledBy) + ')'],
  ['Late January 2027', 'IRS starts accepting 2026 returns (date announced in January)'],
  [day(y6.deadlines.filing), '2026 return and payment; extension request; 2026 IRA and HSA contributions; first 2027 estimated payment'],
  [day(y6.deadlines.extension), '2026 returns filed under an extension'],
], 'Form 1040-ES (2026) and IRS when-to-file page', ['l', 'l'])}
<h2>How the penalties add up</h2>
<p>The two penalties run side by side. For each month or part of a month the return is late, ${S.penalties.ftfPerMonth}% of the unpaid tax, reduced by the ${S.penalties.ftpPerMonth}% failure-to-pay penalty of the same month, so ${S.penalties.ftfPerMonth - S.penalties.ftpPerMonth}% plus ${S.penalties.ftpPerMonth}%. After five months the failure-to-file part reaches its ${S.penalties.ftfMax}% ceiling; the failure-to-pay part keeps running until it too reaches ${S.penalties.ftpMax}%. Interest is charged on the tax and on the penalties at the quarterly underpayment rate, ${P.interest.underpayment['2026'][3]}% for the last quarter of 2026. With an approved payment plan after an on-time return, the failure-to-pay rate drops to ${S.penalties.ftpPlan}% a month.</p>
<p>Filing on time but paying later costs far less: someone who owed ${usd(3000)} on the 2025 return, filed by the deadline or under extension and paid six months late, faces about ${usd(ext.ftp)} of failure-to-pay penalty plus interest. That is why the IRS insists on filing on time even when you cannot pay.</p>
<h2>Extensions and estimated payments</h2>
<p>An ${h.a('tax-extension', 'extension')} gives six more months to file, not to pay. Estimated payments are due from people whose withholding will not cover their tax, typically the self-employed, landlords and investors; the ${h.a('estimated-tax-payments', 'estimated tax calculator')} shows the safe harbors. The ${h.a('irs-interest-rates', 'interest rate page')} explains how interest accrues on any unpaid balance.</p>
<p>Sources: ${h.src('whenfile')}; ${h.src('es2026')}; ${h.src('ftf')}; ${h.src('ftp')}; ${h.src('rp2532')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-extension', 'estimated-tax-payments', 'irs-interest-rates', 'tax-refund-calculator', 'prior-year-tax-brackets'],
  sources: ['whenfile', 'es2026', 'ftf', 'ftp', 'rp2532'],
});
