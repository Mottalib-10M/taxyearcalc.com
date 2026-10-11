import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const f6 = Y(2026).feie; const f5 = Y(2025).feie;
const ex = E.feie(2026, 'single', 150000, 0, 365);
const part = E.feie(2026, 'single', 90000, 0, 200);

export default definePage({
  id: 'foreign-earned-income-exclusion',
  group: 'estates',
  kind: 'tool',
  order: 50,
  slug: 'foreign-earned-income-exclusion',
  nav: 'Foreign earned income exclusion',
  card: 'The $132,900 exclusion for Americans working abroad in 2026, and the stacking rule.',
  title: `Foreign Earned Income Exclusion 2026: ${usd(f6)} for Expats`,
  description: `Foreign earned income exclusion 2026: up to ${usd(f6)} of foreign wages (${usd(f5)} for 2025), prorated by days abroad, with the stacking rule. Estimate US tax.`,
  h1: 'The foreign earned income exclusion for 2026',
  intro: 'How much salary earned abroad a US citizen or resident can leave off the federal return, and what is still taxed.',
  resume: `US citizens and resident aliens are taxed on worldwide income, but those who live and work abroad can exclude up to ${usd(f6)} of foreign earned income from federal income tax for 2026, under section 4.39 of Rev. Proc. 2025-32 (${usd(f5)} for 2025). To qualify, your tax home must be in a foreign country and you must pass either the bona fide residence test (a full tax year as a resident abroad) or the physical presence test (330 full days abroad in any 12-month period). The exclusion is prorated by the qualifying days in the year, and it is claimed on Form 2555. Income above the exclusion is taxed at the rates that would apply if the excluded income were still included, the stacking rule: an engineer in Dubai earning ${usd(150000)} for the whole of 2026 excludes ${usd(ex.excluded)}, and the remaining income is taxed starting in a higher bracket, ${usd(ex.tax)} of federal tax instead of ${usd(ex.withoutExclusion)} without the exclusion. The exclusion does not cover Social Security or Medicare taxes, investment income or US-source wages, and excluded income is added back for the Schedule 1-A phase-outs.`,
  tool: 'feie',
  faqs: [
    { q: 'What is the foreign earned income exclusion for 2026?', a: `${usd(f6)} per qualifying person for a full year abroad, up from ${usd(f5)} for 2025, per Rev. Proc. 2025-32. A married couple both working abroad can each exclude up to that amount from their own earnings. A housing exclusion or deduction for foreign housing costs can be added on Form 2555, computed separately from the earned income exclusion.` },
    { q: 'How is the exclusion prorated if I moved abroad mid-year?', a: `By the number of qualifying days in the tax year divided by 365. Someone who qualifies for 200 days of 2026 can exclude up to ${usd(part.max)}. With ${usd(90000)} of foreign salary in that period, ${usd(part.excluded)} is excluded and the rest stays taxable. The qualifying period can start once you meet the physical presence or bona fide residence test.` },
    { q: 'Does excluded foreign income count toward the tips or SALT phase-outs?', a: `Yes. Modified AGI for the Schedule 1-A deductions and for the SALT cap adds back income excluded on Form 2555, according to the Schedule 1-A and Schedule A worksheets. An American abroad who also receives tips or overtime on US wages, or pays state and local taxes, measures those phase-outs on income including the excluded amount.` },
  ],
  body: (h) => `
<h2>What the stacking rule does</h2>
<p>Without stacking, excluded salary would push the remaining income down into the 10% and 12% brackets. The Foreign Earned Income Tax Worksheet prevents that: it computes the tax on taxable income plus the excluded amount, then subtracts the tax on the excluded amount alone. The income you keep on the return is therefore taxed at the rates of the top of your total income. The table shows the effect for a single filer abroad all year, with the ${usd(Y(2026).standard.single)} standard deduction.</p>
${h.table(['Foreign salary', 'Excluded', 'Taxable after exclusion', 'US tax with exclusion', 'US tax without'], [100000, 150000, 200000, 300000].map((w) => { const r = E.feie(2026, 'single', w, 0, 365); return [usd(w), usd(r.excluded), usd(r.taxableAfter), usd(r.tax), usd(r.withoutExclusion)]; }), '2026, single, no other income, no foreign tax credit', ['l', 'r', 'r', 'r', 'r'])}
<h2>The two tests and the tax home</h2>
<p>The bona fide residence test requires residence in a foreign country for an uninterrupted period that includes a whole tax year; the physical presence test requires 330 full days in foreign countries during any 12 consecutive months, which can straddle two tax years. In both cases your tax home must be abroad: you work there for an indefinite rather than temporary period and your abode is not in the United States. Short trips home count against the 330 days.</p>
<h2>Exclusion or foreign tax credit</h2>
<p>An expat in a country with income tax rates similar to or higher than US rates often prefers the foreign tax credit, which offsets US tax with foreign tax paid and keeps the income on the return (useful for IRA contributions or the child tax credit refund). In a country with no income tax, such as the United Arab Emirates, the exclusion is usually the tool, since there is no foreign tax to credit. The IRS has specific rules on choosing and revoking the exclusion, so the choice deserves a two-way calculation before the first return that uses it.</p>
<h2>What the exclusion leaves taxable</h2>
<p>Interest, dividends, ${h.a('capital-gains-tax-rates', 'capital gains')}, rental income and US wages remain fully taxable. The exclusion reduces regular income tax on self-employed income abroad but not self-employment tax, according to the IRS. Pay from the US government, pensions and Social Security are never foreign earned income. The ${h.a('schedule-1-a', 'Schedule 1-A')} and ${h.a('salt-deduction', 'SALT')} worksheets add it back to modified AGI.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('rp2440')}; ${h.src('sch1a')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-brackets', 'schedule-1-a', 'capital-gains-tax-rates', 'tax-extension', 'fica-tax-rate'],
  sources: ['feie', 'rp2532', 'rp2440', 'sch1a'],
});
