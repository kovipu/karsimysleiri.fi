# Kärsimysleiri Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, statically generated Astro site for the Kärsimysleiri gravel ultra event with all copy in one editable TypeScript file, styled with Tailwind v4 design tokens, and Finnish content throughout.

**Architecture:** Astro 5 static site, zero runtime JS. Tailwind v4 configured via CSS-only `@theme` in `src/styles/global.css`. All content lives in `src/content/site.ts` as a single typed export consumed by eight small `.astro` components composed in `src/pages/index.astro`. Self-hosted variable fonts (Fraunces + Inter) under `public/fonts/`.

**Tech Stack:** Astro 5, TypeScript (strict), Tailwind CSS v4 (`@tailwindcss/vite`), Fraunces + Inter variable fonts.

**Testing strategy:** This is a static presentational site with no business logic — no unit-test harness is added. Each task's verification step is: `npx astro check` (type/template errors), `npm run build` (production build succeeds), and `npm run dev` with explicit "look for X in the browser" checks. Add a test harness later only when there is behavior worth testing.

**Spec:** `docs/superpowers/specs/2026-06-15-karsimysleiri-site-design.md`

---

## File Structure

Created in this plan:

```
.gitignore                                 # node_modules, dist, .astro, .DS_Store
package.json                               # astro + tailwindcss + @tailwindcss/vite
tsconfig.json                              # extends astro/tsconfigs/strict
astro.config.mjs                           # site config, vite plugins (Tailwind)
public/
  fonts/
    Fraunces[opsz,wght].woff2              # variable font
    Inter-Variable.woff2                   # variable font
  favicon.svg                              # minimal placeholder
src/
  content/
    site.ts                                # all copy & structured data, typed export
  styles/
    global.css                             # @import "tailwindcss"; @theme tokens; @font-face; small @layer components
  layouts/
    BaseLayout.astro                       # <html lang="fi">, <head> meta, font preload, body slot
  components/
    SectionLabel.astro                     # small "— reitit —" label, reused
    Hero.astro
    About.astro
    Routes.astro
    Included.astro
    Practical.astro
    Faq.astro
    Registration.astro
    Footer.astro
  pages/
    index.astro                            # composes all sections
```

Per-file responsibilities:
- **`src/content/site.ts`** — single source of truth for all copy and structured data. Strongly typed via `as const`. No logic.
- **`src/styles/global.css`** — design tokens (`@theme`), font-face declarations, base resets, a few `@layer components` rules for compound styles (route card, prose).
- **`src/layouts/BaseLayout.astro`** — HTML shell: `<html lang="fi">`, meta tags, font preload links, single `<slot />`.
- **Components** — each renders one section, importing from `site.ts`. Pure presentation, no props beyond what they need from the content object.
- **`src/pages/index.astro`** — wraps everything in `BaseLayout` and renders components in order.

---

## Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`
- Create: `.gitignore`
- Create: `src/pages/index.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: Initialize package.json**

Create `package.json`:

```json
{
  "name": "karsimysleiri-site",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

- [ ] **Step 2: Install Astro and TypeScript tooling**

Run:
```bash
npm install astro@^5 @astrojs/check typescript
```
Expected: installs without errors; `node_modules/` and `package-lock.json` appear.

- [ ] **Step 3: Create tsconfig.json**

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create astro.config.mjs**

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://karsimysleiri.fi',
  output: 'static',
  trailingSlash: 'never',
});
```

- [ ] **Step 5: Create .gitignore**

Create `.gitignore`:

```
node_modules
dist
.astro
.DS_Store
.env
.env.production
```

- [ ] **Step 6: Create placeholder favicon and index page**

Create `public/favicon.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#1b1b1b"/><text x="16" y="22" text-anchor="middle" font-family="serif" font-size="22" fill="#f6f1e7">K</text></svg>
```

Create `src/pages/index.astro`:

```astro
---
---
<html lang="fi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Kärsimysleiri</title>
  </head>
  <body>
    <h1>Kärsimysleiri</h1>
  </body>
</html>
```

- [ ] **Step 7: Verify dev server and build work**

Run: `npx astro check`
Expected: `0 errors, 0 warnings, 0 hints`.

Run: `npm run build`
Expected: build succeeds, `dist/index.html` exists containing "Kärsimysleiri".

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json tsconfig.json astro.config.mjs .gitignore public/ src/
git commit -m "feat: scaffold astro project with placeholder index"
```

---

