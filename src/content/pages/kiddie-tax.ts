import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const k = Y(2026).kiddie;
const ex = E.kiddieTax(2026, 6000, 24);

export default definePage({
  id: 'kiddie-tax',
  group: 'rates',
  kind: 'tool',
  order: 120,
  slug: 'kiddie-tax',
  nav: 'Kiddie tax',
  card: "How a child's investment income above $2,700 is taxed at the parents' rate in 2026.",
  title: `Kiddie Tax 2026: ${usd(k)} Tax-Free, Then the Parents' Rate`,
  description: `Kiddie tax 2026: a child's first ${usd(k)} of investment income is tax-free, the next ${usd(k)} is taxed at the child's rate, the rest at the parents' rate.`,
  h1: "The kiddie tax on a child's investment income",
  intro: 'Interest, dividends and gains in a child’s name stop being lightly taxed above a small threshold.',
  resume: `The kiddie tax stops parents from moving investments into a child's name to use the child's low brackets. For 2026, a child's first ${usd(k)} of unearned income (interest, dividends, capital gains, taxable scholarships beyond earned income rules) is covered by the dependent standard deduction, the next ${usd(k)} is taxed at the child's own rate, and everything above ${usd(2 * k)} is taxed at the parents' marginal rate, under section 1(g) with the ${usd(k)} figure of Rev. Proc. 2025-32 section 4.02, the same as in 2025. A child with ${usd(6000)} of dividends and parents in the 24% bracket owes about ${usd(ex.tax)}: nothing on the first ${usd(k)}, 10% on the next ${usd(k)}, 24% on the remaining ${usd(ex.atParent)}. The rule applies to children under 19 at the end of the year, and to full-time students under 24, whose earned income does not cover more than half their support. Parents may report the child's income on their own return with Form 8814 when it is between ${usd(k)} and ${usd(10 * k)}.`,
  tool: 'kiddie',
  faqs: [
    { q: 'At what amount does the kiddie tax start in 2026?', a: `Above ${usd(2 * k)} of a child's unearned income. The first ${usd(k)} is offset by the dependent standard deduction and the next ${usd(k)} is taxed at the child's own rate, usually 10%. Only unearned income above ${usd(2 * k)} is taxed at the parents' rate. Wages from a job are never subject to the kiddie tax.` },
    { q: 'Can I put my child’s dividends on my own return instead of filing a return for the child?', a: `Yes, with Form 8814, if the child's gross income is only interest and dividends (including capital gain distributions), is more than ${usd(k)} and less than ${usd(10 * k)}, and no estimated tax was paid in the child's name. The amount above ${usd(2 * k)} is added to your income. This can raise your AGI and affect limits tied to it.` },
    { q: 'Does the kiddie tax apply to a college student working part time?', a: `It applies to a full-time student under 24 at the end of the year whose earned income does not exceed half of his or her own support, and who has at least one living parent. A student who pays most of his own way with wages escapes it. The tax only concerns unearned income above ${usd(2 * k)}, not the wages themselves.` },
  ],
  body: (h) => `
<h2>Three layers of a child's investment income</h2>
${h.table(["Child's unearned income", 'Tax-free', "At the child's 10%", "At parents' 24%", 'Tax'], [1000, 2700, 4000, 6000, 10000, 20000].map((u) => { const r = E.kiddieTax(2026, u, 24); return [usd(u), usd(r.free), usd(r.atChild), usd(r.atParent), usd(r.tax)]; }), "2026, child with no earned income, parents in the 24% bracket", ['l', 'r', 'r', 'r', 'r'])}
<p>Qualified dividends and long-term gains keep their preferential rates inside the kiddie tax: the parents' rate here means the rate that would apply on the parents' return, including the 0%, 15% or 20% of the ${h.a('capital-gains-tax-rates', 'capital gains bands')} when relevant. The calculator applies an ordinary rate to the whole excess, which overstates the tax on qualified dividends.</p>
<h2>What escapes the kiddie tax</h2>
<p>Earned income: wages from a summer job, self-employment income from mowing lawns or babysitting. That income gets the regular dependent standard deduction, the larger of ${usd(Y(2026).dependentStandard.minimum)} or earned income plus ${usd(Y(2026).dependentStandard.earnedPlus)}, and the child's own brackets; see the ${h.a('standard-deduction', 'standard deduction page')}. Income inside a 529 plan or a Roth IRA is not taxed while it stays in the account. Trump accounts created by the 2025 law for children born from 2025 through 2028 also grow tax-deferred.</p>
<h2>Filing for the child</h2>
<p>A child with more than ${usd(k)} of unearned income generally files a return, attaching Form 8615 to compute the tax at the parents' rate, which requires the parents' taxable income. When several children have kiddie-tax income, the parents' rate is computed on their combined net unearned income. Parents who prefer one return can use Form 8814 within its limits.</p>
<h2>Gifts to children and the threshold</h2>
<p>Parents and grandparents can give each child up to ${usd(Y(2026).gift.annual)} in 2026 without a ${h.a('gift-tax-limit', 'gift tax return')}, but income from gifted investments counts toward the kiddie tax. With a 4% yield, about ${usd((2 * k) / 0.04)} of savings in the child's name produces ${usd(2 * k)} of interest a year, the level where the parents' rate begins. Above that, custodial accounts lose most of their tax advantage.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('rp2440')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['standard-deduction', 'capital-gains-tax-rates', 'gift-tax-limit', 'tax-brackets', 'marginal-vs-effective-tax-rate'],
  sources: ['rp2532', 'rp2440'],
});
