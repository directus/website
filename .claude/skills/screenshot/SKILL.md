---
disable-model-invocation: true
description: Capture desktop and mobile screenshots of pages using agent-browser. Supports before/after comparison.
argument-hint: "[url paths or --compare]"
---

# Screenshot Pages

Capture screenshots of pages affected by current changes using `agent-browser`.

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

1. **Check prerequisites:**
   - Verify `agent-browser` is available: `which agent-browser`
   - If not installed, tell the user to install it: `npm install -g @anthropic-ai/agent-browser`
   - Ensure `.screenshots/` directory exists: `mkdir -p .screenshots`

2. **Parse arguments:**
   - If URL paths provided (e.g., `/pricing /features`) → screenshot those pages
   - If `--compare` flag → do before/after comparison (see step 5)
   - If no args → infer affected pages from the git diff. Look at changed files in `app/pages/` to determine routes. If changes are only in components/blocks, ask the user which pages to screenshot.

3. **Start dev server** in background:
   ```bash
   pnpm dev &
   DEV_PID=$!
   ```
   Wait for `http://localhost:3000` to respond:
   ```bash
   for i in {1..30}; do curl -s -o /dev/null http://localhost:3000 && break || sleep 2; done
   ```

4. **Capture screenshots** for each page path:
   ```bash
   # Desktop (1440x900)
   agent-browser open "http://localhost:3000<path>"
   agent-browser wait --load networkidle
   agent-browser set viewport 1440 900
   agent-browser screenshot ".screenshots/<name>-desktop.png" --full

   # Mobile (390x844)
   agent-browser set viewport 390 844
   agent-browser screenshot ".screenshots/<name>-mobile.png" --full
   ```
   - For the homepage `/`, use `home` as the name
   - For other paths like `/pricing`, use the last segment as the name (e.g., `pricing`)

5. **Before/after mode** (when `--compare` is passed):
   - First, stash current changes: `git stash`
   - Restart dev server, wait for it
   - Screenshot each page with `-before-desktop.png` / `-before-mobile.png` suffixes
   - Restore changes: `git stash pop`
   - Restart dev server, wait for it
   - Screenshot each page with `-after-desktop.png` / `-after-mobile.png` suffixes

6. **Kill dev server:**
   ```bash
   kill $DEV_PID
   ```

7. **Output results** as a markdown table.

## Output Format

For standard mode:
```markdown
## Screenshots

| Page | Desktop | Mobile |
|------|---------|--------|
| /pricing | ![desktop](.screenshots/pricing-desktop.png) | ![mobile](.screenshots/pricing-mobile.png) |
```

For compare mode:
```markdown
## Screenshots (Before / After)

### /pricing
| Viewport | Before | After |
|----------|--------|-------|
| Desktop | ![before](.screenshots/pricing-before-desktop.png) | ![after](.screenshots/pricing-after-desktop.png) |
| Mobile | ![before](.screenshots/pricing-before-mobile.png) | ![after](.screenshots/pricing-after-mobile.png) |
```

## Important

- Always kill the dev server when done, even if something fails
- Screenshots go in `.screenshots/` at the repo root (already gitignored)
- If `agent-browser` commands fail, suggest the user check that the browser agent is running
