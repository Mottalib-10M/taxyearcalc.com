/** Shared helpers of the calculators ("_" prefix: not a calculator). Formatting goes through Intl (RECETTE §4.1). */
import { formatMoney, formatNumber } from '../format';
import type { Status, Year } from '../engine/tax';
import { STATUS_LABEL } from '../engine/tax';
export { pct, day } from '../fmt';
export const usd = (x: number, d = 0) => formatMoney(x, d);
export const num = (x: number, d = 0) => formatNumber(x, d);
export const rate = (x: number, d = 1) => `${formatNumber(x, d)}%`;
export const STATUS_CODES: Status[] = ['single', 'mfj', 'hoh', 'mfs'];
export const statusField = (def: Status = 'single', allowed: Status[] = STATUS_CODES) => ({
  id: 'status', label: 'Filing status', def: STATUS_CODES.indexOf(def),
  options: allowed.map((s) => ({ value: String(STATUS_CODES.indexOf(s)), label: STATUS_LABEL[s] })),
});
export const statusOf = (v: number): Status => STATUS_CODES[v] ?? 'single';
export const yearField = (def: Year = 2026) => ({ id: 'year', label: 'Tax year', def, options: [{ value: '2026', label: '2026 (filed in 2027)' }, { value: '2025', label: '2025 (filed in 2026)' }] });
export const yearOf = (v: number): Year => (v === 2025 ? 2025 : 2026);
export const yesNo = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export function parseArg<T>(arg: string | undefined, fallback: T): T {
  if (!arg) return fallback;
  try { return { ...fallback, ...(JSON.parse(arg) as T) }; } catch { return fallback; }
}
export const share = (part: number, whole: number) => (whole > 0 ? Math.max(0, Math.min(1, part / whole)) : 0);
import { incomeTax, standardDeduction } from '../engine/tax';
/** Federal income tax saved by a below-the-line deduction for someone taking the standard deduction. */
export function taxSaved(year: Year, status: Status, magi: number, deduction: number) {
  const base = Math.max(0, magi - standardDeduction(year, status).total);
  const before = incomeTax(year, status, base);
  const after = incomeTax(year, status, Math.max(0, base - deduction));
  return { saved: before.tax - after.tax, marginal: before.marginal };
}
