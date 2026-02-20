---
disable-model-invocation: true
description: Review current changes for code quality, Vue patterns, styling, and security issues before submitting a PR.
---

# Pre-Review Changes

Review the current changes before submitting a PR.

## Context

Current diff:
```
`! git diff`
```

Commit log on this branch:
```
`! git log --oneline main..HEAD`
```

## Steps

1. **Run automated checks:**
   - Run `pnpm lint` and report results
   - Run `pnpm typecheck` and report results

2. **Review the diff** for issues across these categories:

   **Code quality:**
   - `console.log` or `debugger` statements
   - Nested ternaries
   - Duplicated code — logic, markup, or styles repeated across or within files
   - Overly complex code that could be simplified without losing functionality (long functions, deep nesting, unnecessary abstractions)

   **Vue patterns:**
   - Missing `scoped` attribute on `<style>` tags
   - Missing TypeScript types (untyped props, `any` usage)
   - Not using existing Base components (`BaseButton`, `BaseCard`, etc.) when applicable
   - Reactive state that should be computed properties
   - Missing `key` attributes on `v-for` loops
   - Direct DOM manipulation instead of Vue reactivity
   - Props mutation (modifying props directly instead of emitting events)

   **Styling:**
   - Inline styles instead of scoped SCSS
   - Hardcoded colors, spacing, or font sizes instead of `--space-*` / CSS custom properties
   - Missing responsive handling for tablet (`50rem`) and desktop (`68rem`) breakpoints

   **Security:**
   - `v-html` with unsanitized or user-controlled content
   - Interpolating raw URLs or external data without validation
   - Exposed API keys, tokens, or secrets

3. **Output a review summary:**

   ```
   ## Pre-Review Results

   **Lint:** ✅ Pass / ❌ Fail
   **Typecheck:** ✅ Pass / ❌ Fail

   ### Issues Found
   - [ ] issue description (file:line)

   ### Looks Good
   - brief summary of what the changes do correctly
   ```

4. If there are issues, offer to fix them automatically.

## Important

- Be specific — reference exact files and line numbers
- Don't flag things that are pre-existing (not in the diff)
- Focus on the project conventions in AGENTS.md
