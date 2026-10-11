import { definePage } from '../../lib/page-types';
import { E, Y, S, usd, day, P } from '../../lib/kit';

const c6 = Y(2026).ctc; const ph = S.ctcPhase;
const low = E.childTaxCredit(2026, 'hoh', 2, 24000, 0, 24000);
const mid = E.childTaxCredit(2026, 'mfj', 2, 90000, 6000, 90000);

export default definePage({
  id: 'child-tax-credit',
  group: 'credits',
  kind: 'tool',
  order: 10,
  slug: 'child-tax-credit',
  nav: 'Child tax credit',
  card: 'The $2,200 credit per child for 2026, the refundable part and the income phase-out.',
  title: `Child Tax Credit 2026: ${usd(c6.max)} per Child, ${usd(c6.refundable)} Refundable`,
  description: `Child tax credit 2026: ${usd(c6.max)} per child under 17, up to ${usd(c6.refundable)} refundable, reduced by $50 per $1,000 of AGI over ${usd(ph.start.other)} (${usd(ph.start.mfj)} joint). Estimate yours.`,
  h1: 'The child tax credit for 2026',
  intro: 'How much the credit gives per child, how much can come back as a refund, and where income starts to reduce it.',
  resume: `The child tax credit is ${usd(c6.max)} for each qualifying child under 17 at the end of 2026, the amount Public Law 119-21 set for 2025 and indexed afterward (Rev. Proc. 2025-32 section 4.05 keeps it at ${usd(c6.max)} for 2026). It first reduces your income tax; if the tax is too small to absorb it, up to ${usd(c6.refundable)} per child can be paid as the additional child tax credit, computed as ${ph.refundRate}% of earned income above ${usd(ph.refundFloor)}. The credit shrinks by ${usd(50)} for each ${usd(1000)} or part of ${usd(1000)} of modified AGI above ${usd(ph.start.other)}, or ${usd(ph.start.mfj)} on a joint return. A single parent with two children and ${usd(24000)} of wages owes no income tax but receives ${usd(low.refundable)} as a refundable credit; a couple with two children and ${usd(90000)} of income uses the full ${usd(mid.total)}. The child needs a Social Security number valid for work issued before the return's due date, and at least one parent on a joint return needs one too. Other dependents, such as older children or parents, bring a ${usd(ph.otherDependent)} credit instead.`,
  tool: 'ctc',
  faqs: [
    { q: 'Is the child tax credit $2,200 or $2,500 for 2026?', a: `${usd(c6.max)}. Public Law 119-21 set the credit at ${usd(c6.max)} for 2025 and provided an inflation adjustment for later years, and section 4.05 of Rev. Proc. 2025-32 gives ${usd(c6.max)} for taxable years beginning in 2026. The refundable portion is ${usd(c6.refundable)} per child for 2026, the same as for 2025.` },
    { q: 'How much of the child tax credit can I get back if I owe no tax?', a: `Up to ${usd(c6.refundable)} per child, limited to ${ph.refundRate}% of your earned income above ${usd(ph.refundFloor)}. A parent with ${usd(15000)} of wages and two children gets ${usd(E.childTaxCredit(2026, 'single', 2, 15000, 0, 15000).refundable)}; at ${usd(25200)} of wages the full ${usd(2 * c6.refundable)} for two children is reached. Refunds that include this credit are not released before mid-February.` },
    { q: 'At what income does the child tax credit disappear?', a: `It depends on the number of children. The reduction is ${usd(50)} per ${usd(1000)} above ${usd(ph.start.mfj)} for a joint return, so one child's ${usd(c6.max)} is gone at ${usd(E.childTaxCredit(2026, 'mfj', 1, 0, 0, 0).goneAt)} of modified AGI and two children's credit at ${usd(E.childTaxCredit(2026, 'mfj', 2, 0, 0, 0).goneAt)}. For other filers the reduction starts at ${usd(ph.start.other)}.` },
    { q: 'Does my child need a Social Security number for the child tax credit?', a: `Yes. The child must have a Social Security number valid for employment, issued before the due date of the return including extensions. Since 2025 the law also requires a valid SSN for the taxpayer; on a joint return one spouse is enough, the other needing an SSN or ITIN, according to the 2026 Form 1040-ES. A child with only an ITIN can still bring the ${usd(ph.otherDependent)} credit for other dependents.` },
  ],
  body: (h) => `
<h2>Credit by income for a family with two children</h2>
${h.table(['AGI (married filing jointly)', 'Income tax before credit', 'Credit used against tax', 'Refundable part', 'Total credit'], [20000, 40000, 60000, 120000, 405000, 450000].map((a) => { const tax = E.incomeTax(2026, 'mfj', Math.max(0, a - Y(2026).standard.mfj)).tax; const c = E.childTaxCredit(2026, 'mfj', 2, a, tax, a); return [usd(a), usd(tax), usd(c.nonrefundable), usd(c.refundable), usd(c.total)]; }), 'Two qualifying children, 2026, all income earned, standard deduction', ['l', 'r', 'r', 'r', 'r'])}
<p>At low incomes the credit is mostly refundable and grows with earnings, 15 cents per dollar above ${usd(ph.refundFloor)}; between roughly ${usd(40000)} and ${usd(ph.start.mfj)} a joint family gets the full credit, first against its tax; above the threshold it falls by 5% of the excess, rounded up to the next ${usd(1000)} of income.</p>
<h2>Who counts as a qualifying child</h2>
<p>A son, daughter, stepchild, eligible foster child, brother, sister or a descendant of one, under 17 on December 31, who lived with you more than half the year, did not provide more than half of his or her own support, is claimed as your dependent and is a US citizen, national or resident alien. A child who turns 17 during 2026 no longer qualifies for the ${usd(c6.max)} credit but can bring the ${usd(ph.otherDependent)} credit for other dependents. Divorced parents can shift the credit to the noncustodial parent with Form 8332; head of household status stays with the custodial parent.</p>
<h2>Refund timing and other family credits</h2>
<p>Returns that claim the additional child tax credit cannot be refunded before mid-February under the PATH Act; in the 2026 season the IRS expected most of those refunds in accounts by ${day(P.calendar.season2026.eitcRefundsBy)} for direct deposit. The ${h.a('earned-income-credit', 'earned income credit')}, the ${h.a('child-and-dependent-care-credit', 'dependent care credit')}, now up to 50% of expenses for low incomes, and the ${h.a('adoption-credit', 'adoption credit')} can be claimed on the same return. Run the whole return in the ${h.a('tax-refund-calculator', 'refund estimator')}, or the dates in the ${h.a('irs-refund-schedule', 'refund schedule')}.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('sch8812')}; ${h.src('ctc')}; ${h.src('es2026', 'Form 1040-ES (2026), changes to the child tax credit')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['earned-income-credit', 'child-and-dependent-care-credit', 'tax-refund-calculator', 'when-will-i-get-my-refund', 'head-of-household-brackets'],
  sources: ['rp2532', 'sch8812', 'ctc', 'es2026', 'law'],
});
