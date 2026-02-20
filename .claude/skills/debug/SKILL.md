---
disable-model-invocation: true
description: Debug page issues using browser diagnostics. Opens the page, gathers console/network errors, traces to source, fixes, and verifies.
argument-hint: "[url path or description of issue]"
---

# Debug Page Issue

Open the browser, gather diagnostics, find the root cause, fix it, and verify the fix.

## Context

Current branch:
```
`! git branch --show-current`
```

Changed files:
```
`! git diff --name-only main...HEAD`
```

## Steps

1. **Check browser access:**
   - Run `which agent-browser` to check availability
   - If available → **agent-browser mode** (opens pages automatically)
   - If not → **MCP-only mode** (user must have the page open in their browser)
   - Tell the user which mode you're using

2. **Parse arguments:**
   - URL path (e.g., `/pricing`) → debug that specific page
   - Text description (e.g., "images not loading on homepage") → infer page from description and git diff
   - No args → ask the user what issue they're seeing and which page

3. **Start dev server** (agent-browser mode only, skip if already running):
   ```bash
   pnpm dev &
   DEV_PID=$!
   for i in {1..30}; do curl -s -o /dev/null http://localhost:3000 && break || sleep 2; done
   ```

4. **Open the page** (agent-browser mode only):
   ```bash
   agent-browser open "http://localhost:3000<path>"
   agent-browser wait --load networkidle
   ```

5. **Gather diagnostics** — run these MCP tools (work in both modes):
   - `mcp__browser-tools__getConsoleErrors` — JS runtime errors, Vue warnings
   - `mcp__browser-tools__getConsoleLogs` — all console output
   - `mcp__browser-tools__getNetworkErrors` — failed API calls, 404s, CORS issues
   - `mcp__browser-tools__getNetworkLogs` — all network activity
   - `mcp__browser-tools__takeScreenshot` — current visual state

6. **Analyze and trace to source:**
   - **Network errors** → check `server/api/` routes, check `app/plugins/directus.ts` for API config
   - **Console errors** → use Grep to find the error source in `app/components/`, read the file
   - **Vue warnings** → check component props, data fetching in the relevant `Block*.vue` or `Base*.vue`
   - **Visual issues** → read component styles, check responsive breakpoints (50rem, 68rem)
   - **API errors** → check Directus query fields, permissions, collection names in `types/schema.ts`

7. **Fix the issue:**
   - Make the minimal code change to resolve the root cause
   - Follow project conventions (scoped SCSS, `<script setup lang="ts">`, etc.)

8. **Verify the fix:**
   - **Agent-browser mode:** reload the page and re-run diagnostics
     ```bash
     agent-browser open "http://localhost:3000<path>"
     agent-browser wait --load networkidle
     ```
   - **MCP-only mode:** ask the user to refresh, then re-run `getConsoleErrors` and `getNetworkErrors`
   - Take a screenshot to confirm visual state

9. **Optional audits** (if user passes flags):
   - `--perf` → run `mcp__browser-tools__runPerformanceAudit`
   - `--a11y` → run `mcp__browser-tools__runAccessibilityAudit`

10. **Clean up:**
    - Kill dev server if this skill started it: `kill $DEV_PID`
    - Wipe browser logs: `mcp__browser-tools__wipeLogs`

11. **Output a debug report:**

```markdown
## Debug Report: <page>

### Issues Found
- **Console Error:** `<error message>` in `<file>:<line>`
- **Network Error:** `<method> <url>` returned `<status>`

### Changes Made
- <description of fix> in `<file path>`

### Verification
- Console errors: 0
- Network errors: 0
- Screenshot confirms fix
```

## Key Files

- `app/plugins/directus.ts` — Directus SDK client, retry logic, rate limiting
- `app/components/Block/*.vue` — CMS block components (most common issue source)
- `app/components/Base/*.vue` — reusable UI primitives
- `server/api/` — Nitro server routes
- `types/schema.ts` — Directus collection types

## Important

- Always kill the dev server if you started it, even if debugging fails
- Don't add `console.log` — the project ESLint config forbids it
- Keep fixes minimal — only change what's needed to resolve the issue
- If you can't determine the root cause, report what you found and ask the user for more context
