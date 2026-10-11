import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const a6 = Y(2026).amt; const a5 = Y(2025).amt;
const ex = E.amt(2026, 'mfj', 1100000);

export default definePage({
  id: 'alternative-minimum-tax',
  group: 'rates',
  kind: 'tool',
  order: 110,
  slug: 'alternative-minimum-tax',
  nav: 'Alternative minimum tax',
  card: 'The 2026 AMT exemption, the faster phase-out from $500,000 and who it now reaches.',
  title: `Alternative Minimum Tax 2026: ${usd(a6.exemption.single)} Exemption, Phase-Out`,
  description: `Alternative minimum tax 2026: exemption ${usd(a6.exemption.single)} single and ${usd(a6.exemption.mfj)} joint, phased out at 50% from ${usd(a6.phaseStart.single)} and ${usd(a6.phaseStart.mfj)}. Check whether you owe the AMT.`,
  h1: 'The alternative minimum tax in 2026',
  intro: 'A parallel tax with its own exemption and two rates, which for 2026 starts to bite at lower incomes than in 2025.',
  resume: `The alternative minimum tax is a second computation of income tax with fewer deductions, a large exemption and two rates, 26% and 28%; you pay whichever of the regular tax and the tentative minimum tax is higher. For 2026 the exemption is ${usd(a6.exemption.single)} for single filers and heads of household, ${usd(a6.exemption.mfj)} for married couples filing jointly and ${usd(a6.exemption.mfs)} married filing separately, and the 28% rate starts above ${usd(a6.rate28Start.single)} of AMT base (Rev. Proc. 2025-32 section 4.10). The exemption phases out from ${usd(a6.phaseStart.single)} of alternative minimum taxable income single and ${usd(a6.phaseStart.mfj)} joint, at ${a6.phaseRate} cents per dollar, and is gone at ${usd(a6.phaseEnd.single)} and ${usd(a6.phaseEnd.mfj)}. Public Law 119-21 made the higher exemption permanent but brought the thresholds back from ${usd(a5.phaseStart.single)} and ${usd(a5.phaseStart.mfj)} in 2025 and doubled the phase-out rate from ${a5.phaseRate}%, so more high earners meet the AMT in 2026. Typical triggers: exercising incentive stock options, large state and local taxes added back, private activity bond interest.`,
  tool: 'amt',
  faqs: [
    { q: 'Why might I owe AMT in 2026 when I did not in 2025?', a: `Because the exemption now shrinks sooner and faster. In 2025 it started phasing out at ${usd(a5.phaseStart.mfj)} for a couple, at 25 cents per dollar; in 2026 it starts at ${usd(a6.phaseStart.mfj)} at 50 cents per dollar. A couple with ${usd(1100000)} of AMT income keeps only ${usd(ex.exemption)} of exemption in 2026. The higher SALT deduction, added back for the AMT, can also widen the gap.` },
    { q: 'Do incentive stock options trigger the alternative minimum tax?', a: `They often do. When you exercise incentive stock options and keep the shares past the end of the year, the spread between the market value and the exercise price is not regular income but is added to alternative minimum taxable income on Form 6251. A large spread can lift the tentative minimum tax above the regular tax. The AMT paid can create a credit for later years.` },
    { q: 'What deductions are not allowed under the AMT?', a: `The main add-back for most people is state and local taxes deducted on Schedule A, now up to ${usd(Y(2026).salt.cap)} instead of ${usd(10000)}. The standard deduction is not allowed either, which matters little because AMT payers usually itemize. Mortgage interest on a home purchase and charitable gifts remain deductible. Form 6251 lists every adjustment.` },
  ],
  body: (h) => `
<h2>The 2026 and 2025 figures</h2>
${h.table(['Item', '2026 single', '2026 joint', '2025 single', '2025 joint'], [
  ['Exemption', usd(a6.exemption.single), usd(a6.exemption.mfj), usd(a5.exemption.single), usd(a5.exemption.mfj)],
  ['Phase-out starts', usd(a6.phaseStart.single), usd(a6.phaseStart.mfj), usd(a5.phaseStart.single), usd(a5.phaseStart.mfj)],
  ['Exemption gone at', usd(a6.phaseEnd.single), usd(a6.phaseEnd.mfj), usd(a5.phaseEnd.single), usd(a5.phaseEnd.mfj)],
  ['28% rate above', usd(a6.rate28Start.single), usd(a6.rate28Start.mfj), usd(a5.rate28Start.single), usd(a5.rate28Start.mfj)],
], 'Rev. Proc. 2025-32 section 4.10 and Rev. Proc. 2024-40 section 2.11', ['l', 'r', 'r', 'r', 'r'])}
<h2>How the computation runs</h2>
<p>Start from regular taxable income, add back the items the AMT does not allow (state and local taxes, the incentive stock option spread, private activity bond interest, some depreciation differences), and you have alternative minimum taxable income. Subtract the exemption left after the phase-out, then tax the result at 26% up to ${usd(a6.rate28Start.single)} and 28% above, with long-term gains still at their ${h.a('capital-gains-tax-rates', '0%, 15% and 20%')} rates. If this tentative minimum tax exceeds the regular tax, the difference is the AMT, added on Schedule 2. The calculator handles the ordinary-income part; Form 6251 separates the gains.</p>
<h2>The AMT credit</h2>
<p>AMT caused by timing items, such as the stock option spread or depreciation differences, generates a minimum tax credit on Form 8801 that can reduce regular tax in later years when the regular tax is higher than the tentative minimum tax. AMT caused by permanent items, such as state and local taxes, creates no credit. Keeping the Form 6251 of each year matters for that reason.</p>
<h2>Who should run the check</h2>
<p>Households with AMT income in or above the phase-out range, roughly ${usd(a6.phaseStart.single)} single or ${usd(a6.phaseStart.mfj)} joint, especially in high-tax states now that the ${h.a('salt-deduction', 'SALT deduction')} can reach ${usd(Y(2026).salt.cap)} below ${usd(Y(2026).salt.threshold)} of modified AGI; employees exercising incentive stock options of any size; investors with large private activity bond interest. Most households under the phase-out start never pay it, because the exemption covers the add-backs. Each item of the AMT computation is reported on Form 6251.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('rp2440')}; ${h.src('wftc')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-brackets', 'salt-deduction', 'capital-gains-tax-rates', 'one-big-beautiful-bill-tax-changes', 'itemized-vs-standard-deduction'],
  sources: ['rp2532', 'rp2440', 'wftc', 'law'],
});
