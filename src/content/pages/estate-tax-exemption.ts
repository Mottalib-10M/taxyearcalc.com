import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, day, P } from '../../lib/kit';

const e6 = Y(2026).estate.exclusion; const e5 = Y(2025).estate.exclusion;
const ex = E.estateTax(2026, 18000000);
const couple = E.estateTax(2026, 25000000, 0, e6);

export default definePage({
  id: 'estate-tax-exemption',
  group: 'estates',
  kind: 'tool',
  order: 20,
  slug: 'estate-tax-exemption',
  nav: 'Estate tax exemption',
  card: 'The $15 million exclusion for 2026, portability between spouses and the 40% rate above it.',
  title: `Estate Tax Exemption 2026: ${usd(e6 / 1e6)} Million per Person, Indexed`,
  description: `Estate tax exemption 2026: ${usd(e6 / 1e6)} million per person, ${usd(2 * e6 / 1e6)} million for a couple with portability, up from ${usd(e5)}, and ${S.estateRate.top}% above it. Estimate the tax.`,
  h1: 'The federal estate tax exemption in 2026',
  intro: 'How much an estate can pass free of federal estate tax, and how the tax is figured above that amount.',
  resume: `For people dying in 2026, the federal estate tax basic exclusion is ${usd(e6)}, set by section 70106 of Public Law 119-21 and confirmed by Rev. Proc. 2025-32 (${usd(e5)} for 2025 deaths). The amount will be indexed for inflation from 2027 instead of falling by roughly half, as it was scheduled to under the 2017 law. Only the part of a taxable estate, plus lifetime taxable gifts, above the exclusion is taxed, at a top rate of ${S.estateRate.top}%: an estate of ${usd(18000000)} with no prior taxable gifts owes about ${usd(ex.tax)}. Married couples can effectively double the exclusion: the unused exclusion of the first spouse to die passes to the survivor when the executor elects portability on a timely estate tax return, so a couple can shelter up to ${usd(2 * e6)}; a widow with ${usd(25000000)} and her late husband's full unused exclusion would owe ${usd(couple.tax)}. Property left to a US citizen spouse or to charity is deducted before the tax. Some states levy their own estate or inheritance taxes with far lower thresholds.`,
  tool: 'estate',
  faqs: [
    { q: 'Is the $15 million estate tax exemption permanent?', a: `The 2025 law removed the scheduled drop: without it, the exclusion would have fallen back to about half its level after 2025. Section 70106 sets ${usd(e6)} for 2026 and indexes it for inflation from 2027, with no end date. A future Congress could still change it, as with any part of the tax code.` },
    { q: 'How does portability work for a married couple’s estate tax exemption?', a: `When the first spouse dies, the executor can elect on a timely filed Form 706 to pass the unused part of that spouse's exclusion to the survivor. The survivor can then use it for gifts or at death on top of his or her own ${usd(e6)}. The election requires filing the estate tax return even when no tax is due.` },
    { q: 'Do lifetime gifts reduce the estate tax exemption?', a: `Yes. Taxable gifts, the part of each gift above the ${usd(Y(2026).gift.annual)} annual exclusion reported on Form 709, use the same basic exclusion. Someone who made ${usd(3000000)} of taxable gifts during life has ${usd(e6 - 3000000)} left for the estate if death occurs in 2026. Gifts within the annual exclusion, tuition and medical payments made directly do not count.` },
  ],
  body: (h) => `
<h2>Exclusion amounts and what they mean</h2>
${h.table(['Year of death', 'Basic exclusion', 'With a spouse’s full unused exclusion'], [['2025', usd(e5), usd(2 * e5)], ['2026', usd(e6), usd(2 * e6)]], 'IRS: estate tax basic exclusion by year of death; Public Law 119-21 section 70106', ['l', 'r', 'r'])}
<h2>How the tax is figured</h2>
<p>The estate tax applies a graduated table to the taxable estate plus adjusted taxable gifts made after 1976, then subtracts a credit equal to the tax on the basic exclusion. Because the exclusion is far above the levels where the lower rates apply, everything above the exclusion ends up taxed at ${S.estateRate.top}%. The calculator uses that shortcut, which is exact when the exclusion is fully available. The taxable estate is the gross estate (everything owned at death, life insurance owned by the deceased, retirement accounts) minus debts, funeral and administration costs, the marital deduction and the charitable deduction.</p>
${h.table(['Taxable estate', '2025 death', '2026 death'], [10000000, 14000000, 16000000, 20000000, 30000000].map((v) => [usd(v), usd(E.estateTax(2025, v).tax), usd(E.estateTax(2026, v).tax)]), 'Federal estate tax, no prior taxable gifts, no portability', ['l', 'r', 'r'])}
<h2>Who must file Form 706</h2>
<p>An estate tax return is required when the gross estate plus adjusted taxable gifts exceeds the basic exclusion for the year of death, whether or not tax is owed after deductions. It is also needed, even for a small estate, when the surviving spouse wants the unused exclusion through portability. The return lists cumulative lifetime taxable gifts, which is why keeping each year's Form 709 matters. State estate taxes are separate and often start far lower.</p>
<h2>Gifts, the step-up and the generation-skipping tax</h2>
<p>Lifetime gifts and the estate share the exclusion, see the ${h.a('gift-tax-limit', 'gift tax page')}. Assets passed at death generally receive a new cost basis equal to their value at death, which erases the built-in capital gain, while gifted assets keep the donor's basis. The generation-skipping transfer tax exemption, for transfers to grandchildren and later generations, also equals ${usd(e6)} for 2026 under Rev. Proc. 2025-32.</p>
<p>Sources: ${h.src('estate')}; ${h.src('rp2532')}; ${h.src('law')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['gift-tax-limit', 'capital-gains-tax-rates', 'one-big-beautiful-bill-tax-changes', 'kiddie-tax', 'bonus-depreciation'],
  sources: ['estate', 'rp2532', 'law', 'gift'],
});
