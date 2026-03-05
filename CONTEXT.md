# Portfolio-v2 — Project Context

## Overview

A personal portfolio website for **Aahad** — designed to be an outstanding, flashy, award-worthy portfolio with heavy animations, 3D elements, and cinematic transitions. Built with previous Claude AI chats.

## Design Inspiration

- [Dennis Snellenberg](https://dennissnellenberg.com/) — smooth scroll, typography-driven layout, clean luxury aesthetic
- [Previous Portfolio v1](https://my-portfolio-v2-two-phi.vercel.app/) — earlier iteration to improve upon

The goal is a portfolio that feels like a motion design piece — every element animates in with purpose, scroll interactions add depth, and the 3D scene gives it a modern edge.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (SSR, island architecture) |
| UI Library | React 19 (interactive islands via `client:load`) |
| Styling | Tailwind CSS v4 + shadcn/ui (CVA, Radix UI) |
| Animations | GSAP (ScrollTrigger) + Framer Motion |
| 3D | React Three Fiber + Drei (Three.js) |
| CMS | Sanity (embedded studio at `/studio`) |
| Deployment | Vercel (`@astrojs/vercel` adapter) |
| Package Manager | Bun |
| Fonts | General Sans (body) + Clash Display (headings) via Fontshare |

---

## Project Structure

```
src/
├── pages/
│   └── index.astro              # Single-page portfolio
├── layouts/
│   └── Layout.astro             # Root layout (Preloader, Cursor, Navbar)
├── styles/
│   └── global.css               # 4 theme definitions, custom animations
├── components/
│   ├── hero/                    # Hero section (13+ subcomponents)
│   │   ├── Hero.tsx             # Main hero — entrance timeline + scroll parallax
│   │   ├── HeroTitle.tsx        # Split-text character animation with metallic shine
│   │   ├── RotatingText.tsx     # Cycles through roles (Full Stack Dev, etc.)
│   │   ├── HeroScene.tsx        # R3F Canvas — 3D wireframes + particles
│   │   ├── WireframeShape.tsx   # Floating wireframe geometries (icosahedron, torus, octahedron)
│   │   ├── ParticleEmitter.tsx  # Floating particle system
│   │   ├── SkillNetwork.tsx     # 3D skill nodes in the scene
│   │   ├── HeroMarquee.tsx      # Infinite scrolling tech stack strip
│   │   ├── HeroStats.tsx        # Animated counting stats (3+ years, 20+ projects, etc.)
│   │   ├── HeroBio.tsx          # Short bio paragraph
│   │   ├── HeroCTA.tsx          # Call-to-action button
│   │   ├── HeroSocials.tsx      # Social media links
│   │   └── HeroLocation.tsx     # Location badge
│   ├── navbar/
│   │   ├── Navbar.tsx           # Main navbar — top bar + floating menu button
│   │   ├── Logo.tsx             # Animated logo
│   │   ├── NavLinks.tsx         # Glass pill navigation links
│   │   ├── MenuButton.tsx       # Hamburger/close button
│   │   ├── FullscreenMenu.tsx   # Fullscreen overlay menu
│   │   ├── MenuLink.tsx         # Individual menu link with hover animation
│   │   └── ThemeToggle.tsx      # 4-theme dropdown selector
│   ├── about/                   # About section (3 variants)
│   │   ├── About.tsx            # V1 — Noise sphere + bio/highlights
│   │   ├── AboutV2.tsx          # V2 — Noise sphere + skill words
│   │   ├── AboutV6.tsx          # V3 — Spiky crystal sphere variant
│   │   ├── AboutSphere.tsx      # V1 3D sphere (custom noise shader + fresnel)
│   │   ├── AboutSphereV6.tsx    # V3 sphere (sharp noise + wireframe overlay)
│   │   ├── AboutScene.tsx       # V1 Canvas wrapper (theme sync, demand rendering)
│   │   ├── createAboutScene.tsx # Factory for variant Canvas wrappers
│   │   ├── AboutLayout.tsx      # Shared 2-column layout (scene + content)
│   │   ├── AboutSwitcher.tsx    # Floating variant switcher tabs
│   │   ├── AboutHeading.tsx     # Section heading
│   │   ├── AboutDescription.tsx # Bio paragraphs
│   │   ├── AboutHighlights.tsx  # Skill/highlight pill badges
│   │   └── useAboutAnimations.ts # Shared GSAP entrance + scroll animations
│   ├── loader/
│   │   └── Preloader.tsx        # Split-reveal preloader (count 0→100)
│   └── cursor/
│       └── CustomCursor.tsx     # Custom cursor with magnetic effect
├── hooks/
│   ├── useAfterPreloader.ts     # Run callback after preloader finishes (event-based)
│   ├── useTheme.ts              # Theme state + localStorage persistence
│   ├── useScrollSpy.ts          # Track active section on scroll
│   ├── useScrollDirection.ts    # Detect scroll direction + at-top state
│   └── useMagnetic.ts           # Magnetic hover effect for elements
├── sanity/
│   ├── schemaTypes/             # CMS content schemas
│   │   ├── profile.ts           # Name, title, bio, socials, stats, location
│   │   ├── project.ts           # Portfolio projects (title, images, tech, links)
│   │   ├── experience.ts        # Work experience entries
│   │   ├── service.ts           # Services offered
│   │   ├── skill.ts             # Skills with categories and proficiency
│   │   ├── review.ts            # Client testimonials
│   │   ├── aboutSection.ts      # About section content (singleton)
│   │   └── seoSettings.ts       # SEO metadata (singleton)
│   └── lib/
│       ├── load-query.ts        # Sanity query helper
│       └── url-for-image.ts     # Image URL builder
└── lib/
    └── utils.ts                 # cn() utility (clsx + tailwind-merge)
```

---

## Key Architecture Patterns

### Preloader → Entrance Animation Chain

The preloader and all entrance animations are coordinated via a custom event system:

1. `Preloader` counts 0→100, then dispatches `window "preloader-complete"` event
2. `useAfterPreloader(callback, delay?)` hook listens for this event
3. Hero, Navbar, and HeroStats queue their GSAP entrance timelines through this hook
4. 5-second fallback ensures the site works even if the preloader breaks

```
Preloader finishes → dispatches event
  → Hero entrance timeline (immediate)
  → Navbar entrance timeline (immediate)
  → HeroStats counter animation (2500ms delay)
```

### 4-Theme System

| Theme | Mode | Primary Color |
|---|---|---|
| `orange` (default) | Dark | Orange accent (#ff6b2b) |
| `mono-dark` | Dark | White/gray monochrome |
| `mono-light` | Light | Black/gray monochrome |
| `orange-light` | Light | Orange accent (darker variant) |

- Applied via `data-theme` attribute on `<html>`
- Inline script in `<head>` prevents FOUC (sets `data-theme`, `dark` class, and `backgroundColor` before CSS loads)
- `useTheme` hook manages state + localStorage
- CSS custom properties (`--primary`, `--background`, etc.) defined per theme in `global.css`

### Animation Strategy

- **GSAP** — entrance sequences (orchestrated timelines with stagger), scroll-driven effects (parallax, clip-path morphing), counter animations
- **Framer Motion** — UI transitions (menu open/close, button appear/disappear, component mount/unmount via `AnimatePresence`)
- **Data attributes as selectors** — elements tagged with `data-hero-char`, `data-hero-badge`, `data-nav-logo`, etc. for GSAP targeting

### Scroll Behavior

- Hero section: clip-path trapezoid morph on scroll, content parallax with layered depths, name slides left / role slides right
- Navbar: visible at top of page → slides up when scrolled → floating menu button appears
- `useScrollSpy` tracks which section is in view for nav highlighting

### 3D Scenes

**Hero Scene:**
- React Three Fiber canvas behind hero content
- 3 wireframe shapes (icosahedron, torus, octahedron) rotating slowly
- Particle emitter with floating particles
- Skill network with labeled 3D nodes
- Theme-aware colors via `useTheme` hook

**About Spheres:**
- V1: Custom simplex noise shader with 2-octave displacement, fresnel glow, dark inner core, mouse-reactive
- V3 (V6 internally): Sharp 2-octave noise with `pow()` peak sharpening, low-poly wireframe overlay, spike glow
- All use `frameloop="demand"` + `invalidate()` for on-demand rendering
- `createAboutScene` factory shares theme sync + Canvas boilerplate across variants
- Theme color sync via MutationObserver on `data-theme` attribute

---

## Sanity CMS

- **Singletons**: profile, aboutSection, seoSettings (one document each)
- **Collections**: project, experience, service, skill, review
- Studio accessible at `/studio` route
- Env vars: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`

---

## Current State

### Completed
- Hero section (fully animated with all subcomponents)
- Navbar (top bar + fullscreen menu + theme toggle)
- Preloader (split-reveal with counter)
- Custom cursor (magnetic effect, hidden on touch)
- 4-theme system with FOUC prevention
- All Sanity schemas defined

### In Progress
- About section (3 variants via switcher: V1 noise sphere, V2 skill words, V3 spiky crystal)

### Placeholder / TODO
- Skills section
- Projects section
- Experience section
- Contact section
- Sanity data integration (schemas exist but frontend doesn't fetch data yet)

---

## Branch Strategy

- `master` — production (main branch for PRs)
- `develop` — development branch
- `feature/*` — feature branches merged into develop
  - `feature/navbar` — navbar implementation
  - `feature/hero` — hero section
  - `feature/theme-switcher` — 4-theme system
  - `feature/preloader` — preloader + useAfterPreloader hook

---

## Config Notes

- Path alias: `@/*` → `./src/*` (tsconfig)
- Tailwind v4 uses `@tailwindcss/vite` plugin (not PostCSS)
- shadcn/ui configured via `components.json`
- Strict TypeScript (`astro/tsconfigs/strict`)
- JSX configured for React (`react-jsx`)
