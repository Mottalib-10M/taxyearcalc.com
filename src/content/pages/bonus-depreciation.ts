import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, day, P } from '../../lib/kit';

const s6 = Y(2026).sec179; const s5 = Y(2025).sec179; const bd = S.bonusDepreciation;
const big = E.section179(2026, 3000000, 4500000);

export default definePage({
  id: 'bonus-depreciation',
  group: 'estates',
  kind: 'tool',
  order: 30,
  slug: 'bonus-depreciation',
  nav: 'Bonus depreciation',
  card: 'Permanent 100% bonus depreciation and the $2,560,000 section 179 limit for 2026.',
  title: `Bonus Depreciation 2026: ${bd.rate}% Permanent, Section 179 Limits`,
  description: `Bonus depreciation 2026: ${bd.rate}% first-year write-off, permanent for property acquired after January 19, 2025, and section 179 up to ${usd(s6.limit)}. Compute it.`,
  h1: 'Bonus depreciation and section 179 in 2026',
  intro: 'Two ways to deduct business equipment in the year you buy it, both enlarged by the 2025 law.',
  resume: `Bonus depreciation lets a business deduct the cost of qualified property, such as machinery, equipment, computers and many vehicles, in the year it is placed in service instead of over several years. Section 70301 of Public Law 119-21 made it permanent at ${bd.rate}% for property acquired after January 19, 2025. For the first tax year ending after that date, a business can elect ${bd.electableRate}% instead (60% for long production period property). Section 179 works alongside it: for 2026 a business can expense up to ${usd(s6.limit)} of qualifying property, a limit reduced dollar for dollar once total section 179 property placed in service exceeds ${usd(s6.phaseStart)} (Rev. Proc. 2025-32 section 4.24; ${usd(s5.limit)} and ${usd(s5.phaseStart)} for 2025). A sport utility vehicle is capped at ${usd(s6.suv)} under section 179. A company that places ${usd(4500000)} of equipment in service in 2026 keeps a section 179 limit of ${usd(big.limit)}, and bonus depreciation can take the rest. Section 179 cannot exceed business taxable income; bonus depreciation can create a loss.`,
  tool: 'sec179',
  faqs: [
    { q: 'Is bonus depreciation 100% in 2026?', a: `Yes, for property acquired after January 19, 2025. Section 70301 of Public Law 119-21 provides a permanent ${bd.rate}% additional first-year depreciation deduction for that property, according to the IRS summary of the law. Property acquired earlier, under a binding contract signed before that date, stays under the old phase-down schedule. A business may elect a lower rate for its first tax year ending after January 19, 2025.` },
    { q: 'What is the section 179 deduction limit for 2026?', a: `${usd(s6.limit)} of qualifying property, reduced by the amount by which total section 179 property placed in service during 2026 exceeds ${usd(s6.phaseStart)}, under section 4.24 of Rev. Proc. 2025-32. A business placing ${usd(6650000)} or more in service in 2026 has no section 179 deduction left, though bonus depreciation remains available. The limits for 2025 were ${usd(s5.limit)} and ${usd(s5.phaseStart)}.` },
    { q: 'Should a small business use section 179 or bonus depreciation?', a: `Often both, in that order. Section 179 lets you choose asset by asset and is limited to business income, so it cannot create a loss. Bonus depreciation applies to whole classes of property unless you elect out, and it can create a net operating loss. States treat them differently: many do not follow federal bonus depreciation, which matters for the state return.` },
  ],
  body: (h) => `
<h2>The 2026 and 2025 numbers</h2>
${h.table(['Item', '2025', '2026'], [
  ['Section 179 maximum', usd(s5.limit), usd(s6.limit)],
  ['Phase-out begins at property placed in service of', usd(s5.phaseStart), usd(s6.phaseStart)],
  ['Section 179 cap for an SUV', 'see Rev. Proc. 2024-40', usd(s6.suv)],
  ['Bonus depreciation, property acquired after January 19, 2025', `${bd.rate}% (or ${bd.electableRate}% elected)`, `${bd.rate}%`],
], 'Rev. Proc. 2025-32 sections 3.02 and 4.24; Public Law 119-21 sections 70301 and 70306', ['l', 'r', 'r'])}
<h2>How the two deductions combine</h2>
<p>On Form 4562, section 179 is applied first to the assets you choose, up to the limit and to business taxable income. Bonus depreciation then applies to the remaining cost of qualified property, and regular MACRS depreciation to whatever is left. For a contractor buying a ${usd(180000)} excavator in 2026, section 179 alone can cover it; for a manufacturer placing ${usd(4500000)} of machines in service, the section 179 limit falls to ${usd(big.limit)} and ${usd(4500000 - big.limit)} goes to bonus depreciation.</p>
<h2>What qualifies</h2>
<p>Tangible property with a recovery period of 20 years or less, off-the-shelf software and qualified improvement property generally qualify for bonus depreciation; used property qualifies if the business did not use it before. Section 179 covers machinery, equipment, vehicles, furniture, software and certain improvements to nonresidential buildings such as roofs, HVAC and security systems. Land and most buildings never qualify. Passenger cars remain subject to the yearly luxury auto limits even with bonus depreciation.</p>
<h2>Individuals and the new car deduction</h2>
<p>A sole proprietor claims these deductions on Schedule C, which lowers business income for both income tax and ${h.a('fica-tax-rate', 'self-employment tax')}. A vehicle used partly for the business and partly at home splits its depreciation, and the personal share of interest on a new US-assembled car may fall under the separate ${h.a('car-loan-interest-deduction', 'car loan interest deduction')}. The ${h.a('qualified-business-income-deduction', 'QBI deduction')} is then computed on the lower business income.</p>
<p>Sources: ${h.src('wftcbiz')}; ${h.src('rp2532')}; ${h.src('law')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['qualified-business-income-deduction', 'car-loan-interest-deduction', 'estimated-tax-payments', 'one-big-beautiful-bill-tax-changes', 'fica-tax-rate'],
  sources: ['wftcbiz', 'rp2532', 'law'],
});
