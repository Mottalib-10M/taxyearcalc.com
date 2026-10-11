/**
 * Federal tax engine: pure functions over src/data/params-2026.json. No figure is typed here;
 * every amount comes from the parameters (RECETTE §4, §17.4). Each function names the form line
 * or the Code section it reproduces, and tests/engine.test.ts replays the IRS worked examples.
 */
import P from '../../data/params-2026.json';
export { P };

export type Year = 2025 | 2026;
export type Status = 'single' | 'mfj' | 'mfs' | 'hoh';
export const STATUSES: Status[] = ['single', 'mfj', 'hoh', 'mfs'];
export const STATUS_LABEL: Record<Status, string> = { single: 'Single', mfj: 'Married filing jointly', mfs: 'Married filing separately', hoh: 'Head of household' };

type Y = (typeof P.years)['2026'];
export const Y = (year: Year): Y => (P.years as unknown as Record<string, Y>)[String(year)];
export const S = P.statutory;
const pair = (s: Status) => (s === 'mfj' ? 'mfj' : 'single') as 'single' | 'mfj';
const pos = (x: number) => (x > 0 ? x : 0);

/* ---------------------------------------------------------------- brackets (§1(j)) */
export interface BracketRow { rate: number; from: number; to: number | null; taxed: number; tax: number }
export interface BracketResult { tax: number; marginal: number; average: number; rows: BracketRow[]; nextAt: number | null; roomInBracket: number | null }
export function brackets(year: Year, status: Status): Array<[number | null, number]> {
  return Y(year).brackets[status] as Array<[number | null, number]>;
}
/** Tax on taxable income by the rate schedule of Rev. Proc. 2025-32 §4.01 / 2024-40 §2.01. */
export function incomeTax(year: Year, status: Status, taxable: number): BracketResult {
  const t = pos(taxable);
  let from = 0; let tax = 0; let marginal = 0; let nextAt: number | null = null;
  const rows: BracketRow[] = [];
  for (const [to, rate] of brackets(year, status)) {
    const top = to ?? Infinity;
    const taxed = pos(Math.min(t, top) - from);
    const tx = (taxed * rate) / 100;
    rows.push({ rate, from, to, taxed, tax: tx });
    tax += tx;
    if (t > from || from === 0) { marginal = rate; nextAt = to; }
    from = top;
  }
  return { tax, marginal, average: t > 0 ? (tax / t) * 100 : 0, rows, nextAt, roomInBracket: nextAt === null ? null : nextAt - t };
}
/** Tax at the start of each bracket ("$X plus r% of the excess"), the way the Rev. Proc. prints it. */
export function bracketBases(year: Year, status: Status): number[] {
  let from = 0; let base = 0; const out: number[] = [];
  for (const [to, rate] of brackets(year, status)) { out.push(base); if (to !== null) { base += ((to - from) * rate) / 100; from = to; } }
  return out;
}

/* ---------------------------------------------------------------- standard deduction (§63) */
export interface StdInput { age65?: number; blind?: number; dependent?: boolean; earned?: number }
/** Basic standard deduction + additional amounts (per box checked: 65 or older, blind). §63(c), §63(f). */
export function standardDeduction(year: Year, status: Status, i: StdInput = {}) {
  const y = Y(year);
  let basic = y.standard[status];
  if (i.dependent) basic = Math.min(basic, Math.max(y.dependentStandard.minimum, (i.earned ?? 0) + y.dependentStandard.earnedPlus));
  const per = status === 'mfj' || status === 'mfs' ? y.agedBlind.married : y.agedBlind.unmarried;
  const boxes = (i.age65 ?? 0) + (i.blind ?? 0);
  return { basic, additional: per * boxes, per, total: basic + per * boxes };
}

