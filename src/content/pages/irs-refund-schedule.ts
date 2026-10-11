import { definePage } from '../../lib/page-types';
import { E, P, usd, day } from '../../lib/kit';

const s26 = P.calendar.season2026; const rf = P.calendar.refunds;
const a = E.refundDate('2026-02-09', true, false, true);
const b = E.refundDate('2026-02-02', true, true, true);
const c = E.refundDate('2026-03-02', false, false, true);

export default definePage({
  id: 'irs-refund-schedule',
  group: 'calendar',
  kind: 'tool',
  order: 20,
  slug: 'irs-refund-schedule',
  nav: 'IRS refund schedule',
  card: 'The date your refund should arrive, from the day the IRS accepts your return.',
  title: 'IRS Refund Schedule 2026: Your Refund Date by Filing Day',
  description: `IRS refund schedule 2026: about ${rf.efileDays} days after e-file acceptance, ${rf.paperWeeks} weeks or more on paper, EITC and ACTC refunds by ${day(s26.eitcRefundsBy)}. Get your own refund date.`,
  h1: 'IRS refund schedule: when your refund should arrive',
  intro: 'Enter the day the IRS accepted your return and how you filed; the calculator applies the IRS timing rules.',
  resume: `The IRS issues most refunds within ${rf.efileDays} days of accepting an electronically filed return, and in six weeks or more for a mailed return counted from the day it is received, according to its refund page. Two rules move that date. First, returns claiming the earned income credit or the additional child tax credit cannot be refunded before mid-February under the PATH Act; in the 2026 season, which opened on ${day(s26.open)}, the IRS expected most of those refunds in bank accounts by ${day(s26.eitcRefundsBy)} for people who chose direct deposit and had no other issue. Second, a paper check takes longer to arrive, and the IRS has been phasing paper refund checks out since ${day(s26.paperChecksPhaseOut)} under Executive Order 14247. An e-filed return accepted on ${day('2026-02-09')} with direct deposit points to about ${day(a.date)}; an EITC return accepted on ${day('2026-02-02')}, to ${day(b.date)}; a paper return mailed on ${day('2026-03-02')}, to ${day(c.date)} or later. For the 2027 season, dates are projections until the IRS announces its opening day in January.`,
  tool: 'refundDate',
  faqs: [
    { q: 'How long after my return is accepted will I get my refund?', a: `For an e-filed return with direct deposit, the IRS says most refunds come within ${rf.efileDays} days of acceptance. Acceptance usually comes within a day or two of filing and is confirmed by your software. A paper return takes six weeks or more from the date the IRS receives it, and a paper check adds mailing time on top.` },
    { q: 'Why does the IRS hold refunds with the earned income credit until February?', a: `The PATH Act forbids refunding a return that claims the earned income credit or the additional child tax credit before mid-February, to give the IRS time to match wages reported by employers and stop fraud. The hold covers the entire refund, not only the credit. In 2026 the IRS expected most of those refunds by ${day(s26.eitcRefundsBy)}.` },
    { q: 'What dates will the IRS use for refunds in the 2027 filing season?', a: `The IRS has not announced them yet; it usually sets the opening day of the season in early January. The ${rf.efileDays}-day rule and the February hold for EITC and ACTC returns apply every year, so the calculator projects 2027 dates from them and labels them as projections. The exact EITC date for 2027 will be published by the IRS during the season.` },
  ],
  body: (h) => `
<h2>The rules the calculator applies</h2>
${h.table(['Situation', 'Expected refund', 'Source'], [
  ['E-file, direct deposit, no credits held', `about ${rf.efileDays} days after acceptance`, 'IRS refunds page'],
  ['Mailed return', `${rf.paperWeeks} weeks or more after the IRS receives it`, 'IRS refunds page'],
  ['Return with EITC or ACTC', `no refund before mid-February; ${day(s26.eitcRefundsBy)} expected in 2026`, 'IR-2026 filing season release'],
  ['Paper check instead of direct deposit', 'extra mailing time; checks being phased out', 'Executive Order 14247'],
], 'IRS timing rules for refunds', ['l', 'l', 'l'])}
<h2>When the status appears in the IRS tracker</h2>
<p>Where's My Refund shows a status about ${rf.statusEfileHours} hours after an e-filed current-year return, ${rf.statusPriorYearDays} days after an e-filed prior-year return and ${rf.statusPaperWeeks} weeks after a paper return. It moves through three stages: return received, refund approved, refund sent. For returns with the EITC or ACTC, the tracker shows a projected deposit date once the February hold lifts. The tracker needs your Social Security number or ITIN, filing status and the exact refund amount in whole dollars.</p>
<h2>Amended returns and prior years</h2>
<p>An amended return on Form 1040-X follows a slower track: the IRS lists it among the causes of delay because it must compare and review both returns, and amended returns have their own status line and their own phone number. A late return for an earlier year, filed electronically, shows its status after about ${rf.statusPriorYearDays} days. Neither is covered by the 21-day rule of current-year e-filed returns.</p>
<h2>Why a refund takes longer</h2>
<p>A math error, a missing signature, a mismatch with W-2 or 1099 data, an identity check, an amended return or an injured spouse claim can each add weeks. Part or all of a refund can also be used to pay a past-due federal or state debt, child support or earlier taxes; the Bureau of the Fiscal Service mails a notice when that happens. The ${h.a('when-will-i-get-my-refund', 'refund timing guide')} explains each delay and the ${h.a('tax-refund-calendar', 'refund calendar')} lists dates week by week. To estimate the amount itself, use the ${h.a('tax-refund-calculator', 'refund estimator')}.</p>
<p>Sources: ${h.src('refunds')}; ${h.src('season2026b')}; ${h.src('season2026')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['when-will-i-get-my-refund', 'tax-refund-calendar', 'tax-refund-calculator', 'earned-income-credit', 'tax-deadline'],
  sources: ['refunds', 'season2026b', 'season2026'],
});
void usd;
