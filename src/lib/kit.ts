/** The data kit passed to page bodies (`h.`) and importable by page files: parameters, engine and formatters.
 *  A figure of the parameters is never typed in a page: it is read here (RECETTE §17.4 point 7). */
import P from '../data/params-2026.json';
import * as E from './engine/tax';
import { usd, pct, num, day, listOf, usdx } from './fmt';
export { P, E, usd, pct, num, day, listOf, usdx };
export const Y = E.Y;
export const S = E.S;
export const SL = E.STATUS_LABEL;
/** Rate as a percentage string: 22 → "22%". */
export const r = (x: number) => pct(x);
export const KIT = { P, E, Y, S, SL, usd, usdx, pct, num, day, listOf, r };
export type Kit = typeof KIT;