/* ---------------------------------------------------------------- Schedule 1-A (P.L. 119-21) */
const obbbaYear = (year: number) => year >= S.obbbaYears[0] && year <= S.obbbaYears[1];
/** Lines 7-13 (tips) and 15-21 (overtime): $100 per full $1,000 of MAGI over the threshold (rounded DOWN). */
function stepDown(amount: number, magi: number, start: number, per: number, roundUp: boolean) {
  const over = pos(magi - start);
  const steps = roundUp ? Math.ceil(over / 1000) : Math.floor(over / 1000);
  const reduction = steps * per;
  return { reduction, deduction: pos(amount - reduction) };
}
export function tipsDeduction(year: Year, status: Status, tips: number, magi: number) {
  const y = Y(year);
  if (status === 'mfs' || !obbbaYear(year)) return { capped: 0, reduction: 0, deduction: 0, eligible: false, gone: y.tips.phaseStart[pair(status)] };
  const capped = Math.min(pos(tips), y.tips.max);
  const start = y.tips.phaseStart[pair(status)];
  const r = stepDown(capped, magi, start, y.tips.per1000, false);
  return { capped, ...r, eligible: true, gone: start + Math.ceil(capped / y.tips.per1000) * 1000 };
}
export function overtimeDeduction(year: Year, status: Status, premium: number, magi: number) {
  const y = Y(year);
  if (status === 'mfs' || !obbbaYear(year)) return { capped: 0, reduction: 0, deduction: 0, eligible: false, gone: 0 };
  const capped = Math.min(pos(premium), y.overtime.max[pair(status)]);
  const start = y.overtime.phaseStart[pair(status)];
  const r = stepDown(capped, magi, start, y.overtime.per1000, false);
  return { capped, ...r, eligible: true, gone: start + Math.ceil(capped / y.overtime.per1000) * 1000 };
}
/** FLSA premium inside total overtime pay: the part above the regular rate that the FLSA requires (half the regular
 *  rate per overtime hour). Notice 2025-69 examples: 1.5x pay of $15,000 → $5,000; 2x pay of $20,000 → $5,000. */
export const overtimePremium = (totalOvertimePay: number, multiplier: number) => (multiplier > 0 ? (pos(totalOvertimePay) * 0.5) / multiplier : 0);
/** Lines 24-30: $200 per $1,000 or fraction (rounded UP) over $100,000 ($200,000 joint). */
export function carLoanDeduction(year: Year, status: Status, interest: number, magi: number) {
  const y = Y(year);
  if (status === 'mfs' || !obbbaYear(year)) return { capped: 0, reduction: 0, deduction: 0, eligible: false };
  const capped = Math.min(pos(interest), y.carLoan.max);
  return { capped, ...stepDown(capped, magi, y.carLoan.phaseStart[pair(status)], y.carLoan.per1000, true), eligible: true };
}
/** Lines 31-37: $6,000 per person 65+, minus 6% of MAGI over $75,000 ($150,000 joint). */
export function seniorDeduction(year: Year, status: Status, magi: number, people: number) {
  const y = Y(year);
  if (status === 'mfs' || !obbbaYear(year)) return { each: 0, reduction: 0, deduction: 0, eligible: false, gone: 0 };
  const start = y.senior.phaseStart[pair(status)];
  const reduction = (pos(magi - start) * y.senior.rate) / 100;
  const each = pos(y.senior.amount - reduction);
  const n = status === 'mfj' ? Math.min(Math.max(people, 0), 2) : Math.min(Math.max(people, 0), 1);
  return { each, reduction, deduction: each * n, eligible: n > 0, gone: start + (y.senior.amount * 100) / y.senior.rate };
}

/* ---------------------------------------------------------------- SALT (§164(b)(6)-(7)) */
/** State and Local Tax Deduction Worksheet (Schedule A instructions): cap minus 30% of MAGI over the threshold,
 *  never below $10,000; half of each amount when married filing separately. */
