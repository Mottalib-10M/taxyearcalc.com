/**
 * One component for every calculator of the site, driven by a spec of src/lib/tools/<kind>.ts.
 * - size "full": the tool of a page (fields, result card with bars, copy / share link / print, state in the
 *   address bar only after an action of the visitor, RECETTE §17.2 and §18.1);
 * - size "mini": the small simulator placed in the text (RECETTE §9.3).
 * First render = build defaults; the shared link is read in an effect after hydration (RECETTE §17.5).
 * `data-chrome`: the labels of the widget count neither in the words nor in the page comparison.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { getTool } from '../../lib/tools/registry';
import { readParams, updateURL } from '../../lib/url-state';

interface Props { kind: string; arg?: string; size?: 'full' | 'mini'; methodHref?: string; href?: string; idPrefix?: string; lead?: boolean }

export default function Calc({ kind, arg, size = 'full', methodHref, href, idPrefix, lead = false }: Props) {
  const spec = useMemo(() => getTool(kind, arg), [kind, arg]);
  const pre = idPrefix ?? `${size === 'mini' ? 'm' : 't'}-${kind}`;
  const [v, setV] = useState<Record<string, number>>(() => Object.fromEntries(spec.fields.map((f) => [f.id, f.def])));
  const [copied, setCopied] = useState('');
  useEffect(() => {
    if (size !== 'full') return;
    const sp = readParams(window.location.search);
    const next: Record<string, number> = {};
    for (const f of spec.fields) { const x = sp.get(f.id); if (x !== null && !Number.isNaN(Number(x))) next[f.id] = Number(x); }
    if (Object.keys(next).length) setV((o) => ({ ...o, ...next }));
  }, [size, spec]);
  useEffect(() => { if (size === 'full') updateURL(v); }, [v, size]);
  const out = useMemo(() => spec.run(v), [v, spec]);
  const set = (id: string) => (x: number) => setV((o) => ({ ...o, [id]: x }));
  const fields = spec.fields.map((f) => f.options
    ? <SelectField key={f.id} id={`${pre}-${f.id}`} label={f.label} value={String(v[f.id])} onChange={(x) => set(f.id)(Number(x))} options={f.options} help={f.help} />
    : <NumberField key={f.id} id={`${pre}-${f.id}`} label={f.label} value={v[f.id]} onChange={set(f.id)} unit={f.unit} max={f.max} decimals={f.decimals} help={f.help} />);
  const text = () => [spec.title, `${out.head[0]}: ${out.head[1]}`, ...out.rows.map((r) => `${r.label}: ${r.value}`)].join('\n');
  const copy = async (what: 'result' | 'link') => {
    try { await navigator.clipboard.writeText(what === 'result' ? text() : window.location.href); setCopied(what); setTimeout(() => setCopied(''), 1800); } catch { /* clipboard refused: nothing to do */ }
  };
  const wide = spec.fields.length > 4;
  // Phone (RECETTE §5, 2026-10-11): the fields stack above the result, so the key figure follows the
  // visitor in a bar held at the bottom of the screen until the result card itself comes into view.
  const bar = (
    <div aria-hidden="true" className={`sticky bottom-0 z-10 flex items-baseline justify-between gap-3 border-t-2 border-accent-600 bg-accent-50 px-4 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] ${size === 'mini' ? '' : '-mx-4 sm:-mx-5 sm:px-5'} lg:hidden`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-accent-800">{out.head[0]}</span>
      <span className="tabular-nums text-xl font-bold text-navy-900">{out.head[1]}</span>
    </div>
  );
  if (size === 'mini') {
    return (
      <div data-chrome data-mini={kind} className="not-prose my-8 border-l-4 border-accent-600 bg-white py-4 pl-4 pr-2 sm:pl-5">
        <p className="font-serif text-lg font-semibold text-navy-900">{spec.title}</p>
        <div className={`mt-3 grid gap-5 ${wide ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : 'sm:grid-cols-2'}`}>
          <form className={`grid grid-cols-1 content-start self-start gap-x-4 gap-y-3 ${wide ? 'sm:grid-cols-2' : ''}`} onSubmit={(e) => e.preventDefault()}>{fields}</form>
          {lead && bar}
          <div aria-live="polite" data-resultat className="bg-accent-50 p-4">
            <p className="text-sm font-medium text-navy-700">{out.head[0]}</p>
            <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{out.head[1]}</p>
            {out.sub && <p className="mt-1 text-sm text-navy-700">{out.sub}</p>}
            <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
              {out.rows.map((r) => <tr key={r.label}><td className="py-1.5 pr-3 text-navy-700">{r.label}</td><td className={`tabular-nums py-1.5 text-right text-navy-900 ${r.strong ? 'font-semibold' : ''}`}>{r.value}</td></tr>)}
            </tbody></table>
            {out.note && <p className="mt-2 text-xs text-navy-600">{out.note}</p>}
          </div>
        </div>
        {(spec.cta?.href ?? href) && <a href={spec.cta?.href ?? href} className="mt-3 inline-block text-sm font-semibold text-accent-700 underline underline-offset-2">{spec.cta?.label ?? 'Open the full calculator'}</a>}
      </div>
    );
  }
  return (
    <div data-chrome data-tool={kind} className="not-prose border border-navy-200 bg-white">
      <p className="border-b border-navy-200 px-4 py-3 font-serif text-lg font-semibold text-navy-900 sm:px-5">{spec.title}</p>
      <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="grid grid-cols-1 content-start self-start gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>{fields}</form>
        {bar}
        <div aria-live="polite" data-resultat className="bg-accent-50 p-4 sm:p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-800">{out.head[0]}</p>
          <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{out.head[1]}</p>
          {out.sub && <p className="mt-1 text-sm text-navy-700">{out.sub}</p>}
          <ul className="mt-4 space-y-2">
            {out.rows.map((r) => (
              <li key={r.label} className="text-sm">
                <div className="flex justify-between gap-3"><span className="text-navy-700">{r.label}</span><span className={`tabular-nums text-navy-900 ${r.strong ? 'font-semibold' : ''}`}>{r.value}</span></div>
                {r.bar !== undefined && <div className="mt-1 h-1.5 bg-white" aria-hidden="true"><div className="h-1.5 bg-accent-600" style={{ width: `${Math.round(Math.max(0, Math.min(1, r.bar)) * 100)}%` }} /></div>}
              </li>
            ))}
          </ul>
          {out.note && <p className="mt-3 text-xs text-navy-600">{out.note}</p>}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <button type="button" onClick={() => copy('result')} className="font-semibold text-accent-700 underline underline-offset-2">{copied === 'result' ? 'Copied' : 'Copy the result'}</button>
            <button type="button" onClick={() => copy('link')} className="font-semibold text-accent-700 underline underline-offset-2">{copied === 'link' ? 'Link copied' : 'Copy a link to this case'}</button>
            <button type="button" onClick={() => window.print()} className="font-semibold text-accent-700 underline underline-offset-2">Print</button>
            {methodHref && <a href={methodHref} className="font-semibold text-accent-700 underline underline-offset-2">How this is calculated</a>}
          </div>
        </div>
      </div>
    </div>
  );
}
