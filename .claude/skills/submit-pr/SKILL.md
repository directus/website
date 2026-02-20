---
disable-model-invocation: true
description: Create a pull request for the current branch with automated checks and screenshot uploads.
---

# Submit Pull Request

Create a pull request for the current branch.

## Context

Current branch:
```
`! git branch --show-current`
```

Diff against main:
```
`! git diff main...HEAD`
```

Commit log:
```
`! git log --oneline main..HEAD`
```

## Steps

1. **Check prerequisites:**
   - Verify there are commits ahead of `main`
   - Verify the working tree is clean (no uncommitted changes). If dirty, ask user whether to commit first.
   - Verify lint and typecheck pass. If not, ask user whether to fix or proceed anyway.

2. **Push the branch** to origin if not already pushed:
   ```bash
   git push -u origin HEAD
   ```

3. **Draft the PR description** using the template in `.docs/pr-template.md`. Fill in:
   - Summary from the commit log and diff
   - What changed (files and components)
   - How to test (based on what was modified)

4. **Create the PR** targeting `main`:
   ```bash
   gh pr create --title "<title>" --body "<body>"
   ```

5. **Attach screenshots** if `.screenshots/*.png` files exist:
   - After creating the PR, build a markdown comment with the screenshot images
   - Upload and comment using:
     ```bash
     gh pr comment <PR_NUMBER> --body "$(cat <<'EOF'
     ## Screenshots

     <markdown table with image references>
     EOF
     )"
     ```
   - Clean up: `rm -rf .screenshots/`

6. **Output the PR URL** so the user can share it with reviewers.

## Important

- PR title: under 72 chars, use conventional commit prefix (feat:, fix:, etc.)
- Keep the description concise but complete
- Always target `main` unless told otherwise
