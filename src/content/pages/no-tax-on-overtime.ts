import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, day, P } from '../../lib/kit';

const o = Y(2026).overtime;
const nurse = { pay: 15000, prem: E.overtimePremium(15000, 1.5) };
const nurseDed = E.overtimeDeduction(2026, 'single', nurse.prem, 82000);
const std = Y(2026).standard.single;
const nurseSaved = E.incomeTax(2026, 'single', 82000 - std).tax - E.incomeTax(2026, 'single', 82000 - std - nurseDed.deduction).tax;
const couple = E.overtimeDeduction(2026, 'mfj', 31000, 318500);

export default definePage({
  id: 'no-tax-on-overtime',
  group: 'deductions',
  kind: 'tool',
  order: 30,
  slug: 'no-tax-on-overtime',
  nav: 'No tax on overtime',
  card: 'How much of your overtime pay is deductible, and what the deduction saves after the phase-out.',
  title: `No Tax on Overtime 2026: How Much It Saves, ${usd(o.max.single)} Cap`,
  description: `No tax on overtime covers only the FLSA premium, up to ${usd(o.max.single)} (${usd(o.max.mfj)} joint) for 2025 to 2028, phased out above ${usd(o.phaseStart.single)} of MAGI. See your 2026 deduction.`,
  h1: 'No tax on overtime: the part of your overtime you can deduct',
  intro: 'Only the premium above your regular rate counts, and the saving is that premium times your tax bracket.',
  resume: `No tax on overtime lets a worker deduct the qualified overtime premium, the part of overtime pay above the regular rate that the Fair Labor Standards Act requires, up to ${usd(o.max.single)} a year or ${usd(o.max.mfj)} on a joint return, for tax years 2025 through 2028 (section 70202 of Public Law 119-21, Schedule 1-A Part III). It is not the whole overtime check: for time and a half, the deductible premium is one third of total overtime pay, so ${usd(nurse.pay)} of overtime holds ${usd(nurse.prem)} of premium, the example the IRS itself gives in Notice 2025-69. The deduction loses $100 for each full $1,000 of modified AGI above ${usd(o.phaseStart.single)} (${usd(o.phaseStart.mfj)} joint). A single nurse with ${usd(82000)} of modified AGI deducts ${usd(nurseDed.deduction)} and pays about ${usd(nurseSaved)} less federal income tax for 2026. Social Security and Medicare taxes are still due on all overtime pay. A valid Social Security number is required, and a married couple must file jointly to claim it.`,
  tool: 'overtime',
  faqs: [
    { q: 'Is all my overtime pay tax-free under the new law?', a: `No. Only the FLSA premium is deductible, and only up to ${usd(o.max.single)} (${usd(o.max.mfj)} joint). If you earn ${usd(30)} an hour and work 10 hours of overtime at ${usd(45)}, the ${usd(30)} part of each hour is ordinary wages and only the ${usd(15)} premium counts. Federal income tax still applies to the rest, and Social Security and Medicare apply to all of it.` },
    { q: 'My employer pays double time. How much of it qualifies for no tax on overtime?', a: `Only the half-time premium the FLSA requires. At double time, total overtime pay is four times that premium, so ${usd(20000)} of double-time pay holds ${usd(E.overtimePremium(20000, 2))} of qualified overtime compensation, as in the IRS example of Brad in Notice 2025-69. The extra half-time your employer adds by contract or policy does not count.` },
    { q: 'We are married, both work overtime and earn $318,500 together. What is our overtime deduction?', a: `Your modified AGI is ${usd(318500 - o.phaseStart.mfj)} above the ${usd(o.phaseStart.mfj)} joint threshold, which is ${Math.floor((318500 - o.phaseStart.mfj) / 1000)} full steps of $1,000, so ${usd(couple.reduction)} comes off. With ${usd(31000)} of combined premium, capped at ${usd(o.max.mfj)}, the deduction is ${usd(couple.deduction)}. Filing separately would wipe it out for both of them.` },
    { q: 'Do salaried exempt employees get the overtime deduction?', a: `Usually not. The deduction covers overtime the Fair Labor Standards Act requires: time and a half for hours over 40 in a workweek for non-exempt employees. Salaried executive, administrative and professional employees exempt from FLSA overtime receive no qualified overtime, even if their employer pays extra for long weeks. Police and firefighters on FLSA work periods do qualify.` },
  ],
  body: (h) => `
<h2>From the pay stub to the deductible premium</h2>
<p>The 2025 W-2 has no box for qualified overtime, so Notice 2025-69 lets workers rebuild the figure from their pay records. A payroll line labeled "overtime premium" can be used as it is. A line showing total overtime pay at time and a half is divided by three; at double time, by four. Compensatory time paid by a state or local employer at one and a half hours per hour worked is divided by three as well. For 2026 the employer reports the amount directly in box 12 of Form W-2 with code TT, or in box 14 of Form 1099-MISC and box 1d of Form 1099-NEC, according to the 2026 Form 1040-ES.</p>
${h.table(['What your stub shows', 'Amount', 'Qualified premium'], [
  ['Overtime premium only', usd(5000), usd(5000)],
  ['Total overtime pay at 1.5x', usd(15000), usd(E.overtimePremium(15000, 1.5))],
  ['Total overtime pay at 2x', usd(20000), usd(E.overtimePremium(20000, 2))],
  ['Comp time paid at 1.5 hours per hour', usd(4500), usd(E.overtimePremium(4500, 1.5))],
], 'The four examples of IRS Notice 2025-69 (IR-2025-114)', ['l', 'r', 'r'])}
<h2>The cap, the phase-out and your bracket</h2>
<p>Lines 15 to 21 of Schedule 1-A keep the smaller of the premium and ${usd(o.max.single)} (${usd(o.max.mfj)} joint), then remove $100 per full $1,000 of modified AGI above ${usd(o.phaseStart.single)} or ${usd(o.phaseStart.mfj)}, rounding the division down. The deduction is reached after AGI, so it does not shrink the income used for the phase-out. What it saves is the deduction times the rate of your top bracket: in the 22% bracket, ${usd(5000)} of premium saves ${usd(1100)}; in the 12% bracket, ${usd(600)}. Use the ${h.a('tax-brackets', 'bracket calculator')} to see where your income sits.</p>
${h.mini('schedule1a')}
<h2>Who misses out</h2>
<p>Married people filing separately, workers without a valid Social Security number, exempt salaried staff and anyone paid overtime only because a state law or a union contract requires it beyond the federal rule. Overtime in the eight-hour daily sense some states use is not FLSA overtime unless the week passes 40 hours. A worker with both tips and overtime can claim ${h.a('no-tax-on-tips', 'no tax on tips')} as well, each with its own cap. Federal income tax withholding was not changed by the law, so most of the gain shows up as a larger refund; the ${h.a('tax-refund-calculator', 'refund estimator')} includes it.</p>
<p>Sources: ${h.src('sch1a')}; ${h.src('ir25114')}; ${h.src('es2026', 'Form 1040-ES (2026), changes to information returns for qualified overtime')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['no-tax-on-tips', 'schedule-1-a', 'one-big-beautiful-bill-tax-changes', 'tax-refund-calculator', 'fica-tax-rate'],
  sources: ['sch1a', 'ir25114', 'wftc', 'fs2503', 'es2026', 'law'],
});
void S;
