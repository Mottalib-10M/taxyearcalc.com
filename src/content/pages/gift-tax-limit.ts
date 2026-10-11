import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const g6 = Y(2026).gift; const g5 = Y(2025).gift; const ex6 = Y(2026).estate.exclusion;
const fam = E.giftTax(2026, [30000, 30000, 30000], false);

export default definePage({
  id: 'gift-tax-limit',
  group: 'estates',
  kind: 'tool',
  order: 10,
  slug: 'gift-tax-limit',
  nav: 'Gift tax limit',
  card: 'The $19,000 annual exclusion per recipient for 2026 and the lifetime exemption behind it.',
  title: `Gift Tax Limit 2026: ${usd(g6.annual)} a Person, ${usd(ex6 / 1e6)} Million Lifetime`,
  description: `Gift tax limit 2026: give up to ${usd(g6.annual)} per person with no gift tax return; above that, Form 709 draws on the ${usd(ex6 / 1e6)} million lifetime exemption. Check your gifts.`,
  h1: 'The gift tax limit for 2026',
  intro: 'How much you can give each person without paying gift tax or even filing a return, and what happens above it.',
  resume: `For 2026 you can give up to ${usd(g6.annual)} to any number of people without gift tax and without filing a gift tax return, the annual exclusion of section 4.42 of Rev. Proc. 2025-32, the same as in 2025. A married couple can give ${usd(2 * g6.annual)} to each recipient by electing to split gifts, though that election itself requires a Form 709. Gifts above the annual exclusion are not taxed right away: they are reported on Form 709 and subtracted from the lifetime basic exclusion, ${usd(ex6)} per person for 2026 after Public Law 119-21 (${usd(Y(2025).estate.exclusion)} for 2025). Gift tax is due only once lifetime taxable gifts exceed that amount. Three types of transfer fall outside these limits altogether: tuition paid directly to a school, medical expenses paid directly to a provider, and gifts to a spouse who is a US citizen. Gifts to a spouse who is not a citizen have their own annual exclusion of ${usd(g6.nonCitizenSpouse)} for 2026. A parent who gives each of three children ${usd(30000)} in 2026 makes ${usd(fam.taxable)} of taxable gifts, reported on Form 709, with no tax to pay.`,
  tool: 'gift',
  faqs: [
    { q: 'Do I have to pay tax if I give my son $50,000 in 2026?', a: `Almost certainly not. The first ${usd(g6.annual)} is covered by the annual exclusion; the remaining ${usd(50000 - g6.annual)} must be reported on Form 709, and it reduces your ${usd(ex6)} lifetime exemption. Tax is due only after your lifetime taxable gifts pass that exemption. Your son owes nothing either: the recipient never pays federal gift tax and does not report the gift as income.` },
    { q: 'Can my spouse and I give $38,000 to each grandchild in 2026?', a: `Yes. Each spouse has a ${usd(g6.annual)} annual exclusion per recipient, so together you can give ${usd(2 * g6.annual)} to each grandchild. If the money comes from one spouse's account, you must elect gift splitting on Form 709, even though no tax is due. If each spouse gives ${usd(g6.annual)} from his or her own funds, no return is needed.` },
    { q: 'Does paying my grandchild’s college tuition count toward the gift tax limit?', a: `No, if you pay the school directly. Tuition paid to an educational institution and medical expenses paid to a provider are excluded from gift tax without any dollar limit, and they do not use your ${usd(g6.annual)} annual exclusion. Money given to the grandchild to pay the tuition, or paid for books and housing, is an ordinary gift and counts.` },
  ],
  body: (h) => `
<h2>Annual exclusion and lifetime exemption, 2025 and 2026</h2>
${h.table(['Item', '2025', '2026'], [
  ['Annual exclusion per recipient', usd(g5.annual), usd(g6.annual)],
  ['Per recipient for a married couple splitting gifts', usd(2 * g5.annual), usd(2 * g6.annual)],
  ['Annual exclusion for a non-citizen spouse', usd(g5.nonCitizenSpouse), usd(g6.nonCitizenSpouse)],
  ['Lifetime basic exclusion (gifts and estate)', usd(Y(2025).estate.exclusion), usd(ex6)],
], 'Rev. Proc. 2024-40, Rev. Proc. 2025-32 sections 2.14 and 4.42', ['l', 'r', 'r'])}
<h2>Two limits, one shared exemption</h2>
<p>The annual exclusion renews every January 1 and applies separately to each recipient: a grandmother with five grandchildren can give each of them ${usd(g6.annual)} in 2026, ${usd(5 * g6.annual)} in all, without any return. Unused exclusion does not carry over to the next year. The lifetime exemption is a single amount for gifts during life and the estate at death combined: every dollar of taxable gifts reported on Form 709 reduces what is left for the ${h.a('estate-tax-exemption', 'estate tax exclusion')}. Under the 2025 law the basic exclusion becomes ${usd(ex6)} for 2026, indexed afterward, instead of falling by half as it would have after 2025.</p>
<h2>What counts as a gift</h2>
<p>Any transfer for less than full value: cash, a car, shares, a house sold to a child below market, forgiving a loan, adding someone as a joint owner of an account they then draw on. Gifts of future interests, such as most transfers into a trust that the beneficiary cannot use now, do not qualify for the annual exclusion and always require a Form 709. Shares given keep the donor's cost basis, so the recipient pays ${h.a('capital-gains-tax-rates', 'capital gains tax')} on the full gain when selling; a child may also face the ${h.a('kiddie-tax', 'kiddie tax')} on the income.</p>
<h2>Filing Form 709</h2>
<p>A gift tax return is required when gifts to one person exceed the annual exclusion, when spouses split gifts, or when a gift of a future interest is made. It can now be e-filed. Most returns show no tax at all, only the use of the lifetime exemption, and they create the record that later supports the estate return.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('rp2440')}; ${h.src('gift')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['estate-tax-exemption', 'kiddie-tax', 'capital-gains-tax-rates', 'one-big-beautiful-bill-tax-changes', 'tax-deadline'],
  sources: ['rp2532', 'rp2440', 'gift', 'estate'],
});