export function saltDeduction(year: Year, status: Status, paid: number, magi: number) {
  const s = Y(year).salt;
  const half = status === 'mfs';
  const threshold = half ? s.threshold / 2 : s.threshold;
  const reduced = s.cap - (pos(magi - threshold) * s.rate) / 100;
  let cap = Math.max(reduced, s.floor);
  if (half) cap = cap / 2;
  return { cap, fullCap: half ? s.cap / 2 : s.cap, floor: half ? s.floor / 2 : s.floor, deduction: Math.min(pos(paid), cap), lost: pos(Math.min(pos(paid), half ? s.cap / 2 : s.cap) - Math.min(pos(paid), cap)), threshold, floorAt: threshold + ((s.cap - s.floor) * 100) / s.rate };
}

/* ---------------------------------------------------------------- capital gains (§1(h)) */
/** Long-term gains stacked on top of ordinary taxable income: 0% up to the zero-rate top, 15% up to the
 *  15%-rate top, 20% above (Rev. Proc. §4.03). Returns the gains tax only. */
export function capitalGainsTax(year: Year, status: Status, ordinaryTaxable: number, gains: number) {
  const cg = Y(year).capitalGains;
  const z = cg.zeroTop[status]; const f = cg.fifteenTop[status];
  const lo = pos(ordinaryTaxable); const hi = lo + pos(gains);
  const at0 = pos(Math.min(hi, z) - lo);
  const at15 = pos(Math.min(hi, f) - Math.max(lo, z));
  const at20 = pos(hi - Math.max(lo, f));
  const [r0, r15, r20] = S.capitalGainsRates.rates;
  return { at0, at15, at20, tax: (at0 * r0 + at15 * r15 + at20 * r20) / 100, zeroTop: z, fifteenTop: f };
}
/** 3.8% on the lesser of net investment income and MAGI over the threshold. */
export function niit(status: Status, magi: number, investmentIncome: number) {
  const base = Math.min(pos(investmentIncome), pos(magi - S.niit.threshold[status]));
  return { base, tax: (base * S.niit.rate) / 100, threshold: S.niit.threshold[status] };
}

/* ---------------------------------------------------------------- credits */
/** Child tax credit (Schedule 8812): $2,200 a child + $500 per other dependent, minus 5% of each $1,000 or
 *  fraction of AGI over $200,000 ($400,000 joint). Refundable part: 15% of earned income over $2,500, capped
 *  at $1,700 a child and at the credit not used against tax. */
export function childTaxCredit(year: Year, status: Status, kids: number, agi: number, taxBefore: number, earned: number, otherDependents = 0) {
  const y = Y(year); const c = S.ctcPhase;
  const gross = kids * y.ctc.max + otherDependents * c.otherDependent;
  const start = status === 'mfj' ? c.start.mfj : c.start.other;
  const steps = Math.ceil(pos(agi - start) / c.step);
  const reduction = (steps * c.step * c.pctPerStep) / 100;
  const allowed = pos(gross - reduction);
  const kidsPart = Math.min(allowed, kids * y.ctc.max);
  const nonrefundable = Math.min(allowed, pos(taxBefore));
  const unused = pos(Math.min(kidsPart, allowed) - nonrefundable);
  const refundable = Math.min(unused, kids * y.ctc.refundable, (pos(earned - c.refundFloor) * c.refundRate) / 100);
  return { gross, reduction, allowed, nonrefundable, refundable, total: nonrefundable + refundable, phaseStart: start, goneAt: start + Math.ceil(gross / ((c.step * c.pctPerStep) / 100)) * c.step };
}
/** Earned income credit by the §32(b) amounts (phase-in rate = max credit / earned income amount; the IRS table
 *  rounds to $50 bands, so results can differ from the printed table by a few dollars). */
