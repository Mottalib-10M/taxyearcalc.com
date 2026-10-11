import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const h6 = Y(2026).hsa; const h5 = Y(2025).hsa;
const fam55 = E.hsaLimit(true, 57, 12).limit;

export default definePage({
  id: 'hsa-contribution-limit',
  group: 'accounts',
  kind: 'tool',
  order: 40,
  slug: 'hsa-contribution-limit',
  nav: 'HSA limit',
  card: 'The 2026 HSA limits for self-only and family coverage, the catch-up at 55 and new eligible plans.',
  title: `HSA Contribution Limit 2026: ${usd(h6.self)} Self, ${usd(h6.family)} Family`,
  description: `HSA contribution limit 2026: ${usd(h6.self)} for self-only coverage, ${usd(h6.family)} for family, ${usd(h6.catchUp55)} more at 55, and bronze plans now HSA-eligible. See what you can add.`,
  h1: 'HSA contribution limits for 2026',
  intro: 'How much can go into a health savings account for 2026, and the changes that let more people open one.',
  resume: `For 2026 the health savings account limit is ${usd(h6.self)} with self-only coverage and ${usd(h6.family)} with family coverage under a high-deductible health plan, up from ${usd(h5.self)} and ${usd(h5.family)} in 2025, according to Rev. Proc. 2025-19. Account holders aged 55 or older can add ${usd(h6.catchUp55)}, so a 57-year-old with family coverage can contribute ${usd(fam55)}. The limit includes employer contributions, including those made through a cafeteria plan. To qualify for 2026, a plan must have a deductible of at least ${usd(h6.hdhpMinDeductible.self)} self-only or ${usd(h6.hdhpMinDeductible.family)} family and out-of-pocket costs capped at ${usd(h6.hdhpMaxOop.self)} or ${usd(h6.hdhpMaxOop.family)}. Public Law 119-21 widened eligibility from January 1, 2026: bronze and catastrophic plans count as HSA-compatible, enrollees in certain direct primary care arrangements may contribute, and telehealth before the deductible no longer disqualifies. Contributions for 2026 can be made until ${day(Y(2026).deadlines.filing)} and are deductible even without itemizing.`,
  tool: 'hsa',
  faqs: [
    { q: 'Are bronze plans HSA-eligible in 2026?', a: `Yes. Starting January 1, 2026, bronze and catastrophic health plans are treated as HSA-compatible, whether bought through an exchange or not, under the HSA changes of Public Law 119-21 described by the IRS. People who could not contribute before because their bronze plan did not meet the strict high-deductible definition can now open an HSA and contribute up to ${usd(h6.self)} or ${usd(h6.family)}.` },
    { q: 'Do employer HSA contributions count toward the 2026 limit?', a: `Yes. Everything that goes into your HSA for the year, from you, your employer or anyone else, counts toward the ${usd(h6.self)} or ${usd(h6.family)} limit, plus the ${usd(h6.catchUp55)} catch-up. If your employer puts in ${usd(1000)} for self-only coverage, you can add ${usd(h6.self - 1000)}. Employer money and payroll deductions through a cafeteria plan are not taxed as wages.` },
    { q: 'Can both spouses make the HSA catch-up contribution?', a: `Yes, but each in his or her own HSA. The ${usd(h6.catchUp55)} catch-up belongs to an account holder aged 55 or older; a couple with family coverage where both are 55 or older can put the ${usd(h6.family)} family limit in one or split it, and each spouse can add ${usd(h6.catchUp55)} to an HSA in his or her own name.` },
  ],
  body: (h) => `
<h2>The 2026 and 2025 figures</h2>
${h.table(['Item', '2025', '2026'], [
  ['Contribution limit, self-only', usd(h5.self), usd(h6.self)],
  ['Contribution limit, family', usd(h5.family), usd(h6.family)],
  ['Catch-up at 55 or older', usd(h6.catchUp55), usd(h6.catchUp55)],
  ['Minimum deductible, self-only / family', 'not shown', `${usd(h6.hdhpMinDeductible.self)} / ${usd(h6.hdhpMinDeductible.family)}`],
  ['Maximum out-of-pocket, self-only / family', 'not shown', `${usd(h6.hdhpMaxOop.self)} / ${usd(h6.hdhpMaxOop.family)}`],
], 'Rev. Proc. 2024-25 (2025) and Rev. Proc. 2025-19 (2026)', ['l', 'r', 'r'])}
<h2>Partial years and Medicare</h2>
<p>The limit is prorated by the months in which you are eligible on the first day of the month: six months of self-only coverage allow ${usd(E.hsaLimit(false, 40, 6).limit)}. The last-month rule lets someone eligible on December 1 contribute the full year's amount, provided he stays eligible through the following year; otherwise the extra becomes taxable with a penalty. Enrolling in Medicare ends eligibility from the first month of coverage, which matters for people who start Social Security at 65 and receive Medicare Part A automatically.</p>
<h2>A triple tax advantage</h2>
<p>Contributions lower AGI (or are excluded from wages when made through payroll, which also avoids FICA), growth is untaxed, and withdrawals for qualified medical expenses are tax-free. That makes the HSA the only account where money can go in and come out without income tax. Unlike a ${h.a('fsa-limit', 'health FSA')}, the balance never expires and follows you when you change jobs. From 2026 HSA money can also pay periodic fees of a direct primary care arrangement.</p>
<h2>Excess contributions and withdrawals</h2>
<p>Contributing more than the limit triggers a 6% excise tax each year the excess stays in the account, unless you withdraw it with its earnings before the return due date. Withdrawals for anything other than qualified medical expenses are taxable and, before 65, carry an additional 20% tax; from 65 they are simply taxable, like a traditional IRA. Keep receipts: the IRS can ask you to show that a tax-free withdrawal paid a medical expense, even years later.</p>
<h2>Comparing with other accounts</h2>
<p>An HSA comes on top of the ${h.a('401k-contribution-limit', '401(k)')} and ${h.a('ira-contribution-limit', 'IRA')} limits. Because the deduction lowers AGI, it helps with income-based limits such as the ${h.a('roth-ira-income-limit', 'Roth IRA range')}.</p>
<p>Sources: ${h.src('rp2519')}; ${h.src('rp2425')}; HSA changes for 2026: ${h.src('wftc', 'IRS Working Families Tax Cuts summary')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['fsa-limit', '401k-contribution-limit', 'ira-contribution-limit', 'roth-ira-income-limit', 'tax-refund-calculator'],
  sources: ['rp2519', 'rp2425', 'wftc', 'rp2532'],
});
