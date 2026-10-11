import { definePage } from '../../lib/page-types';
import { E, P, usd, day } from '../../lib/kit';

const s26 = P.calendar.season2026; const rf = P.calendar.refunds;
const add = (iso: string, d: number) => { const t = new Date(`${iso}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + d); return t.toISOString().slice(0, 10); };
const weeks26 = Array.from({ length: 12 }, (_, i) => add(s26.open, i * 7));
const weeks27 = ['2027-01-25', '2027-02-01', '2027-02-08', '2027-02-15', '2027-03-01', '2027-03-15', '2027-04-05', '2027-04-15'];

export default definePage({
  id: 'tax-refund-calendar',
  group: 'calendar',
  kind: 'tool',
  order: 40,
  slug: 'tax-refund-calendar',
  nav: 'Refund calendar',
  card: 'Expected refund dates week by week for the 2026 season, and a labeled projection for 2027.',
  title: 'Tax Refund Calendar 2026: Deposit Dates by Filing Week',
  description: `Tax refund calendar 2026: e-file accepted ${day(s26.open)}, refund around ${day(E.refundDate(s26.open, true, false, true).date)}; EITC returns by ${day(s26.eitcRefundsBy)}. Every week, plus a 2027 projection.`,
  h1: 'Tax refund calendar, week by week',
  intro: 'For each week of acceptance, the date a refund usually arrives, with and without the earned income credit.',
  resume: `This calendar turns the IRS timing rules into dates. For a return e-filed and accepted in a given week, with direct deposit and no problem, the refund usually arrives about ${rf.efileDays} days later, the delay the IRS gives for most refunds. Returns that claim the earned income credit or the additional child tax credit follow a different column: no refund before mid-February under the PATH Act, and in the 2026 season, the IRS expected most of them in accounts by ${day(s26.eitcRefundsBy)}. The 2026 season opened on ${day(s26.open)}, so a return accepted that week pointed to about ${day(E.refundDate(s26.open, true, false, true).date)} without those credits and to ${day(E.refundDate(s26.open, true, true, true).date)} with them. Paper returns are not in the table: count six weeks or more from the date the IRS receives them. For the 2027 season, which will handle 2026 returns, the IRS has not announced the opening day; the second table projects dates from the same rules and must be read as an estimate.`,
  tool: 'refundDate',
  toolArg: { season: 2027, month: 2, day: 1 },
  faqs: [
    { q: 'If I file the first week of the season, when do I get my refund?', a: `In 2026 the season opened on ${day(s26.open)}. A return accepted that day, e-filed with direct deposit and without the EITC or ACTC, pointed to about ${day(E.refundDate(s26.open, true, false, true).date)}. With either credit, the refund waited for the mid-February release and was expected by ${day(s26.eitcRefundsBy)}. Filing early helps mostly if your return has no credits held by law.` },
    { q: 'Is there an official IRS refund calendar by filing date?', a: `No. The IRS gives rules, not a calendar: most e-filed refunds within ${rf.efileDays} days, paper returns in six weeks or more, and the yearly date for EITC and ACTC refunds. Calendars online, this one included, apply those rules to filing dates. Your own date appears in Where's My Refund once the return is approved.` },
    { q: 'When will 2027 EITC refunds arrive?', a: `The IRS publishes that date during each filing season; for 2026 it was ${day(s26.eitcRefundsBy)}. The PATH Act hold until mid-February will apply again in 2027, so the projection in the table places those refunds in early March, on the same pattern. Treat it as an estimate until the IRS announces the 2027 date.` },
  ],
  body: (h) => `
<h2>2026 season (2025 returns), e-file with direct deposit</h2>
${h.table(['Return accepted', 'Without EITC or ACTC', 'With EITC or ACTC'], weeks26.map((d) => [day(d), day(E.refundDate(d, true, false, true).date), day(E.refundDate(d, true, true, true).date)]), `Season opened ${day(s26.open)}; EITC and ACTC refunds expected by ${day(s26.eitcRefundsBy)} (IRS)`, ['l', 'r', 'r'])}
<h2>2027 season (2026 returns): projection</h2>
${h.table(['Return accepted', 'Without EITC or ACTC', 'With EITC or ACTC'], weeks27.map((d) => [day(d), day(E.refundDate(d, true, false, true).date), day(E.refundDate(d, true, true, true).date)]), 'Projection from the 21-day rule and the mid-February hold; the IRS has not announced the 2027 dates', ['l', 'r', 'r'])}
<p>The dates assume an accepted e-file, direct deposit and no review. They are a typical outcome, not a promise: the IRS says some returns need more time. A return accepted the day the season opens is not processed faster than one accepted a week later if both claim the earned income credit, because both wait for the same release date.</p>
<h2>Reading the calendar for paper returns and checks</h2>
<p>For a paper return, add six weeks or more to the date the IRS receives it, not the date you mailed it, and expect the tracker to show nothing for about four weeks. If you did not give a bank account, the IRS may still mail a check, which adds several days to weeks; under Executive Order 14247 it has been phasing out paper refund checks since ${day(s26.paperChecksPhaseOut)}. The ${h.a('irs-refund-schedule', 'refund schedule calculator')} handles both cases, and the ${h.a('when-will-i-get-my-refund', 'refund timing guide')} explains what each status in the tracker means.</p>
<p>Sources: ${h.src('refunds')}; ${h.src('season2026b')}; ${h.src('season2026')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['irs-refund-schedule', 'when-will-i-get-my-refund', 'tax-refund-calculator', 'earned-income-credit', 'tax-deadline'],
  sources: ['refunds', 'season2026b', 'season2026'],
});
void usd;