export function eitc(year: Year, kids: number, earned: number, agi: number, mfj: boolean, investmentIncome = 0) {
  const e = Y(year).eitc; const k = Math.min(Math.max(kids, 0), 3);
  if (investmentIncome > e.investmentLimit) return { credit: 0, max: e.maxCredit[k], stage: 'investment' as const, phaseStart: 0, phaseEnd: 0 };
  const max = e.maxCredit[k]; const earnAmt = e.earnedAmount[k];
  const start = mfj ? e.phaseStartMfj[k] : e.phaseStart[k]; const end = mfj ? e.phaseEndMfj[k] : e.phaseEnd[k];
  const inRate = max / earnAmt; const outRate = max / (end - start);
  const fromEarned = Math.min(max, pos(earned) * inRate);
  const income = Math.max(pos(earned), pos(agi));
  const out = pos(max - pos(income - start) * outRate);
  const credit = Math.max(0, Math.min(fromEarned, out));
  const stage = income >= end ? 'none' : income > start ? 'phase-out' : earned < earnAmt ? 'phase-in' : 'plateau';
  return { credit, max, stage, phaseStart: start, phaseEnd: end, earnedAmount: earnAmt };
}

/* ---------------------------------------------------------------- AMT (§55) */
export function amt(year: Year, status: Status, amti: number) {
  const a = Y(year).amt;
  const exemption = pos(a.exemption[status] - (pos(amti - a.phaseStart[status]) * a.phaseRate) / 100);
  const base = pos(amti - exemption);
  const b28 = a.rate28Start[status];
  const tmt = Math.min(base, b28) * 0.26 + pos(base - b28) * 0.28;
  return { exemption, base, tentative: tmt };
}

/* ---------------------------------------------------------------- deductions with income limits */
/** Student loan interest (§221): $2,500 maximum, reduced proportionally across the MAGI range. */
export function studentLoanInterest(year: Year, status: Status, paid: number, magi: number) {
  const s = Y(year).studentLoan;
  if (status === 'mfs') return { deduction: 0, share: 0 };
  const [lo, hi] = s.phase[pair(status)];
  const base = Math.min(pos(paid), s.max);
  const share = magi <= lo ? 1 : magi >= hi ? 0 : (hi - magi) / (hi - lo);
  return { deduction: base * share, share, range: [lo, hi] as [number, number] };
}
/** Charitable gifts, 2026 rules (§170(p), §170(b)(1)(I)): non-itemizers deduct cash gifts up to $1,000 ($2,000
 *  joint); itemizers deduct only what exceeds 0.5% of the contribution base (AGI here). */
export function charity(year: Year, status: Status, cash: number, agi: number) {
  const c = Y(year).charity;
  const nonItemizer = Math.min(pos(cash), c.nonItemizer[pair(status)]);
  const floor = (pos(agi) * c.floorPct) / 100;
  return { nonItemizer, floor, itemized: pos(pos(cash) - floor) };
}
/** Home mortgage interest (§163(h)(3)): interest on the first $750,000 of acquisition debt ($1,000,000 if
 *  incurred before December 16, 2017; half when married filing separately), pro rata on the average balance. */
export function mortgageInterest(status: Status, balance: number, interest: number, grandfathered: boolean) {
  const m = S.mortgage;
  const limit = grandfathered ? (status === 'mfs' ? m.grandfatheredMfs : m.grandfathered) : status === 'mfs' ? m.limitMfs : m.limit;
  const share = balance <= limit ? 1 : limit / balance;
  return { limit, share, deductible: pos(interest) * share };
}

/* ---------------------------------------------------------------- retirement and health accounts */
export function k401Limit(year: Year, age: number) {
  const r = Y(2026).retirement; // only 2026 limits are on the site (Notice 2025-67)
  void year;
  const catchUp = age >= 60 && age <= 63 ? r.catchUp6063 : age >= 50 ? r.catchUp50 : 0;
  return { base: r.k401, catchUp, total: r.k401 + catchUp, total415c: r.total415c };
}
/** Roth IRA (§408A(c)(3)): the $7,500 ($8,600 at 50+) limit shrinks across the MAGI range, rounded UP to the next
 *  $10, and a reduced amount between $0 and $200 is raised to $200 (Pub. 590-A worksheet). */
