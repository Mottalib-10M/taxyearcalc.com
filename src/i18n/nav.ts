import { route, ROUTES, type Locale } from './routes';
import { PAGES, pageById } from '../lib/pages';
import { GROUPS } from '../lib/topics';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: '2026 tax year', method: 'How we calculate', about: 'About', widget: 'Embed a calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const label = (id: string, _lang?: Locale) => CORE[id] ?? pageById(id)?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: g.short, links: PAGES.filter((p) => p.group === g.id).map((p) => link(p.id, lang)) })).filter((c) => c.links.length);
}
// Methode : liee en bas de page, hors du menu du haut pour qu'il tienne sur une ligne.
export const navDirect = (_lang: Locale): NavLink[] => [];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.map((g) => ({ label: g.label, links: PAGES.filter((p) => p.group === g.id).map((p) => link(p.id, lang)) })).filter((c) => c.links.length),
  { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** No extra row: every page already sits in a footer column (RECETTE §18.2). */
export const popularLinks = (_lang: Locale): NavLink[] => [];
void ROUTES;
