---
description: "Execute instructions from the current GitHub Issue step"
agent: tdd-developer
tools: ["search", "read", "edit", "execute", "web", "todo"]
---

# Execute Step

Execute the activities from the current GitHub Issue step.

## Workflow

1. **Find the Exercise Issue**
   - If issue number is not provided, use GitHub CLI to find the main exercise issue
   - Reference the [Workflow Utilities](../.github/copilot-instructions.md#workflow-utilities) section in project instructions:
     - Command: `gh issue list --state open` to find the exercise issue (look for "Exercise:" in title)
     - Then: `gh issue view <issue-number> --comments` to get issue with all steps

2. **Parse Step Instructions**
   - Get the issue content with all comments
   - Find the latest step or currently active step
   - Locate the "⌨️ Activity:" sections within that step
   - Extract all activities that need to be executed

3. **Execute Activities Systematically**
   - Follow each activity in order
   - Complete the implementation work as guided
   - Run tests after implementation to verify
   - **SCOPE BOUNDARY**: Do NOT create or run Playwright UI tests in this prompt
     - For UI test creation: Use `/create-ui-tests` (auto-switches to test-engineer)
     - For UI test execution: Use `/run-ui-tests` (auto-switches to test-engineer)

4. **Generate Next Steps**
   - After completing all activities, provide the next command(s) in this order:
     - **If the current step requires UI workflow**: 
       - `/create-ui-tests` → `/run-ui-tests` → `/validate-step {step-number}`
     - **If UI workflow is not required**: 
       - `/validate-step {step-number}`
   - **IMPORTANT**: Never recommend `/validate-step` before running required UI prompts

## Prompt Usage

### Input
Provide the issue number (optional). If not provided, the prompt will use GitHub CLI to find the main exercise issue.

**Examples:**
- `/execute-step` - Find and execute the current step
- `/execute-step 42` - Execute step from issue #42

### Output
- Clear execution of all activities in the current step
- Passing tests confirming implementation
- Next command recommendation based on whether UI testing is required

## Key Principles

- **Follow Testing Scope**: Respect project testing constraints (backend/component tests here, UI tests in `/create-ui-tests` and `/run-ui-tests`)
- **Do Not Commit**: Changes are staged but not committed (use `/commit-and-push` for that)
- **Do Not Push**: All work stays local until `/commit-and-push` is executed
- **Systematic Execution**: Complete each activity fully before moving to next
- **Test Verification**: Run appropriate test suite after implementation
- **Hand-off to Validation**: Use `/validate-step` to confirm success criteria are met