export function rothLimit(status: Status, magi: number, age: number, compensation = Infinity) {
  const r = Y(2026).retirement;
  const full = Math.min(r.ira + (age >= 50 ? r.iraCatchUp50 : 0), pos(compensation));
  const key = status === 'mfj' ? 'mfj' : status === 'mfs' ? 'mfs' : 'single';
  const [lo, hi] = r.rothPhase[key];
  return { full, range: [lo, hi] as [number, number], limit: phaseLimit(full, magi, lo, hi) };
}
function phaseLimit(full: number, magi: number, lo: number, hi: number) {
  if (magi <= lo) return full;
  if (magi >= hi) return 0;
  let v = Math.ceil((full * (hi - magi)) / (hi - lo) / 10) * 10;
  if (v > 0 && v < 200) v = 200;
  return Math.min(v, full);
}
/** Traditional IRA deduction when covered by a workplace plan (§219(g)). */
export function iraDeduction(status: Status, magi: number, age: number, covered: boolean, spouseCovered: boolean) {
  const r = Y(2026).retirement;
  const full = r.ira + (age >= 50 ? r.iraCatchUp50 : 0);
  if (!covered && !spouseCovered) return { full, limit: full, range: null as null | [number, number] };
  let range: [number, number];
  if (covered) range = (r.iraDeductCovered[status === 'mfj' ? 'mfj' : status === 'mfs' ? 'mfs' : 'single'] as [number, number]);
  else range = status === 'mfs' ? [0, 10000] : (r.iraDeductSpouseCovered as [number, number]);
  return { full, limit: phaseLimit(full, magi, range[0], range[1]), range };
}
/** HSA (§223): self-only or family limit, + $1,000 at 55 or older, prorated by months of HDHP coverage. */
export function hsaLimit(family: boolean, age: number, months: number) {
  const h = Y(2026).hsa;
  const m = Math.min(Math.max(months, 0), 12);
  const base = family ? h.family : h.self;
  const catchUp = age >= 55 ? h.catchUp55 : 0;
  return { base, catchUp, limit: ((base + catchUp) * m) / 12 };
}

/* ---------------------------------------------------------------- payroll taxes */
export function fica(status: Status, wages: number, selfEmployed: boolean, year: Year = 2026) {
  const f = S.fica; const base = Y(2026).ssWageBase; void year;
  const earnings = selfEmployed ? (pos(wages) * f.selfEmployedBase) / 100 : pos(wages);
  const ssRate = selfEmployed ? f.socialSecurity * 2 : f.socialSecurity;
  const mcRate = selfEmployed ? f.medicare * 2 : f.medicare;
  const ss = (Math.min(earnings, base) * ssRate) / 100;
  const medicare = (earnings * mcRate) / 100;
  const additional = (pos(earnings - f.additionalThreshold[status]) * f.additionalMedicare) / 100;
  return { earnings, ss, medicare, additional, total: ss + medicare + additional, wageBase: base, overBase: pos(earnings - base) };
}
/** Excess social security withheld by two or more employers (credit on Schedule 3). */
export function excessSocialSecurity(wagesByEmployer: number[]) {
  const f = S.fica; const base = Y(2026).ssWageBase;
  const withheld = wagesByEmployer.reduce((s, w) => s + (Math.min(pos(w), base) * f.socialSecurity) / 100, 0);
  const due = (Math.min(wagesByEmployer.reduce((s, w) => s + pos(w), 0), base) * f.socialSecurity) / 100;
  return { withheld, due, excess: pos(withheld - due) };
}

/* ---------------------------------------------------------------- transfer taxes */
export function giftTax(year: Year, giftsPerRecipient: number[], splitWithSpouse: boolean) {
  const g = Y(year).gift.annual * (splitWithSpouse ? 2 : 1);
  const taxable = giftsPerRecipient.reduce((s, x) => s + pos(x - g), 0);
  return { exclusion: g, taxable, exemptionLeft: Y(year).estate.exclusion * (splitWithSpouse ? 2 : 1) - taxable };
}
/** Above the basic exclusion the unified credit has absorbed every bracket under 40%, so the tax is 40% of the
 *  excess (§2001(c), §2010). Lifetime taxable gifts use the same exclusion. */
