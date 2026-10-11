import { definePage } from '../../lib/page-types';
import { E, Y, usd, usdx, day, P } from '../../lib/kit';

const y5 = Y(2025);
const b = (s: 'single' | 'mfj' | 'hoh' | 'mfs') => y5.brackets[s] as Array<[number | null, number]>;
const top = (s: 'single' | 'mfj' | 'hoh' | 'mfs', i: number) => usd(b(s)[i][0] as number);
const ex = E.incomeTax(2025, 'hoh', 62000 - y5.standard.hoh);
const late = E.latePenalties(2025, 2000, 1, 1);

export default definePage({
  id: 'prior-year-tax-brackets',
  group: 'rates',
  kind: 'tool',
  order: 20,
  slug: 'prior-year-tax-brackets',
  nav: '2025 tax brackets',
  card: 'The brackets for the 2025 return, filed in 2026 or under extension until October 15.',
  title: 'Tax Brackets 2025: The Table for the Return Filed in 2026',
  description: `Tax brackets 2025 for the return filed in 2026: 10% up to ${top('single', 0)} single or ${top('mfj', 0)} joint, 37% above ${top('single', 5)}, with the raised ${usd(y5.standard.single)} standard deduction.`,
  h1: 'Federal tax brackets for 2025',
  intro: 'The table behind the return due in April 2026, still in use for extended, late and amended 2025 returns.',
  resume: `The 2025 federal brackets apply to income earned in calendar year 2025 and reported on the return that was due ${day(y5.deadlines.filing)}, or ${day(y5.deadlines.extension)} with an extension. They come from Rev. Proc. 2024-40 and were not touched by Public Law 119-21, which kept the seven rates permanently. A single filer paid 10% on taxable income up to ${top('single', 0)}, 12% up to ${top('single', 1)}, 22% up to ${top('single', 2)}, 24% up to ${top('single', 3)}, 32% up to ${top('single', 4)}, 35% up to ${top('single', 5)} and 37% above; a joint return used ${top('mfj', 0)}, ${top('mfj', 1)}, ${top('mfj', 2)}, ${top('mfj', 3)}, ${top('mfj', 4)} and ${top('mfj', 5)}. What the new law did change for 2025 is the standard deduction, raised after the fact to ${usd(y5.standard.single)} single, ${usd(y5.standard.hoh)} head of household and ${usd(y5.standard.mfj)} joint, plus the four Schedule 1-A deductions. A head of household with ${usd(62000)} of income had ${usd(62000 - y5.standard.hoh)} of taxable income in 2025, sat in the ${ex.marginal}% bracket and owed ${usd(ex.tax)} before credits.`,
  tool: 'brackets',
  toolArg: { year: 2025, status: 'single', income: 75000 },
  faqs: [
    { q: 'Which tax brackets do I use if I file my 2025 return late in 2026?', a: `Always the 2025 table, whatever the date you file. The year the income was earned decides, so a 2025 return sent in November 2026 still uses the thresholds of Rev. Proc. 2024-40, ${top('single', 0)} for the end of the 10% band for a single filer. Filing after ${day(y5.deadlines.extension)} without a valid extension adds penalties and interest, not a different table.` },
    { q: 'Why did my 2025 standard deduction differ from what was announced in late 2024?', a: `Because the law changed it in July 2025. Rev. Proc. 2024-40 had printed ${usd(y5.standardBeforeLaw.single)} single and ${usd(y5.standardBeforeLaw.mfj)} joint; section 70102 of Public Law 119-21 raised those amounts to ${usd(y5.standard.single)} and ${usd(y5.standard.mfj)} for 2025, and Rev. Proc. 2025-32 formally replaced the old figures. The 2025 brackets themselves stayed as announced.` },
    { q: 'How much more is the 2026 10% bracket than the 2025 one?', a: `For a single filer the 10% band grows from ${top('single', 0)} in 2025 to ${usd(Y(2026).brackets.single[0][0] as number)} in 2026, and for a joint return from ${top('mfj', 0)} to ${usd(Y(2026).brackets.mfj[0][0] as number)}. At 10% versus 12%, the wider band is worth ${usd(((Y(2026).brackets.single[0][0] as number) - (b('single')[0][0] as number)) * 0.02)} to a single filer who fills it.` },
    { q: 'I owe $2,000 on my 2025 return and file one month late. What does it cost?', a: `Without an extension, the failure-to-file penalty is 5% a month and the failure-to-pay penalty 0.5% a month, with the first reduced by the second in the same month: about ${usd(late.ftf)} plus ${usd(late.ftp)} for one month, plus interest at the quarterly rate. The deadline and extension pages compute other durations.` },
  ],
  body: (h) => `
<h2>The four 2025 schedules</h2>
${h.table(['Rate', 'Single', 'Married filing jointly', 'Head of household', 'Married filing separately'], b('single').map((row, i) => [`${row[1]}%`, ...(['single', 'mfj', 'hoh', 'mfs'] as const).map((s) => { const lo = i === 0 ? 0 : (b(s)[i - 1][0] as number); const hi = b(s)[i][0]; return hi === null ? `over ${usd(lo)}` : `${usd(lo)} to ${usd(hi)}`; })]), 'Taxable income ranges for 2025, Rev. Proc. 2024-40 section 2.01', ['l', 'r', 'r', 'r', 'r'])}
<p>The printed tax at the start of the 37% bracket, ${usdx(y5.bracketCheck.single)} for a single filer and ${usdx(y5.bracketCheck.mfj)} for a joint return, is recomputed by the tests of this site from the thresholds above, to the cent.</p>
<h2>Who still needs this table in late 2026</h2>
<p>Anyone who filed Form 4868 and has until ${day(y5.deadlines.extension)} to send the return; anyone filing late; anyone amending a 2025 return on Form 1040-X to claim a deduction they missed, such as the ${h.a('no-tax-on-tips', 'tips deduction')} or the ${h.a('senior-deduction', 'senior deduction')}, both available from 2025. An amended return generally has three years from the original filing date to claim a refund. Payroll departments also use it to check year-end corrections of 2025 wages.</p>
<h2>2025 and 2026 compared</h2>
<p>Each 2026 threshold is higher, so the same income usually falls into the same or a lower bracket. A single filer with ${usd(110000)} of taxable income was in the 24% bracket in 2025, which started at ${top('single', 2)}, and stays in it in 2026 by only ${usd(110000 - (Y(2026).brackets.single[2][0] as number))}. Use the year switch of the calculator to run both years on the same income, or open the ${h.a('tax-brackets', '2026 brackets')} directly.</p>
<p>Sources: ${h.src('rp2440')}; ${h.src('rp2532', 'Rev. Proc. 2025-32 section 3 (2025 items modified by Public Law 119-21)')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-brackets', 'tax-extension', 'standard-deduction', 'tax-deadline', 'marginal-vs-effective-tax-rate'],
  sources: ['rp2440', 'rp2532', 'law'],
});
