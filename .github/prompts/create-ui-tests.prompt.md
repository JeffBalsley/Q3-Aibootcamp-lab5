---
description: "Create UI tests for required critical user journeys"
agent: test-engineer
tools: ["search", "read", "edit", "execute", "todo"]
---

# Create UI Tests

Create or maintain Playwright tests for the requested critical user journeys.

## Input

Journeys are optional. If none are provided, use this default set:

- Create
- Edit
- Toggle completion
- Delete
- Core error-state handling

## Hard Test Limit

- Author or update a maximum of **5 Playwright test cases** during this run.
- Target 3-5 total tests, including at least 1 error-path test.
- If more than 5 scenarios are candidates, select the 5 highest-risk scenarios and list deferred scenarios in the final report.
- Before finishing, count every authored `test(...)` or `it(...)` case affected by this run. Reduce the authored set to 5 or fewer if it exceeds the limit.
- Do not describe the scope as small if the final authored count is greater than 5.

## Workflow

1. **Inspect the Existing Test Surface**
   - Read the Playwright configuration, existing UI tests, application routes, and relevant components.
   - Reuse the project's existing test commands, fixtures, and conventions.
   - Identify current coverage before adding or changing tests.

2. **Select Scenarios**
   - Map requested journeys to concrete user scenarios and assertions.
   - Include at least one failure or error-state path in the 3-5 test cases.
   - Prefer the highest-risk and most valuable journeys when the candidate list exceeds the limit.

3. **Implement with Page Object Model**
   - Put reusable UI interactions and selectors in page object classes or helpers.
   - Keep spec files focused on scenario intent, setup, and assertions.
   - Avoid duplicating selectors or interaction flows across tests.
   - Keep each test deterministic and isolated; do not depend on another test's data or execution order.

4. **Use Reliable Playwright Practices**
   - Prefer accessibility-first selectors such as `getByRole` and `getByLabel`.
   - Use stable `data-testid` attributes only when semantic selectors are not appropriate.
   - Avoid brittle CSS selectors, arbitrary timeouts, and index-based element selection.
   - Use state-based waits such as locator assertions, response waits, and load-state checks.
   - Create unique test data and clean up or reset state as required by the project.

5. **Validate the Test Changes**
   - Run the narrowest relevant Playwright command available.
   - Confirm the tests are readable, isolated, and within the maximum count.
   - Investigate failures sufficiently to distinguish application, test, and environment problems.

## Final Report

Include:

- Files created or updated
- Number of Playwright test cases created or updated
- Scenarios covered, including the error path
- Deferred scenarios, if any
- Validation command and result
- Any application, test, or environment blockers

Do not implement unrelated application features in this prompt. Hand application behavior fixes to the appropriate TDD workflow.
