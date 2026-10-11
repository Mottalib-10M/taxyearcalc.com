/**
 * One page = ONE content file `src/content/pages/<id>.ts` (CONTRIBUTING-PAGES.md).
 * Routes, menus, footer, sitemap, schemas and internal links read these files alone.
 */
import type { Group } from './topics';
import type { Kit } from './kit';

export interface FAQ { q: string; a: string }

export interface Helpers extends Kit {
  /** Internal link by page id. An unknown id fails the page test. */
  a: (id: string, text: string) => string;
  /** Journal-style table; numbers are formatted, strings are inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to an official source of params-2026.json (key). */
  src: (key: string, text?: string) => string;
  ext: (url: string, text: string) => string;
  /** Ruled box in the press style. */
  box: (title: string, html: string) => string;
  /** Inline calculator (mini size) of src/lib/tools/<kind>.ts. */
  mini: (kind: string, arg?: unknown) => string;
  /** Long text folded in an accordion, still in the HTML (RECETTE §26). */
  fold: (title: string, html: string) => string;
}

export interface PageDef {
  id: string;
  group: Group;
  /** tool: the page is the calculator (data-outil, 500-700 words); guide: a question answered in 1,200 words or more with a mini. */
  kind: 'tool' | 'guide';
  order: number;
  /** URL segment, lowercase and dashes, no year. */
  slug: string;
  nav: string;
  card: string;
  /** 50 to 60 characters, key term first, the year included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, the year included. */
  description: string;
  h1: string;
  intro: string;
  /** ONE paragraph of 120 words or more, the direct answer with the figures (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
  /** Calculator of the page (src/lib/tools/<kind>.ts), full size, after the answer. */
  tool?: string;
  toolArg?: unknown;
  /** Guides: mini calculator after the answer. */
  mini?: string;
  miniArg?: unknown;
  related: string[];
  /** Keys of params-2026.json > sources. */
  sources: string[];
}
export const definePage = (p: PageDef): PageDef => p;
