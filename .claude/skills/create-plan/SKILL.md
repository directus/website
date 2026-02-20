---
disable-model-invocation: true
description: Create an implementation plan for a website change from a text description or GitHub issue number. Interviews the user to fill gaps before planning.
argument-hint: "[description of change or GitHub issue number]"
---

# Create Implementation Plan

You are helping a team member plan a website change. Your input is either a text description or a GitHub issue number. Your job is to produce a great plan — but only after you have enough context to do so.

## Phase 1: Gather Context

1. **Parse the input:**
   - If the argument is a number, fetch the issue: `gh issue view <number>`
   - Otherwise, treat the argument as a plain-text description of the desired change

2. **Assess what you know.** Check whether you have enough to write a solid plan. You need:
   - **What** — the type of change (new feature, enhancement, fix, refactor)
   - **Where** — which page(s), section(s), or component(s) are affected
   - **Behavior** — what should happen, what should the result look like
   - **Visual expectations** — layout, styling, responsive behavior (if applicable)

3. **If gaps exist, interview the user.** Use `AskUserQuestion` with 1-3 targeted questions per round. Max 2-3 rounds before moving forward with what you have. Example questions by gap type:

   **Where:**
   - Which page or section is this for?
   - Is this a new page or a change to an existing one?

   **Behavior:**
   - What should happen when the user interacts with this?
   - What data should be displayed? Where does it come from?

   **Visual:**
   - Do you have a screenshot, mockup, or reference URL? (paste an image or file path)
   - Should this match an existing section on the site? Which one?
   - Any specific desktop vs. mobile differences?

   **Scope:**
   - Is this a one-off or should it be reusable?
   - Are there edge cases to handle (empty states, long text, missing data)?

4. **If the input is already detailed enough, skip the interview** and move to Phase 2.

## Phase 2: Visual References

- If the user provides screenshots or mockups → use the Read tool to view them and reference in the plan
- If no visuals provided but the change is visual → ask once: "Do you have a screenshot or mockup? If not, no worries — I'll base the plan on your description."
- If the change involves an existing page → suggest using `/screenshot <path>` to capture current state for reference
- If the user provides a reference URL → note it in the plan for the implementer

## Phase 3: Explore the Codebase

Use Glob, Grep, and Read tools to understand what files and patterns are relevant. Pay attention to:
- Existing components in `app/components/` — especially `Base/` and `Block/`
- Page structure in `app/pages/`
- Types in `types/schema.ts`
- Styling patterns in similar existing components

## Phase 4: Produce the Plan

**Enter plan mode** and write the plan following the template in `.docs/plan-template.md`. The plan must include:
- Summary of the change
- Files to modify/create
- Step-by-step implementation approach
- Existing patterns to follow (with file paths)
- Visual references (if provided)
- Unresolved questions (if any remain)

**Exit plan mode** when the plan is ready for approval.

## Important

- **Interview first, plan second.** A vague request → interview. A detailed request → skip to explore.
- Keep interview rounds short and focused. Don't ask everything at once.
- Reference existing patterns and components — don't reinvent what exists
- Keep plans concrete and actionable, not abstract
- Call out risks or trade-offs
- If the change is content-only (text, images), tell the user it should be done in the Directus CMS instead
