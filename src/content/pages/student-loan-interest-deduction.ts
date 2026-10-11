import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const s6 = Y(2026).studentLoan; const s5 = Y(2025).studentLoan;
const mid = E.studentLoanInterest(2026, 'single', 2500, 92500);

export default definePage({
  id: 'student-loan-interest-deduction',
  group: 'deductions',
  kind: 'tool',
  order: 100,
  slug: 'student-loan-interest-deduction',
  nav: 'Student loan interest',
  card: 'Up to $2,500 of interest, phased out between $85,000 and $100,000 single in 2026.',
  title: `Student Loan Interest Deduction 2026: ${usd(s6.max)} and Limits`,
  description: `Student loan interest deduction 2026: up to ${usd(s6.max)} a year, phased out from ${usd(s6.phase.single[0])} to ${usd(s6.phase.single[1])} single and ${usd(s6.phase.mfj[0])} to ${usd(s6.phase.mfj[1])} joint. Check how much you keep.`,
  h1: 'Student loan interest deduction for 2026',
  intro: 'An adjustment to income worth up to $2,500 a year, and the income range where it fades away.',
  resume: `Interest paid on a qualified student loan is deductible up to ${usd(s6.max)} a year, and unlike most deductions it is an adjustment to income: it lowers AGI and is available whether you itemize or not. For 2026 the deduction starts to shrink when modified AGI passes ${usd(s6.phase.single[0])} for a single filer or head of household and ${usd(s6.phase.mfj[0])} on a joint return, and it disappears at ${usd(s6.phase.single[1])} and ${usd(s6.phase.mfj[1])} (Rev. Proc. 2025-32 section 4.29). For 2025 the joint range was ${usd(s5.phase.mfj[0])} to ${usd(s5.phase.mfj[1])} and the single range ${usd(s5.phase.single[0])} to ${usd(s5.phase.single[1])}. Inside the range the reduction is proportional: a single borrower with ${usd(92500)} of modified AGI, halfway through, deducts ${usd(mid.deduction)} of ${usd(2500)} paid. Married filing separately gets no deduction, and someone claimed as a dependent cannot take it. The lender reports the interest on Form 1098-E when it reaches ${usd(600)}.`,
  tool: 'studentLoan',
  faqs: [
    { q: 'What is the income limit for the student loan interest deduction in 2026?', a: `The deduction begins to phase out at ${usd(s6.phase.single[0])} of modified AGI for single filers and heads of household and at ${usd(s6.phase.mfj[0])} for married couples filing jointly. It is gone at ${usd(s6.phase.single[1])} and ${usd(s6.phase.mfj[1])}. These figures come from section 4.29 of Rev. Proc. 2025-32; the ${usd(s6.max)} maximum itself is not indexed.` },
    { q: 'Can my parents deduct the interest on my student loan?', a: `Only if they are legally obligated on the loan, for example as cosigners or because it is a Parent PLUS loan in their name, and they actually pay it. If they claim you as a dependent, you cannot take the deduction yourself. If nobody claims you and you pay the interest on a loan in your name, the deduction is yours.` },
    { q: 'Does an employer paying my student loan affect the deduction?', a: `Employer payments of student loan principal or interest are excluded from income up to ${usd(5250)} a year under an educational assistance program, a rule Public Law 119-21 made permanent. Interest your employer paid tax-free cannot also be deducted by you; only interest you paid with your own taxed income counts toward the ${usd(s6.max)}.` },
  ],
  body: (h) => `
<h2>How the proportional phase-out works</h2>
<p>The IRS worksheet multiplies the interest you paid, capped at ${usd(s6.max)}, by the share of the phase-out range your income has not yet crossed. For a single filer in 2026 the range is ${usd(s6.phase.single[1] - s6.phase.single[0])} wide, so every ${usd(1500)} of income above ${usd(s6.phase.single[0])} removes a tenth of the deduction. Modified AGI here is AGI before the deduction itself, plus any foreign earned income exclusion.</p>
${h.table(['Modified AGI (single)', 'Share kept', 'Deduction on $2,500 paid'], [80000, 85000, 88000, 92500, 97000, 100000].map((m) => { const d = E.studentLoanInterest(2026, 'single', 2500, m); return [usd(m), `${Math.round(d.share * 100)}%`, usd(d.deduction)]; }), 'Computed with the 2026 range of Rev. Proc. 2025-32', ['l', 'r', 'r'])}
<h2>What counts as qualified interest</h2>
<p>The loan must have been taken out only to pay qualified education expenses (tuition, fees, books, room and board) for you, your spouse or a dependent, while enrolled at least half time in a degree program. Federal and private loans both qualify; a loan from a relative or from an employer plan does not. Interest on a refinanced student loan keeps qualifying as long as the new loan only replaced the old one. Voluntary interest payments during a deferment count in the year paid.</p>
<h2>Payments during forgiveness programs and income-driven plans</h2>
<p>Interest only counts when you actually pay it. On an income-driven repayment plan where the monthly payment does not cover the accrued interest, only the interest portion of what you paid is deductible; unpaid interest added to the balance becomes deductible later, when paid. Form 1098-E shows the interest your servicer received in the year, and you can deduct interest under ${usd(600)} even without the form if you can document it.</p>
<h2>Why it is worth more than it looks</h2>
<p>Because it lowers AGI, the deduction also helps with limits measured on AGI: the ${h.a('earned-income-credit', 'earned income credit')}, the ${h.a('roth-ira-income-limit', 'Roth IRA income limit')}, the 0.5% floor on charitable gifts. Its direct value is the deduction times your marginal rate, ${usd(550)} at most in the 22% bracket. The ${h.a('tax-brackets', 'bracket calculator')} shows your rate.</p>
<p>Source: ${h.src('rp2532')}; 2025 range: ${h.src('rp2440')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['tax-brackets', 'standard-deduction', 'roth-ira-income-limit', 'itemized-vs-standard-deduction', 'tax-refund-calculator'],
  sources: ['rp2532', 'rp2440', 'law'],
});
