import { definePage } from '../../lib/page-types';
import { E, P, usd, day } from '../../lib/kit';

const u = P.interest.underpayment; const o = P.interest.overpaymentIndividual;
const ex = E.underpaymentInterest(5000, 180, u['2026'][3]);

export default definePage({
  id: 'irs-interest-rates',
  group: 'calendar',
  kind: 'tool',
  order: 80,
  slug: 'irs-interest-rates',
  nav: 'IRS interest rates',
  card: 'The 2026 quarterly rates on unpaid tax and on refunds, and the interest on a balance.',
  title: `IRS Interest Rate 2026: ${u['2026'][3]}% on Unpaid Tax This Quarter`,
  description: `IRS interest rate 2026: ${u['2026'][0]}% in the first quarter, ${u['2026'][1]}% in the second, ${u['2026'][2]}% in the third and ${u['2026'][3]}% in the fourth, compounded daily on unpaid tax. Compute yours.`,
  h1: 'IRS interest rates for 2026',
  intro: 'The rate the IRS charges on unpaid tax and pays on late refunds, set each quarter and compounded every day.',
  resume: `The IRS charges interest on tax paid after its due date, and pays interest on some refunds, at a rate it resets every quarter: the federal short-term rate plus three percentage points for individuals. For 2026 the underpayment rate was ${u['2026'][0]}% from January to March, ${u['2026'][1]}% from April to June, ${u['2026'][2]}% from July to September and ${u['2026'][3]}% from October to December, according to the IRS table of quarterly rates; the rate on individual overpayments matched it, ${o['2026'].join('%, ')}%. In 2025 the rate stayed at ${u['2025'][0]}% all year. Interest is compounded daily and runs from the original due date of the return, even under an extension, until the tax is paid. It also applies to penalties. A balance of ${usd(5000)} left unpaid for 180 days at ${u['2026'][3]}% costs about ${usd(ex)} of interest, on top of the failure-to-pay penalty. Rates for 2027 will be set quarter by quarter.`,
  tool: 'interest',
  faqs: [
    { q: 'What is the IRS interest rate for the fourth quarter of 2026?', a: `${u['2026'][3]}% a year for underpayments by individuals and businesses, and ${o['2026'][3]}% for overpayments to individuals, for October through December 2026, according to the IRS quarterly rate table published in Internal Revenue Bulletin 2026-36. The rate is compounded daily, so the effective annual cost is slightly higher than the nominal rate.` },
    { q: 'Does the IRS charge interest on penalties too?', a: `Yes. The IRS states that interest accrues on any unpaid tax, penalties and interest until the balance is paid in full, compounded daily. A failure-to-pay penalty added to a ${usd(5000)} balance therefore grows with interest as well, which is why paying the tax first, even before the return is finished, limits the total cost.` },
    { q: 'If the IRS rate drops next quarter, is my old interest recomputed?', a: `No. A new quarterly rate applies only from the first day of that quarter; changes do not affect the rate already charged for prior quarters, according to the IRS. A balance unpaid since April 2026 was charged ${u['2026'][1]}% for the second quarter, then ${u['2026'][2]}% from July and ${u['2026'][3]}% from October.` },
  ],
  body: (h) => `
<h2>Quarterly rates for 2025 and 2026</h2>
${h.table(['Quarter', 'Underpayment 2025', 'Underpayment 2026', 'Individual overpayment 2026'], ['January to March', 'April to June', 'July to September', 'October to December'].map((q, i) => [q, `${u['2025'][i]}%`, `${u['2026'][i]}%`, `${o['2026'][i]}%`]), 'IRS quarterly interest rates', ['l', 'r', 'r', 'r'])}
<h2>How daily compounding works</h2>
<p>Each day, interest is added to the balance at one 365th of the annual rate, and the next day's interest is computed on the new balance. Over a year at ${u['2026'][3]}%, ${usd(10000)} grows by about ${usd(E.underpaymentInterest(10000, 365, u['2026'][3]))}, slightly more than simple interest of ${usd((10000 * u['2026'][3]) / 100)}. When the quarter changes, the new rate applies to the balance from that day. The calculator uses one rate for the whole period, which is exact inside a quarter and close otherwise.</p>
<h2>Interest and penalties are separate</h2>
<p>A late payment usually brings both: interest at the quarterly rate, and the ${h.a('tax-deadline', 'failure-to-pay penalty')} of 0.5% a month, plus the failure-to-file penalty if the return was late too. Interest runs on the penalties as well. The underpayment penalty for ${h.a('estimated-tax-payments', 'estimated tax')} is computed at the same quarterly rate but is a penalty, figured on Form 2210. An ${h.a('tax-extension', 'extension')} stops none of these from the April date: it only removes the failure-to-file penalty.</p>
<h2>The formula behind the rate</h2>
<p>The IRS table of formulas sets the standard underpayment rate at the federal short-term rate plus 3 percentage points, for individuals and corporations alike, and a higher rate, plus 5 points, for large corporate underpayments above ${usd(100000)}. Individuals receive the same rate on overpayments. The federal short-term rate is determined each quarter from Treasury yields, which is why the IRS rate moved from ${u['2026'][0]}% to ${u['2026'][1]}% and back during 2026.</p>
<h2>Paying over time</h2>
<p>Taxpayers who cannot pay in full can apply for a payment plan online. Interest keeps running on the unpaid balance, but for individuals who filed on time, the failure-to-pay penalty drops to 0.25% a month while the plan is in force. Paying whatever you can by the deadline, then the rest through the plan, keeps both charges lower.</p>
<p>Sources: ${h.src('interest')}; ${h.src('ftp')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-deadline', 'tax-extension', 'estimated-tax-payments', 'tax-refund-calculator', 'when-will-i-get-my-refund'],
  sources: ['interest', 'ftp'],
});
