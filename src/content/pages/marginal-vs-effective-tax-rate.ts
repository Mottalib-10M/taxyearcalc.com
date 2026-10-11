import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, num, day, P } from '../../lib/kit';

const y6 = Y(2026);
const nurse = E.fullReturn({ year: 2026, status: 'single', wages: 72000, otherIncome: 0, adjustments: 0, itemized: 0, age65: 0, kids: 0, tips: 0, overtimePremium: 0, withholding: 0 });
const fam = E.fullReturn({ year: 2026, status: 'mfj', wages: 110000, otherIncome: 0, adjustments: 0, itemized: 0, age65: 0, kids: 2, tips: 0, overtimePremium: 0, withholding: 0 });
const nurseBr = E.incomeTax(2026, 'single', nurse.taxable);
const ss = S.fica.socialSecurity + S.fica.medicare;

export default definePage({
  id: 'marginal-vs-effective-tax-rate',
  group: 'rates',
  kind: 'guide',
  order: 70,
  slug: 'marginal-vs-effective-tax-rate',
  nav: 'Marginal vs effective rate',
  card: 'Why your bracket is not the share of income you pay, with 2026 examples.',
  title: 'Marginal vs Effective Tax Rate 2026: Bracket vs Real Rate',
  description: `Marginal vs effective tax rate in 2026: a single nurse on ${usd(72000)} is in the ${nurseBr.marginal}% bracket but pays ${num(nurse.effective, 1)}% of AGI in federal income tax. See how the brackets fill.`,
  h1: 'Marginal tax rate and effective tax rate, explained with 2026 numbers',
  intro: 'Your bracket tells you what the next dollar costs; your effective rate tells you what the whole year cost.',
  resume: `Your marginal tax rate is the rate of the highest bracket your taxable income reaches: the tax on your next dollar. Your effective tax rate is your total federal income tax divided by your income: the share you actually pay. They differ because the brackets fill one after the other. In 2026 a single nurse earning ${usd(72000)} subtracts the ${usd(y6.standard.single)} standard deduction, has ${usd(nurse.taxable)} of taxable income and lands in the ${nurseBr.marginal}% bracket, yet her federal income tax is ${usd(nurse.taxAfter)}, an effective rate of ${num(nurse.effective, 1)}% of AGI. The first ${usd(y6.brackets.single[0][0] as number)} of her taxable income was taxed at 10%, the next slice at 12%, and only the part above ${usd(y6.brackets.single[1][0] as number)} at 22%. Credits pull the effective rate down further: a married couple with ${usd(110000)} of wages and two children is in the ${fam.marginal}% bracket but pays ${num(fam.effective, 1)}% of AGI after the child tax credit. Moving into a higher bracket never lowers your take-home pay; only the dollars above the threshold pay the higher rate.`,
  mini: 'brackets',
  miniArg: { year: 2026, status: 'single', income: 72000 },
  faqs: [
    { q: 'Can a raise ever leave me with less money because of a higher tax bracket?', a: `Not because of the brackets. A raise that pushes taxable income from ${usd(y6.brackets.single[2][0] as number)} to ${usd((y6.brackets.single[2][0] as number) + 2000)} for a single filer is taxed at 24% only on those ${usd(2000)}, so ${usd(1520)} of it remains before payroll taxes. Benefit cliffs outside the tax brackets, such as an income-tested subsidy that stops at a fixed income, can produce that effect, but the bracket system cannot.` },
    { q: 'Which rate should I use to estimate the value of a 401(k) contribution?', a: `Your marginal rate. A pre-tax 401(k) deferral comes off the top of your taxable income, so a single filer in the 22% bracket saves ${usd(220)} of federal income tax for each ${usd(1000)} deferred, as long as the contribution does not drop income into the 12% bracket. The effective rate would understate the saving because it averages in the low brackets.` },
    { q: 'Is my effective tax rate the same as the percentage withheld from my paycheck?', a: `Not exactly. Withholding uses IRS tables that approximate your annual tax from each paycheck, and it includes Social Security and Medicare at ${ss}% of wages, which are not income tax. Your effective income tax rate is known only when the return is done: total tax on Form 1040 divided by income. Refunds and balances due are the gap between the two.` },
    { q: 'What is the difference between effective tax rate and average tax rate?', a: `People use the two terms loosely. On this site the average rate is income tax divided by taxable income, the figure the bracket calculator shows, and the effective rate is income tax after credits divided by adjusted gross income, the figure the refund estimator shows. The second is lower because it counts the standard deduction and credits as part of the picture.` },
  ],
  body: (h) => `
<h2>How the brackets fill, slice by slice</h2>
<p>Picture taxable income as a column of water filling a set of stacked jars. The first jar holds ${usd(y6.brackets.single[0][0] as number)} for a single filer and is taxed at 10%. Once it is full, the next dollars pour into the 12% jar, which holds up to ${usd(y6.brackets.single[1][0] as number)} in total, then the 22% jar, and so on. The rate printed on a jar applies only to the water inside it. That is why "I am in the 22% bracket" never means "I pay 22% of my income".</p>
${h.table(['Slice of taxable income', 'Rate', 'Amount taxed', 'Tax'], nurseBr.rows.filter((r) => r.taxed > 0).map((r) => [r.to === null ? `over ${usd(r.from)}` : `${usd(r.from)} to ${usd(r.to)}`, `${r.rate}%`, usd(r.taxed), usd(r.tax)]), `Single filer in 2026 with ${usd(nurse.taxable)} of taxable income`, ['l', 'r', 'r', 'r'])}
<p>The three rows add up to ${usd(nurseBr.tax)}. Divided by taxable income, that is an average of ${num(nurseBr.average, 1)}%; divided by the ${usd(72000)} salary, ${num((nurseBr.tax / 72000) * 100, 1)}%. Both are far below the 22% marginal rate.</p>
<h2>Three rates people confuse</h2>
<p><strong>Marginal rate</strong>: the rate on the next dollar of taxable income. It is the number that matters for decisions at the edge, such as an extra shift, a ${h.a('401k-contribution-limit', '401(k) deferral')}, a ${h.a('roth-ira-income-limit', 'Roth conversion')} or a deduction. A deduction is worth its amount times the marginal rate.</p>
<p><strong>Average rate on taxable income</strong>: tax divided by taxable income, the measure the ${h.a('tax-brackets', 'bracket calculator')} shows. It rises smoothly with income and never reaches the top marginal rate.</p>
<p><strong>Effective rate</strong>: tax after credits divided by AGI or by total income. It includes the effect of the ${h.a('standard-deduction', 'standard deduction')}, of the Schedule 1-A deductions and of credits such as the ${h.a('child-tax-credit', 'child tax credit')}. Families with children often have effective rates near zero at incomes where their marginal rate is 12%.</p>
${h.mini('refundEstimate')}
<h2>When the marginal rate is higher than the bracket</h2>
<p>Some rules make the real cost of an extra dollar higher than the bracket rate, because the dollar also shrinks a deduction or credit. In 2026, inside the phase-out of the ${h.a('senior-deduction', 'senior deduction')}, each dollar of income above ${usd(y6.senior.phaseStart.single)} also removes six cents of deduction, so a retiree in the 22% bracket pays about 23.3 cents on that dollar. Inside the ${h.a('salt-deduction', 'SALT phase-down')}, between ${usd(y6.salt.threshold)} and the point where the cap reaches its floor, a dollar of income removes 30 cents of deduction for someone paying more state tax than the cap allows. The ${h.a('earned-income-credit', 'earned income credit')} shrinks as income rises in its phase-out range, which raises the marginal rate of low-income workers. Capital gains add their own layer: long-term gains use the 0%, 15% and 20% rates of the ${h.a('capital-gains-tax-rates', 'capital gains table')}, stacked above ordinary income.</p>
<h2>Same income, different statuses</h2>
<p>Filing status changes both rates at once. At ${usd(90000)} of income, a single filer is in the 22% bracket; a head of household, with a wider 12% band and a larger standard deduction, is in the 22% bracket too but pays ${usd(E.incomeTax(2026, 'single', 90000 - y6.standard.single).tax - E.incomeTax(2026, 'hoh', 90000 - y6.standard.hoh).tax)} less; a married couple with one income of ${usd(90000)} stays in the 12% bracket. The ${h.a('single-tax-brackets', 'single')}, ${h.a('head-of-household-brackets', 'head of household')} and ${h.a('married-filing-jointly-brackets', 'joint')} pages give the thresholds of each schedule.</p>
${h.table(['Status', 'Taxable income', 'Marginal', 'Tax', 'Average'], (['single', 'hoh', 'mfj'] as const).map((s) => { const t = Math.max(0, 90000 - y6.standard[s]); const r = E.incomeTax(2026, s, t); return [({ single: 'Single', hoh: 'Head of household', mfj: 'Married, one income' })[s], usd(t), `${r.marginal}%`, usd(r.tax), `${num(r.average, 1)}%`]; }), 'Income of $90,000 in 2026, standard deduction, before credits', ['l', 'r', 'r', 'r', 'r'])}
<h2>Payroll taxes are a separate layer</h2>
<p>Employees also pay ${S.fica.socialSecurity}% of wages for Social Security up to the ${usd(y6.ssWageBase)} wage base and ${S.fica.medicare}% for Medicare on all wages, plus 0.9% above ${usd(S.fica.additionalThreshold.single)}. For most workers under the wage base, the combined marginal rate on an extra dollar of salary is the income tax bracket plus ${ss}%. That is why a worker in the 12% bracket keeps about 80 cents of each extra dollar earned, before state tax, and why the ${h.a('no-tax-on-overtime', 'overtime deduction')} saves less than its name suggests: it removes the income tax layer only.</p>
<h2>A common mistake with refunds</h2>
<p>A large refund is not a sign of a low tax rate, and a balance due is not a sign of a high one. Both measure withholding against the final tax. Someone whose employer withheld too little because of a second job, or who received freelance income with nothing withheld, can owe money while having a modest effective rate. Checking the effective rate on last year's return, then comparing it with this year's withholding as a share of pay, is the quickest test of whether the next return will bring a surprise.</p>
<h2>Using the two numbers well</h2>
<p>Compare effective rates across years, between countries or between households. Use marginal rates to decide: whether to contribute to a traditional or Roth account, whether to realize a gain this year or next, how much a deduction is worth, how much of a bonus you will keep. Both figures come out of the same calculation, which is why every calculator on this site shows the bracket and the tax together.</p>
<p>Source: ${h.src('rp2532')}; ${h.src('tc751')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-brackets', 'single-tax-brackets', 'tax-refund-calculator', 'fica-tax-rate', 'capital-gains-tax-rates'],
  sources: ['rp2532', 'tc751', 'law'],
});
