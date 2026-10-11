import { definePage } from '../../lib/page-types';
import { E, Y, usd, num, day, P } from '../../lib/kit';

const y6 = Y(2026); const std = y6.standard.single;
const br = y6.brackets.single as Array<[number | null, number]>;
const at = (gross: number) => E.incomeTax(2026, 'single', gross - std);

export default definePage({
  id: 'single-tax-brackets',
  group: 'rates',
  kind: 'tool',
  order: 30,
  slug: 'single-tax-brackets',
  nav: 'Brackets: single',
  card: 'The 2026 brackets for single filers, with the tax and average rate at common incomes.',
  title: 'Tax Brackets 2026 Single: Every Rate and Your Tax Bill',
  description: `Tax brackets 2026 for single filers: 10% to ${usd(br[0][0] as number)}, 22% from ${usd(br[1][0] as number)}, 24% from ${usd(br[2][0] as number)}, 37% over ${usd(br[5][0] as number)}, after the ${usd(std)} standard deduction for one.`,
  h1: 'Tax brackets for single filers in 2026',
  intro: 'One person, one set of thresholds: the 2026 single schedule and what it takes from typical salaries.',
  resume: `A single filer in 2026 pays 10% on the first ${usd(br[0][0] as number)} of taxable income, 12% up to ${usd(br[1][0] as number)}, 22% up to ${usd(br[2][0] as number)}, 24% up to ${usd(br[3][0] as number)}, 32% up to ${usd(br[4][0] as number)}, 35% up to ${usd(br[5][0] as number)} and 37% above, according to Rev. Proc. 2025-32. Taxable income is what remains after the ${usd(std)} standard deduction or itemized deductions, and after any Schedule 1-A deduction. So a single worker earning ${usd(50000)} has ${usd(50000 - std)} of taxable income, stays in the 12% bracket and owes ${usd(at(50000).tax)}, while one earning ${usd(100000)} reaches the 22% bracket and owes ${usd(at(100000).tax)}, an average of ${num(at(100000).average, 1)}% of taxable income. You file as single if you are unmarried or legally separated on December 31 and do not qualify as head of household or qualifying surviving spouse. The 35% bracket is the widest of the schedule: it runs ${usd((br[5][0] as number) - (br[4][0] as number))} for a single filer, which is why two high earners can pay less tax unmarried than married.`,
  tool: 'brackets',
  toolArg: { year: 2026, status: 'single', income: 70000 },
  faqs: [
    { q: 'What is the highest tax bracket for a single person in 2026?', a: `37%, on taxable income above ${usd(br[5][0] as number)}. Below that, the 35% rate applies from ${usd(br[4][0] as number)}. Because only income above each threshold is taxed at the higher rate, a single filer with ${usd(700000)} of taxable income pays ${usd(E.incomeTax(2026, 'single', 700000).tax)}, an average of ${num(E.incomeTax(2026, 'single', 700000).average, 1)}%, not 37% of everything.` },
    { q: 'At what salary does a single filer move from 12% to 22% in 2026?', a: `When taxable income passes ${usd(br[1][0] as number)}. With only the ${usd(std)} standard deduction, that is a salary of about ${usd((br[1][0] as number) + std)}. Pre-tax 401(k) deferrals, HSA contributions and the overtime or tips deductions push the crossing point higher, because they come off before the brackets apply.` },
    { q: 'Should a single parent file as single or head of household?', a: `Head of household if you qualify: unmarried at year end, paying more than half the cost of keeping up a home where a qualifying child or relative lived more than half the year. It gives a ${usd(y6.standard.hoh)} standard deduction instead of ${usd(std)} and a wider 10% and 12% band, ${usd(y6.brackets.hoh[1][0] as number)} instead of ${usd(br[1][0] as number)}.` },
  ],
  body: (h) => `
<h2>What a single filer owes at common salaries</h2>
${h.table(['Salary', 'Taxable income', 'Marginal bracket', 'Income tax', 'Share of salary'], [30000, 50000, 75000, 100000, 150000, 250000].map((g) => { const r = at(g); return [usd(g), usd(g - std), `${r.marginal}%`, usd(r.tax), `${num((r.tax / g) * 100, 1)}%`]; }), 'Single filer, 2026 standard deduction only, before credits', ['l', 'r', 'r', 'r', 'r'])}
<p>The last column is the share of gross salary that goes to federal income tax, often half of what people guess from their bracket. Social Security and Medicare, ${h.a('fica-tax-rate', '7.65% for an employee')}, come on top and are not shown here.</p>
<h2>Single, and the widest bracket of the schedule</h2>
<p>For single filers the 35% band stretches from ${usd(br[4][0] as number)} to ${usd(br[5][0] as number)}. On a joint return it ends at ${usd(y6.brackets.mfj[5][0] as number)}, much less than twice the single figure. Two partners each earning ${usd(400000)} of taxable income pay 35% on their top dollars as singles but reach 37% sooner once married. Below the 32% bracket the joint thresholds are exactly double the single ones, so most couples see no penalty at all; see the ${h.a('married-filing-jointly-brackets', 'married filing jointly')} page.</p>
<h2>Bonuses, raises and the bracket edge</h2>
<p>A raise that crosses a threshold is taxed at the higher rate only on the part above it. A single worker with ${usd(60000)} of salary who receives a ${usd(5000)} bonus has ${usd(60000 + 5000 - std)} of taxable income: the whole bonus falls in the 22% bracket and adds ${usd(at(65000).tax - at(60000).tax)} of income tax. Withholding on bonuses often runs at a flat 22% for supplemental wages, so the refund or balance due at filing time settles any difference with the real bracket.</p>
<h2>Things only a single return has</h2>
<p>A single filer has the lowest phase-out thresholds for income-based benefits: the ${h.a('no-tax-on-tips', 'tips')} and ${h.a('no-tax-on-overtime', 'overtime')} deductions shrink from ${usd(y6.tips.phaseStart.single)}, the ${h.a('senior-deduction', 'senior deduction')} from ${usd(y6.senior.phaseStart.single)}, the ${h.a('roth-ira-income-limit', 'Roth IRA')} from ${usd(y6.retirement.rothPhase.single[0])}. The ${h.a('salt-deduction', 'SALT cap')} is the same ${usd(y6.salt.cap)} as for a married couple, which makes itemizing relatively easier for a single homeowner. The additional standard deduction at 65 is ${usd(y6.agedBlind.unmarried)}, higher than the married amount per person.</p>
<p>Source: ${h.src('rp2532')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-brackets', 'head-of-household-brackets', 'married-filing-jointly-brackets', 'standard-deduction', 'marginal-vs-effective-tax-rate'],
  sources: ['rp2532', 'law', 'wftc'],
});
