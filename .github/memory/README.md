# Memory System

This directory implements the **working memory** half of a two-tier memory system for this project. It exists so that discoveries, patterns, and decisions made during development are not lost between sessions, and so future work (by AI agents or humans) can build on what was already learned instead of rediscovering it.

## Purpose

While working on this codebase (implementing features, fixing bugs, chasing down lint errors, debugging failing tests), you inevitably learn things that aren't obvious from reading the code alone:

- "This service always initializes with an empty array, never `null`, because X depends on it."
- "We tried approach A for the date parsing bug, it didn't work because of Y, approach B did."
- "The Playwright tests are flaky when run in parallel because of shared fixture Z."

These insights are valuable. Writing them down means:

- The next session doesn't repeat failed experiments.
- Code reviewers and teammates understand *why* something was done a certain way.
- AI agents (like Copilot) can read this memory and apply the same patterns/conventions automatically.

## Two Types of Memory

| Type | Location | Scope | Committed to git? |
|---|---|---|---|
| **Persistent Memory** | [.github/copilot-instructions.md](../copilot-instructions.md) | Foundational principles, architecture, workflows that rarely change | Yes |
| **Working Memory** | `.github/memory/` (this directory) | Discoveries, patterns, and decisions accumulated during development | Mostly yes (except `scratch/`) |

Persistent memory answers "how do we work here?" Working memory answers "what have we learned so far?"

## Directory Structure

```
.github/memory/
├── README.md                  # This file
├── session-notes.md           # Historical summaries of completed sessions (committed)
├── patterns-discovered.md     # Accumulated code patterns and conventions (committed)
└── scratch/
    ├── .gitignore              # Ignores everything in scratch/
    └── working-notes.md        # Active session scratchpad (NOT committed)
```

### `session-notes.md`
A chronological log of **completed** sessions. Each entry summarizes what was done, what was found, and the outcome. Written *after* a session wraps up, once findings are distilled from the scratchpad. This is a historical record — never delete old entries, append new ones.

### `patterns-discovered.md`
A living reference of recurring code patterns, conventions, and idioms found in this codebase. Unlike session notes (which are chronological history), this file is organized by pattern and should be updated/refined whenever a pattern recurs or a better example is found.

### `scratch/working-notes.md`
The scratchpad for the **current, active** session. Freely rewritten, messy, in-progress — this is where you think out loud while working. It is git-ignored (see `scratch/.gitignore`) because it's ephemeral and only useful mid-session.

## When to Use Each File

### During TDD (Red-Green-Refactor)
- Jot down in `scratch/working-notes.md` why a test was written a certain way, or a surprising failure during RED/GREEN.
- If a reusable testing pattern emerges (e.g., how to mock a service), add it to `patterns-discovered.md`.

### During Linting / Code Quality Passes
- Note any repeated lint issues and their systemic cause in `scratch/working-notes.md`.
- If the fix represents a convention the team should follow going forward, promote it to `patterns-discovered.md`.

### During Debugging
- Record hypotheses tried, dead ends, and the eventual root cause in `scratch/working-notes.md` as you go — this is the highest-value use of the scratchpad, since debugging context is the easiest to lose.
- Once the bug is fixed, summarize the root cause and fix in `session-notes.md` so future debugging of related issues starts from this context.

## How AI Reads and Applies These Patterns

When working in this repository, Copilot (and other agents) should:

1. Check `.github/memory/patterns-discovered.md` before implementing something that resembles an existing pattern, and follow the established convention instead of inventing a new one.
2. Check `.github/memory/session-notes.md` for prior context on the area of code being touched, especially for previously-solved bugs or rejected approaches.
3. Write new findings to `.github/memory/scratch/working-notes.md` during active work.
4. At the end of a session, summarize the scratchpad into a new dated entry in `session-notes.md`, and extract any durable, reusable patterns into `patterns-discovered.md`.

## Key Difference: `session-notes.md` vs `scratch/working-notes.md`

- **`session-notes.md`** — completed, distilled, historical. Written once a session's work is done. Committed to git so the whole team benefits.
- **`scratch/working-notes.md`** — in-progress, raw, disposable. Overwritten/cleared each session. Not committed — it's a personal/session-local thinking space, not a deliverable.

Think of `scratch/working-notes.md` as your whiteboard during the session, and `session-notes.md` as the meeting notes you publish afterward.