## Task 2: Install Tailwind v4 and define design tokens

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro` (import the stylesheet)

- [ ] **Step 1: Install Tailwind v4 and Vite plugin**

Run:
```bash
npm install tailwindcss@^4 @tailwindcss/vite@^4
```
Expected: installs without errors.

- [ ] **Step 2: Wire Vite plugin into astro.config.mjs**

Replace `astro.config.mjs` with:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://karsimysleiri.fi',
  output: 'static',
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Create global.css with @theme tokens**

Create `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg: #f6f1e7;
  --color-ink: #1b1b1b;
  --color-muted: #6b6760;
  --color-accent: #b04a2b;

  --font-serif: "Fraunces", Georgia, "Times New Roman", serif;
  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;

  --text-hero: clamp(4rem, 14vw, 12rem);
  --text-section: clamp(2rem, 5vw, 3.5rem);
}

@layer base {
  html {
    background-color: var(--color-bg);
    color: var(--color-ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  body {
    margin: 0;
  }
  h1, h2, h3 {
    font-family: var(--font-serif);
    font-weight: 500;
    letter-spacing: -0.02em;
  }
}
```

- [ ] **Step 4: Import the stylesheet from index.astro**

Replace the content of `src/pages/index.astro` with:

```astro
---
import '../styles/global.css';
---
<html lang="fi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Kärsimysleiri</title>
  </head>
  <body class="bg-bg text-ink font-sans">
    <h1 class="text-hero font-serif">Kärsimysleiri</h1>
  </body>
</html>
```

- [ ] **Step 5: Verify Tailwind utilities + tokens resolve**

Run: `npm run build`
Expected: build succeeds; open `dist/index.html` and confirm a `<link rel="stylesheet">` tag is present, and grep one of the generated assets for `#f6f1e7` to confirm the token made it into output:
```bash
grep -r "#f6f1e7" dist/
```
Expected: at least one match in a generated CSS file.

Run: `npm run dev` and open `http://localhost:4321`.
Expected: page background is warm off-white, "Kärsimysleiri" renders huge in a serif (system serif until Task 3 lands Fraunces).

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs package.json package-lock.json src/styles/global.css src/pages/index.astro
git commit -m "feat: add tailwind v4 with design tokens"
```

---

## Task 3: Self-host Fraunces and Inter variable fonts

**Files:**
- Create: `public/fonts/Fraunces-VariableFont.woff2` (copied from `@fontsource-variable/fraunces`)
- Create: `public/fonts/Inter-VariableFont.woff2` (copied from `@fontsource-variable/inter`)
- Modify: `src/styles/global.css` (add @font-face)
- Modify: `src/pages/index.astro` (preload links)

Approach: install the `@fontsource-variable/*` dev packages, which ship the variable woff2 files in `node_modules`, then copy the two files we want into `public/fonts/` and uninstall the packages (we only need the binary artifacts). This avoids brittle direct downloads.

- [ ] **Step 1: Install fontsource packages temporarily**

Run:
```bash
npm install --save-dev @fontsource-variable/fraunces @fontsource-variable/inter
```
Expected: installs without errors.

- [ ] **Step 2: Locate and copy the variable woff2 files**

Run:
```bash
mkdir -p public/fonts
ls node_modules/@fontsource-variable/fraunces/files/ | grep -E 'standard.*normal.*\.woff2$'
ls node_modules/@fontsource-variable/inter/files/ | grep -E 'standard.*normal.*\.woff2$'
```
Expected: each `ls` lists at least one `.woff2` file with `standard` and `normal` in its name (these are the full-range Latin variable files). Note the filenames printed.

Copy the files (replace `<fraunces-file>` and `<inter-file>` with the filenames from above):
```bash
cp node_modules/@fontsource-variable/fraunces/files/<fraunces-file> public/fonts/Fraunces-VariableFont.woff2
cp node_modules/@fontsource-variable/inter/files/<inter-file> public/fonts/Inter-VariableFont.woff2
ls -lh public/fonts/
```
Expected: both files exist in `public/fonts/`, each >50 KB.

- [ ] **Step 3: Uninstall the fontsource packages**

We have the binary artifacts copied — we don't need the packages anymore.
```bash
npm uninstall @fontsource-variable/fraunces @fontsource-variable/inter
```
Expected: `package.json` no longer lists them.

- [ ] **Step 4: Add @font-face declarations to global.css**

At the very top of `src/styles/global.css` (before `@import "tailwindcss";`), add:

```css
@font-face {
  font-family: "Fraunces";
  src: url("/fonts/Fraunces-VariableFont.woff2") format("woff2-variations");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-VariableFont.woff2") format("woff2-variations");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 5: Preload fonts in index.astro**

Inside `<head>` of `src/pages/index.astro`, before the `<title>`, add:

```astro
<link rel="preload" href="/fonts/Fraunces-VariableFont.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Inter-VariableFont.woff2" as="font" type="font/woff2" crossorigin />
```

- [ ] **Step 6: Verify fonts load**

Run: `npm run dev` and open `http://localhost:4321`.
Expected in the browser DevTools Network tab: both `.woff2` files load with status 200 and `font/woff2` content-type. The "Kärsimysleiri" heading visibly renders in Fraunces (curvier, more editorial than the system serif fallback).

Run: `npm run build && ls dist/fonts/`
Expected: both font files copied into `dist/fonts/`.

- [ ] **Step 7: Commit**

```bash
git add public/fonts/ src/styles/global.css src/pages/index.astro package.json package-lock.json
git commit -m "feat: self-host fraunces + inter variable fonts"
```

---

## Task 4: Create the typed content file

**Files:**
- Create: `src/content/site.ts`

- [ ] **Step 1: Create site.ts with full placeholder content**

Create `src/content/site.ts`:

```ts
export const site = {
  hero: {
    title: "Kärsimysleiri",
    dates: "7.–9.8.2026",
    location: "Rusko, Suomi",
    tagline: "Omavarainen gravel-ultra Vahdon metsästä.",
  },

  about: [
    "Kärsimysleiri on omavarainen pitkän matkan gravel-tapahtuma elokuun ensimmäisenä viikonloppuna. Lähtö ja maali sijaitsevat Vahdon metsästysmajalla Ruskolla.",
    "Tapahtuma ei ole kilpailu. Se on yhteinen viikonloppu pitkien hiekkateiden, pohjoismaisen kesäyön ja sen valossa testattujen rajojen äärellä. Jokainen ajaa omaa matkaansa, omaan tahtiinsa.",
  ],

  routes: [
    {
      id: "iso",
      name: "Iso kärsimys",
      km: 450,
      ascent: "TBA",
      description:
        "Kolmesta reitistä raskain. Kahden vuorokauden urakka, joka kiertää laajasti Varsinais-Suomen ja Satakunnan sorateiden parhaat osuudet.",
    },
    {
      id: "keski",
      name: "Keskimmäinen",
      km: 300,
      ascent: "TBA",
      description:
        "Klassinen ultramatka. Kovavauhtisille yhden vuorokauden suoritus, rauhallisemmille kaksi päivää maisemia ja metsää.",
    },
    {
      id: "pikku",
      name: "Pikku kärsimys",
      km: 200,
      ascent: "TBA",
      description:
        "Lyhyin vaihtoehto — silti pitkä päivä satulassa. Hyvä sisäänajo ultratapahtumiin tai täysipäiväinen kärsimys omaan tahtiin.",
    },
  ],

  included: {
    yes: [
      "Kisakeskus Vahdon metsästysmajalla",
      "Hiilarivoittoinen ateria maalissa",
      "Juomat",
      "Sauna",
      "Nukkumamahdollisuus maalissa",
    ],
    no: [
      "Kuljetus paikalle",
      "Reitin huolto tai tarkistuspisteet",
      "Ruoka ja juoma matkalla",
      "Varaosat ja varusteet",
    ],
  },

  practical: [
    {
      title: "Lähtö",
      body: "Lähtöajat ja tarkat porrastukset reittikohtaisesti ilmoitetaan lähempänä tapahtumaa. Kaikki lähdöt Vahdon metsästysmajalta.",
    },
    {
      title: "Mitä mukaan",
      body: "Toimiva polkupyörä, riittävä valaistus, navigointiin sopiva laite, omat huoltotarvikkeet ja varusteet vaihteleviin keliolosuhteisiin. Yön yli kestävillä reiteillä myös valaisin ja heijastimet ovat pakolliset.",
    },
    {
      title: "Reitit ja navigointi",
      body: "GPX-tiedostot toimitetaan ilmoittautuneille hyvissä ajoin ennen tapahtumaa. Reitit kulkevat pääosin sora- ja metsäautoteillä, paikoin myös vähäliikenteisillä päällystetyillä osuuksilla.",
    },
    {
      title: "Pysäköinti",
      body: "Vahdon metsästysmajalla on pysäköintimahdollisuus tapahtuman ajaksi.",
    },
    {
      title: "Sää",
      body: "Elokuun alku Lounais-Suomessa: päivisin yleensä lämmin, öisin viileä. Sade on aina mahdollinen — varustaudu sen mukaisesti.",
    },
  ],

  faq: [
    {
      q: "Kenelle Kärsimysleiri on?",
      a: "Aikuisille pyöräilijöille, jotka tietävät mihin ryhtyvät. Tapahtuma on omavarainen ja matkat ovat pitkiä — itsenäinen huolto ja kohtuullinen kokemus pitkistä ajoista ovat välttämättömyyksiä.",
    },
    {
      q: "Millainen pyörä reiteille tarvitaan?",
      a: "Gravel- tai cyclocross-pyörä on luontevin valinta. Maastopyörä toimii. Maantiepyörä ei sovellu — alustana on pääosin soraa.",
    },
    {
      q: "Voiko reitin keskeyttää?",
      a: "Voi. Tapahtuma ei ole kilpailu eikä keskeyttämisestä seuraa mitään. Ilmoita keskeytyksestä järjestäjälle, jotta tiedämme sinun olevan turvassa.",
    },
    {
      q: "Onko aikarajaa?",
      a: "Maali sulkeutuu sunnuntai-iltana. Tarkat aikarajat reittikohtaisesti ilmoitetaan lähempänä tapahtumaa.",
    },
    {
      q: "Voiko tulla katsomaan tai kannustamaan?",
      a: "Maalialueella Vahdon metsästysmajalla saa toki käydä. Reitin varrella ei ole virallisia katsomopaikkoja.",
    },
  ],

  registration: {
    status: "tulossa",
    note: "Ilmoittautuminen avautuu myöhemmin. Tiedot päivittyvät tänne.",
  },

  organizer: {
    name: "Kärsimysleirin järjestäjä",
    contact: "Yhteystiedot päivittyvät pian.",
  },
} as const;

export type SiteContent = typeof site;
```

- [ ] **Step 2: Verify the file is type-clean**

Run: `npx astro check`
Expected: `0 errors`.

- [ ] **Step 3: Commit**

```bash
git add src/content/site.ts
git commit -m "feat: add typed site content with placeholder finnish copy"
```

---

## Task 5: Create BaseLayout and SectionLabel

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SectionLabel.astro`
- Modify: `src/pages/index.astro` (use BaseLayout)

- [ ] **Step 1: Create BaseLayout.astro**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = "Kärsimysleiri — omavarainen gravel-ultra Vahdon metsästä, 7.–9.8.2026." } = Astro.props;
---
<!doctype html>
<html lang="fi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#f6f1e7" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fi_FI" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preload" href="/fonts/Fraunces-VariableFont.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/Inter-VariableFont.woff2" as="font" type="font/woff2" crossorigin />
    <title>{title}</title>
  </head>
  <body class="bg-bg text-ink font-sans antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Create SectionLabel.astro**

Create `src/components/SectionLabel.astro`:

```astro
---
interface Props {
  children?: unknown;
}
---
<p class="text-muted text-xs uppercase tracking-[0.25em] mb-6">
  <slot />
</p>
```

- [ ] **Step 3: Update index.astro to use the layout**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { site } from '../content/site.ts';
---
<BaseLayout title="Kärsimysleiri — 7.–9.8.2026">
  <main class="px-6 py-16 max-w-[64ch] mx-auto">
    <h1 class="text-hero font-serif leading-[0.95] tracking-tight">
      {site.hero.title}
    </h1>
    <p class="mt-4 text-sm uppercase tracking-[0.25em] text-muted">
      {site.hero.dates} · {site.hero.location}
    </p>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Verify layout renders**

Run: `npx astro check`
Expected: `0 errors`.

Run: `npm run dev` and visit `http://localhost:4321`.
Expected: page has warm bg, huge serif "Kärsimysleiri" heading, dates+location line beneath in small uppercase muted text. DevTools "Elements" shows `<html lang="fi">`, meta description, preload tags, og: tags.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/SectionLabel.astro src/pages/index.astro
git commit -m "feat: add base layout with meta + font preload"
```

---

## Task 6: Hero component

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Hero.astro**

Create `src/components/Hero.astro`:

```astro
---
import { site } from '../content/site.ts';
const { hero } = site;
---
<header class="relative px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 max-w-[80ch] mx-auto">
  <h1 class="text-hero font-serif leading-[0.9] tracking-tight">
    {hero.title}
  </h1>

  <div class="mt-8 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
    <p class="text-sm uppercase tracking-[0.25em] text-muted">
      {hero.dates}
    </p>
    <p class="text-sm uppercase tracking-[0.25em] text-muted">
      {hero.location}
    </p>
  </div>

  <p class="mt-10 max-w-[40ch] text-lg font-serif italic text-ink/80">
    {hero.tagline}
  </p>

  {/* Placeholder slot for hero graphic — replace later */}
  {/* <div class="mt-12 aspect-[3/2] bg-ink/5 rounded-sm" aria-hidden="true" /> */}
</header>
```

- [ ] **Step 2: Wire Hero into index.astro**

Replace the `<main>...</main>` block in `src/pages/index.astro` with:

```astro
<Hero />
<main class="px-6 max-w-[64ch] mx-auto">
  {/* sections will go here */}
</main>
```

And add the import at the top of the frontmatter:

```astro
import Hero from '../components/Hero.astro';
```

Also remove the now-unused `site` import from index.astro (the Hero component pulls it directly). The full updated `src/pages/index.astro` becomes:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
---
<BaseLayout title="Kärsimysleiri — 7.–9.8.2026">
  <Hero />
  <main class="px-6 max-w-[64ch] mx-auto">
    {/* sections will go here */}
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify hero looks right**

Run: `npx astro check`
Expected: `0 errors`.

Run: `npm run dev` and visit `http://localhost:4321`.
Expected: hero takes the top of the viewport with massive serif "Kärsimysleiri", small uppercase dates + location line, tagline in serif italic. Resize the window from mobile to desktop and confirm the title scales smoothly (clamp).

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: hero section"
```

---

## Task 7: About section

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create About.astro**

Create `src/components/About.astro`:

```astro
---
import { site } from '../content/site.ts';
import SectionLabel from './SectionLabel.astro';
---
<section id="tapahtuma" aria-labelledby="tapahtuma-heading" class="py-20 border-t border-ink/10">
  <SectionLabel>— tapahtuma —</SectionLabel>
  <h2 id="tapahtuma-heading" class="text-section font-serif leading-tight mb-8">
    Mikä on Kärsimysleiri?
  </h2>
  <div class="space-y-6 text-lg leading-relaxed">
    {site.about.map((paragraph) => <p>{paragraph}</p>)}
  </div>
</section>
```

- [ ] **Step 2: Add About to index.astro**

In `src/pages/index.astro`, add the import:

```astro
import About from '../components/About.astro';
```

And inside the `<main>`, add:

```astro
<About />
```

- [ ] **Step 3: Verify**

Run: `npx astro check && npm run dev`
Expected: below the hero, a section appears with a thin top border, small "— tapahtuma —" label, large serif heading "Mikä on Kärsimysleiri?", and two paragraphs of Finnish prose.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.astro src/pages/index.astro
git commit -m "feat: about section"
```

---

## Task 8: Routes section

**Files:**
- Create: `src/components/Routes.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css` (route card component class)

- [ ] **Step 1: Add route-card component class to global.css**

In `src/styles/global.css`, append (after the existing `@layer base` block):

```css
@layer components {
  .route-card {
    @apply border border-ink/15 p-6 bg-bg flex flex-col gap-3 transition-colors;
  }
  .route-card:hover {
    @apply border-ink/40;
  }
  .route-km {
    @apply font-serif text-5xl sm:text-6xl tracking-tight leading-none;
  }
}
```

- [ ] **Step 2: Create Routes.astro**

Note: this section's content area is wider than `64ch` so we break out of the main column via negative margin or a wider wrapper. We use a wider wrapper inside the section.

Create `src/components/Routes.astro`:

```astro
---
import { site } from '../content/site.ts';
import SectionLabel from './SectionLabel.astro';
---
<section id="reitit" aria-labelledby="reitit-heading" class="py-20 border-t border-ink/10">
  <SectionLabel>— reitit —</SectionLabel>
  <h2 id="reitit-heading" class="text-section font-serif leading-tight mb-4">
    Kolme matkaa, sama metsä
  </h2>
  <p class="text-lg text-muted mb-12 max-w-[50ch]">
    Valitse pituus, joka vastaa kuntoa ja kunnianhimoa. Kaikki reitit lähtevät ja päättyvät Vahdon metsästysmajalle.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 -mx-2 sm:mx-0">
    {site.routes.map((route) => (
      <article class="route-card">
        <p class="route-km">{route.km}<span class="text-xl text-muted ml-1">km</span></p>
        <h3 class="text-sm uppercase tracking-[0.2em] text-ink">{route.name}</h3>
        <p class="text-sm text-muted">Nousua: {route.ascent}</p>
        <p class="text-base leading-relaxed mt-2">{route.description}</p>
      </article>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Make the Routes section break out of the narrow column**

The 3-column grid needs more horizontal room than `max-w-[64ch]` provides. Update `src/pages/index.astro` so `Routes` lives in a wider container:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Routes from '../components/Routes.astro';
---
<BaseLayout title="Kärsimysleiri — 7.–9.8.2026">
  <Hero />
  <main class="px-6">
    <div class="max-w-[64ch] mx-auto">
      <About />
    </div>
    <div class="max-w-[90ch] mx-auto">
      <Routes />
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Verify**

Run: `npx astro check && npm run dev`
Expected: three side-by-side route cards on desktop (≥768px wide). Each card shows a large serif number (450/300/200), "km" suffix, route name in small uppercase, "Nousua: TBA" line, and a paragraph description. Cards stack vertically on mobile. Border darkens on hover.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/components/Routes.astro src/pages/index.astro
git commit -m "feat: routes section with three cards"
```

---

## Task 9: Included section

**Files:**
- Create: `src/components/Included.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Included.astro**

Create `src/components/Included.astro`:

```astro
---
import { site } from '../content/site.ts';
import SectionLabel from './SectionLabel.astro';
---
<section id="sisaltyy" aria-labelledby="sisaltyy-heading" class="py-20 border-t border-ink/10">
  <SectionLabel>— mitä sisältyy —</SectionLabel>
  <h2 id="sisaltyy-heading" class="text-section font-serif leading-tight mb-12">
    Itse pyöräily on omasi
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
    <div>
      <h3 class="text-sm uppercase tracking-[0.2em] text-ink mb-4">Sisältyy</h3>
      <ul class="space-y-2 text-base">
        {site.included.yes.map((item) => (
          <li class="flex gap-3">
            <span class="text-accent" aria-hidden="true">●</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h3 class="text-sm uppercase tracking-[0.2em] text-ink mb-4">Ei sisälly</h3>
      <ul class="space-y-2 text-base text-muted">
        {site.included.no.map((item) => (
          <li class="flex gap-3">
            <span aria-hidden="true">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add Included to index.astro**

Add the import:

```astro
import Included from '../components/Included.astro';
```

And inside the narrow `max-w-[64ch]` div (after `<About />`), no — Included is two-column, put it in the wider container after `<Routes />`:

```astro
<div class="max-w-[90ch] mx-auto">
  <Routes />
  <Included />
</div>
```

- [ ] **Step 3: Verify**

Run: `npx astro check && npm run dev`
Expected: a two-column section appears below Routes. Left column has accent-colored dots before each "sisältyy" item, right column has em-dashes before each "ei sisälly" item in muted color. Columns stack on mobile.

- [ ] **Step 4: Commit**

```bash
git add src/components/Included.astro src/pages/index.astro
git commit -m "feat: included / not included section"
```

---

## Task 10: Practical section

**Files:**
- Create: `src/components/Practical.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Practical.astro**

Create `src/components/Practical.astro`:

```astro
---
import { site } from '../content/site.ts';
import SectionLabel from './SectionLabel.astro';
---
<section id="kaytanto" aria-labelledby="kaytanto-heading" class="py-20 border-t border-ink/10">
  <SectionLabel>— käytännön tiedot —</SectionLabel>
  <h2 id="kaytanto-heading" class="text-section font-serif leading-tight mb-12">
    Käytännön tiedot
  </h2>

  <dl class="space-y-8">
    {site.practical.map((item) => (
      <div>
        <dt class="text-sm uppercase tracking-[0.2em] text-ink mb-2">{item.title}</dt>
        <dd class="text-base leading-relaxed text-ink/85">{item.body}</dd>
      </div>
    ))}
  </dl>
</section>
```

- [ ] **Step 2: Add Practical to index.astro**

Add the import:

```astro
import Practical from '../components/Practical.astro';
```

Practical is a narrow-column section (prose). Place it inside the narrow wrapper. Restructure the `<main>` so prose sections share one narrow column and Routes/Included keep their wider wrapper:

```astro
<main class="px-6">
  <div class="max-w-[64ch] mx-auto">
    <About />
  </div>
  <div class="max-w-[90ch] mx-auto">
    <Routes />
    <Included />
  </div>
  <div class="max-w-[64ch] mx-auto">
    <Practical />
  </div>
</main>
```

- [ ] **Step 3: Verify**

Run: `npx astro check && npm run dev`
Expected: below Included, a vertically stacked definition list of practical info items appears, each with a small uppercase title and a prose body in slightly softened ink color.

- [ ] **Step 4: Commit**

```bash
git add src/components/Practical.astro src/pages/index.astro
git commit -m "feat: practical info section"
```

---

## Task 11: FAQ section

**Files:**
- Create: `src/components/Faq.astro`
- Modify: `src/styles/global.css` (small styles for `<details>`)
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add `<details>` styles to global.css**

Append inside the `@layer components` block in `src/styles/global.css`:

```css
@layer components {
  .faq-item {
    @apply border-b border-ink/10 py-5;
  }
  .faq-item > summary {
    @apply cursor-pointer list-none flex justify-between items-baseline gap-4 font-serif text-xl leading-snug;
  }
  .faq-item > summary::-webkit-details-marker {
    display: none;
  }
  .faq-item > summary::after {
    content: "+";
    @apply text-2xl text-muted font-sans transition-transform;
  }
  .faq-item[open] > summary::after {
    content: "−";
  }
  .faq-item[open] > summary {
    @apply text-accent;
  }
  .faq-answer {
    @apply mt-4 text-base leading-relaxed text-ink/85;
  }
}
```

- [ ] **Step 2: Create Faq.astro**

Create `src/components/Faq.astro`:

```astro
---
import { site } from '../content/site.ts';
import SectionLabel from './SectionLabel.astro';
---
<section id="usein-kysyttya" aria-labelledby="faq-heading" class="py-20 border-t border-ink/10">
  <SectionLabel>— usein kysyttyä —</SectionLabel>
  <h2 id="faq-heading" class="text-section font-serif leading-tight mb-10">
    Usein kysyttyä
  </h2>

  <div>
    {site.faq.map((item) => (
      <details class="faq-item">
        <summary>{item.q}</summary>
        <p class="faq-answer">{item.a}</p>
      </details>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Add FAQ to index.astro**

Add the import:

```astro
import Faq from '../components/Faq.astro';
```

Inside the narrow column (after `<Practical />`):

```astro
<div class="max-w-[64ch] mx-auto">
  <Practical />
  <Faq />
</div>
```

- [ ] **Step 4: Verify**

Run: `npx astro check && npm run dev`
Expected: below Practical, a FAQ section with five collapsible questions. Each row has a question in serif, a "+" marker on the right. Clicking expands the answer; the marker becomes "−" and the question text takes the accent color. No JavaScript is needed (native `<details>`).

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/components/Faq.astro src/pages/index.astro
git commit -m "feat: faq section using native details"
```

---

## Task 12: Registration + Footer

**Files:**
- Create: `src/components/Registration.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Registration.astro**

Create `src/components/Registration.astro`:

```astro
---
import { site } from '../content/site.ts';
import SectionLabel from './SectionLabel.astro';
const { registration, organizer } = site;
---
<section id="ilmoittautuminen" aria-labelledby="ilmo-heading" class="py-20 border-t border-ink/10">
  <SectionLabel>— ilmoittautuminen —</SectionLabel>

  <div class="bg-accent/10 border border-accent/20 p-8 sm:p-10">
    <h2 id="ilmo-heading" class="text-section font-serif leading-tight mb-4">
      Ilmoittautuminen
    </h2>
    <p class="text-sm uppercase tracking-[0.2em] text-accent mb-4">
      Status: {registration.status}
    </p>
    <p class="text-lg leading-relaxed mb-2">
      {registration.note}
    </p>
    <p class="text-base text-muted mt-6">
      Järjestää: {organizer.name}. {organizer.contact}
    </p>
  </div>
</section>
```

- [ ] **Step 2: Create Footer.astro**

Create `src/components/Footer.astro`:

```astro
---
import { site } from '../content/site.ts';
---
<footer class="px-6 py-12 border-t border-ink/10 mt-12">
  <div class="max-w-[64ch] mx-auto flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 text-sm text-muted">
    <p class="font-serif italic">Kärsimysleiri · {site.hero.dates}</p>
    <p>© 2026 {site.organizer.name}</p>
  </div>
</footer>
```

- [ ] **Step 3: Wire both into index.astro (final form)**

Replace `src/pages/index.astro` with the complete final composition:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Routes from '../components/Routes.astro';
import Included from '../components/Included.astro';
import Practical from '../components/Practical.astro';
import Faq from '../components/Faq.astro';
import Registration from '../components/Registration.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout title="Kärsimysleiri — 7.–9.8.2026">
  <Hero />
  <main class="px-6">
    <div class="max-w-[64ch] mx-auto">
      <About />
    </div>
    <div class="max-w-[90ch] mx-auto">
      <Routes />
      <Included />
    </div>
    <div class="max-w-[64ch] mx-auto">
      <Practical />
      <Faq />
      <Registration />
    </div>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 4: Verify**

Run: `npx astro check && npm run dev`
Expected: at the bottom of the page a soft-accent-tinted Registration callout appears with status "tulossa" in accent color and the placeholder note. Below it, a small muted footer with two lines.

- [ ] **Step 5: Commit**

```bash
git add src/components/Registration.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: registration callout + footer"
```

---

## Task 13: Final verification pass

**Files:** none modified (verification only); minor copy/style tweaks possible.

- [ ] **Step 1: Run type check and production build**

Run:
```bash
npx astro check
npm run build
```
Expected: both succeed with zero errors. `dist/` contains `index.html`, fonts in `dist/fonts/`, and one or more bundled CSS files.

- [ ] **Step 2: Inspect built HTML for the essentials**

Run:
```bash
grep -o 'Kärsimysleiri' dist/index.html | head -1
grep -o 'lang="fi"' dist/index.html
grep -o '7.–9.8.2026' dist/index.html
grep -c '<section' dist/index.html
```
Expected: each grep finds at least one match; the `<section>` count is 6 (About, Routes, Included, Practical, Faq, Registration).

- [ ] **Step 3: Run preview server and walk through every section**

Run: `npm run preview`
Expected URL: `http://localhost:4321` (or whatever Astro prints).

Manually verify in the browser:
- Hero: huge serif title, dates + location, italic tagline.
- About: two prose paragraphs.
- Routes: three side-by-side cards on desktop, stacked on mobile (resize window to confirm).
- Included: two-column list (sisältyy / ei sisälly).
- Practical: definition-list of items.
- FAQ: five collapsible items, "+" toggles to "−", accent color on open question.
- Registration: tinted callout with status.
- Footer: small muted line.

Resize browser from ~320px wide up to ~1400px. No horizontal scroll, no broken layouts, typography scales smoothly at hero and section headings.

- [ ] **Step 4: Confirm no JS shipped**

Run:
```bash
ls dist/_astro/ 2>/dev/null | grep -E '\.js$' || echo "no JS bundles"
```
Expected: prints "no JS bundles" (or empty). The page is fully static HTML + CSS + fonts.

- [ ] **Step 5: Commit any polish tweaks (if needed) and finish**

If the verification turned up minor copy/spacing issues, fix them inline then:

```bash
git add -A
git commit -m "chore: final polish pass after manual verification"
```

If nothing needed fixing, skip the commit and move on.

---

## Spec coverage check

Cross-referencing the spec against the plan:

- **Stack: Astro 5 + TS strict + Tailwind v4 + self-hosted fonts** → Tasks 1, 2, 3.
- **Zero runtime deps beyond Astro+Tailwind** → enforced by Task 13 step 4 (no JS bundles).
- **All content in one editable `src/content/site.ts`** → Task 4 plus every component imports from it.
- **Eight components + base layout + section label** → Tasks 5–12.
- **Design tokens via `@theme` in CSS** → Task 2.
- **Editorial visual design** (off-white bg, serif display, ink text, accent rust, generous whitespace, max-width column, thin rules, small uppercase labels) → Tasks 2, 5, 6–12.
- **Hero with huge title + dates/location + tagline + graphic placeholder** → Task 6.
- **Routes as three responsive cards** → Task 8.
- **FAQ via native `<details>`** → Task 11.
- **Registration "tulossa" callout** → Task 12.
- **Section order on page** matches spec → Task 12's final `index.astro`.
- **`<html lang="fi">`, meta description, OG tags** → Task 5.
- **No analytics, no dark toggle, no real graphics, no i18n** → none added (correct).
- **Static deployable build** → verified in Task 13.
