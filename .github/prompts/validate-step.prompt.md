---
description: "Validate that all success criteria for the current step are met"
agent: code-reviewer
tools: ["search", "read", "execute", "web", "todo"]
---

# Validate Step

Validate that the current workspace satisfies every success criterion for the requested exercise step.

## Required Input

The step number is required. Accept formats such as `5-0` or `5-1`.

If no step number is provided, ask the user for it and do not begin validation.

## Workflow

1. **Find the Exercise Issue**
   - Use GitHub CLI to find the main exercise issue.
   - Run `gh issue list --state open` and identify the issue with `Exercise:` in its title.
   - Run `gh issue view <issue-number> --comments` to retrieve the issue description and comments.

2. **Locate the Requested Step**
   - Search the issue content for the exact heading `# Step {step-number}:`.
   - Extract that step's `Success Criteria` section.
   - Do not use criteria from another step or infer missing criteria without clearly labeling the assumption.

3. **Check Each Criterion**
   - Inspect the current workspace, relevant source files, tests, configuration, and documentation.
   - Run the narrowest available validation commands needed to verify each criterion.
   - Check behavior and test evidence, not just the presence of files or keywords.
   - Use the project's testing guidance and existing npm workspace commands.

4. **Report Results**
   - Report every criterion as `PASS`, `FAIL`, or `BLOCKED`.
   - For each result, include concrete evidence such as a file, command, test result, or remaining gap.
   - For incomplete criteria, provide specific next actions.
   - Separate application failures from missing tests, configuration issues, and environment blockers.

## Output Format

```text
Step {step-number} Validation

Success Criteria
- PASS: <criterion> - <evidence>
- FAIL: <criterion> - <specific gap and next action>
- BLOCKED: <criterion> - <environment or missing-input blocker>

Overall: PASS | INCOMPLETE | BLOCKED
Next actions: <only the commands or changes still required>
```

## Constraints

- This prompt validates the requested step; it does not implement unrelated features.
- Preserve existing tests and project conventions.
- Do not claim success based only on static inspection when an executable check is available.
- If a required UI workflow has not been run, report that criterion as incomplete or blocked and direct the user to `/create-ui-tests` and `/run-ui-tests` before re-running validation.
