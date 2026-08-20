---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ["read", "execute", "todo"]
---

# Commit and Push

Analyze changes, generate a commit message using conventional commit format, and push to a feature branch.

## Workflow

1. **Pre-Commit Validation** (If Required)
   - If the current step includes required UI workflow:
     - Verify `npm run test:ui` has been successfully executed (or `/run-ui-tests` completed in current chat)
     - Do NOT commit if UI tests failed
   - Confirm all backend and component tests pass

2. **Analyze Changes**
   - Run `git diff` to review all changes
   - Understand what code was added, modified, or removed
   - Summarize the purpose of the changes

3. **Generate Commit Message**
   - Use [conventional commit format](../copilot-instructions.md#conventional-commits) from project instructions
   - Prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`, `style:`
   - Examples from project:
     - `feat: add todo item completion endpoint`
     - `fix: correct date validation in todo creation`
     - `test: add component rendering tests`
   - Make message clear, descriptive, and focused

4. **Create/Switch to Branch**
   - If branch doesn't exist: `git checkout -b <branch-name>`
   - If branch exists: `git checkout <branch-name>`
   - Verify you are on the correct branch

5. **Stage and Commit**
   - Stage all changes: `git add .`
   - Commit with generated message: `git commit -m "prefix: description"`
   - Verify commit is created successfully

6. **Push to Branch**
   - Push to feature branch: `git push origin <branch-name>`
   - Verify push succeeds
   - **DO NOT commit to main or any other branch - ONLY use the user-provided branch name**

## Prompt Usage

### Input
**Branch name is REQUIRED**. Provide the branch name where changes should be pushed.

**Examples:**
- `/commit-and-push feature/add-todo-completion`
- `/commit-and-push fix/date-validation-error`

### If No Branch Name Provided
- Prompt the user for the branch name
- Do not proceed without it

### Output
- Summary of changes analyzed
- Generated commit message
- Confirmation of branch creation/switch
- Confirmation of git add, commit, and push completion
- Branch and commit hash reference

## Key Principles

- **UI Tests Must Pass First**: If step requires UI workflow, verify tests passed before committing
- **Conventional Commits**: Always use the format from project instructions
- **Branch Safety**: Verify you're on the correct branch before pushing
- **Feature Branches Only**: Never commit to main
- **User Responsibility**: User provides branch name (no auto-generation)
- **No Push Without Branch**: Require explicit branch name input
