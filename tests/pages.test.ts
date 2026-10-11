/**
 * Every page file against the writing rules (CONTRIBUTING-PAGES.md, RECETTE §6, §7, §11, §21).
 * PAGE_FILES=id1,id2 limits the run to some pages (the uniqueness of questions is then checked among them).
 */
import { describe, expect, it } from 'vitest';
import { PAGES } from '../src/lib/pages';
import { helpers, SOURCES } from '../src/lib/helpers';
import { TOOLS } from '../src/lib/tools/registry';
const only = process.env.PAGE_FILES?.split(',').map((s) => s.trim()).filter(Boolean);
const list = only ? PAGES.filter((p) => only.includes(p.id)) : PAGES;
const words = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const BANNED = /—|&mdash;|it's important to note|dive into|delve|whether you're|navigate the|\bMoreover\b|\bAdditionally\b|\bFurthermore\b|in today's world/i;
describe('pages', () => {
  it('at least one page is checked', () => expect(list.length).toBeGreaterThan(0));
  const seenQ = new Map<string, string>(); const seenT = new Map<string, string>(); const seenD = new Map<string, string>(); const seenS = new Map<string, string>();
  for (const p of list) {
    describe(p.id, () => {
      const body = p.body(helpers());
      it('title 50-60, key term first, year, unique', () => {
        expect(p.title.length, p.title).toBeGreaterThanOrEqual(50); expect(p.title.length, p.title).toBeLessThanOrEqual(60);
        expect(p.title).toMatch(/202[5-7]/);
        expect(p.title).not.toMatch(/^(How|What|When|Can|Is|Do|Does|Why|Which|US|USA|American|United States|Calculator|Federal Tax Calculator)\b/);
        expect(seenT.get(p.title) ?? p.id).toBe(p.id); seenT.set(p.title, p.id);
      });
      it('description 150-160, year, unique', () => {
        expect(p.description.length, p.description).toBeGreaterThanOrEqual(150); expect(p.description.length, p.description).toBeLessThanOrEqual(160);
        expect(p.description).toMatch(/202[5-7]/);
        expect(seenD.get(p.description) ?? p.id).toBe(p.id); seenD.set(p.description, p.id);
      });
      it('slug without year, unique', () => { expect(p.slug).toMatch(/^[a-z0-9-]+$/); expect(p.slug).not.toMatch(/20\d\d/); expect(seenS.get(p.slug) ?? p.id).toBe(p.id); seenS.set(p.slug, p.id); });
      it('answer block: one paragraph of 120 words or more', () => { expect(words(p.resume)).toBeGreaterThanOrEqual(120); expect(p.resume).not.toMatch(/\n\n|<p/); });
      it('FAQ: 3 to 8 questions, answers 40 to 90 words, unique on the site', () => {
        expect(p.faqs.length).toBeGreaterThanOrEqual(3); expect(p.faqs.length).toBeLessThanOrEqual(8);
        for (const f of p.faqs) {
          const n = words(f.a); expect(n, `${f.q} (${n} words)`).toBeGreaterThanOrEqual(40); expect(n, `${f.q} (${n} words)`).toBeLessThanOrEqual(90);
          const k = f.q.toLowerCase().trim(); expect(seenQ.get(k) ?? p.id, f.q).toBe(p.id); seenQ.set(k, p.id);
        }
      });
      it('body length and banned words', () => {
        expect(words(body), 'body words').toBeGreaterThanOrEqual(p.kind === 'guide' ? 800 : 320);
        for (const t of [p.title, p.description, p.resume, body, ...p.faqs.map((f) => f.q + f.a)]) expect(t).not.toMatch(BANNED);
        expect(body).not.toMatch(/toFixed|NaN|undefined/);
      });
      it('calculators and sources exist', () => {
        if (p.kind === 'tool') expect(p.tool && TOOLS[p.tool]).toBeTruthy();
        else expect(p.mini && TOOLS[p.mini]).toBeTruthy();
        expect(p.sources.length).toBeGreaterThanOrEqual(2);
        for (const s of p.sources) expect(SOURCES[s], s).toBeTruthy();
        for (const m of body.matchAll(/<!--mini:([A-Za-z0-9_-]+)/g)) expect(TOOLS[m[1]], m[1]).toBeTruthy();
        expect(p.related.length).toBeGreaterThanOrEqual(3);
      });
    });
  }
});
