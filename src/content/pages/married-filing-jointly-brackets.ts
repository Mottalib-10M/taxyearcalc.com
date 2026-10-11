import { definePage } from '../../lib/page-types';
import { E, Y, usd, num, day, P } from '../../lib/kit';

const y6 = Y(2026);
const br = y6.brackets.mfj as Array<[number | null, number]>;
const sb = y6.brackets.single as Array<[number | null, number]>;
const joint = (a: number, b: number) => E.incomeTax(2026, 'mfj', Math.max(0, a + b - y6.standard.mfj)).tax;
const apart = (a: number, b: number) => E.incomeTax(2026, 'single', Math.max(0, a - y6.standard.single)).tax + E.incomeTax(2026, 'single', Math.max(0, b - y6.standard.single)).tax;

export default definePage({
  id: 'married-filing-jointly-brackets',
  group: 'rates',
  kind: 'tool',
  order: 40,
  slug: 'married-filing-jointly-brackets',
  nav: 'Brackets: married jointly',
  card: 'The 2026 joint brackets, and when marriage lowers or raises the couple’s tax.',
  title: 'Tax Brackets 2026 Married Filing Jointly: Rates and Limits',
  description: `Tax brackets 2026 married filing jointly: 10% to ${usd(br[0][0] as number)}, 12% to ${usd(br[1][0] as number)}, 22% to ${usd(br[2][0] as number)}, 37% over ${usd(br[5][0] as number)}, plus the joint ${usd(y6.standard.mfj)} standard deduction.`,
  h1: 'Tax brackets for married couples filing jointly in 2026',
  intro: 'Double the single thresholds up to the 32% rate, then not: where marriage helps and where it costs.',
  resume: `A married couple filing jointly in 2026 pays 10% on the first ${usd(br[0][0] as number)} of taxable income, 12% up to ${usd(br[1][0] as number)}, 22% up to ${usd(br[2][0] as number)}, 24% up to ${usd(br[3][0] as number)}, 32% up to ${usd(br[4][0] as number)}, 35% up to ${usd(br[5][0] as number)} and 37% beyond, under Rev. Proc. 2025-32. Up to the end of the 32% bracket these thresholds are exactly twice the single ones, and the ${usd(y6.standard.mfj)} standard deduction is twice the single ${usd(y6.standard.single)}, so two partners with similar pay owe the same tax married or not. When one spouse earns most of the income, the joint return lowers the total: a single earner with ${usd(120000)} owes ${usd(apart(120000, 0))} alone but ${usd(joint(120000, 0))} filing jointly with a spouse who has no income. Only at the top does a penalty appear, because the 35% bracket ends at ${usd(br[5][0] as number)} on a joint return against ${usd(sb[5][0] as number)} for each single filer. You can file jointly if you are married on December 31, even if you married that day.`,
  tool: 'brackets',
  toolArg: { year: 2026, status: 'mfj', income: 140000 },
  faqs: [
    { q: 'Is there still a marriage penalty in the 2026 tax brackets?', a: `Only for high earners. Every joint threshold up to ${usd(br[4][0] as number)} is twice the single one, so a couple with similar incomes pays the same as two singles. Above that, the joint 35% band stops at ${usd(br[5][0] as number)} while two singles could each stay in 35% up to ${usd(sb[5][0] as number)}; two partners with ${usd(600000)} of taxable income each pay ${usd(joint(600000 + y6.standard.single, 600000 + y6.standard.single) - apart(600000 + y6.standard.single, 600000 + y6.standard.single))} more married.` },
    { q: 'How much tax does a married couple earning $150,000 pay in 2026?', a: `With ${usd(150000)} of combined wages and the ${usd(y6.standard.mfj)} joint standard deduction, taxable income is ${usd(150000 - y6.standard.mfj)}, which sits in the 22% bracket. The federal income tax before credits is ${usd(joint(150000, 0))}, an average of ${num((joint(150000, 0) / 150000) * 100, 1)}% of wages. Two children would bring the child tax credit of ${usd(y6.ctc.max)} each off that amount.` },
    { q: 'We married in December 2026. Do we file jointly for the whole year?', a: `Yes. Your marital status on December 31 decides for the whole year, so a couple married on December 20 can file a joint 2026 return covering both partners' income for all of 2026. You may also choose married filing separately, but that usually costs more and removes several deductions and credits.` },
  ],
  body: (h) => `
<h2>Married or single: the same couple, two answers</h2>
${h.table(['Spouse A', 'Spouse B', 'Two single returns', 'Joint return', 'Difference'], [[60000, 60000], [120000, 0], [90000, 30000], [250000, 50000], [450000, 450000]].map(([a, b]) => { const s = apart(a, b); const j = joint(a, b); return [usd(a), usd(b), usd(s), usd(j), j < s ? `${usd(s - j)} less married` : j > s ? `${usd(j - s)} more married` : 'same']; }), 'Federal income tax for 2026, standard deduction, before credits', ['r', 'r', 'r', 'r', 'l'])}
<p>The pattern is clear: unequal incomes produce a marriage bonus, equal incomes no change, and very high equal incomes a penalty that comes from the 35% bracket alone.</p>
<h2>Joint thresholds for the other new rules</h2>
<p>Several 2025 to 2028 rules double for a joint return too: the ${h.a('no-tax-on-overtime', 'overtime deduction')} cap is ${usd(y6.overtime.max.mfj)}, the tips and overtime phase-outs start at ${usd(y6.tips.phaseStart.mfj)} of modified AGI, the ${h.a('senior-deduction', 'senior deduction')} covers each spouse aged 65 or older and phases out from ${usd(y6.senior.phaseStart.mfj)}. Others do not double: the ${h.a('no-tax-on-tips', 'tips cap')} stays ${usd(y6.tips.max)} per return, and the ${h.a('salt-deduction', 'SALT cap')} is ${usd(y6.salt.cap)} for the couple, the same as for one single filer. The child tax credit phases out from ${usd(400000)} of AGI instead of ${usd(200000)}.</p>
<h2>Two incomes and withholding</h2>
<p>Each employer withholds as if its paycheck were the household's only income unless the W-4 says otherwise, so a couple with two similar salaries often under-withholds: each job fills the low brackets on its own, while the joint return fills them only once. The IRS Tax Withholding Estimator or the multiple-jobs step of Form W-4 corrects it. The ${h.a('tax-refund-calculator', 'refund estimator')} shows whether the year will end with a refund or a bill.</p>
<h2>Joint liability</h2>
<p>Both spouses sign and both are responsible for the whole tax on a joint return, including errors in the other's income. Innocent spouse relief exists for cases where one spouse did not know about understated income, but it has to be requested. A spouse with large medical costs or unpaid tax debts sometimes compares with ${h.a('married-filing-separately-brackets', 'separate returns')} before deciding.</p>
<p>Source: ${h.src('rp2532')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-brackets', 'married-filing-separately-brackets', 'single-tax-brackets', 'child-tax-credit', 'standard-deduction'],
  sources: ['rp2532', 'law', 'sch8812'],
});