export function estateTax(year: Year, taxableEstate: number, lifetimeGifts = 0, portability = 0) {
  const ex = Y(year).estate.exclusion + pos(portability);
  const base = pos(taxableEstate) + pos(lifetimeGifts);
  return { exclusion: ex, over: pos(base - ex), tax: (pos(base - ex) * S.estateRate.top) / 100 };
}

/* ---------------------------------------------------------------- business expensing */
export function section179(year: Year, cost: number, placedInService: number) {
  const s = Y(year).sec179;
  const limit = pos(s.limit - pos(placedInService - s.phaseStart));
  return { limit, expensed: Math.min(pos(cost), limit) };
}

/* ---------------------------------------------------------------- deadlines, penalties, interest */
/** Failure to file (5% a month, 25% max, reduced by the failure-to-pay part of the same month) and failure to
 *  pay (0.5% a month, 25% max). Minimum failure-to-file penalty after 60 days: lesser of the minimum or 100%. */
export function latePenalties(year: Year, unpaid: number, monthsLateFiling: number, monthsLatePaying: number, daysLateFiling = monthsLateFiling * 30) {
  const p = S.penalties; const u = pos(unpaid);
  const ftp = Math.min(u * (p.ftpPerMonth / 100) * Math.max(0, monthsLatePaying), (u * p.ftpMax) / 100);
  const fileMonths = Math.min(Math.max(0, monthsLateFiling), p.ftfMax / p.ftfPerMonth);
  const overlap = Math.min(fileMonths, Math.max(0, monthsLatePaying));
  let ftf = u * (p.ftfPerMonth / 100) * fileMonths - u * (p.ftpPerMonth / 100) * overlap;
  if (daysLateFiling > p.ftfMinimumAfterDays) ftf = Math.max(ftf, Math.min(Y(year).ftfMinimum, u));
  return { ftf: pos(ftf), ftp, total: pos(ftf) + ftp };
}
/** Interest on an unpaid balance, compounded daily at the quarterly underpayment rate (§6621, §6622). */
export function underpaymentInterest(amount: number, days: number, ratePct: number) {
  return pos(amount) * (Math.pow(1 + ratePct / 100 / 365, Math.max(0, days)) - 1);
}
/** Estimated tax: required annual payment = smaller of 90% of this year's tax and 100% (110% above $150,000 of
 *  prior-year AGI) of last year's tax; nothing is required under $1,000 owed after withholding. */
export function estimatedTax(thisYearTax: number, priorYearTax: number, priorAgi: number, withholding: number, mfs = false) {
  const e = S.estimated;
  const high = priorAgi > (mfs ? e.highIncomeAgiMfs : e.highIncomeAgi);
  const priorPct = high ? e.highIncomePct : e.priorYearPct;
  const required = Math.min((pos(thisYearTax) * e.currentYearPct) / 100, (pos(priorYearTax) * priorPct) / 100);
  const owed = pos(thisYearTax - withholding);
  const toPay = owed < e.owedThreshold ? 0 : pos(required - withholding);
  return { required, priorPct, owed, toPay, quarterly: toPay / 4, needed: owed >= e.owedThreshold && withholding < required };
}

