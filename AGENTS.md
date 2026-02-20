# Directus Website

## Overview

Marketing website for [directus.io](https://directus.io) built with Nuxt 4 and Directus CMS. Pages are composed of reusable block components that render content from the Directus API.

## Tech Stack

- **Framework:** Nuxt 4 (app/ directory convention)
- **CMS:** Directus (headless, all content via API)
- **Styling:** Scoped SCSS with CSS custom properties (no Tailwind)
- **Hosting:** Netlify (deploy previews on PRs)
- **CI:** GitHub Actions (lint, typecheck, build)

## Project Structure

```
app/
├── components/
│   ├── Base/          # Reusable UI primitives (Button, Card, Container, etc.)
│   ├── Block/         # CMS block components (Header, RichText, CardGroup, etc.)
│   ├── Nav/           # Navigation components
│   └── ...
├── composables/       # Vue composables
├── layouts/           # Page layouts
├── pages/             # File-based routing
├── plugins/
└── utils/
server/                # Nitro server routes
types/                 # TypeScript type definitions
```

## Architecture: Block System

Pages are built from **sections** containing **blocks**. Content editors compose pages in Directus; the app renders them:

1. `PageBuilder.vue` receives sections from the CMS
2. Each section renders via `PageSection.vue` (handles background, spacing)
3. Blocks render via `BaseBlock.vue` which maps `block_*` collection types to `Block*.vue` components

**To add a new block:**
1. Create `app/components/Block/YourBlock.vue`
2. Register it in `app/components/Base/Block.vue` in the `components` map
3. Add the corresponding `block_*` type to `types/schema.ts` `BlockType`
4. The block receives a `uuid` prop and fetches its own data from Directus

## Conventions

### Components
- Use `<script setup lang="ts">` with TypeScript
- Props use `defineProps<T>()` with `withDefaults()` when needed
- Vue props destructure is enabled (`vue.propsDestructure: true`)
- Component names: PascalCase, auto-imported by Nuxt

### Styling
- Scoped SCSS (`<style lang="scss" scoped>`)
- CSS custom properties for theming (defined in `app/assets/css/vars.css`)
- Responsive breakpoints: `50rem` (tablet), `68rem` (desktop)
- Spacing uses `--space-*` tokens

### Code Quality
- No `console.log` or `debugger` (ESLint errors)
- No nested ternaries
- Prettier: 120 char width, single quotes, tabs
- Blank lines between blocks/imports/multiline statements (enforced by ESLint)

## Before Submitting

Always run these commands and fix any issues before committing:

```bash
pnpm lint
pnpm typecheck
```

## Common Tasks

### Modifying an existing block
1. Find the block in `app/components/Block/`
2. Read the component to understand its props and data fetching
3. Make changes, keeping existing patterns
4. Run lint + typecheck

### Modifying page layout or routing
1. Pages live in `app/pages/` using file-based routing
2. Most pages use the `[...permalink].vue` catch-all which renders CMS content
3. Dedicated pages exist for blog, case studies, features, team, etc.

### Working with Base components
- `BaseButton`, `BaseCard`, `BaseContainer`, `BaseHeading`, `BaseText` etc. are in `app/components/Base/`
- Always use existing Base components instead of creating new primitives
- Check what's available before building something new

## References

- [Vue Best Practices](.docs/vue-best-practices.md) — component conventions and patterns for this project

## Pull Requests

Use the PR template when opening pull requests. Include a deploy preview link so reviewers can verify changes visually.

### Handling Change Requests (AI Agents Only)

When an AI agent is triggered to resolve change requests or feedback on a pull request, it must create a **Sub-PR** (a new pull request targeting the original PR branch) instead of pushing commits directly to the PR branch.

**Why Sub-PRs:**
- Reviewers can evaluate AI-generated fixes in isolation
- Clear separation between original work and revisions
- Easier rollback if AI-generated fixes introduce issues
- Additional review checkpoint for AI changes
