# Claude Code Guide for the Website Team

A guide for using Claude Code to make changes to the Directus marketing website.

## What is Claude Code?

Claude Code is an AI-powered coding assistant that runs in your terminal. It can read your codebase, write code, run commands, and help you submit pull requests — all through natural language conversation.

## Getting Started

### 1. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

You'll need to authenticate with your team account. Ask a team lead for access if you don't have it.

### 2. Clone the repo and open it

```bash
git clone https://github.com/directus/website.git
cd website
claude
```

This drops you into an interactive session where you can ask Claude to make changes.

### 3. Install dependencies (first time only)

```bash
pnpm install
```

## Workflow: Skills

The recommended workflow uses three skills (slash commands) that guide you through the full process:

### Step 1: Plan your change

```
/create-plan Add a compact variant to the Header block
```

Or reference a GitHub issue:

```
/create-plan 42
```

Claude will explore the codebase, ask clarifying questions, and produce a structured implementation plan for your approval.

### Step 2: Implement

Once you approve the plan, Claude implements it. You can also make changes conversationally:

```
> Make the changes from the plan
```

### Step 2b: Capture screenshots (optional)

```
/screenshot /pricing /features
```

Spins up the dev server, captures desktop and mobile screenshots of the specified pages, and saves them to `.screenshots/`. Use `--compare` for before/after screenshots. When you run `/submit-pr`, any screenshots are automatically uploaded as a PR comment.

### Step 3: Review before submitting

```
/pre-review
```

Runs lint + typecheck and reviews your diff for common issues (missing scoped styles, console.logs, etc.). Fix any issues before proceeding.

### Step 4: Submit a PR

```
/submit-pr
```

Pushes your branch, creates a PR targeting `main` with a structured description, and gives you the PR URL.

### Step 5: Get a review

Add the `claude` label to your PR on GitHub. This triggers an automated code review that will post comments on your PR. A team dev will also review and approve before merge.

## What Happens After You Push

1. **CI Checks** run automatically (lint, typecheck, build) — all must pass
2. **Deploy Preview** — Netlify creates a preview URL so you can see your changes live
3. **Claude Review** — add the `claude` label for an automated code review
4. **Human Review** — a dev reviews and merges your PR

### Debugging issues

```
/debug /pricing
```

Opens the page in the browser, checks for console errors, network failures, and visual issues. Traces errors to source code, fixes them, and verifies the fix. Works with `agent-browser` (automatic) or MCP browser tools (manual — you keep the page open).

## Tips

- **Be specific.** "Make the header bigger" is vague. "Increase the header font size on desktop from 3rem to 3.5rem" is better.
- **Ask Claude to explain.** If you don't understand something, ask: "What does this component do?" or "How does the block system work?"
- **Don't worry about breaking things.** CI checks catch most issues, deploy previews let you verify visually, and a dev reviews before merge.
- **Use existing components.** Before asking Claude to build something new, ask: "Is there an existing component for X?" The `Base/` directory has reusable primitives.
- **Run checks locally.** `pnpm lint` and `pnpm typecheck` catch issues before you push.

## Common Gotchas

- **Content vs. code changes.** If you're updating text, images, or page content — that's done in the Directus CMS admin, not in this repo. This repo is for layout, styling, and functionality changes.
- **Environment variables.** You'll need a `.env` file for local development. Ask a dev for the values.
- **Node version.** This project uses Node 20. Use `nvm use 20` if you have nvm installed.
