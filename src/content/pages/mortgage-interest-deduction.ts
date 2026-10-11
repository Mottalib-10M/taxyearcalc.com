import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, day, P } from '../../lib/kit';

const m = S.mortgage;
const big = E.mortgageInterest('mfj', 1000000, 62000, false);

export default definePage({
  id: 'mortgage-interest-deduction',
  group: 'deductions',
  kind: 'tool',
  order: 80,
  slug: 'mortgage-interest-deduction',
  nav: 'Mortgage interest',
  card: 'Interest on up to $750,000 of home debt, made permanent, and whether itemizing pays.',
  title: 'Mortgage Interest Deduction 2026: $750,000 Limit for Good',
  description: `Mortgage interest deduction 2026: interest on the first ${usd(m.limit)} of home debt (${usd(m.grandfathered)} for older loans), made permanent, and mortgage insurance counts again.`,
  h1: 'Mortgage interest deduction in 2026',
  intro: 'Which part of your mortgage interest is deductible, and whether it is enough to make itemizing worth it.',
  resume: `Home mortgage interest remains deductible in 2026 on up to ${usd(m.limit)} of debt used to buy, build or substantially improve a main or second home (${usd(m.limitMfs)} married filing separately), and Public Law 119-21 made that limit permanent instead of letting it return to ${usd(m.grandfathered)} after 2025 (section 70108). Mortgages taken out before December 16, 2017 keep the older ${usd(m.grandfathered)} limit. When the balance exceeds the limit, only the matching share of the interest is deductible: a couple with a ${usd(1000000)} post-2017 mortgage and ${usd(62000)} of interest deducts ${usd(big.deductible)}. From 2026 mortgage insurance premiums count as deductible interest again, after expiring for 2022 through 2025 according to IRS Publication 936. The deduction is an itemized deduction, so it only helps when mortgage interest, state and local taxes up to the ${usd(Y(2026).salt.cap)} cap and charitable gifts together exceed the ${usd(Y(2026).standard.mfj)} joint standard deduction. Home equity interest counts only when the loan improved the home.`,
  tool: 'mortgage',
  faqs: [
    { q: 'Is the $750,000 mortgage interest limit going back to $1 million?', a: `No. Under the 2017 law the ${usd(m.limit)} limit was due to expire after 2025, which would have restored ${usd(m.grandfathered)}. Section 70108 of Public Law 119-21 removed the expiration date, so ${usd(m.limit)} (${usd(m.limitMfs)} married filing separately) is now permanent for mortgages taken out after December 15, 2017. Older mortgages keep the grandfathered ${usd(m.grandfathered)} limit.` },
    { q: 'Can I deduct private mortgage insurance on my 2026 return?', a: `Yes, for 2026. Publication 936 says the itemized deduction for mortgage insurance premiums expired and could not be claimed for 2025. Public Law 119-21 treats qualified mortgage insurance premiums as mortgage interest again for taxable years beginning after December 31, 2025, so PMI paid in 2026 counts with the interest, subject to the same debt limit.` },
    { q: 'How is the interest split when my mortgage is above $750,000?', a: `Publication 936 uses the average balance: deductible interest equals total interest times ${usd(m.limit)} divided by the average mortgage balance for the year. With a ${usd(1000000)} average balance and ${usd(62000)} of interest, ${usd(big.deductible)} is deductible, ${Math.round(big.share * 100)}% of the total. The calculator applies that ratio to the balance you enter.` },
    { q: 'Is interest on a HELOC deductible in 2026?', a: `Only when the money was used to buy, build or substantially improve the home that secures the loan, and only within the ${usd(m.limit)} total for all acquisition debt. A home equity line used to pay credit cards, tuition or a car is not deductible. The permanent rules of section 70108 keep that treatment in place after 2025.` },
  ],
  body: (h) => `
<h2>Which limit applies to your loan</h2>
${h.table(['Mortgage taken out', 'Debt limit', 'Married filing separately'], [
  ['Before December 16, 2017 (or binding contract before December 15, 2017)', usd(m.grandfathered), usd(m.grandfatheredMfs)],
  ['After December 15, 2017', usd(m.limit), usd(m.limitMfs)],
  ['Refinanced older mortgage, up to the old balance', usd(m.grandfathered), usd(m.grandfatheredMfs)],
], 'IRS Publication 936 and section 163(h)(3)(F) as amended', ['l', 'r', 'r'])}
<p>The limit counts all acquisition debt on up to two homes together. A refinancing keeps the grandfathered status only up to the balance of the old loan just before the refinance; any cash taken out on top follows the current rules.</p>
<h2>Will itemizing beat the standard deduction?</h2>
<p>For most households the real question is not the limit but the comparison. In 2026 a married couple needs more than ${usd(Y(2026).standard.mfj)} of itemized deductions to gain anything. Interest on a ${usd(400000)} mortgage at 6.5% is about ${usd(26000)} in the early years; add ${usd(12000)} of property and state taxes and the couple itemizes ${usd(38000)}, ${usd(38000 - Y(2026).standard.mfj)} more than the standard deduction. At a 22% rate, the mortgage interest is then worth about ${usd(Math.round((38000 - Y(2026).standard.mfj) * 0.22))} of tax, far less than its face amount. The ${h.a('salt-deduction', 'SALT cap')} rose to ${usd(Y(2026).salt.cap)}, which makes itemizing more common in high-tax states.</p>
<h2>Married couples filing separately</h2>
<p>Each spouse filing separately has half the limit, ${usd(m.limitMfs)} for a recent mortgage, and if one spouse itemizes the other must itemize too, losing the standard deduction. Separate filers also lose the Schedule 1-A deductions and get half the SALT cap, so the mortgage interest deduction rarely justifies separate returns on its own.</p>
<h2>Points, second homes and rentals</h2>
<p>Points paid to buy a main home are generally deductible in the year paid; points on a refinance are spread over the loan. A second home counts if you use it personally; a home rented out most of the year falls under the rental rules of Schedule E instead. The ${h.a('itemized-vs-standard-deduction', 'itemize-or-not calculator')} adds the other deductions.</p>
<p>Sources: ${h.src('p936')}; section 70108 of ${h.src('law', 'Public Law 119-21')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['itemized-vs-standard-deduction', 'salt-deduction', 'standard-deduction', 'charitable-deduction', 'tax-brackets'],
  sources: ['p936', 'law', 'scha'],
});
