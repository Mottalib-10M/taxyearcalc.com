/** Every calculator runs on its build defaults and on its extremes without NaN, an empty result or a throw
 *  (RECETTE §17.3: a calculator that shows zero or nothing does not show in the code). */
import { describe, expect, it } from 'vitest';
import { TOOLS } from '../src/lib/tools/registry';
describe('calculators', () => {
  for (const [kind, f] of Object.entries(TOOLS)) {
    it(`${kind}: defaults, zeros and maximums`, () => {
      const spec = f();
      expect(spec.fields.length).toBeGreaterThan(0);
      const def = Object.fromEntries(spec.fields.map((x) => [x.id, x.def]));
      for (const v of [def, Object.fromEntries(spec.fields.map((x) => [x.id, x.options ? Number(x.options[0].value) : 0])), Object.fromEntries(spec.fields.map((x) => [x.id, x.options ? Number(x.options[x.options.length - 1].value) : (x.max ?? 1e6)]))]) {
        const out = spec.run(v);
        const txt = JSON.stringify(out);
        expect(txt).not.toMatch(/NaN|Infinity|undefined/);
        expect(out.head[1]).not.toBe('');
        expect(out.rows.length).toBeGreaterThan(0);
      }
      for (const x of spec.fields) if (x.options) expect(x.options.some((o) => Number(o.value) === x.def)).toBe(true);
    });
  }
});
