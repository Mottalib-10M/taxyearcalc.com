import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, day, P } from '../../lib/kit';

const d = S.dependentCare; const r6 = d.rate2026;
const fam = E.dependentCareCredit(2026, 'mfj', 100000, 9000, 2);
const fam25 = E.dependentCareCredit(2025, 'mfj', 100000, 9000, 2);
const low = E.dependentCareCredit(2026, 'hoh', 30000, 5000, 1);
const old20 = d.rate2025.start + (d.rate2025.top - d.rate2025.floor - 1) * d.rate2025.step;

export default definePage({
  id: 'child-and-dependent-care-credit',
  group: 'credits',
  kind: 'tool',
  order: 40,
  slug: 'child-and-dependent-care-credit',
  nav: 'Dependent care credit',
  card: 'The 2026 credit rate of up to 50% on child care costs, and the $7,500 FSA limit.',
  title: `Child and Dependent Care Credit 2026: Up to ${r6.top}% of Costs`,
  description: `Child and dependent care credit 2026: up to ${r6.top}% of ${usd(d.expenseCap[0])} of care costs (${usd(d.expenseCap[1])} for two or more), stepping down to ${r6.mid}% then ${r6.floor}% with income. See your credit.`,
  h1: 'The child and dependent care credit in 2026',
  intro: 'For 2026 the credit rate rises for most families, and the tax-free employer benefit for care grows to $7,500.',
  resume: `The child and dependent care credit pays back part of what you spend on care for a child under 13, or for a spouse or dependent unable to care for themselves, so that you can work or look for work. From 2026, section 70405 of Public Law 119-21 sets the rate at ${r6.top}% of expenses, reduced by one point for each ${usd(r6.step)} or part of it of AGI above ${usd(r6.start)} down to ${r6.mid}%, then by one point for each ${usd(r6.secondStep.single)} (${usd(r6.secondStep.mfj)} joint) above ${usd(r6.secondStart.single)} (${usd(r6.secondStart.mfj)} joint), down to ${r6.floor}%. For 2025 the rate started at ${d.rate2025.top}% and reached ${d.rate2025.floor}% for AGI above ${usd(old20)}. Expenses still count up to ${usd(d.expenseCap[0])} for one person and ${usd(d.expenseCap[1])} for two or more. A married couple with ${usd(100000)} of AGI and ${usd(9000)} of day care for two children gets ${usd(fam.credit)} for 2026, against ${usd(fam25.credit)} for 2025. The credit is not refundable. Separately, the tax-free dependent care benefit an employer can provide, often through a dependent care FSA, rises to ${usd(Y(2026).fsa.dependentCare)} (section 70404).`,
  tool: 'dependentCare',
  faqs: [
    { q: 'What percentage of child care costs is the 2026 credit?', a: `It depends on AGI. Families with AGI up to ${usd(r6.start)} get ${r6.top}%; the rate drops a point per ${usd(r6.step)} to ${r6.mid}% at about ${usd(r6.start + (r6.top - r6.mid) * r6.step)}, stays at ${r6.mid}% up to ${usd(r6.secondStart.mfj)} for a couple (${usd(r6.secondStart.single)} for others), then falls toward ${r6.floor}%. A couple with ${usd(120000)} of AGI gets ${E.dependentCareRate(2026, 'mfj', 120000)}% of up to ${usd(d.expenseCap[1])}.` },
    { q: 'Can I use a dependent care FSA and the credit together?', a: `Yes, but not on the same dollars. Expenses paid with tax-free employer money, up to ${usd(Y(2026).fsa.dependentCare)} in 2026, reduce the expenses eligible for the credit, which stay capped at ${usd(d.expenseCap[0])} or ${usd(d.expenseCap[1])}. A family with two children and ${usd(12000)} of care that puts ${usd(7500)} through an FSA can claim the credit on ${usd(Math.min(4500, d.expenseCap[1]))} of the rest.` },
    { q: 'Which care expenses qualify for the dependent care credit?', a: `Day care, before- and after-school care, day camps and in-home care for a qualifying child under 13, and care for a spouse or dependent who cannot care for themselves. Overnight camps, tuition from kindergarten up, and care that is not needed for you to work or look for work do not qualify. You must report the provider's name and taxpayer identification number on Form 2441.` },
  ],
  body: (h) => `
<h2>The 2026 rate, step by step</h2>
${h.table(['AGI', 'Rate (single or HOH)', 'Rate (joint)', 'Credit on $6,000, joint'], [15000, 25000, 45000, 75000, 100000, 150000, 180000, 250000].map((a) => [usd(a), `${E.dependentCareRate(2026, 'single', a)}%`, `${E.dependentCareRate(2026, 'mfj', a)}%`, usd(E.dependentCareCredit(2026, 'mfj', a, 6000, 2).credit)]), 'Section 21(a)(2) as amended by section 70405 of Public Law 119-21', ['l', 'r', 'r', 'r'])}
<p>The table shows why the new law matters most to two groups: families under about ${usd(45000)} of AGI, whose rate rises from 35% or less to as much as ${r6.top}%, and middle-income couples between ${usd(45000)} and ${usd(r6.secondStart.mfj)}, who now keep ${r6.mid}% instead of the ${d.rate2025.floor}% that applied above ${usd(old20)} under the old rule.</p>
<h2>Limits on the expenses</h2>
<p>Countable expenses are capped at ${usd(d.expenseCap[0])} for one qualifying person and ${usd(d.expenseCap[1])} for two or more, amounts the 2025 law left unchanged. They are also capped at the earned income of the lower-earning spouse: a parent with no earnings generally makes the couple ineligible, unless that spouse was a full-time student or unable to care for himself, in which case the law assigns a deemed income. Married people must file jointly to claim the credit, with an exception for some separated spouses.</p>
<h2>Two parents working, one in school</h2>
<p>The expense cap is limited by the earned income of each spouse. When one spouse earns ${usd(4000)} in a year, only ${usd(4000)} of care costs count, however much was spent. A spouse who was a full-time student for at least five months of the year, or who could not care for himself, is treated as earning a set monthly amount for that purpose, which keeps the family eligible. These rules are unchanged by the 2025 law.</p>
<h2>The low-income case</h2>
<p>A single parent with ${usd(30000)} of AGI and ${usd(5000)} of care for one child gets ${low.rate}% of ${usd(low.counted)}, a credit of ${usd(low.credit)} for 2026. Because the credit is not refundable, it only helps to the extent there is income tax to absorb it, after the ${h.a('child-tax-credit', 'child tax credit')} has been applied. A family whose tax is already wiped out gains nothing from it, which the ${h.a('tax-refund-calculator', 'refund estimator')} makes visible.</p>
<p>Sources: sections 70404 and 70405 of ${h.src('law', 'Public Law 119-21')}; ${h.src('wftc', 'IRS Working Families Tax Cuts summary (child and dependent care credit)')}; ${h.src('es2026')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['child-tax-credit', 'fsa-limit', 'earned-income-credit', 'tax-refund-calculator', 'one-big-beautiful-bill-tax-changes'],
  sources: ['law', 'wftc', 'es2026'],
});
