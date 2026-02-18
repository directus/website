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

## Submitting Your First PR

Here's the typical workflow:

### Step 1: Create a branch

Tell Claude what you want to do. It'll create a branch and start working:

```
> Create a branch and update the CTA block to support a secondary variant
```

Or create one yourself first:

```bash
git checkout -b your-name/description-of-change
```

### Step 2: Make your changes

Describe what you want in plain language:

```
> Add a new "compact" size option to the Header block
> Update the testimonial slider to show 3 cards on desktop instead of 2
> Fix the spacing on the pricing tier cards
```

Claude will read the relevant files, make changes, and run lint/typecheck to verify.

### Step 3: Review what changed

Ask Claude to show you what it did:

```
> What files did you change? Show me a summary.
```

Or check git directly:

```bash
git diff
```

### Step 4: Commit and push

```
> Commit these changes and push
```

Or use `/commit` in Claude Code for an interactive commit flow.

### Step 5: Open a PR

```
> Open a pull request for this change
```

Claude will create the PR on GitHub with a description of the changes.

### Step 6: Get a review

Add the `claude` label to your PR on GitHub. This triggers an automated code review that will post comments on your PR. A team dev will also review and approve before merge.

## What Happens After You Push

1. **CI Checks** run automatically (lint, typecheck, build) — all must pass
2. **Deploy Preview** — Netlify creates a preview URL so you can see your changes live
3. **Claude Review** — add the `claude` label for an automated code review
4. **Human Review** — a dev reviews and merges your PR

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
