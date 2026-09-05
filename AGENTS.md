<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Commands

Package manager is **pnpm** (`packageManager: pnpm@11.22.0`). Prefer pnpm over npm/yarn.

```bash
pnpm dev        # dev server on port 3009 (next dev -p 3009)
pnpm build      # production build (next build)
pnpm start      # start production server
pnpm lint       # eslint
```

No test suite configured yet. TypeScript config lives in `tsconfig.json`; run `pnpm exec tsc --noEmit` for a typecheck.

# Project Skills

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
- `ui-ux-pro-max` — UI/UX intelligence for web/mobile/desktop; searchable data: 79 styles (50 active), 192 palettes, 74 font pairings, 119 UX guidelines, 105 icons, 25 chart types, 22 stacks

## `.agents/skills/` (design, Vercel & quality)

- Design & UI (mirror of `.opencode/skills/`): `banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`, `ui-ux-pro-max`
- `deploy-to-vercel` — deploy to Vercel
- `frontend-design` — production-grade frontend interfaces, avoids generic AI aesthetics
- `test` — run React core tests (source/www/stable/experimental channels)
- `vercel-cli-with-tokens` — Vercel CLI with access tokens
- `vercel-composition-patterns` — React composition, compound components, render props
- `vercel-optimize` — Vercel cost/performance optimization
- `vercel-react-best-practices` — React/Next.js performance patterns
- `vercel-react-native-skills` — React Native/Expo performance
- `vercel-react-view-transitions` — View Transition API animations
- `web-design-guidelines` — review UI against Web Interface Guidelines
- `writing-guidelines` — review docs/prose against writing handbook

## Global skill packages (installed skills)

Load with `skill` tool when the task matches. Full descriptions in system prompt.

### superpowers (process workflow)
- `using-superpowers` — skill dispatch rule, read at session start
- `brainstorming` — requirements/design before any creative work
- `systematic-debugging` — root-cause bugs before fixing
- `test-driven-development` — write tests before implementation
- `feature-dev` — 7-phase feature workflow
- `writing-plans` / `executing-plans` / `subagent-driven-development` — plan-driven execution
- `using-git-worktrees` / `finishing-a-development-branch` — branch isolation & integration
- `requesting-code-review` / `receiving-code-review` / `verification-before-completion` — review/verify
- `dispatching-parallel-agents` — run independent tasks in parallel
- `writing-skills` — create/edit skills

### opencode-power-pack (dev & quality)
- `agents-md-improver` / `agents-md-revise` — audit/update AGENTS.md
- `code-review` / `code-reviewer` / `code-architect` / `code-explorer` — review/design/explore
- `code-quality` — lint/format/maintainability
- `design-patterns` — abstraction & architecture choices
- `frontend-design` — production-grade interfaces (no AI-slop aesthetic)
- `ai-slop` — rubric against generic AI design
- `mcp-builder` — build MCP servers
- `skill-creator` — author skills

### security
- `security-audit` — codebase vulnerability audit
- `security-review` — security review of pending git changes
- `security-threat-model` — repository AppSec threat model
- `semgrep` / `semgrep-rule-creator` / `semgrep-rule-variant-creator` — static analysis
- `codeql` / `sarif-parsing` / `differential-review` — SAST + SARIF + diff review
- `fp-check` — verify suspected bugs (eliminate false positives)
- `variant-analysis` — find bug variants
- `vuln-report` — disclosure-ready advisory
- `supply-chain-risk-auditor` / `insecure-defaults` / `sharp-edges` / `agentic-actions-auditor` — audits
- `paper-summarizer` — analyze academic/technical papers

### AI/ML (Hugging Face)
- `hf-cli` / `hf-mem` — Hub CLI, model memory estimation
- `huggingface-*` — best/community-evals/datasets/gradio/llm-trainer/local-models/papers/spaces/tool-builder/zerogpu/vision-trainer/trackio/lora-space-builder/paper-publisher
- `hf-cloud-*` — SageMaker deployment (planner/iam/preflight/production-defaults/serving-image/aws-context/py-env)
- `transformers-js` / `train-sentence-transformers` / `trl-training` — model inference/training

### communication (caveman)
- `caveman` / `caveman-lite|full|ultra|wenyan` — compressed replies
- `caveman-commit` / `caveman-review` / `caveman-stats` / `caveman-help` / `caveman-compress` — terse commits/reviews/metrics
- `cavecrew` (+ `investigator`/`builder`/`reviewer`) — delegate to compressed subagents

### misc
- `context7-mcp` — up-to-date library/framework docs (MCP)
- `find-skills` — discover installable skills
- `graphify` — codebase knowledge graph queries
- `customize-opencode` — edit opencode config (use BEFORE touching opencode.json/.opencode/)
