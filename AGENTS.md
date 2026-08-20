<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Skills

# Design

- `DESIGN.md` is the source of truth for authentication screens — follow its palette, typography, and composition before adapting copy.
- Palette tokens live in `app/globals.css` under `@theme inline` (brand-*): bg `#0A0A0A`, surface `#18181B`, primary `#2563EB`, accent `#3B82F6`, border `#27272A`, text `#FFFFFF`/`#A1A1AA`.
- Fonts: `--font-sans` = Inter, `--font-mono` = JetBrains Mono (defined in `app/layout.tsx`). Use mono for labels/technical metadata, sans for body/display.
- Tailwind v4: no `tailwind.config.js`; tokens are CSS vars in globals.css.

Load the matching skill with the `skill` tool at the START of every session / whenever the task matches its description. Do not rely on memory — invoke the skill to get current instructions.

## `.opencode/skills/` (design & UI)

- `banner-design` — social/ads/web/print banners, multiple art directions
- `brand` — brand voice, visual identity, messaging, brand compliance
- `design` — logo generation, CIP, mockups, icons, social photos, presentations
- `design-system` — design tokens (primitive→semantic→component), CSS vars, component specs
- `slides` — strategic HTML presentations (Chart.js, design tokens)
- `ui-styling` — shadcn/ui + Tailwind UIs, accessible components, dark mode
- `ui-ux-pro-max` — UI/UX intelligence for web/mobile/desktop (79 styles, 192 palettes, 74 font pairings)

## `.agents/skills/` (Vercel & quality)

- `deploy-to-vercel` — deploy to Vercel
- `frontend-design` — production-grade frontend interfaces, avoids generic AI aesthetics
- `vercel-cli-with-tokens` — Vercel CLI with access tokens
- `vercel-composition-patterns` — React composition, compound components, render props
- `vercel-optimize` — Vercel cost/performance optimization
- `vercel-react-best-practices` — React/Next.js performance patterns
- `vercel-react-native-skills` — React Native/Expo performance
- `vercel-react-view-transitions` — View Transition API animations
- `web-design-guidelines` — review UI against Web Interface Guidelines
- `writing-guidelines` — review docs/prose against writing handbook

Also available: `deploy-to-vercel` and `vercel-cli-with-tokens` for Vercel deploy workflows.
