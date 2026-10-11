import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const a6 = Y(2026).adoption; const a5 = Y(2025).adoption;
const mid = E.adoptionCredit(2026, 20000, 285080);

export default definePage({
  id: 'adoption-credit',
  group: 'credits',
  kind: 'tool',
  order: 50,
  slug: 'adoption-credit',
  nav: 'Adoption credit',
  card: 'Up to $17,670 per child in 2026, with $5,120 now refundable.',
  title: `Adoption Credit 2026: ${usd(a6.max)} per Child, ${usd(a6.refundable)} Refundable`,
  description: `Adoption credit 2026: up to ${usd(a6.max)} of qualified expenses per child, ${usd(a6.refundable)} of it refundable, phased out between ${usd(a6.phase[0])} and ${usd(a6.phase[1])} of MAGI. Estimate yours.`,
  h1: 'The adoption credit for 2026',
  intro: 'A per-child credit for adoption expenses, part of which is now paid even when no income tax is owed.',
  resume: `The adoption credit covers qualified adoption expenses up to ${usd(a6.max)} per child for 2026 (${usd(a5.max)} for 2025), under section 4.04 of Rev. Proc. 2025-32. Since 2025, Public Law 119-21 makes part of it refundable: up to ${usd(a6.refundable)} per child for 2026 (${usd(a5.refundable)} for 2025) is paid even if you owe no income tax, while the rest reduces tax and can be carried forward for up to five years. The credit phases out evenly as modified AGI rises from ${usd(a6.phase[0])} to ${usd(a6.phase[1])}; a family halfway through that range, at ${usd(285080)}, with ${usd(20000)} of expenses gets ${usd(mid.credit)}. Qualified expenses are reasonable and necessary adoption fees, court costs, attorney fees and travel. For a child with special needs, as determined by a state, the full ${usd(a6.max)} is allowed whatever the actual expenses. Employer adoption assistance is excluded from income up to the same amount, but the same dollars cannot be used twice. The credit is claimed on Form 8839.`,
  tool: 'adoption',
  faqs: [
    { q: 'How much of the adoption credit is refundable in 2026?', a: `Up to ${usd(a6.refundable)} per child, the inflation-adjusted version of the ${usd(5000)} refundable portion created by section 70402 of Public Law 119-21. Any credit above that reduces your income tax and the unused part carries forward five years. Credit carried forward from earlier years cannot be used to compute the refundable portion, according to the IRS.` },
    { q: 'Was any of the adoption credit refundable on 2025 returns?', a: `Yes. Section 70402 of Public Law 119-21 applies to taxable years beginning after December 31, 2024, so up to ${usd(a5.refundable)} per child is refundable on the 2025 return, then ${usd(a6.refundable)} for 2026 after the inflation adjustment of Rev. Proc. 2025-32. Before 2025 the whole credit was nonrefundable and only reduced income tax, with a five-year carryforward for the unused part.` },
    { q: 'What is a child with special needs for the adoption credit?', a: `A child who is a US citizen or resident for whom a state has determined that he or she cannot or should not be returned to the parents' home and probably will not be adopted without assistance, for example because of age, ethnic background, sibling group or a medical condition. For such a child the full ${usd(a6.max)} credit is allowed in the year the adoption becomes final.` },
  ],
  body: (h) => `
<h2>2026 and 2025 figures</h2>
${h.table(['Item', '2025', '2026'], [
  ['Maximum credit per child', usd(a5.max), usd(a6.max)],
  ['Refundable portion per child', usd(a5.refundable), usd(a6.refundable)],
  ['Phase-out starts at MAGI', usd(a5.phase[0]), usd(a6.phase[0])],
  ['Credit gone at MAGI', usd(a5.phase[1]), usd(a6.phase[1])],
], 'Rev. Proc. 2024-40, Rev. Proc. 2025-32 section 4.04; refundable part under section 70402 of Public Law 119-21', ['l', 'r', 'r'])}
<h2>How the phase-out is applied</h2>
<p>The reduction is proportional over the ${usd(a6.phase[1] - a6.phase[0])} range: credit times the share of the range your modified AGI has not crossed. With ${usd(20000)} of expenses and ${usd(275080)} of modified AGI, a quarter of the range is crossed and ${usd(E.adoptionCredit(2026, 20000, 275080).credit)} remains. Modified AGI is AGI plus excluded foreign income. The same range applies to the employer exclusion for adoption assistance.</p>
<h2>Expenses that count</h2>
<p>Qualified expenses are the reasonable and necessary costs directly related to the legal adoption of an eligible child: adoption fees, court costs, attorney fees and travel, including meals and lodging while away from home. Costs reimbursed by an employer under an adoption assistance program cannot be counted again for the credit, though the employer exclusion and the credit can be combined on different dollars up to the limit for each. The limit applies per child, not per year, so expenses spread over several years share one ${usd(a6.max)} ceiling.</p>
<h2>Carryforward of the nonrefundable part</h2>
<p>Credit above the refundable portion that your income tax cannot absorb carries forward for up to five years. A family with ${usd(17000)} of credit and ${usd(4000)} of income tax uses ${usd(4000)} against tax, receives up to ${usd(a6.refundable)} as a refund and carries the rest forward. Carried-forward amounts are never refundable later.</p>
<h2>Using it with other family credits</h2>
<p>An adopted child is a qualifying child for the ${h.a('child-tax-credit', 'child tax credit')} and the ${h.a('earned-income-credit', 'earned income credit')} once placed with you, and care costs can bring the ${h.a('child-and-dependent-care-credit', 'dependent care credit')}. The refundable part of the adoption credit adds to the refund figured by the ${h.a('tax-refund-calculator', 'refund estimator')}.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('rp2440')}; ${h.src('law')}; ${h.src('wftc')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['child-tax-credit', 'child-and-dependent-care-credit', 'one-big-beautiful-bill-tax-changes', 'tax-refund-calculator', 'earned-income-credit'],
  sources: ['rp2532', 'rp2440', 'law', 'wftc'],
});
