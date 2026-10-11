# Écrire ou étoffer une page de « Tax Year Calc » (taxyearcalc.com)

Notice pour les agents qui écrivent une page. À lire en entier avant d'écrire, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §6, §6.5, §7, §9, §9.3, §11, §17.4, §21, §26).

Le site : chaque chiffre de l'année fiscale fédérale américaine dans un calculateur. Tranches 2026 et 2025,
standard deduction, les quatre déductions de la Schedule 1-A (Public Law 119-21 : tips, overtime, car loan
interest, seniors, 2025 à 2028), SALT, crédits, plafonds 401(k)/IRA/HSA/FSA, échéances, pénalités, calendrier
des remboursements, donations et successions. **Anglais américain seul**, sous `/en/`. Éditeur : la société
**Radif Partners** (jamais de nom de personne, de photo, d'INSEAD, de Mines ni de LinkedIn). Aucun lien vers un
autre site du portefeuille (`_trame/domaines-ovh.txt`), en particulier ni truetakehomepay.com ni
netsalarycalculator.us ni usbenefitscalc.com : ce site traite **l'année fiscale et ses chiffres, pas le salaire net**.

## Une page = un fichier

`src/content/pages/<id>.ts`, `definePage({...})`. Le plan (id, groupe, type, calculateur, requête) est dans
`src/lib/planned.ts` : `id` = nom du fichier = `slug`. Modèle à lire (structure seulement, jamais les phrases) :
`src/content/pages/tax-brackets.ts`.

| Champ | Règle |
|---|---|
| `id`, `slug` | = `planned.ts`. Pas d'année dans le slug. |
| `group`, `kind`, `tool` | = `planned.ts`. `kind: 'tool'` → `tool` (calculateur complet après la réponse, page « outil » de 500 à 700 mots). `kind: 'guide'` → `mini` (petit calculateur) et 1 200 mots ou plus. |
| `toolArg` / `miniArg` | valeurs par défaut propres à la page, si le calculateur en accepte (voir l'en-tête de `src/lib/tools/<kind>.ts`). |
| `order` | place dans le menu du groupe (10, 20, 30…). |
| `nav`, `card` | libellé de menu court ; une phrase pour les cartes « Next numbers to check ». |
| `title` | **50 à 60 caractères**, l'année dedans, **terme-clé de la requête en tête** (« Standard Deduction 2026: … », « No Tax on Tips 2026: … »). Jamais en tête : How, What, When, Can, Is, Calculator, US/USA/American. Pas de tiret cadratin, pas d'espace avant `:`. Unique. |
| `description` | **150 à 160 caractères**, l'année, au moins un chiffre lu dans les paramètres. Unique. |
| `h1` | sans année de préférence. |
| `intro` | une phrase. |
| `resume` | **UN** paragraphe de **120 mots ou plus** (viser 130 à 180) : la réponse directe à la requête, chiffres compris. Affiché replié après la **première phrase** : elle porte le message. Éviter « Rev. Proc. » dans la première phrase. |
| `faqs` | 4 à 6 **vraies questions telles qu'on les tape**, réponses de **45 à 85 mots** (le test accepte 40 à 90), avec le chiffre, la condition et la source. **Une question n'existe qu'une fois sur tout le site**, accueil compris (`src/content/home.ts`). |
| `body(h)` | HTML : `<h2>`, `<h3>`, `<p>`, `<ul>`, `h.table(...)`. Page outil : **350 à 550 mots** de prose hors tableaux, 2 à 4 `<h2>` propres à la page. Guide : **1 000 mots ou plus**, avec au moins un `${h.mini(...)}` en plus. Finir par une ligne de source `h.src(...)`. |
| `related` | 3 à 6 ids de `planned.ts`. |
| `sources` | 2 clés ou plus de `src/data/params-2026.json > sources`. |

## La règle des chiffres (non négociable, RECETTE §17.4 point 7)

Aucun taux, seuil, montant ou date des paramètres n'est tapé en dur : il se lit dans `Y(2026)`, `Y(2025)`, `S`,
`P`, ou se calcule avec le moteur `E` (`src/lib/engine/tax.ts`, testé dans `tests/engine.test.ts`).

```ts
import { definePage } from '../../lib/page-types';
import { E, Y, S, P, usd, usdx, pct, num, day, listOf } from '../../lib/kit';
const t = E.tipsDeduction(2026, 'single', 18000, 160500);   // { capped, reduction, deduction, gone }
title: `No Tax on Tips 2026: Deduct Up to ${usd(Y(2026).tips.max)}, Phase-Out`,
```

- Une hypothèse d'exemple (« a server with $18,000 of tips ») peut s'écrire `usd(18000)`.
- Un chiffre **absent des paramètres ne s'écrit pas**, sauf s'il est dans un document de `research/` (copies des
  documents IRS : `rp-25-32.txt`, `rp-24-40.txt`, `n-25-67.txt`, `rp-25-19.txt`, `rp-24-25.txt`, `f1040s1a.txt`,
  `f1040es.txt`, `i1040sca.txt`, `f1040s8.txt`, `publ21.txt` (la loi), pages IRS en `.txt`) : citez-le alors avec
  `h.src(clé)` ou `h.ext(url, texte)` et signalez-le dans votre compte rendu.
- Un pourcentage de loi qui n'est pas un paramètre peut s'écrire s'il est dans `research/`.
- Formats : `usd(n)` sans cents, `usdx(n)` avec les cents du texte officiel, `pct(22)` → « 22% », `num(x, 1)`,
  `day('2027-04-15')` → « April 15, 2027 ». Jamais `toFixed`.

### Le moteur `E` (extraits)
`incomeTax(year, status, taxable)` → `{ tax, marginal, average, rows, nextAt, roomInBracket }` ;
`bracketBases` ; `standardDeduction(year, status, { age65, blind, dependent, earned })` ;
`tipsDeduction`, `overtimeDeduction`, `overtimePremium(pay, 1.5|2)`, `carLoanDeduction`, `seniorDeduction(year, status, magi, people)` ;
`saltDeduction(year, status, paid, magi)` → `{ cap, fullCap, deduction, floorAt }` ;
`capitalGainsTax(year, status, ordinaryTaxable, gains)`, `niit(status, magi, nii)` ;
`childTaxCredit(year, status, kids, agi, taxBefore, earned)`, `eitc(year, kids, earned, agi, mfj, inv)` ;
`amt`, `studentLoanInterest`, `charity`, `mortgageInterest(status, balance, interest, grandfathered)` ;
`k401Limit(2026, age)`, `rothLimit(status, magi, age)`, `iraDeduction(status, magi, age, covered, spouseCovered)`, `hsaLimit(family, age, months)` ;
`fica(status, wages, selfEmployed)`, `excessSocialSecurity([w1, w2])`, `giftTax`, `estateTax(year, estate, gifts, dsue)` ;
`section179`, `latePenalties(year, unpaid, monthsFile, monthsPay)`, `underpaymentInterest(amount, days, rate)`,
`estimatedTax(thisTax, priorTax, priorAgi, withholding)`, `fullReturn({...})`, `refundDate(iso, efile, credits, dd)` ;
`dependentCareRate/Credit`, `adoptionCredit`, `kiddieTax`, `feie`, `qbiDeduction`. Statuts : `'single' | 'mfj' | 'mfs' | 'hoh'`.

### Dans `body(h)`
`h.a(id, texte)` (lien interne ; id inconnu = test en échec), `h.table(entêtes, lignes, légende, alignements)`,
`h.src(clé, texte?)`, `h.ext(url, texte)`, `h.box(titre, html)`, `h.mini(kind, arg)` (calculateur en petit format,
`kind` = un fichier de `src/lib/tools/`), `h.fold(titre, html)` (texte long replié en accordéon, toujours dans le HTML).

## Ton et langue

- Anglais américain ; termes exacts : « modified adjusted gross income (MAGI) », « taxable income », « Schedule 1-A »,
  « qualified tips », « FLSA overtime premium », « married filing jointly », « head of household », « phase-out »,
  « refundable », « Form 1040 line 11b ».
- Voix humaine, phrases de longueur variable, **le chiffre d'abord**. Interdits (le test les refuse) : tiret
  cadratin, « it's important to note », « dive into », « delve », « whether you're », « navigate the »,
  « Moreover », « Additionally », « Furthermore », « in today's world ». Pas de triplets en série, pas de
  conclusion qui résume, pas d'émoji.
- **Local réel** : formulaires, lignes et boîtes réels (W-2 box 7, box 12 code TP/TT, Form 4137, Form 4868,
  Form 709, Schedule 8812…), exemples américains plausibles (serveur, infirmière de nuit, couple retraité de Floride
  ou du New Jersey pour le SALT).
- **Vérité** : jamais de chiffre ou de règle non sourcés. Rien sur 2027 (non publié au 2026-10-11) sauf pour
  le dire. Pas de conseil personnalisé : « your return as processed by the IRS is what counts ».
- **Unicité** (§6) : `check-unique` compare toutes les pages, chiffres neutralisés, seuil 30 %, fenêtre des 12 000
  premiers caractères. Écrire ce qui n'appartient qu'à la page, avec un vocabulaire propre ; aucune tournure
  reprise d'une autre page ni d'un autre site (`check-portefeuille`). Les pages par statut (single, joint…) ouvrent
  chacune sur ce que ce statut a de propre (qualification HOH, pénalité de mariage, pièges du MFS).

## Contrôles

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/taxyearcalc.com
ALLOW_PLANNED=1 PAGE_FILES=standard-deduction,no-tax-on-tips npx vitest run tests/pages.test.ts   # vos pages
npx vitest run                     # moteur, calculateurs, pages
npm run build                      # inclut typo-nbsp et check-snippets (bloquant)
```
Puis, par le coordinateur : `check-seo`, `check-trame`, `check-unique dist`, `check-simulateurs`,
`check-portefeuille`, `check-regles`, `check-sources`, `check-legal`, `check-layout`, `check-contraste`,
`check-saisie`, `check-nombres`, `check-url-propre`, `check-cookies`, `check-snippets`, `typo-nbsp --check`.

## Ajouter un calculateur

Un fichier `src/lib/tools/<kind>.ts` (contrat dans `types.ts`, aides dans `_kit.ts`) : champs avec valeur par
défaut réaliste, `run` qui appelle le moteur, jamais un second calcul. `tests/tools.test.ts` l'exécute aux valeurs
par défaut, à zéro et au maximum. Une nouvelle règle va dans `src/lib/engine/tax.ts` avec son test, la source en
commentaire ; un nouveau montant va dans `params-2026.json` avec sa clé de source.

## Mise à jour annuelle

Quand l'IRS publie la Rev. Proc. de l'année suivante (octobre-novembre) : ajouter le bloc `years.2027`, la source,
relire chaque valeur, rejouer `tests/engine.test.ts` (les montants « plus » imprimés du barème servent de contrôle),
puis basculer les pages. Notice des plans de retraite et Rev. Proc. HSA : même chose.

## Ce qu'on ne fait pas

- Ne pas toucher à `_trame`, à la RECETTE ni à un autre site. Pas de dépôt GitHub, pas de push, pas de DNS, pas de Chrome.
- Monétisation : publicité désactivée (`AdSlot` de la trame non utilisé), aucun lien d'affiliation.
