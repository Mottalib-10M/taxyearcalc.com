/** Contract of a calculator (full tool or mini): fields with build-time defaults, and a pure `run` that calls
 *  the engine (src/lib/engine/tax.ts). One file per calculator in src/lib/tools/<kind>.ts (default export:
 *  a factory that receives the optional JSON argument written by the page). */
export interface Field {
  id: string; label: string; def: number;
  /** A list instead of a number box. Values are numbers written as strings. */
  options?: Array<{ value: string; label: string }>;
  unit?: string; max?: number; decimals?: number; help?: string;
}
export interface OutRow { label: string; value: string; /** 0..1, draws a proportional bar (RECETTE §17.2). */ bar?: number; strong?: boolean }
export interface Out { head: [string, string]; sub?: string; rows: OutRow[]; note?: string }
export interface ToolSpec { title: string; fields: Field[]; run: (v: Record<string, number>) => Out; cta?: { label: string; href: string } }
export type ToolFactory = (arg?: string) => ToolSpec;
