import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const y6 = Y(2026);
const br = y6.brackets.mfs as Array<[number | null, number]>;
const sep = (a: number) => E.incomeTax(2026, 'mfs', Math.max(0, a - y6.standard.mfs)).tax;
const jnt = (a: number, b: number) => E.incomeTax(2026, 'mfj', Math.max(0, a + b - y6.standard.mfj)).tax;

export default definePage({
  id: 'married-filing-separately-brackets',
  group: 'rates',
  kind: 'tool',
  order: 60,
  slug: 'married-filing-separately-brackets',
  nav: 'Brackets: married separately',
  card: 'The 2026 separate-return brackets and the deductions and credits a separate return gives up.',
  title: 'Married Filing Separately 2026: Brackets and What You Lose',
  description: `Married filing separately in 2026: brackets like single until 35% stops at ${usd(br[5][0] as number)}, half the SALT cap, no tips, overtime or senior deduction. See the cost.`,
  h1: 'Married filing separately in 2026',
  intro: 'The brackets look like the single ones, but a separate return closes several doors that a joint return keeps open.',
  resume: `A married person filing a separate return in 2026 uses brackets that match the single schedule up to the 35% rate, 10% to ${usd(br[0][0] as number)}, 12% to ${usd(br[1][0] as number)}, 22% to ${usd(br[2][0] as number)}, 24% to ${usd(br[3][0] as number)}, 32% to ${usd(br[4][0] as number)}, then 35% only up to ${usd(br[5][0] as number)}, half the joint threshold, and 37% above (Rev. Proc. 2025-32). The standard deduction is ${usd(y6.standard.mfs)}, but it drops to zero if the other spouse itemizes. The bigger cost lies elsewhere: a separate return cannot claim any of the four Schedule 1-A deductions (tips, overtime, car loan interest, seniors), gets half the SALT cap, ${usd(y6.salt.cap / 2)}, loses the student loan interest deduction and, with narrow exceptions for separated spouses, the earned income credit, and faces a Roth IRA range of ${usd(y6.retirement.rothPhase.mfs[0])} to ${usd(y6.retirement.rothPhase.mfs[1])} when the spouses lived together. In return each spouse is liable only for his or her own return, and medical expenses face a floor measured on one income instead of two.`,
  tool: 'brackets',
  toolArg: { year: 2026, status: 'mfs', income: 80000 },
  faqs: [
    { q: 'Can I claim no tax on tips if I file married filing separately?', a: `No. Schedule 1-A requires married taxpayers to file jointly for the tips, overtime and senior deductions, and the car loan interest deduction is allowed only to you or to you and your spouse on a joint return. A server who switches from a joint to a separate return loses up to ${usd(y6.tips.max)} of deduction on top of any change in rates.` },
    { q: 'When does married filing separately actually lower the tax?', a: `Rarely, but it happens when one spouse has large medical bills: the 7.5% of AGI floor is computed on one income instead of two. It is also used to keep liability separate, for example when one spouse has unpaid tax debts or doubts about the other's return. In most other cases the joint return costs less, often by thousands of dollars.` },
    { q: 'How much tax do two spouses earning $70,000 each pay filing separately?', a: `${usd(sep(70000))} each, ${usd(2 * sep(70000))} together, against ${usd(jnt(70000, 70000))} on a joint return in 2026 with the standard deduction: the same amount, because the brackets match until the 35% rate. The difference appears through credits and deductions that a separate return loses, not through the brackets.` },
  ],
  body: (h) => `
<h2>What a separate return gives up in 2026</h2>
${h.table(['Item', 'Joint return', 'Separate return'], [
  [h.a('schedule-1-a', 'Tips, overtime, car loan, senior deductions'), 'allowed', 'not allowed'],
  [h.a('salt-deduction', 'SALT cap'), usd(y6.salt.cap), usd(y6.salt.cap / 2)],
  ['Standard deduction', usd(y6.standard.mfj), `${usd(y6.standard.mfs)}, or $0 if the spouse itemizes`],
  [h.a('student-loan-interest-deduction', 'Student loan interest'), `up to ${usd(y6.studentLoan.max)}`, 'not allowed'],
  [h.a('earned-income-credit', 'Earned income credit'), 'allowed', 'only for spouses who meet the separated-spouse rules'],
  [h.a('roth-ira-income-limit', 'Roth IRA income range'), `${usd(y6.retirement.rothPhase.mfj[0])} to ${usd(y6.retirement.rothPhase.mfj[1])}`, `${usd(y6.retirement.rothPhase.mfs[0])} to ${usd(y6.retirement.rothPhase.mfs[1])}`],
  ['35% bracket ends at', usd(y6.brackets.mfj[5][0] as number), usd(br[5][0] as number)],
  ['Dependent care assistance exclusion', usd(y6.fsa.dependentCare), usd(y6.fsa.dependentCareMfs)],
], '2026 figures from Rev. Proc. 2025-32, Notice 2025-67, Schedule 1-A and Public Law 119-21', ['l', 'r', 'r'])}
<h2>Brackets: identical to single until the top</h2>
<p>Up to ${usd(br[4][0] as number)} of taxable income the separate schedule copies the single one, so two spouses with equal incomes pay the same bracket tax separately or jointly. The 35% band is where they diverge: it stops at ${usd(br[5][0] as number)}, exactly half of the joint ${usd(y6.brackets.mfj[5][0] as number)}, far below the single ${usd(y6.brackets.single[5][0] as number)}. Every other difference comes from the rules in the table.</p>
<h2>Deciding with numbers</h2>
<p>The only reliable way to choose is to compute both: one joint return, and two separate returns that split income, deductions and credits as the law requires. Run the calculator once with the joint status and the couple's total income, then once per spouse with the separate status, and add the two separate results. Credits and the deductions in the table come on top of what the brackets show.</p>
<h2>Medical bills: the one common case</h2>
<p>The medical expense deduction counts only costs above 7.5% of AGI. A spouse with ${usd(50000)} of income and ${usd(20000)} of uninsured medical bills clears that floor by ${usd(20000 - 50000 * 0.075)} on a separate return; on a joint return with ${usd(150000)} of combined income the floor is ${usd(150000 * 0.075)}. Whether that beats the losses in the table needs both returns computed side by side.</p>
<h2>Living apart and community property</h2>
<p>A spouse who lived apart from the other for the last six months of the year and kept up a home for a child can often file as ${h.a('head-of-household-brackets', 'head of household')} instead, with better brackets and the earned income credit. In community property states (such as California and Texas), each spouse filing separately generally reports half of the community income, which can make separate returns more complex without saving tax.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('sch1a')}; ${h.src('n2567')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['married-filing-jointly-brackets', 'single-tax-brackets', 'schedule-1-a', 'salt-deduction', 'itemized-vs-standard-deduction'],
  sources: ['rp2532', 'sch1a', 'n2567', 'law'],
});
