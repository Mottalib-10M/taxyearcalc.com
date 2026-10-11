import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const y6 = Y(2026);
const br = y6.brackets.hoh as Array<[number | null, number]>;
const hoh = (g: number) => E.incomeTax(2026, 'hoh', Math.max(0, g - y6.standard.hoh)).tax;
const sgl = (g: number) => E.incomeTax(2026, 'single', Math.max(0, g - y6.standard.single)).tax;

export default definePage({
  id: 'head-of-household-brackets',
  group: 'rates',
  kind: 'tool',
  order: 50,
  slug: 'head-of-household-brackets',
  nav: 'Brackets: head of household',
  card: 'The 2026 head of household brackets, who qualifies and how much it saves over single.',
  title: 'Tax Brackets 2026 Head of Household: Rates and Who Qualifies',
  description: `Tax brackets 2026 head of household: 10% to ${usd(br[0][0] as number)}, 12% to ${usd(br[1][0] as number)}, 22% to ${usd(br[2][0] as number)}, with a ${usd(y6.standard.hoh)} standard deduction. Compare it with single status.`,
  h1: 'Head of household tax brackets for 2026',
  intro: 'A status for unmarried people who keep up a home for a child or relative, with wider low brackets than single.',
  resume: `Head of household is the filing status of an unmarried taxpayer who pays more than half the cost of keeping up a home where a qualifying person, usually a child, lived for more than half the year. In 2026 it taxes 10% of taxable income up to ${usd(br[0][0] as number)}, 12% up to ${usd(br[1][0] as number)}, 22% up to ${usd(br[2][0] as number)}, 24% up to ${usd(br[3][0] as number)}, 32% up to ${usd(br[4][0] as number)}, 35% up to ${usd(br[5][0] as number)} and 37% above (Rev. Proc. 2025-32), and the standard deduction is ${usd(y6.standard.hoh)} against ${usd(y6.standard.single)} for a single filer. The gain is concentrated at low and middle incomes, where the wider 10% and 12% bands and the larger deduction apply: a parent earning ${usd(55000)} owes ${usd(hoh(55000))} as head of household instead of ${usd(sgl(55000))} as single, ${usd(sgl(55000) - hoh(55000))} less, before the child tax credit. Above ${usd(br[2][0] as number)} of taxable income the thresholds join the single ones. Heads of household use the single thresholds for the tips, overtime and senior deductions.`,
  tool: 'brackets',
  toolArg: { year: 2026, status: 'hoh', income: 55000 },
  faqs: [
    { q: 'Who qualifies as head of household on a 2026 return?', a: `You must be unmarried or considered unmarried on December 31 (a married person living apart from the spouse for the last six months of the year can be), pay more than half the cost of keeping up your home, and have a qualifying person living with you more than half the year, usually a child. A dependent parent counts even if the parent lives in a separate home you pay for.` },
    { q: 'How much does head of household save compared with single in 2026?', a: `It depends on income. At ${usd(40000)} the saving is ${usd(sgl(40000) - hoh(40000))}, at ${usd(55000)} it is ${usd(sgl(55000) - hoh(55000))} and at ${usd(90000)} ${usd(sgl(90000) - hoh(90000))}, from the larger standard deduction and the wider low brackets. The child tax credit and the earned income credit are the same under both statuses for a given child.` },
    { q: 'Can divorced parents both claim head of household for the same child?', a: `No. The status belongs to the parent with whom the child lived for more than half the year, the custodial parent, even if the other parent claims the child tax credit through a signed release on Form 8332. With two children living mainly in different homes, each parent can qualify through a different child.` },
  ],
  body: (h) => `
<h2>Head of household against single, income by income</h2>
${h.table(['Income', 'Single', 'Head of household', 'Saving'], [25000, 40000, 55000, 70000, 90000, 130000, 250000].map((g) => [usd(g), usd(sgl(g)), usd(hoh(g)), usd(sgl(g) - hoh(g))]), 'Federal income tax for 2026 with the standard deduction, before credits', ['l', 'r', 'r', 'r'])}
<p>The saving levels off once income passes the 22% bracket: from ${usd(br[2][0] as number)} of taxable income upward, the head of household thresholds are within a few dollars of the single ones (${usd(br[3][0] as number)} against ${usd(y6.brackets.single[3][0] as number)} for the end of the 24% band), and only the ${usd(y6.standard.hoh - y6.standard.single)} of extra standard deduction remains.</p>
<h2>The cost of keeping up a home</h2>
<p>The IRS counts rent or mortgage interest, property taxes, home insurance, repairs, utilities and food eaten in the home. Clothing, education, medical care, vacations and transportation do not count. Public assistance received for the household counts as paid by someone else. Keeping receipts for these costs matters, because head of household is one of the statuses the IRS checks most often, and a paid preparer has a due diligence duty for it with a penalty of ${usd(Y(2026).preparerDiligencePenalty)} per failure on returns filed in 2027 under Rev. Proc. 2025-32.</p>
<h2>A qualifying person, defined</h2>
<p>A qualifying child (son, daughter, stepchild, foster child, sibling or a descendant of one) who lived with you more than half the year and is under 19, under 24 and a full-time student, or permanently disabled, qualifies. So does a qualifying relative you can claim as a dependent who lived with you all year, except that a parent can live elsewhere. A friend or partner who is not a relative never makes you head of household, even if you support them.</p>
<h2>Other figures tied to the status</h2>
<p>A head of household uses the single thresholds for the ${h.a('no-tax-on-tips', 'tips')}, ${h.a('no-tax-on-overtime', 'overtime')} and ${h.a('senior-deduction', 'senior')} deductions, the ${h.a('roth-ira-income-limit', 'Roth IRA')} range of ${usd(y6.retirement.rothPhase.single[0])} to ${usd(y6.retirement.rothPhase.single[1])}, and its own ${h.a('capital-gains-tax-rates', '0% capital gains band')}, up to ${usd(y6.capitalGains.zeroTop.hoh)} of taxable income. The additional standard deduction at 65 is ${usd(y6.agedBlind.unmarried)}.</p>
<p>Source: ${h.src('rp2532')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['single-tax-brackets', 'tax-brackets', 'child-tax-credit', 'earned-income-credit', 'standard-deduction'],
  sources: ['rp2532', 'law', 'ctc'],
});
