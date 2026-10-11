import { definePage } from '../../lib/page-types';
import { E, Y, usd, day, P } from '../../lib/kit';

const r = Y(2026).retirement; const r5 = Y(2025).retirement;
const cov = r.iraDeductCovered; const c5 = r5.iraDeductCovered as unknown as typeof cov; const sp5 = r5.iraDeductSpouseCovered as unknown as number[];
const ex = E.iraDeduction('single', 86000, 40, true, false);

export default definePage({
  id: 'ira-contribution-limit',
  group: 'accounts',
  kind: 'tool',
  order: 20,
  slug: 'ira-contribution-limit',
  nav: 'IRA limit',
  card: 'The $7,500 IRA limit for 2026, the catch-up at 50 and the deduction ranges.',
  title: `IRA Contribution Limit 2026: ${usd(r.ira)}, ${usd(r.ira + r.iraCatchUp50)} at Age 50`,
  description: `IRA contribution limit 2026: ${usd(r.ira)}, or ${usd(r.ira + r.iraCatchUp50)} at 50 or older. Deduction phases out from ${usd(cov.single[0])} single if covered at work. Check your deductible amount.`,
  h1: 'IRA contribution limits for 2026',
  intro: 'The yearly ceiling for traditional and Roth IRAs combined, and the income ranges that limit the deduction.',
  resume: `For 2026 you can contribute up to ${usd(r.ira)} to your IRAs, traditional and Roth combined, or ${usd(r.ira + r.iraCatchUp50)} if you are 50 or older by the end of the year, up from ${usd(r5.ira)} in 2025 (IRS Notice 2025-67, which also raises the catch-up to ${usd(r.iraCatchUp50)}). You need taxable compensation at least equal to the contribution, though a working spouse's pay can fund an IRA for a spouse without earnings. Whether a traditional IRA contribution is deductible depends on workplace plans: if you are covered by a 401(k) or similar plan, the deduction phases out between ${usd(cov.single[0])} and ${usd(cov.single[1])} of modified AGI for a single filer and between ${usd(cov.mfj[0])} and ${usd(cov.mfj[1])} on a joint return; if only your spouse is covered, between ${usd(r.iraDeductSpouseCovered[0])} and ${usd(r.iraDeductSpouseCovered[1])}. A covered single worker earning ${usd(86000)} can deduct ${usd(ex.limit)} of a full contribution. Contributions for 2026 are accepted until ${day(Y(2026).deadlines.filing)}.`,
  tool: 'ira',
  faqs: [
    { q: 'Can I contribute $7,500 to both a traditional IRA and a Roth IRA in 2026?', a: `No. The ${usd(r.ira)} limit (${usd(r.ira + r.iraCatchUp50)} at 50) is shared by all your traditional and Roth IRAs for the year. You can split it, for example ${usd(4000)} traditional and ${usd(r.ira - 4000)} Roth, but not double it. A 401(k) at work has its own separate limit and does not reduce the IRA limit, though it can limit the IRA deduction.` },
    { q: 'Is my traditional IRA deductible if I have a 401k at work?', a: `Fully if your modified AGI is below ${usd(cov.single[0])} (single) or ${usd(cov.mfj[0])} (joint, covered spouse contributing); partly inside the ranges; not at all above ${usd(cov.single[1])} or ${usd(cov.mfj[1])}. Without any workplace plan for you or your spouse, the contribution is fully deductible at any income. A non-deductible contribution is reported on Form 8606.` },
    { q: 'What is the deadline to make a 2026 IRA contribution?', a: `The due date of the 2026 return without extensions, ${day(Y(2026).deadlines.filing)}. Tell the IRA custodian which year the contribution is for when you make it between January 1 and that date. Filing an extension does not extend the IRA deadline, unlike a SEP contribution, which can wait until the extended due date.` },
  ],
  body: (h) => `
<h2>Deduction ranges for 2026 and 2025</h2>
${h.table(['Situation', '2026 range (MAGI)', '2025 range'], [
  ['Single or head of household, covered at work', `${usd(cov.single[0])} to ${usd(cov.single[1])}`, `${usd(c5.single[0])} to ${usd(c5.single[1])}`],
  ['Married filing jointly, contributing spouse covered', `${usd(cov.mfj[0])} to ${usd(cov.mfj[1])}`, `${usd(c5.mfj[0])} to ${usd(c5.mfj[1])}`],
  ['Married filing jointly, only the other spouse covered', `${usd(r.iraDeductSpouseCovered[0])} to ${usd(r.iraDeductSpouseCovered[1])}`, `${usd(sp5[0])} to ${usd(sp5[1])}`],
  ['Married filing separately, covered', `${usd(cov.mfs[0])} to ${usd(cov.mfs[1])}`, `${usd(c5.mfs[0])} to ${usd(c5.mfs[1])}`],
], 'IRS Notice 2025-67, which gives both years', ['l', 'r', 'r'])}
<p>Inside a range the deductible amount shrinks in proportion, rounded up to the next $10, with a ${usd(200)} minimum as long as you are not above the range, the same worksheet rule as for the ${h.a('roth-ira-income-limit', 'Roth IRA')}.</p>
<h2>Traditional or Roth for 2026</h2>
<p>A deductible traditional contribution saves tax now at your marginal rate and is taxed on withdrawal; a Roth contribution saves nothing now and grows tax-free. Above the deduction range, a traditional contribution becomes non-deductible, which is mostly useful as the first step of a backdoor Roth for people above the ${h.a('roth-ira-income-limit', 'Roth income limit')}. The deduction lowers AGI, so it also helps with the ${h.a('student-loan-interest-deduction', 'student loan interest')} range and the ${h.a('senior-deduction', 'senior deduction')} phase-out.</p>
<h2>Spousal IRAs and compensation</h2>
<p>Each spouse has a separate limit. A spouse with no earnings can fund a full IRA on a joint return as long as the couple's combined taxable compensation covers both contributions, so a single-income couple can put ${usd(2 * r.ira)} into two IRAs, more at 50. Compensation means wages, self-employment income, taxable alimony under older divorce agreements and some stipends; interest, dividends, pensions and Social Security do not count. Notice 2025-67 raises the catch-up itself from ${usd(1000)} for 2025 to ${usd(r.iraCatchUp50)} for 2026.</p>
<h2>Saver's credit</h2>
<p>Low and moderate earners can also receive the saver's credit for IRA and 401(k) contributions. For 2026 Notice 2025-67 sets the AGI ceilings at ${usd(r.saverCredit.mfj[2])} for a joint return, ${usd(r.saverCredit.hoh[2])} for a head of household and ${usd(r.saverCredit.single[2])} for others, with higher credit rates below ${usd(r.saverCredit.mfj[0])} and ${usd(r.saverCredit.mfj[1])} on a joint return.</p>
<p>Source: ${h.src('n2567')}, read on ${day(P.retrieved_at)}.</p>`,
  related: ['roth-ira-income-limit', '401k-contribution-limit', 'hsa-contribution-limit', 'student-loan-interest-deduction', 'tax-deadline'],
  sources: ['n2567', 'iralimits'],
});
