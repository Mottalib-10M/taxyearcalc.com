import { definePage } from '../../lib/page-types';
import { E, Y, usd, usdx, day, P, num } from '../../lib/kit';

const b = (s: 'single' | 'mfj' | 'hoh' | 'mfs') => Y(2026).brackets[s] as Array<[number | null, number]>;
const top = (s: 'single' | 'mfj' | 'hoh' | 'mfs', i: number) => usd(b(s)[i][0] as number);
const ex = E.incomeTax(2026, 'single', 85000 - Y(2026).standard.single);
const exJ = E.incomeTax(2026, 'mfj', 150000 - Y(2026).standard.mfj);

export default definePage({
  id: 'tax-brackets',
  group: 'rates',
  kind: 'tool',
  order: 10,
  slug: 'tax-brackets',
  nav: '2026 tax brackets',
  card: 'The seven 2026 rates for every filing status, and the bracket your income reaches.',
  title: 'Tax Brackets 2026: Your Bracket, Rate and Tax by Status',
  description: `Tax brackets 2026 from IRS Rev. Proc. 2025-32: 10% up to ${top('single', 0)} single or ${top('mfj', 0)} joint, 37% above ${top('single', 5)}. See your marginal and average tax rate now.`,
  h1: 'Federal tax brackets for 2026',
  intro: 'The seven rates stay; every threshold moved up for inflation, and the calculator shows which ones your income crosses.',
  resume: `For tax year 2026, the return you file in early 2027, the IRS keeps the seven federal rates of 10%, 12%, 22%, 24%, 32%, 35% and 37%, which Public Law 119-21 made permanent, and raises every bracket threshold for inflation in Rev. Proc. 2025-32. A single filer pays 10% on the first ${top('single', 0)} of taxable income, 12% up to ${top('single', 1)}, 22% up to ${top('single', 2)}, 24% up to ${top('single', 3)}, 32% up to ${top('single', 4)}, 35% up to ${top('single', 5)} and 37% above. A married couple filing jointly has thresholds exactly twice as high up to the 32% bracket, ${top('mfj', 0)}, ${top('mfj', 1)}, ${top('mfj', 2)}, ${top('mfj', 3)} and ${top('mfj', 4)}, then ${top('mfj', 5)} for the 35% bracket. These rates apply to taxable income, after the standard deduction of ${usd(Y(2026).standard.single)} single or ${usd(Y(2026).standard.mfj)} joint, and only to the slice of income inside each bracket. Someone single earning $85,000 in wages has ${usd(85000 - Y(2026).standard.single)} of taxable income, lands in the ${ex.marginal}% bracket and owes ${usd(ex.tax)}, an average of ${num(ex.average, 1)}% of taxable income.`,
  tool: 'brackets',
  toolArg: { year: 2026, status: 'single', income: 85000 },
  faqs: [
    { q: 'If a raise pushes me into the 24% bracket, does all my income get taxed at 24%?', a: `No. Only the dollars above the threshold are taxed at the higher rate. A single filer whose taxable income rises from ${top('single', 2)} to ${usd((b('single')[2][0] as number) + 1000)} pays 24% on the last $1,000 alone, so the raise costs $240 in federal income tax and every earlier dollar keeps its 10%, 12% or 22% rate. Take-home pay never falls because of a bracket change.` },
    { q: 'Which 2026 bracket am I in at $100,000 of salary?', a: `As a single filer taking the ${usd(Y(2026).standard.single)} standard deduction, $100,000 of wages leaves ${usd(100000 - Y(2026).standard.single)} of taxable income, inside the 22% bracket that runs to ${top('single', 2)}. The federal income tax is ${usd(E.incomeTax(2026, 'single', 100000 - Y(2026).standard.single).tax)}. A married couple with the same $100,000 stays in the 12% bracket, because their 12% band reaches ${top('mfj', 1)} of taxable income.` },
    { q: 'Why are the 2026 brackets for married couples not always double the single ones?', a: `They are exactly double up to the 32% bracket, which removes most of the marriage penalty for middle incomes. The 35% bracket breaks the pattern: it ends at ${top('single', 5)} for a single filer but at ${top('mfj', 5)} for a joint return, well under twice as much. Two high earners can therefore pay more tax married than single, on the income above roughly ${top('mfj', 4)}.` },
    { q: 'Are these the brackets I use for the return I file in April 2026?', a: `No. The return due ${day(Y(2025).deadlines.filing)} covers tax year 2025, which has lower thresholds from Rev. Proc. 2024-40, for example 10% up to ${usd(Y(2025).brackets.single[0][0] as number)} single. The 2026 brackets on this page apply to income earned from January to December 2026, reported on the return due ${day(Y(2026).deadlines.filing)}. They already matter now for withholding and estimated payments.` },
    { q: 'Do long-term capital gains follow these brackets?', a: `They have their own rates of 0%, 15% and 20%, set by separate 2026 thresholds: the 0% rate covers taxable income up to ${usd(Y(2026).capitalGains.zeroTop.single)} single or ${usd(Y(2026).capitalGains.zeroTop.mfj)} joint. Gains are stacked on top of ordinary income, so wages fill the low brackets first. Short-term gains, held a year or less, are taxed with wages under the ordinary brackets above.` },
  ],
  body: (h) => `
<h2>The 2026 rate schedules, all four filing statuses</h2>
<p>Rev. Proc. 2025-32 prints one table per filing status, each line reading "the tax is X plus Y% of the excess over Z". The table below rebuilds those lines from the brackets, and the test suite of this site checks that the amount at the start of the 37% bracket matches the printed one to the cent: ${usdx(Y(2026).bracketCheck.single)} for a single filer, ${usdx(Y(2026).bracketCheck.mfj)} for a joint return.</p>
${h.table(['Rate', 'Single', 'Married filing jointly', 'Head of household', 'Married filing separately'], b('single').map((row, i) => [`${row[1]}%`, ...(['single', 'mfj', 'hoh', 'mfs'] as const).map((s) => { const lo = i === 0 ? 0 : (b(s)[i - 1][0] as number); const hi = b(s)[i][0]; return hi === null ? `over ${usd(lo)}` : `${usd(lo)} to ${usd(hi)}`; })]), 'Taxable income ranges for 2026, Rev. Proc. 2025-32 section 4.01', ['l', 'r', 'r', 'r', 'r'])}
<p>The head of household column sits between the two others: a wider 10% and 12% band than a single filer, because the status is meant for a parent paying for a home alone. Married filing separately mirrors the single column until the 35% bracket, which stops at ${top('mfs', 5)}, half the joint threshold.</p>
<h2>Marginal rate and average rate are two different numbers</h2>
<p>The bracket you are "in" is your marginal rate: what the next dollar of taxable income costs. The share of your income that actually goes to federal income tax is far lower, because each bracket fills in turn. In the example of the answer above, the single filer on $85,000 of wages is in the ${ex.marginal}% bracket but pays ${num(ex.average, 1)}% of taxable income and ${num((ex.tax / 85000) * 100, 1)}% of gross wages. A couple on $150,000 has ${usd(150000 - Y(2026).standard.mfj)} taxable, a ${exJ.marginal}% marginal rate and owes ${usd(exJ.tax)}.</p>
<p>The marginal rate is the one to use when you weigh a decision at the edge: a ${h.a('401k-contribution-limit', '401(k) deferral')} of $1,000 saves $220 at 22%, an extra shift of overtime is worth what is left after 22% (unless it is covered by the ${h.a('no-tax-on-overtime', 'overtime deduction')}), a ${h.a('roth-ira-income-limit', 'Roth contribution')} makes more sense when today's rate is low. The average rate is the one to compare across years or with another country.</p>
${h.mini('brackets', { year: 2026, status: 'mfj', income: 150000 })}
<h2>What moved between 2025 and 2026</h2>
<p>Every threshold rose, by about ${num(((b('single')[0][0] as number) / (Y(2025).brackets.single[0][0] as number) - 1) * 100, 1)}% at the bottom and ${num(((b('single')[5][0] as number) / (Y(2025).brackets.single[5][0] as number) - 1) * 100, 1)}% at the top. The 10% band for a single filer grows from ${usd(Y(2025).brackets.single[0][0] as number)} to ${top('single', 0)}, and the 37% rate starts at ${top('single', 5)} instead of ${usd(Y(2025).brackets.single[5][0] as number)}. The rates themselves did not change: the 2017 rates were due to expire after 2025, and section 70101 of Public Law 119-21 made them permanent. The ${h.a('prior-year-tax-brackets', '2025 brackets')} still govern the return filed in 2026, and the ${h.a('standard-deduction', 'standard deduction')} moved too, to ${usd(Y(2026).standard.single)} single.</p>
<p>Your taxable income is not your salary. Subtract the standard or itemized deduction first, then any of the four new Schedule 1-A deductions (${h.a('no-tax-on-tips', 'tips')}, overtime, ${h.a('car-loan-interest-deduction', 'car loan interest')}, the ${h.a('senior-deduction', 'senior deduction')}), which all reduce taxable income without lowering the bracket thresholds. Credits such as the ${h.a('child-tax-credit', 'child tax credit')} come after the brackets, dollar for dollar against the tax. The ${h.a('tax-refund-calculator', 'refund estimator')} runs the whole sequence.</p>
<p>Source: ${h.src('rp2532')}, read on ${day(P.retrieved_at)}; rates made permanent by section 70101 of ${h.src('law', 'Public Law 119-21')}.</p>`,
  related: ['prior-year-tax-brackets', 'single-tax-brackets', 'married-filing-jointly-brackets', 'standard-deduction', 'capital-gains-tax-rates', 'tax-refund-calculator'],
  sources: ['rp2532', 'law', 'wftc', 'rp2440'],
});
