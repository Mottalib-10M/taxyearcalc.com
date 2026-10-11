import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const y = Y(2026);
const fam = { salt: 19000, mort: 14000, gifts: 3000, agi: 210000 };
const famSalt = E.saltDeduction(2026, 'mfj', fam.salt, fam.agi).deduction;
const famGift = E.charity(2026, 'mfj', fam.gifts, fam.agi).itemized;
const famItem = famSalt + fam.mort + famGift;

export default definePage({
  id: 'itemized-vs-standard-deduction',
  group: 'deductions',
  kind: 'tool',
  order: 110,
  slug: 'itemized-vs-standard-deduction',
  nav: 'Itemize or not',
  card: 'Compare Schedule A with the standard deduction under the 2026 floor and 2/37 limit.',
  title: 'Itemized vs Standard Deduction 2026: Which One Saves More',
  description: `Itemized vs standard deduction 2026: compare SALT up to ${usd(y.salt.cap)}, mortgage interest and gifts above the 0.5% floor with ${usd(y.standard.mfj)} joint or ${usd(y.standard.single)} single.`,
  h1: 'Itemize or take the standard deduction in 2026?',
  intro: 'Add up Schedule A with the 2026 rules and see whether it beats the flat amount.',
  resume: `You itemize only when your Schedule A total beats the standard deduction, which for 2026 is ${usd(y.standard.single)} single, ${usd(y.standard.hoh)} head of household and ${usd(y.standard.mfj)} for a married couple filing jointly. Three 2026 rules change the comparison. State and local taxes count up to ${usd(y.salt.cap)}, less above ${usd(y.salt.threshold)} of modified AGI. Charitable gifts count only above 0.5% of AGI, while non-itemizers get a new deduction of up to ${usd(y.charity.nonItemizer.single)} (${usd(y.charity.nonItemizer.mfj)} joint) for cash gifts. And taxpayers in the 37% bracket see their itemized deductions trimmed by 2/37 of the smaller of the deductions and their income above the 37% threshold. A couple with ${usd(fam.agi)} of AGI, ${usd(fam.salt)} of state and property taxes, ${usd(fam.mort)} of mortgage interest and ${usd(fam.gifts)} of gifts itemizes ${usd(famItem)}, ${famItem > y.standard.mfj ? `${usd(famItem - y.standard.mfj)} more than` : `${usd(y.standard.mfj - famItem)} less than`} the joint standard deduction. The Schedule 1-A deductions apply either way.`,
  tool: 'itemize',
  faqs: [
    { q: 'How many people itemize now that the SALT cap is $40,400?', a: `The IRS has not published 2026 filing statistics yet, so no count is given here. What changed is the arithmetic: a cap of ${usd(y.salt.cap)} instead of ${usd(10000)} lets a homeowner in a high-tax state put up to ${usd(y.salt.cap - 10000)} more of state and property taxes on Schedule A, which pushes many such households above the ${usd(y.standard.mfj)} joint standard deduction.` },
    { q: 'Do I lose the extra standard deduction for age if I itemize?', a: `Yes. The additional ${usd(y.agedBlind.married)} per spouse (${usd(y.agedBlind.unmarried)} unmarried) at 65 or blind is part of the standard deduction and disappears when you itemize. The Schedule 1-A senior deduction of up to ${usd(y.senior.amount)} per person is different: it stays available with Schedule A. Retirees comparing the two should add the age amount to the standard side.` },
    { q: 'What is the 2/37 limit on itemized deductions for 2026?', a: `Section 68, rewritten by section 70111 of Public Law 119-21, reduces itemized deductions by 2/37 of the smaller of total itemized deductions and the amount by which taxable income plus those deductions exceeds the start of the 37% bracket, ${usd(y.brackets.mfj[5][0] as number)} joint or ${usd(y.brackets.single[5][0] as number)} single in 2026. In effect each itemized dollar saves 35 cents instead of 37 for top earners.` },
    { q: 'Can married couples filing separately mix itemizing and the standard deduction?', a: `No. If one spouse itemizes on a separate return, the other's standard deduction is zero, so both must itemize. That rule, the halved SALT cap and the loss of the Schedule 1-A deductions make separate returns costly. The married filing separately page lists the other traps.` },
  ],
  body: (h) => `
<h2>What goes on Schedule A, with the 2026 limits</h2>
${h.table(['Item', '2026 rule'], [
  [h.a('salt-deduction', 'State and local taxes'), `up to ${usd(y.salt.cap)}, reduced by 30% of MAGI above ${usd(y.salt.threshold)}, floor ${usd(y.salt.floor)}`],
  [h.a('mortgage-interest-deduction', 'Mortgage interest'), 'on up to $750,000 of acquisition debt; mortgage insurance counts again'],
  [h.a('charitable-deduction', 'Charitable gifts'), 'only the part above 0.5% of AGI'],
  ['Medical and dental costs', 'only the part above 7.5% of AGI'],
  ['Gambling losses', 'up to 90% of gambling winnings (Form 1040-ES 2026)'],
  ['Casualty losses', 'federally declared disasters, and from 2026 state-declared disasters'],
], 'Schedule A as amended by Public Law 119-21 for 2026', ['l', 'l'])}
<h2>A worked comparison</h2>
<p>In the example above, the SALT line keeps ${usd(famSalt)} because the couple's income is under the ${usd(y.salt.threshold)} threshold, the gifts lose the first ${usd(E.charity(2026, 'mfj', fam.gifts, fam.agi).floor)} to the floor, and the mortgage interest counts in full. Itemizing gives ${usd(famItem)}. Had they taken the standard deduction, they could still deduct ${usd(Math.min(fam.gifts, y.charity.nonItemizer.mfj))} of cash gifts in 2026. The calculator weighs both sides, including that non-itemizer amount.</p>
<h2>Itemizing and the new deductions</h2>
<p>None of the four ${h.a('schedule-1-a', 'Schedule 1-A')} deductions depends on this choice: tips, overtime, car loan interest and the senior deduction are subtracted after either the standard deduction or Schedule A. The qualified business income deduction works the same way. So the comparison on this page only concerns the items listed in the table, and a worker with large tips can still take the standard deduction and the tips deduction together.</p>
<h2>When the answer changes from year to year</h2>
<p>Households near the line can alternate: itemize in a year with a large property tax bill or a bunched charitable gift, take the standard deduction the next. The choice is made each year on the return. The ${h.a('standard-deduction', 'standard deduction')} page has the amounts by status, and the ${h.a('tax-refund-calculator', 'refund estimator')} shows what the difference does to your refund.</p>
<p>Sources: ${h.src('law')}; ${h.src('es2026')}; ${h.src('ischa')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['standard-deduction', 'salt-deduction', 'mortgage-interest-deduction', 'charitable-deduction', 'married-filing-separately-brackets'],
  sources: ['law', 'es2026', 'ischa', 'rp2532'],
});
