import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const y6 = Y(2026); const y5 = Y(2025);
const sd = (yr: 2025 | 2026, s: 'single' | 'mfj' | 'hoh' | 'mfs') => usd(Y(yr).standard[s]);
const couple65 = E.standardDeduction(2026, 'mfj', { age65: 2 }).total;
const single65 = E.standardDeduction(2026, 'single', { age65: 1 }).total;
const seniorCouple = E.seniorDeduction(2026, 'mfj', 90000, 2).deduction;

export default definePage({
  id: 'standard-deduction',
  group: 'deductions',
  kind: 'tool',
  order: 10,
  slug: 'standard-deduction',
  nav: 'Standard deduction',
  card: 'The 2026 and 2025 amounts by filing status, with the age 65 and blindness additions.',
  title: `Standard Deduction 2026: ${sd(2026, 'single')} Single, ${sd(2026, 'mfj')} Joint`,
  description: `Standard deduction 2026: ${sd(2026, 'single')} single, ${sd(2026, 'hoh')} head of household, ${sd(2026, 'mfj')} joint, plus ${usd(y6.agedBlind.unmarried)} at age 65 and the new ${usd(y6.senior.amount)} senior deduction on top of it.`,
  h1: 'Standard deduction for 2026 and 2025',
  intro: 'The flat amount every filer subtracts before the brackets, and the extra amounts age and blindness add.',
  resume: `The 2026 standard deduction is ${sd(2026, 'single')} for a single filer or a married person filing separately, ${sd(2026, 'hoh')} for a head of household and ${sd(2026, 'mfj')} for a married couple filing jointly, under section 4.14 of Rev. Proc. 2025-32. Each person aged 65 or older, or blind, adds ${usd(y6.agedBlind.unmarried)} if unmarried and ${usd(y6.agedBlind.married)} if married, so a single filer of 67 subtracts ${usd(single65)} and a couple where both spouses are past 65 subtracts ${usd(couple65)}. On top of that, for 2025 through 2028, the new senior deduction of Schedule 1-A adds up to ${usd(y6.senior.amount)} per person aged 65 or older, shrinking above ${usd(y6.senior.phaseStart.single)} of modified AGI (${usd(y6.senior.phaseStart.mfj)} joint). For the 2025 return filed in 2026, Public Law 119-21 raised the amounts to ${sd(2025, 'single')}, ${sd(2025, 'hoh')} and ${sd(2025, 'mfj')}. You take the standard deduction unless your itemized deductions add up to more; someone claimed as a dependent gets the larger of ${usd(y6.dependentStandard.minimum)} or earned income plus ${usd(y6.dependentStandard.earnedPlus)}.`,
  tool: 'standardDeduction',
  faqs: [
    { q: 'How much is the 2026 standard deduction for a retired couple both over 65?', a: `${usd(couple65)}: the ${sd(2026, 'mfj')} joint amount plus ${usd(y6.agedBlind.married)} for each spouse. If their modified AGI is ${usd(90000)}, the Schedule 1-A senior deduction adds ${usd(seniorCouple)} more for the two of them, so ${usd(couple65 + seniorCouple)} of income escapes federal tax before the brackets start. Above ${usd(y6.senior.phaseStart.mfj)} of modified AGI the senior part shrinks by 6% of the excess.` },
    { q: 'What is the standard deduction for a teenager with a summer job in 2026?', a: `A dependent's standard deduction is the larger of ${usd(y6.dependentStandard.minimum)} or earned income plus ${usd(y6.dependentStandard.earnedPlus)}, capped at the regular ${sd(2026, 'single')}. A student who earns ${usd(6000)} at a summer job deducts ${usd(6000 + y6.dependentStandard.earnedPlus)} and owes no federal income tax on those wages. Interest or dividends above ${usd(y6.kiddie)} can still be taxed, under the kiddie tax rules.` },
    { q: 'Did the standard deduction for my 2025 return change after I already had the numbers?', a: `Yes. Rev. Proc. 2024-40 had set ${usd(y5.standardBeforeLaw.single)}, ${usd(y5.standardBeforeLaw.hoh)} and ${usd(y5.standardBeforeLaw.mfj)} for 2025. Section 70102 of Public Law 119-21, signed in July 2025, raised them retroactively to ${sd(2025, 'single')}, ${sd(2025, 'hoh')} and ${sd(2025, 'mfj')}, and Rev. Proc. 2025-32 removed the old figures. The 2025 Form 1040 uses the higher amounts.` },
    { q: 'Can I take the standard deduction and still claim the tips and overtime deductions?', a: `Yes. The four Schedule 1-A deductions (tips, overtime, car loan interest and the senior deduction) are claimed on top of the standard deduction, or on top of itemized deductions. They reduce taxable income on Form 1040 line 13b without touching adjusted gross income. Married couples must file jointly to use them.` },
  ],
  body: (h) => `
<h2>All the 2026 and 2025 amounts in one table</h2>
${h.table(['Filing status', '2025 return', '2026 return', 'Extra per box at 65 or blind (2026)'], [
  ['Single', sd(2025, 'single'), sd(2026, 'single'), usd(y6.agedBlind.unmarried)],
  ['Married filing jointly', sd(2025, 'mfj'), sd(2026, 'mfj'), usd(y6.agedBlind.married)],
  ['Head of household', sd(2025, 'hoh'), sd(2026, 'hoh'), usd(y6.agedBlind.unmarried)],
  ['Married filing separately', sd(2025, 'mfs'), sd(2026, 'mfs'), usd(y6.agedBlind.married)],
], 'Rev. Proc. 2025-32 sections 3.01 and 4.14; additional amounts for 2025: ' + usd(y5.agedBlind.unmarried) + ' and ' + usd(y5.agedBlind.married), ['l', 'r', 'r', 'r'])}
<p>The extra amount is counted per box: one for being 65 or older on December 31, one for being blind. A single filer who is both gets ${usd(2 * y6.agedBlind.unmarried)} on top, the figure printed in the 2026 Form 1040-ES chart. Spouses each check their own boxes, so a joint return can add up to four times ${usd(y6.agedBlind.married)}. When one spouse itemizes on a separate return, the other's standard deduction drops to zero.</p>
<h2>Standard deduction and senior deduction are two different things</h2>
<p>The age-based addition has existed for decades and appears on the first page of Form 1040. The senior deduction is new, sits on ${h.a('schedule-1-a', 'Schedule 1-A')}, applies only from 2025 to 2028 and phases out with income: ${usd(y6.senior.amount)} per person minus 6% of modified AGI above ${usd(y6.senior.phaseStart.single)} (${usd(y6.senior.phaseStart.mfj)} on a joint return). A widow with ${usd(60000)} of modified AGI keeps all of it; with ${usd(120000)} she keeps ${usd(E.seniorDeduction(2026, 'single', 120000, 1).deduction)}. The ${h.a('senior-deduction', 'senior deduction calculator')} runs that phase-out alone.</p>
<h2>When itemizing beats it</h2>
<p>Itemizing pays when mortgage interest, state and local taxes up to the ${h.a('salt-deduction', 'SALT cap')}, charitable gifts and large medical bills add up to more than the amount in the table. With the cap at ${usd(y6.salt.cap)} for 2026, a married couple paying ${usd(22000)} of property and state income tax and ${usd(14000)} of mortgage interest reaches ${usd(36000)}, above the ${sd(2026, 'mfj')} joint standard deduction. The ${h.a('itemized-vs-standard-deduction', 'itemize-or-not calculator')} compares the two with the 2026 floor on charitable gifts. From 2026, non-itemizers also deduct up to ${usd(y6.charity.nonItemizer.single)} of cash gifts (${usd(y6.charity.nonItemizer.mfj)} joint), see the ${h.a('charitable-deduction', 'charitable deduction')} page.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('es2026', 'Form 1040-ES (2026) standard deduction chart')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['senior-deduction', 'itemized-vs-standard-deduction', 'tax-brackets', 'schedule-1-a', 'tax-refund-calculator'],
  sources: ['rp2532', 'es2026', 'law', 'sch1a'],
});
