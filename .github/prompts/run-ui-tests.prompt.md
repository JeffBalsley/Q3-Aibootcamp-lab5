---
description: "Run UI tests and summarize failures"
agent: test-engineer
tools: ["read", "execute", "todo"]
---

# Run UI Tests

Run the project's Playwright UI test suite and summarize outcomes and failures clearly.

## Mandatory Dependency Installation

Before running `/run-ui-tests`, always run:

```bash
npm run test:ui:install --workspace=frontend
```

In Ubuntu/Linux environments, this command is mandatory and must perform `playwright install --with-deps chromium` before tests run. The project's `test:ui:install` command includes bounded Ubuntu repository remediation for the common Yarn key issue and one retry.

- Do not perform ad-hoc package hunting or broad OS troubleshooting beyond that automated remediation.
- If installation fails after its retry, stop immediately.
- Report an environment blocker with the failing command and the key error lines.
- Do not run Playwright tests after a failed dependency installation.

## Workflow

1. **Install Browser Dependencies**
   - Run the mandatory install command first.
   - Confirm it completes successfully before continuing.

2. **Ensure Application Services Are Running**
   - Verify both backend and frontend are available.
   - Start them from the repository root with `npm start` if needed, following the project's existing scripts.
   - Do not start duplicate services when the required services are already running.

3. **Run the UI Suite**
   - Use the project's Playwright command, such as `npm run test:ui`.
   - Preserve the command output needed for diagnosis, including failing test names and assertion details.
   - Use existing Playwright configuration, fixtures, and reporters.

4. **Summarize Results**
   - Report total, passed, failed, skipped, and flaky tests when available.
   - Include the exact command used and whether the suite completed.
   - For each failure, include the scenario, failed step or assertion, and relevant error evidence.

5. **Classify Failures**
   Classify each failure as likely one of:
   - **Application code**: the product behavior does not meet the expected journey.
   - **Test code**: selector, wait, fixture, assertion, isolation, or test-data defect.
   - **Environment**: browser installation, service startup, port, dependency, configuration, or infrastructure problem.

   Explain the evidence for each classification and recommend the next focused action. Do not silently rewrite tests or application code while only running the suite.

## Output Format

```text
UI Test Run Summary
Command: <command>
Install: PASS | BLOCKED
Services: PASS | BLOCKED

Results:
- Passed: <count>
- Failed: <count>
- Skipped: <count>
- Flaky: <count, if available>
- Overall: PASS | FAIL | BLOCKED

Failures:
- <test> - <application code | test code | environment>
  Evidence: <key error or observation>
  Next action: <focused recommendation>
```

If the dependency install fails, report only the environment blocker and stop without running Playwright tests.
