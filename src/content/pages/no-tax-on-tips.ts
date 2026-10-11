import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, day, P } from '../../lib/kit';

const t6 = Y(2026).tips;
const server = E.tipsDeduction(2026, 'single', 18000, 52000);
const saved = (() => { const std = Y(2026).standard.single; return E.incomeTax(2026, 'single', 52000 - std).tax - E.incomeTax(2026, 'single', 52000 - std - server.deduction).tax; })();
const ficaRate = S.fica.socialSecurity + S.fica.medicare;
const high = E.tipsDeduction(2026, 'single', 25000, 210000);

export default definePage({
  id: 'no-tax-on-tips',
  group: 'deductions',
  kind: 'tool',
  order: 20,
  slug: 'no-tax-on-tips',
  nav: 'No tax on tips',
  card: 'The tips deduction of Schedule 1-A: cap, phase-out and the tax it really saves.',
  title: `No Tax on Tips 2026: Deduct Up to ${usd(t6.max)}, See Your Savings`,
  description: `No tax on tips for 2025 to 2028: deduct up to ${usd(t6.max)} of qualified tips, minus $100 per $1,000 of MAGI over ${usd(t6.phaseStart.single)}. Calculate what it saves you in 2026.`,
  h1: 'No tax on tips: the deduction and what it is worth',
  intro: 'A deduction, not an exemption: how much of your tips it covers and how much federal income tax it removes.',
  resume: `No tax on tips is a deduction of up to ${usd(t6.max)} a year of qualified tips, created by section 70201 of Public Law 119-21 for tax years 2025 through 2028 and claimed on Part II of Schedule 1-A. It lowers taxable income, not the tips themselves: Social Security and Medicare taxes of ${ficaRate}% are still withheld, and each state decides its own income tax. The deduction shrinks by $100 for every full $1,000 of modified adjusted gross income above ${usd(t6.phaseStart.single)}, or ${usd(t6.phaseStart.mfj)} on a joint return, so the full ${usd(t6.max)} is gone at ${usd(t6.phaseStart.single + t6.max * 10)} for a single filer. A server with ${usd(18000)} of reported tips and ${usd(52000)} of modified AGI deducts all ${usd(server.deduction)} and saves about ${usd(saved)} of federal income tax in 2026, because each deducted dollar is worth her marginal rate. Tips must be received in an occupation on the IRS list of tipped occupations, the worker needs a valid Social Security number and a married couple must file jointly.`,
  tool: 'tips',
  faqs: [
    { q: 'Do I still pay Social Security and Medicare tax on tips under no tax on tips?', a: `Yes. The deduction only removes tips from taxable income for federal income tax. Your employer keeps withholding ${S.fica.socialSecurity}% for Social Security and ${S.fica.medicare}% for Medicare on reported tips, and a self-employed worker still owes self-employment tax on them. On ${usd(18000)} of tips that payroll tax is about ${usd((18000 * ficaRate) / 100)}, the same as before the law.` },
    { q: 'Where do I find my qualified tips on my W-2?', a: `For 2025, the IRS lets employees use tips in box 7 of Form W-2 (social security tips), plus tips reported on Form 4137, under Notice 2025-69. For 2026 the W-2 reports qualified tips in box 12 with code TP and the Treasury tipped occupation code in box 14b; Forms 1099-NEC, 1099-MISC and 1099-K have their own boxes for the self-employed.` },
    { q: 'I make $210,000 as a single filer. How much of my tips can I deduct?', a: `At ${usd(210000)} of modified AGI you are ${usd(210000 - t6.phaseStart.single)} over the ${usd(t6.phaseStart.single)} threshold, which is ${(210000 - t6.phaseStart.single) / 1000} full steps of $1,000. Each step removes $100, a reduction of ${usd(high.reduction)}. With ${usd(25000)} of qualified tips your deduction falls to ${usd(high.deduction)}. It reaches zero at ${usd(high.gone)} of modified AGI for a single filer with the maximum in tips.` },
    { q: 'Which jobs count for the no tax on tips deduction?', a: `Only occupations that customarily and regularly received tips on or before December 31, 2024, on the list the Treasury published in final regulations. Servers, bartenders, hairstylists, delivery drivers and many others are on it. A worker, or the employer, in a specified service trade or business such as health, law or performing arts is excluded, with transition relief for 2025.` },
  ],
  body: (h) => `
<h2>The Schedule 1-A arithmetic, line by line</h2>
<p>Part II of Schedule 1-A takes qualified tips received as an employee (line 4) and as a self-employed worker (line 5, never more than the net profit of that business), keeps the smaller of the total and ${usd(t6.max)} (line 7), then compares your modified AGI with ${usd(t6.phaseStart.single)} or ${usd(t6.phaseStart.mfj)} (lines 8 to 10). The excess is divided by $1,000 and the result is rounded down to a whole number (line 11): ${usd(1500)} over the threshold counts as one step, not one and a half. Each step removes $100 (line 12). Modified AGI here is Form 1040 line 11b plus excluded foreign income, so the tips themselves are already inside it.</p>
${h.table(['Modified AGI (single)', 'Tips', 'Reduction', 'Deduction'], [usd(140000), usd(155000), usd(175000), usd(250000), usd(400000)].map((_, i) => { const m = [140000, 155000, 175000, 250000, 400000][i]; const d = E.tipsDeduction(2026, 'single', 25000, m); return [usd(m), usd(25000), usd(d.reduction), usd(d.deduction)]; }), 'Computed with the Schedule 1-A rules for a single filer with $25,000 of qualified tips', ['l', 'r', 'r', 'r'])}
<h2>What the deduction saves depends on your bracket</h2>
<p>A deduction removes income from the top of your tax bill, at your marginal rate. Most tipped workers sit in the 10% or 12% bracket, so ${usd(10000)} of deducted tips saves ${usd(1000)} to ${usd(1200)}, not ${usd(10000)}. A bartender in the 22% bracket saves ${usd(2200)} on the same amount. Workers whose income is low enough to owe no income tax gain nothing from the deduction, and the ${h.a('earned-income-credit', 'earned income credit')} is unaffected because it is based on earned income, which still includes the tips.</p>
${h.mini('schedule1a')}
<h2>Married, separated, self-employed</h2>
<p>A married couple must file jointly; ${h.a('married-filing-separately-brackets', 'married filing separately')} loses the deduction entirely. The ${usd(t6.max)} cap is per return, not per spouse, so two servers married to each other share one ${usd(t6.max)}. A self-employed hairstylist can deduct tips up to the net profit of the business, and a delivery driver paid tips through an app can use a daily tip log when the Form 1099-K does not separate them, as in the IRS example of Notice 2025-69. The same return can also claim ${h.a('no-tax-on-overtime', 'no tax on overtime')}.</p>
<p>Sources: ${h.src('sch1a')}; ${h.src('ir25114')}; ${h.src('es2026', 'Form 1040-ES (2026), changes to information returns for qualified tips')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['no-tax-on-overtime', 'schedule-1-a', 'one-big-beautiful-bill-tax-changes', 'fica-tax-rate', 'tax-refund-calculator'],
  sources: ['sch1a', 'ir25114', 'wftc', 'fs2503', 'es2026', 'law'],
});
