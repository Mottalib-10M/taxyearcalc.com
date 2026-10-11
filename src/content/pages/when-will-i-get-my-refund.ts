import { definePage } from '../../lib/page-types';
import { E, P, Y, usd, day } from '../../lib/kit';

const s26 = P.calendar.season2026; const rf = P.calendar.refunds;
const x = E.refundDate('2026-03-16', true, false, true);

export default definePage({
  id: 'when-will-i-get-my-refund',
  group: 'calendar',
  kind: 'guide',
  order: 30,
  slug: 'when-will-i-get-my-refund',
  nav: 'When will I get my refund',
  card: 'The timeline of a refund, what each tracker status means and the usual causes of delay.',
  title: 'Tax Refund Timing 2026: When Will I Get My Refund?',
  description: `When will I get my tax refund? Most arrive ${rf.efileDays} days after e-file acceptance, paper takes ${rf.paperWeeks} weeks or more, EITC refunds wait for mid-February. 2026 timeline.`,
  h1: 'When will I get my tax refund?',
  intro: 'The path of a refund from the day you file to the day it lands, and what to do when it stalls.',
  resume: `Most taxpayers who e-file and choose direct deposit get their refund within ${rf.efileDays} days of the IRS accepting the return, according to the IRS refunds page; a mailed return takes six weeks or more from the day the IRS receives it. Refunds on returns that claim the earned income credit or the additional child tax credit cannot be released before mid-February, whatever the filing date: in the 2026 season, which opened on ${day(s26.open)}, the IRS expected most of them in bank accounts by ${day(s26.eitcRefundsBy)}. You can follow the refund in the IRS tracker Where's My Refund about ${rf.statusEfileHours} hours after e-filing a current-year return, or ${rf.statusPaperWeeks} weeks after mailing a paper one. The tracker moves through three stages: received, approved, sent. A refund can take longer when the return has an error, needs identity verification, is amended, includes an injured spouse claim or is reduced to pay a past-due debt. The IRS is also phasing out paper checks, so a missing bank account can slow things down.`,
  mini: 'refundDate',
  miniArg: { season: 2027, month: 2, day: 8 },
  faqs: [
    { q: 'Why does Where\'s My Refund still say received after three weeks?', a: `Received means the IRS has the return but has not approved the refund. Past ${rf.efileDays} days for an e-filed return, the IRS may be reviewing an item, checking identity or waiting for a correction. If nothing changes after the normal processing time, the IRS refund hotline and your IRS online account show where the return stands; follow any instruction the tracker gives.` },
    { q: 'What does it mean when my refund was approved but not deposited yet?', a: `Approved means the IRS has processed the return and set a date to send the money. The tracker shows that date. Banks can take a few days to post a direct deposit. If the refund was reduced to pay a debt, the Bureau of the Fiscal Service mails a notice explaining the offset; the IRS itself does not see the details of it.` },
    { q: 'I filed in March. When should my refund arrive?', a: `With e-file and direct deposit, about ${rf.efileDays} days after acceptance: a return accepted on ${day('2026-03-16')} points to around ${day(x.date)}. The February hold for the earned income credit no longer matters by March. A paper return mailed in March should expect six weeks or more after the IRS receives it, plus mailing time if a check is sent.` },
    { q: 'Can the IRS keep part of my refund?', a: `Yes. A refund can be applied to federal taxes you still owe, and the Bureau of the Fiscal Service can reduce it for past-due child support, federal agency debts such as defaulted student loans in some cases, or state income tax debts. You receive a notice explaining the offset. If the IRS corrects your return and raises the refund instead, it also mails a notice.` },
    { q: 'Do I need a bank account to get a federal refund now?', a: `The IRS strongly encourages it. Under Executive Order 14247, the IRS began phasing out paper refund checks on ${day(s26.paperChecksPhaseOut)}, and most taxpayers must now give routing and account numbers for direct deposit. A prepaid debit card or a mobile payment account with routing numbers can often receive the deposit.` },
  ],
  body: (h) => `
<h2>From filing to deposit, in order</h2>
<ol>
<li><strong>Filing and acceptance.</strong> Tax software or a preparer transmits the return; the IRS acknowledges acceptance within a day or two, after basic checks of names and Social Security numbers. A rejected return has not been filed: fix the error and send it again.</li>
<li><strong>Return received.</strong> About ${rf.statusEfileHours} hours after acceptance the tracker shows the return as received. For a paper return, count about ${rf.statusPaperWeeks} weeks before it appears.</li>
<li><strong>Processing.</strong> The IRS matches wages and withholding with the W-2s and 1099s employers and payers sent, checks credits and deductions, and computes the refund. Returns claiming the EITC or ACTC wait here until mid-February.</li>
<li><strong>Refund approved.</strong> The tracker shows the date the money will be sent.</li>
<li><strong>Refund sent.</strong> The Treasury sends the deposit; the bank posts it, usually within a few days. A check, where one is still used, can take several weeks by mail.</li>
</ol>
${h.mini('refundDate', { season: 2026, month: 2, day: 2 })}
<h2>The February hold, explained</h2>
<p>Under the PATH Act, the IRS cannot release any refund on a return that claims the earned income credit or the additional child tax credit before mid-February. The rule gives the IRS time to compare the earnings on the return with the W-2s filed by employers, which is how most refund fraud on these credits used to slip through. The whole refund is held, not only the credit part. For the 2026 season the IRS said most of these refunds would reach bank accounts by ${day(s26.eitcRefundsBy)} for people who chose direct deposit and had no other issue; for the 2027 season it will announce the date during the season. Filing on the first day of the season does not beat the hold, but it does put the return early in line for the release.</p>
<h2>Six reasons a refund is late</h2>
<p><strong>A mistake on the return.</strong> A math error, a missing signature, a wrong bank account number or a Social Security number that does not match the name stops the automatic process; the IRS corrects or writes to you.</p>
<p><strong>Identity verification.</strong> When a return looks unusual, the IRS can ask the taxpayer to confirm identity online or by phone before releasing the refund. The letter explains how; nothing moves until it is answered.</p>
<p><strong>Credits that need review.</strong> Besides the February hold, the IRS describes the additional child tax credit as requiring more time to review, and returns with the earned income credit are frequently checked.</p>
<p><strong>Amended returns.</strong> The IRS must compare the amended return with the original, so it takes much longer than the 21-day rule and has its own tracker line.</p>
<p><strong>Injured spouse claims.</strong> A spouse who asks to protect his or her share of a joint refund from the other spouse's debts has the case handled manually.</p>
<p><strong>Offsets.</strong> The refund may be reduced to pay federal taxes, child support, certain federal debts or state income tax owed; the notice comes from the Bureau of the Fiscal Service.</p>
<h2>What to do when a refund stalls</h2>
<p>Check the tracker no more than once a day, since it updates overnight. If it has been more than ${rf.efileDays} days since an accepted e-file, or more than six weeks since mailing, and the tracker gives no instruction, the IRS refund hotline and your IRS online account can tell you more. A lost or stolen check can be traced once four weeks have passed since the date the IRS issued it. Above all, answer IRS letters quickly: most long delays come from a request for information that sat unanswered.</p>
<h2>Errors you notice after filing</h2>
<p>If you realize after filing that you forgot income or a credit, do not file a second original return: that triggers a duplicate-return review and delays everything. Wait until the first return is processed, then file an amended return on Form 1040-X, electronically with tax software for the current year and the two previous years, according to the IRS. A forgotten W-2 that increases the tax should be corrected quickly to limit interest; a forgotten credit is claimed the same way, and the amended return then has its own processing time.</p>
<h2>Estimating the amount</h2>
<p>The size of the refund is a separate question from its timing. The ${h.a('tax-refund-calculator', 'refund estimator')} works it out from wages, withholding, children and the new deductions for ${h.a('no-tax-on-tips', 'tips')} and ${h.a('no-tax-on-overtime', 'overtime')}, which many workers will see as a larger refund since employers did not change withholding for them. The ${h.a('tax-refund-calendar', 'refund calendar')} lists expected dates week by week, and the ${h.a('irs-refund-schedule', 'refund schedule calculator')} gives a date for any filing day. The 2026 return itself is due ${day(Y(2026).deadlines.filing)}.</p>
<p>Sources: ${h.src('refunds')}; ${h.src('season2026b')}; ${h.src('season2026')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['irs-refund-schedule', 'tax-refund-calendar', 'tax-refund-calculator', 'earned-income-credit', 'child-tax-credit'],
  sources: ['refunds', 'season2026b', 'season2026'],
});
void usd;