/* ---------------------------------------------------------------- whole return */
export interface ReturnInput {
  year: Year; status: Status; wages: number; otherIncome: number; adjustments: number;
  itemized: number; age65: number; blind?: number; kids: number; tips: number; overtimePremium: number;
  carInterest?: number; withholding: number; ltcg?: number; dependent?: boolean; otherDependents?: number;
}
export function fullReturn(i: ReturnInput) {
  const agi = pos(i.wages + i.otherIncome + (i.ltcg ?? 0) - i.adjustments);
  const std = standardDeduction(i.year, i.status, { age65: i.age65, blind: i.blind ?? 0, dependent: i.dependent, earned: i.wages });
  const below = Math.max(std.total, pos(i.itemized));
  const tips = tipsDeduction(i.year, i.status, i.tips, agi);
  const ot = overtimeDeduction(i.year, i.status, i.overtimePremium, agi);
  const car = carLoanDeduction(i.year, i.status, i.carInterest ?? 0, agi);
  const senior = seniorDeduction(i.year, i.status, agi, i.age65);
  const extra = tips.deduction + ot.deduction + car.deduction + senior.deduction;
  const taxable = pos(agi - below - extra);
  const gains = Math.min(pos(i.ltcg ?? 0), taxable);
  const ordinary = taxable - gains;
  const ordTax = incomeTax(i.year, i.status, ordinary);
  const cg = capitalGainsTax(i.year, i.status, ordinary, gains);
  const taxBefore = ordTax.tax + cg.tax;
  const ctc = childTaxCredit(i.year, i.status, i.kids, agi, taxBefore, i.wages + i.tips, i.otherDependents ?? 0);
  const e = i.status === 'mfs' ? { credit: 0 } : eitc(i.year, i.kids, i.wages + i.tips, agi, i.status === 'mfj');
  const taxAfter = pos(taxBefore - ctc.nonrefundable);
  const refundable = ctc.refundable + e.credit;
  const balance = i.withholding + refundable - taxAfter;
  return {
    agi, standard: std.total, itemized: pos(i.itemized), usedItemized: pos(i.itemized) > std.total, below,
    tips: tips.deduction, overtime: ot.deduction, car: car.deduction, senior: senior.deduction, extra,
    taxable, taxBefore, marginal: ordTax.marginal, ctcNonrefundable: ctc.nonrefundable, actc: ctc.refundable, eitc: e.credit,
    taxAfter, refundable, withholding: i.withholding, refund: balance > 0 ? balance : 0, owe: balance < 0 ? -balance : 0, balance,
    effective: agi > 0 ? (taxAfter / agi) * 100 : 0,
  };
}

