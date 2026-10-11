import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, day, P } from '../../lib/kit';

const c6 = Y(2026).capitalGains; const c5 = Y(2025).capitalGains;
const ex = E.capitalGainsTax(2026, 'mfj', 70000, 40000);

export default definePage({
  id: 'capital-gains-tax-rates',
  group: 'rates',
  kind: 'tool',
  order: 80,
  slug: 'capital-gains-tax-rates',
  nav: 'Capital gains rates',
  card: 'The 0%, 15% and 20% bands for 2026 and 2025, stacked on top of ordinary income.',
  title: `Capital Gains Tax Rates 2026: 0% Up to ${usd(c6.zeroTop.mfj)} Joint`,
  description: `Capital gains tax rates 2026: 0% up to ${usd(c6.zeroTop.single)} single or ${usd(c6.zeroTop.mfj)} joint, 15% to ${usd(c6.fifteenTop.single)} single, 20% above, plus the 3.8% NIIT. Compute your gains tax.`,
  h1: 'Long-term capital gains tax rates for 2026',
  intro: 'Three rates for assets held more than a year, set by taxable income bands, with your wages filling the bands first.',
  resume: `Long-term capital gains and qualified dividends are taxed at 0%, 15% or 20% depending on taxable income, with 2026 bands from section 4.03 of Rev. Proc. 2025-32. The 0% rate applies up to ${usd(c6.zeroTop.single)} of taxable income for a single filer, ${usd(c6.zeroTop.mfj)} for a married couple filing jointly and ${usd(c6.zeroTop.hoh)} for a head of household; the 15% rate up to ${usd(c6.fifteenTop.single)}, ${usd(c6.fifteenTop.mfj)} and ${usd(c6.fifteenTop.hoh)}; 20% above. For 2025 the 0% band ended at ${usd(c5.zeroTop.single)} single and ${usd(c5.zeroTop.mfj)} joint. Gains sit on top of ordinary income: wages and interest fill the bands first, and only the room left at 0% shelters the gains. A couple with ${usd(70000)} of ordinary taxable income and ${usd(40000)} of long-term gains has ${usd(ex.at0)} taxed at 0% and ${usd(ex.at15)} at 15%, ${usd(ex.tax)} in all. Above ${usd(S.niit.threshold.single)} of modified AGI single or ${usd(S.niit.threshold.mfj)} joint, a further ${S.niit.rate}% net investment income tax applies. Short-term gains, on assets held a year or less, are taxed as ordinary income.`,
  tool: 'capitalGains',
  faqs: [
    { q: 'How much capital gain can I take tax-free in 2026?', a: `As much as fits under the 0% ceiling after your other taxable income. A married couple with ${usd(60000)} of taxable wages and pension has ${usd(c6.zeroTop.mfj - 60000)} of room before ${usd(c6.zeroTop.mfj)}, so that much of long-term gain is taxed at 0%. Gains above the room move into the 15% band. The standard deduction is already subtracted from taxable income, which enlarges the room.` },
    { q: 'Does selling stock at a gain push my salary into a higher bracket?', a: `No. Ordinary income is taxed first through the regular brackets, and the gains are added on top through their own 0%, 15% and 20% bands. A large gain cannot raise the rate on your wages. It can, however, raise modified AGI, which matters for the 3.8% net investment income tax and for income-based limits such as the Roth IRA range or the senior deduction.` },
    { q: 'What capital gains rate applies to collectibles and real estate depreciation?', a: `Gains on collectibles such as coins, art and precious metals are taxed at a maximum of ${S.capitalGainsRates.collectibles}%, and the part of a real estate gain that recaptures straight-line depreciation (unrecaptured section 1250 gain) at a maximum of ${S.capitalGainsRates.unrecaptured1250}%, according to IRS Topic 409. The calculator on this page does not separate those two categories.` },
  ],
  body: (h) => `
<h2>The 2026 and 2025 bands</h2>
${h.table(['Filing status', '0% up to (2026)', '15% up to (2026)', '0% up to (2025)', '15% up to (2025)'], (['single', 'mfj', 'hoh', 'mfs'] as const).map((s) => [({ single: 'Single', mfj: 'Married filing jointly', hoh: 'Head of household', mfs: 'Married filing separately' })[s], usd(c6.zeroTop[s]), usd(c6.fifteenTop[s]), usd(c5.zeroTop[s]), usd(c5.fifteenTop[s])]), 'Taxable income limits, Rev. Proc. 2025-32 section 4.03 and Rev. Proc. 2024-40 section 2.03', ['l', 'r', 'r', 'r', 'r'])}
<p>The limits are expressed in taxable income, after the standard or itemized deduction, not in gains. A single retiree with a ${usd(30000)} pension and ${usd(30000)} of gains has ${usd(60000 - Y(2026).standard.single)} of taxable income: ${usd(E.capitalGainsTax(2026, 'single', 30000 - Y(2026).standard.single, 30000).at0)} of the gains fall at 0%.</p>
<h2>Stacking, step by step</h2>
<p>The Qualified Dividends and Capital Gain Tax Worksheet of Form 1040 separates taxable income into two parts: ordinary income, taxed through the ${h.a('tax-brackets', 'regular brackets')}, and net capital gain, taxed through the bands above. Gains start where ordinary income ends. With ${usd(70000)} of ordinary taxable income, a couple's gains begin at ${usd(70000)} and fill the remaining ${usd(c6.zeroTop.mfj - 70000)} of the 0% band before moving to 15%. That ordering makes a low-income year, a sabbatical or early retirement before Social Security, the cheapest time to realize gains.</p>
<h2>Gifts, inheritances and the step-up</h2>
<p>Shares given during life keep the donor's purchase price, so the person who receives them and sells them pays tax on the whole gain, at the recipient's rates; a child or grandchild may also face the ${h.a('kiddie-tax', 'kiddie tax')}. Shares inherited at death generally take their value on the date of death, which wipes out the gain built up during the deceased owner's life. That difference shapes many estate plans, alongside the ${h.a('estate-tax-exemption', 'estate tax exclusion')}.</p>
<h2>The 3.8% surtax and the holding period</h2>
<p>The net investment income tax adds ${S.niit.rate}% on the lesser of net investment income and the amount by which modified AGI exceeds ${usd(S.niit.threshold.single)} single, ${usd(S.niit.threshold.mfj)} joint or ${usd(S.niit.threshold.mfs)} separately. Those thresholds are fixed in the statute and do not rise with inflation. A gain counts as long-term when the asset was held more than one year; the day after purchase starts the count.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('tc409')}; ${h.src('niit')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-brackets', 'marginal-vs-effective-tax-rate', 'estimated-tax-payments', 'gift-tax-limit', 'kiddie-tax'],
  sources: ['rp2532', 'tc409', 'niit', 'rp2440'],
});
