import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const q = Y(2026).qbi;
const ex = E.qbiDeduction(2026, 'single', 60000, 70000);
const small = E.qbiDeduction(2026, 'single', 1500, 50000);

export default definePage({
  id: 'qualified-business-income-deduction',
  group: 'estates',
  kind: 'tool',
  order: 40,
  slug: 'qualified-business-income-deduction',
  nav: 'QBI deduction',
  card: 'The 20% deduction for pass-through income, the 2026 thresholds and the new $400 minimum.',
  title: `QBI Deduction 2026: 20% of Business Income and Thresholds`,
  description: `QBI deduction 2026: 20% of qualified business income, made permanent, full below ${usd(q.threshold.single)} of taxable income single or ${usd(q.threshold.mfj)} joint, and a new ${usd(q.minimumDeduction)} minimum.`,
  h1: 'The qualified business income deduction in 2026',
  intro: 'A deduction of up to 20% of pass-through business income, now permanent, with a new floor for small owners.',
  resume: `The qualified business income deduction, section 199A, lets owners of sole proprietorships, partnerships, S corporations and many rental businesses deduct up to 20% of their qualified business income. Public Law 119-21 made it permanent and, from 2026, guarantees a minimum deduction of ${usd(q.minimumDeduction)} to owners with at least ${usd(q.minimumIncome)} of qualified business income from active businesses (section 70105). Below the 2026 threshold of ${usd(q.threshold.single)} of taxable income for most filers and ${usd(q.threshold.mfj)} for married couples filing jointly (Rev. Proc. 2025-32 section 4.26), the deduction is simply the smaller of 20% of qualified business income and 20% of taxable income before the deduction, net capital gain removed. A freelance designer with ${usd(60000)} of business income and ${usd(70000)} of taxable income deducts ${usd(ex.deduction)}. Above the threshold, limits based on W-2 wages paid and on the cost of business property phase in, and specified service businesses such as law, health and consulting lose the deduction gradually. The calculator handles the case under the threshold only, the one most small owners are in.`,
  tool: 'qbi',
  faqs: [
    { q: 'What is the new minimum QBI deduction in 2026?', a: `${usd(q.minimumDeduction)}, for taxpayers with at least ${usd(q.minimumIncome)} of qualified business income from one or more active trades or businesses in which they materially participate, under section 199A(i) added by Public Law 119-21. A side business earning ${usd(1500)} would otherwise give a ${usd(300)} deduction; with the floor it gives ${usd(small.deduction)}. Both amounts are indexed from 2027.` },
    { q: 'Does the QBI deduction reduce self-employment tax?', a: `No. The deduction lowers taxable income for federal income tax only, after AGI, much like the standard deduction; it does not reduce net earnings from self-employment, so the 15.3% self-employment tax is unchanged. It also does not reduce AGI, so limits based on AGI ignore it. It can be claimed with the standard deduction or with itemized deductions.` },
    { q: 'What happens to the QBI deduction above the income threshold?', a: `Above ${usd(q.threshold.single)} of taxable income (${usd(q.threshold.mfj)} joint) in 2026, the deduction for each business becomes limited by the W-2 wages it pays and the cost of its qualified property, a limit phased in up to ${usd(q.phaseEnd.single)} (${usd(q.phaseEnd.mfj)} joint). For a specified service business the deduction itself phases out. Form 8995-A handles that computation.` },
  ],
  body: (h) => `
<h2>2026 thresholds</h2>
${h.table(['Filing status', 'Threshold (taxable income)', 'Phase-in range ends'], [
  ['Married filing jointly', usd(q.threshold.mfj), usd(q.phaseEnd.mfj)],
  ['Married filing separately', usd(q.threshold.mfs), usd(q.phaseEnd.mfs)],
  ['All other returns', usd(q.threshold.single), usd(q.phaseEnd.single)],
], 'Rev. Proc. 2025-32 section 4.26', ['l', 'r', 'r'])}
<h2>What counts as qualified business income</h2>
<p>Net income from a trade or business conducted in the United States through a sole proprietorship, a partnership, an S corporation, a trust or estate, including many rental activities that rise to the level of a business. It excludes wages earned as an employee, reasonable compensation paid to an S corporation owner, guaranteed payments to partners, capital gains, most interest and dividends. Qualified REIT dividends and publicly traded partnership income have their own 20% component.</p>
<h2>Below the threshold: a simple computation</h2>
<p>Under the threshold, the business type does not matter: a dentist and a plumber with the same income get the same deduction. Twenty percent of qualified business income is compared with twenty percent of taxable income before the deduction, minus net capital gain, and the smaller amount is deducted on Form 8995. With ${usd(60000)} of business income and ${usd(30000)} of taxable income, the deduction is ${usd(E.qbiDeduction(2026, 'single', 60000, 30000).deduction)}, held down by the taxable income limit.</p>
<h2>Rental real estate</h2>
<p>Rental income counts as qualified business income only when the rental rises to the level of a trade or business. Many landlords with several properties, regular repairs and active management meet that standard; someone renting a single condo with a property manager may not. A landlord unsure of the status should read the IRS guidance on rentals under section 199A before claiming the deduction, since the answer depends on the facts of each rental.</p>
<h2>Planning notes</h2>
<p>Deductions that lower business income, such as ${h.a('bonus-depreciation', 'bonus depreciation')} or a self-employed retirement contribution, also lower the QBI deduction, by 20 cents per dollar. Staying under the threshold can matter for service businesses near it, since crossing it starts the phase-out. The deduction is subtracted after AGI, like the ${h.a('schedule-1-a', 'Schedule 1-A deductions')}.</p>
<p>Sources: ${h.src('rp2532')}; ${h.src('law')}; ${h.src('es2026', 'Form 1040-ES (2026), changes to QBID')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['bonus-depreciation', 'estimated-tax-payments', 'fica-tax-rate', 'tax-brackets', 'one-big-beautiful-bill-tax-changes'],
  sources: ['rp2532', 'law', 'es2026'],
});