/* ---------------------------------------------------------------- refund timing */
const addDays = (iso: string, d: number) => { const t = new Date(`${iso}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + d); return t.toISOString().slice(0, 10); };
/** Expected refund date from the IRS rules of thumb: about 21 days after an accepted e-file with direct deposit,
 *  six weeks or more after a mailed return is received; returns claiming the EITC or the ACTC cannot be refunded
 *  before February 15 (PATH Act), and in 2026 the IRS expected most of them in accounts by March 2. A paper check
 *  adds mailing time (the IRS is phasing paper checks out). */
export function refundDate(filed: string, efile: boolean, credits: boolean, directDeposit: boolean) {
  const r = P.calendar.refunds;
  let date = efile ? addDays(filed, r.efileDays) : addDays(filed, r.paperWeeks * 7);
  let rule = efile ? `about ${r.efileDays} days after e-file acceptance` : `${r.paperWeeks} weeks or more after the IRS receives a paper return`;
  if (credits) {
    const yr = filed.slice(0, 4);
    const hold = `${yr}-${S.pathActHold}`;
    const typical = yr === '2026' ? P.calendar.season2026.eitcRefundsBy : addDays(hold, 15);
    if (date < typical) { date = typical; rule = yr === '2026' ? 'EITC/ACTC returns: most refunds in accounts by March 2, 2026' : 'EITC/ACTC returns: no refund before February 15, then bank processing'; }
  }
  if (!directDeposit) { date = addDays(date, 7); rule += ', plus mailing time for a paper check'; }
  return { date, rule, statusFrom: efile ? addDays(filed, 1) : addDays(filed, r.statusPaperWeeks * 7) };
}
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);

/* ---------------------------------------------------------------- other credits and exclusions */
/** Child and dependent care credit (§21). 2026 (P.L. 119-21 §70405): 50%, minus 1 point per $2,000 or fraction
 *  of AGI over $15,000 down to 35%, then minus 1 point per $2,000 ($4,000 joint) or fraction over $75,000
 *  ($150,000 joint) down to 20%. 2025: 35% minus 1 point per $2,000 over $15,000, down to 20%. */
export function dependentCareRate(year: Year, status: Status, agi: number) {
  const d = S.dependentCare;
  if (year === 2025) { const r = d.rate2025; return Math.max(r.floor, r.top - Math.ceil(pos(agi - r.start) / r.step)); }
  const r = d.rate2026;
  let rate = Math.max(r.mid, r.top - Math.ceil(pos(agi - r.start) / r.step));
  const k = pair(status);
  rate = Math.max(r.floor, rate - Math.ceil(pos(agi - r.secondStart[k]) / r.secondStep[k]));
  return rate;
}
export function dependentCareCredit(year: Year, status: Status, agi: number, expenses: number, people: number) {
  const cap = people >= 2 ? S.dependentCare.expenseCap[1] : people === 1 ? S.dependentCare.expenseCap[0] : 0;
  const counted = Math.min(pos(expenses), cap);
  const rate = dependentCareRate(year, status, agi);
  return { cap, counted, rate, credit: (counted * rate) / 100 };
}
/** Adoption credit (§23): expenses up to the limit, phased out linearly over the MAGI range; part refundable. */
export function adoptionCredit(year: Year, expenses: number, magi: number) {
  const a = Y(year).adoption;
  const base = Math.min(pos(expenses), a.max);
  const [lo, hi] = a.phase;
  const share = magi <= lo ? 1 : magi >= hi ? 0 : (hi - magi) / (hi - lo);
  const credit = base * share;
  return { credit, refundable: Math.min(credit, a.refundable), share };
}
/** Kiddie tax (§1(g)) for a child with unearned income only: the first $1,350 is covered by the dependent
 *  standard deduction, the next $1,350 is taxed at the child's 10% rate, the rest at the parents' top rate. */
export function kiddieTax(year: Year, unearned: number, parentRate: number) {
  const k = Y(year).kiddie;
  const free = Math.min(pos(unearned), k);
  const atChild = Math.min(pos(unearned - k), k);
  const atParent = pos(unearned - 2 * k);
  return { free, atChild, atParent, tax: (atChild * S.kiddieRate.childRate + atParent * parentRate) / 100 };
}
/** Foreign earned income exclusion (§911) with the stacking rule of the Foreign Earned Income Tax Worksheet:
 *  the income left after the exclusion is taxed at the rates that would apply if the excluded income were added. */
export function feie(year: Year, status: Status, foreignEarned: number, otherIncome: number, qualifyingDays: number) {
  const max = (Y(year).feie * Math.min(Math.max(qualifyingDays, 0), 365)) / 365;
  const excluded = Math.min(pos(foreignEarned), max);
  const std = standardDeduction(year, status).total;
  const taxableAfter = pos(foreignEarned + otherIncome - excluded - std);
  const tax = taxableAfter > 0 ? incomeTax(year, status, taxableAfter + excluded).tax - incomeTax(year, status, excluded).tax : 0;
  const withoutExclusion = incomeTax(year, status, pos(foreignEarned + otherIncome - std)).tax;
  return { max, excluded, taxableAfter, tax, withoutExclusion };
}
/** QBI deduction (§199A) below the threshold only: 20% of qualified business income, limited to 20% of taxable
 *  income before the deduction (net capital gain removed); 2026 minimum $400 with $1,000 of QBI. Above the
 *  threshold the W-2 wage and property limits apply and are not modeled. */
export function qbiDeduction(year: Year, status: Status, qbi: number, taxableBefore: number, netCapitalGain = 0) {
  const q = Y(2026).qbi;
  const threshold = year === 2026 ? q.threshold[status] : null;
  let ded = Math.min(pos(qbi) * 0.2, pos(taxableBefore - netCapitalGain) * 0.2);
  if (year === 2026 && qbi >= q.minimumIncome) ded = Math.max(ded, Math.min(q.minimumDeduction, pos(taxableBefore)));
  return { deduction: ded, aboveThreshold: threshold !== null && taxableBefore > threshold, threshold };
}
