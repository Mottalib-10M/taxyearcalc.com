import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const c6 = Y(2026).charity;
const ex = E.charity(2026, 'mfj', 6000, 180000);

export default definePage({
  id: 'charitable-deduction',
  group: 'deductions',
  kind: 'tool',
  order: 90,
  slug: 'charitable-deduction',
  nav: 'Charitable deduction',
  card: 'The 2026 deduction for non-itemizers and the new 0.5% floor for those who itemize.',
  title: `Charitable Deduction 2026: ${usd(c6.nonItemizer.single)} Without Itemizing`,
  description: `Charitable deduction 2026: up to ${usd(c6.nonItemizer.single)} (${usd(c6.nonItemizer.mfj)} joint) of cash gifts without itemizing, and a 0.5% of AGI floor for itemizers. See what yours are worth.`,
  h1: 'Charitable deductions under the 2026 rules',
  intro: 'Two changes start in 2026: a deduction for people who do not itemize, and a floor for those who do.',
  resume: `Starting with the 2026 return, people who take the standard deduction can also deduct cash gifts to charity up to ${usd(c6.nonItemizer.single)}, or ${usd(c6.nonItemizer.mfj)} for a married couple filing jointly, under section 70424 of Public Law 119-21; for 2025 there is no such deduction for non-itemizers. Those who itemize face a new floor from 2026 (section 70425): only the part of their gifts above 0.5% of their contribution base, essentially AGI, is deductible, and the part below the floor carries forward. A couple with ${usd(180000)} of AGI who give ${usd(6000)} and itemize deducts ${usd(ex.itemized)}, because the first ${usd(ex.floor)} falls under the floor. A separate limit for top earners in the 37% bracket trims the value of every itemized deduction to about 35 cents per dollar. The non-itemizer deduction covers cash gifts to public charities, not gifts to donor-advised funds or private foundations. The usual percentage-of-AGI ceilings for large gifts still apply.`,
  tool: 'charity',
  faqs: [
    { q: 'Can I deduct donations in 2026 if I take the standard deduction?', a: `Yes, cash gifts up to ${usd(c6.nonItemizer.single)} on a single return or ${usd(c6.nonItemizer.mfj)} on a joint return, under section 170(p) as rewritten by Public Law 119-21, for taxable years beginning after December 31, 2025. The 2026 Form 1040-ES lists it among the changes. It does not exist for 2025 returns, so gifts made in 2025 count only if you itemize.` },
    { q: 'What is the 0.5% floor on charitable gifts?', a: `From 2026, an itemizer deducts gifts only to the extent they exceed 0.5% of the contribution base, which for most people is adjusted gross income. With ${usd(100000)} of AGI the first ${usd(500)} of gifts is not deductible that year. The amount under the floor is added to the charitable carryover, according to the 2026 Form 1040-ES.` },
    { q: 'Do gifts to a donor-advised fund count for the non-itemizer charitable deduction?', a: `No. Section 170(p) is limited to cash contributions to organizations described in section 170(b)(1)(A), which excludes donor-advised funds and supporting organizations. Gifts of stock or goods do not count either. A donor-advised fund gift can still be deducted by someone who itemizes, subject to the 0.5% floor.` },
    { q: 'Should I bunch two years of charitable gifts into 2026?', a: `It depends on itemizing. Bunching helps households close to the standard deduction: two years of gifts in one year can lift itemized deductions above ${usd(Y(2026).standard.mfj)} for a couple, then the standard deduction plus the ${usd(c6.nonItemizer.mfj)} cash gift deduction applies in the following year. The 0.5% floor is applied each year, so bunching also uses it only once.` },
  ],
  body: (h) => `
<h2>2025 against 2026, side by side</h2>
${h.table(['Rule', '2025 return', '2026 return'], [
  ['Deduction without itemizing', 'none', `${usd(c6.nonItemizer.single)} single / ${usd(c6.nonItemizer.mfj)} joint, cash only`],
  ['Floor for itemizers', 'none', '0.5% of the contribution base'],
  ['Limit for the 37% bracket', 'none', 'itemized deductions cut by 2/37 of the smaller of the deductions and the income above the 37% threshold'],
], 'Sections 70424, 70425 and 70111 of Public Law 119-21; Form 1040-ES (2026)', ['l', 'l', 'l'])}
<h2>What a gift is worth in tax</h2>
<p>For a non-itemizer in the 12% bracket, ${usd(1000)} given in cash saves ${usd(120)} in 2026, and nothing in 2025. For an itemizer with ${usd(150000)} of AGI in the 24% bracket, the first ${usd(750)} of gifts is under the floor and each dollar above it saves 24 cents. For a top earner, the 2/37 rule means each itemized dollar saves about 35 cents instead of 37. The calculator shows the deduction and the tax it removes, using your filing status and AGI.</p>
<h2>Records the IRS expects</h2>
<p>Every cash gift needs a bank record or a written receipt from the charity, and any single gift of ${usd(250)} or more needs a written acknowledgment stating whether you received anything in return, obtained by the time you file. That rule applies to the new non-itemizer deduction too. Gifts to individuals, crowdfunding for a neighbor or political campaigns are never deductible.</p>
<h2>Gifts that save more than a deduction</h2>
<p>From age 70 and a half, a qualified charitable distribution from an IRA goes directly to the charity and stays out of AGI, up to ${usd(111000)} for 2026 under Notice 2025-67, which helps whether or not you itemize and keeps income lower for the ${h.a('senior-deduction', 'senior deduction')} phase-out. Appreciated stock held more than a year can be given without paying ${h.a('capital-gains-tax-rates', 'capital gains tax')} on it. Compare the totals in the ${h.a('itemized-vs-standard-deduction', 'itemize-or-not calculator')}.</p>
<p>Sources: sections 70424 and 70425 of ${h.src('law', 'Public Law 119-21')}; ${h.src('es2026')}; ${h.src('n2567')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['itemized-vs-standard-deduction', 'standard-deduction', 'one-big-beautiful-bill-tax-changes', 'salt-deduction', 'mortgage-interest-deduction'],
  sources: ['law', 'es2026', 'n2567'],
});
