# Kärsimysleiri — site design

**Date:** 2026-06-15
**Status:** Approved (brainstorming phase)

## Goal

Build a small, professional, single-page website for **Kärsimysleiri**, a self-supported gravel ultra event in Rusko, Finland on **7.–9.8.2026**. The site communicates what the event is, the three route options, what's included, practical info, FAQ, and a registration placeholder. Content is in Finnish. The site should look personalized and editorial — not generic.

## Non-goals

- No CMS or headless backend.
- No analytics integration in v1.
- No internationalization — Finnish only.
- No final graphics — placeholder slots only; graphics will be added later by the organizer.
- No dark mode toggle in v1 (design tokens make it trivial to add later).
- No registration form or mailto link in v1 — registration is shown as "coming soon" with a placeholder note.

## Stack

- **Astro 5** (latest), TypeScript strict, `output: 'static'`.
- **Tailwind CSS v4** via `@tailwindcss/vite`. Theme defined entirely in CSS via `@theme` in `src/styles/global.css` — no JS config file.
- **Self-hosted fonts** in `public/fonts/`: **Fraunces** (serif, for display) + **Inter** (sans, for body/UI). Both as variable woff2. No Google Fonts runtime call.
- **No runtime JS** beyond what Astro emits (i.e. effectively none — the page is static HTML/CSS). FAQ uses native `<details>`.

Total dependencies: `astro`, `tailwindcss`, `@tailwindcss/vite`. That's the whole list.

Deployable to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

## Content model

All copy and structured data live in **one editable file**: `src/content/site.ts`. Editing the site means editing this file. Shape:

```ts
export const site = {
  hero: {
    title: "Kärsimysleiri",
    dates: "7.–9.8.2026",
    location: "Rusko, Suomi",
    tagline: "<one-line pitch>",
  },
  about: "<prose, can include simple HTML or be split into paragraphs>",
  routes: [
    { id: "iso",   name: "<route name>", km: 450, ascent: "TBA", description: "..." },
    { id: "keski", name: "<route name>", km: 300, ascent: "TBA", description: "..." },
    { id: "pikku", name: "<route name>", km: 200, ascent: "TBA", description: "..." },
  ],
  included: {
    yes: ["Kisakeskus Vahdon metsästysmajalla", "Hiilarivoittoinen ateria maalissa", "Juomat", "Sauna", "Nukkumamahdollisuus maalissa"],
    no:  ["Kuljetus", "Reitin huolto", "Ruoka matkalla", "Varaosat"],
  },
  practical: [
    { title: "Lähtö",        body: "..." },
    { title: "Mitä mukaan",  body: "..." },
    // ... etc, placeholder content
  ],
  faq: [
    { q: "...", a: "..." },
  ],
  registration: {
    status: "tulossa",
    note: "Ilmoittautuminen avautuu myöhemmin. Lisätiedot päivittyvät tänne.",
  },
  organizer: {
    name: "<organizer name>",
    contact: "<contact placeholder>",
  },
} as const;
```

Components import from this file. Route names, tagline, organizer name, prose, and exact item lists above are starting placeholders the user will refine.

## File layout

```
src/
  content/
    site.ts                  # all copy & structured data
  styles/
    global.css               # @import "tailwindcss"; + @theme tokens + small @layer components
  components/
    Hero.astro
    About.astro
    Routes.astro
    Included.astro
    Practical.astro
    Faq.astro
    Registration.astro
    Footer.astro
    SectionLabel.astro       # small reused "— reitit —" label
  pages/
    index.astro              # composes the above in order
public/
  fonts/                     # self-hosted woff2 files
  favicon.svg                # placeholder
astro.config.mjs
package.json
tsconfig.json
```

## Visual design

**Vibe:** editorial & confident. The name "Kärsimysleiri" carries the edge — the design stays understated.

**Design tokens** (defined in `@theme` in `global.css`, auto-generate Tailwind utilities):

| Token | Value (starting) | Generates |
|---|---|---|
| `--color-bg` | `#f6f1e7` (warm off-white) | `bg-bg`, `text-bg` |
| `--color-ink` | `#1b1b1b` (near-black) | `text-ink`, `border-ink` |
| `--color-muted` | `#6b6760` (warm mid-grey) | `text-muted` |
| `--color-accent` | `#b04a2b` (rust) | `text-accent`, `bg-accent` |
| `--font-serif` | Fraunces, variable | `font-serif` |
| `--font-sans` | Inter, variable | `font-sans` |
| `--text-hero` | `clamp(4rem, 14vw, 12rem)` | `text-hero` |
| `--text-section` | `clamp(2rem, 5vw, 3.5rem)` | `text-section` |
| `--measure` | `64ch` | content max-width |

**Hero:**
- "Kärsimysleiri" set in the serif at `text-hero`, tight tracking, ink color on bg.
- Dates + location beneath in small uppercase sans (`tracking-widest`, `text-sm`).
- One-line tagline below in muted sans.
- A reserved empty slot (commented placeholder) for the graphic to come.

**Sections:**
- Centered single column, max-width ~`64ch`.
- Generous vertical rhythm.
- Each section opens with a small `SectionLabel` (lowercase, letter-spaced, e.g. `— reitit —`) and an `<h2>` in the serif at `text-section`.
- Thin horizontal rule (`border-ink/20`) between sections.

**Routes:**
- Responsive grid: `grid-cols-1 md:grid-cols-3`.
- Each card: big km number in serif, route name in sans uppercase, short description, room for a future GPX link.
- Hover state: subtle accent underline on the name (no transform tricks).

**Included:**
- Two columns: `Mitä sisältyy` (checkmark/dot bullets) and `Mitä ei` (em-dash bullets), no icons in v1.

**Practical:**
- Definition-list style: bold title, prose body. Stacked vertically.

**FAQ:**
- Native `<details>`/`<summary>` styled with Tailwind. No JS. Subtle chevron via CSS.

**Registration:**
- Boxed callout with `bg-accent/10` (or similar low-saturation tint), the status text, and the note. Placeholder for a future button/link.

**Footer:**
- Organizer name, contact placeholder, year. Small, muted.

**Responsive:**
- Mobile-first. Hero shrinks via `clamp`. Routes collapse to single column. No horizontal scrollers.

## Section order on the page

1. Hero
2. Tapahtuma (About)
3. Reitit (Routes)
4. Mitä sisältyy / mitä ei
5. Käytännön tiedot
6. FAQ
7. Ilmoittautuminen (Registration placeholder)
8. Footer

## Accessibility & meta

- Semantic landmarks (`<header>`, `<main>`, `<section>` with `aria-labelledby`, `<footer>`).
- Logical heading order: one `<h1>` in hero, `<h2>` per section.
- Focus states preserved on `<details>` and any future links.
- `<html lang="fi">`.
- Basic `<meta>`: description, OG title/description, theme-color. OG image is a TODO placeholder.
- Lighthouse target: 95+ across the board (achievable trivially given no JS, self-hosted fonts, static output).

## Out of scope (will be added later)

- Final graphics / illustrations / hero image.
- Real OG image.
- GPX file downloads on route cards.
- Registration mechanism (form, email, or external link — decision deferred).
- Analytics.
- Dark mode toggle.
- Sponsor logos section (if applicable).

## Deliverable

A working `npm run dev` site at `localhost:4321` that renders all eight sections with placeholder Finnish content, plus a `npm run build` producing a static `dist/` ready to deploy.
