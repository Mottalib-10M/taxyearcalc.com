import { definePage } from '../../lib/page-types';
import { Y, S, usd, num, day, P } from '../../lib/kit';

const f6 = Y(2026).fsa;

export default definePage({
  id: 'fsa-limit',
  group: 'accounts',
  kind: 'tool',
  order: 50,
  slug: 'fsa-limit',
  nav: 'FSA limits',
  card: 'The 2026 health FSA limit and carryover, and the dependent care FSA raised to $7,500.',
  title: `FSA Limit 2026: ${usd(f6.health)} Health, ${usd(f6.dependentCare)} Dependent Care`,
  description: `FSA limit 2026: ${usd(f6.health)} for a health FSA with up to ${usd(f6.carryover)} of carryover, and ${usd(f6.dependentCare)} for a dependent care FSA, up from $5,000. Plan your 2026 election now.`,
  h1: 'FSA limits for 2026',
  intro: 'Two different accounts share the name: the health FSA, indexed every year, and the dependent care FSA, raised by law for 2026.',
  resume: `For 2026 an employee can put up to ${usd(f6.health)} into a health flexible spending arrangement through salary reduction, under section 4.15 of Rev. Proc. 2025-32, and a plan that allows carryover can let up to ${usd(f6.carryover)} of unspent money roll into 2027. The dependent care FSA is a separate account with a separate limit, which Public Law 119-21 raised from ${usd(5000)} to ${usd(f6.dependentCare)} per household for 2026, or ${usd(f6.dependentCareMfs)} for a married person filing separately (section 70404); that amount is not indexed. Both accounts take money before federal income tax and before Social Security and Medicare, so an employee in the 22% bracket saves about ${num(22 + S.fica.socialSecurity + S.fica.medicare, 2)} cents per dollar used. The trade-off is the use-it-or-lose-it rule: money left in a health FSA at the end of the plan year is forfeited unless the plan offers the carryover or a grace period of up to two and a half months. Elections are made during open enrollment and generally cannot change mid-year without a qualifying event.`,
  tool: 'fsa',
  faqs: [
    { q: 'Is the dependent care FSA limit $7,500 in 2026?', a: `Yes. Section 70404 of Public Law 119-21 raised the exclusion for employer-provided dependent care assistance from ${usd(5000)} to ${usd(f6.dependentCare)}, and from ${usd(2500)} to ${usd(f6.dependentCareMfs)} for married people filing separately, for taxable years beginning after December 31, 2025. Your employer's plan must be amended to allow the higher election.` },
    { q: 'How much can I carry over in my health FSA from 2026 to 2027?', a: `Up to ${usd(f6.carryover)}, if your employer's plan offers a carryover, under Rev. Proc. 2025-32. Some plans offer a grace period instead, which lets you spend the previous year's balance during the first months of the new year, and some offer neither. A plan cannot offer both a carryover and a grace period for the same account.` },
    { q: 'Can I have both an HSA and a health FSA in 2026?', a: `Not a general-purpose health FSA: it disqualifies you from contributing to an HSA. A limited-purpose FSA that covers only dental and vision costs, or a post-deductible FSA, is compatible with an HSA. A dependent care FSA has nothing to do with medical costs and can be combined with either account.` },
  ],
  body: (h) => `
<h2>The two accounts side by side</h2>
${h.table(['', 'Health FSA', 'Dependent care FSA'], [
  ['2026 limit', usd(f6.health), `${usd(f6.dependentCare)} per household (${usd(f6.dependentCareMfs)} married filing separately)`],
  ['Limit applies to', 'each employee, each employer plan', 'the household'],
  ['Indexed for inflation', 'yes', 'no'],
  ['Unspent money', `forfeited, unless a carryover up to ${usd(f6.carryover)} or a grace period`, 'forfeited, unless a grace period'],
  ['Pays for', 'medical, dental and vision costs not reimbursed', 'care for a child under 13 or a dependent who needs care, so you can work'],
], 'Rev. Proc. 2025-32 section 4.15; section 129 as amended by section 70404 of Public Law 119-21', ['l', 'l', 'l'])}
<h2>Sizing a health FSA election</h2>
<p>Add predictable costs: deductibles and copays, prescriptions, dental work, glasses and contacts. The full annual election is available from the first day of the plan year, even before it has been withheld from pay, which makes an FSA useful for a large planned expense early in the year. Spouses each have their own ${usd(f6.health)} limit through their own employers.</p>
<h2>Dependent care FSA or the credit</h2>
<p>Money run through a dependent care FSA cannot also count for the ${h.a('child-and-dependent-care-credit', 'child and dependent care credit')}. For most middle- and higher-income families the FSA saves more, since it avoids income tax and FICA; low-income families can come out ahead with the credit, whose rate reaches 50% in 2026. With two children and ${usd(12000)} of costs, putting ${usd(f6.dependentCare)} through the FSA and claiming the credit on what remains, within its ${usd(S.dependentCare.expenseCap[1])} cap, often combines both.</p>
<h2>Changing an election during the year</h2>
<p>Elections are fixed for the plan year once it starts. A change is allowed after a qualifying event: marriage, divorce, birth or adoption, a change in a spouse's job or coverage, or, for dependent care, a change in the provider or its cost. The change must be consistent with the event and made within the window the plan sets, often 30 days. Leaving a job ends contributions; health FSA money not yet spent is generally lost unless COBRA continuation is elected for the account.</p>
<h2>HSA instead</h2>
<p>People with an HSA-eligible plan, now including bronze plans, may prefer the ${h.a('hsa-contribution-limit', 'HSA')}, which keeps its balance year after year.</p>
<p>Sources: ${h.src('rp2532')}; section 70404 of ${h.src('law', 'Public Law 119-21')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['hsa-contribution-limit', 'child-and-dependent-care-credit', '401k-contribution-limit', 'fica-tax-rate', 'one-big-beautiful-bill-tax-changes'],
  sources: ['rp2532', 'law'],
});
