/** llms.txt (RECETTE §21): what the site covers, where its figures come from, and its main pages. */
import { PAGES } from '../lib/pages';
import { GROUPS } from '../lib/topics';
import { SITE_URL, SITE_NAMES, LAST_UPDATED } from '../data/site-config';
import { route } from '../i18n/routes';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> Calculators for every figure of the US federal tax years 2026 and 2025: brackets, standard deduction, the Schedule 1-A deductions of Public Law 119-21 (tips, overtime, car loan interest, seniors), SALT cap, credits, 401(k), IRA and HSA limits, deadlines, penalties and IRS refund timing. Figures from IRS Rev. Proc. 2025-32, Rev. Proc. 2024-40, Notice 2025-67, Rev. Proc. 2025-19, IRS forms and the statute. Last updated ${LAST_UPDATED}. Published by Radif Partners, independent, not affiliated with the IRS.`,
    '',
    `- [How we calculate](${SITE_URL}${route('method', 'en')}): formulas, sources, tests and limits`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
    '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, '', ...PAGES.filter((p) => p.group === g.id).map((p) => `- [${p.h1}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
