---
description: "Development guidelines and patterns for the Q3 Aibootcamp TODO application"
---

# GitHub Copilot Instructions

## Project Context

This is a full-stack TODO application built with React (frontend) and Express (backend). The project is in the backend stabilization and frontend feature completion phase, emphasizing iterative, feedback-driven development.

**Tech Stack:**
- Backend: Node.js + Express
- Frontend: React with React Testing Library
- Testing: Jest (backend), React Testing Library (frontend), Playwright (UI/E2E)
- Build & Development: npm workspace structure

## Documentation References

Refer to these guides when working on the project:

- [Project Overview](../docs/project-overview.md) - Architecture, tech stack, and folder structure
- [Testing Guidelines](../docs/testing-guidelines.md) - Test patterns and standards for all testing tiers
- [Workflow Patterns](../docs/workflow-patterns.md) - Development workflow guidance and best practices

## Development Principles

1. **Test-Driven Development (TDD)**: Follow the Red-Green-Refactor cycle
   - Write tests first, see them fail (RED)
   - Implement code to pass tests (GREEN)
   - Refactor for clarity and performance (REFACTOR)

2. **Incremental Changes**: Make small, testable modifications
   - One feature or fix per commit
   - Changes should be reviewable and independently valuable
   - Avoid large, multi-purpose changes

3. **Systematic Debugging**: Use test failures as guides
   - Failing tests indicate the problem scope
   - Use debug output and test output to understand failure root cause
   - Fix the root cause, not just the symptom

4. **Validation Before Commit**: Ensure code quality and correctness
   - All tests must pass (unit, integration, and UI tests)
   - No lint errors
   - Manual browser testing for visual and interaction validation

## Testing Scope

This project combines multiple testing tiers for comprehensive coverage and fast feedback:

### Testing Tiers

- **Backend API Testing**: Jest + Supertest for testing Express endpoints and business logic
  - Unit tests for individual functions and modules
  - Integration tests for API routes and database interactions
  - Focus: API contract compliance, data integrity, error handling

- **Frontend Component Testing**: React Testing Library for component unit and integration tests
  - Component behavior and state management
  - User interactions (clicks, form submissions, etc.)
  - Props handling and conditional rendering
  - Focus: Component functionality from the user's perspective

- **UI End-to-End Testing**: Playwright for critical user journey automation
  - Full workflow testing (e.g., create → read → update → delete)
  - Cross-browser validation
  - Visual regression detection
  - Focus: Real-world user scenarios and application stability

- **Manual Browser Testing**: Exploratory validation and visual checks
  - Visual appearance and layout consistency
  - Responsive design across devices
  - Accessibility and keyboard navigation
  - User experience and edge cases not covered by automation

### Why This Approach

Combining fast feedback (unit/integration) with end-to-end quality confidence (UI tests and manual testing) ensures:
- Rapid development cycle with immediate test feedback
- High confidence in application correctness
- Early detection of integration issues
- Comprehensive coverage of critical user paths

## Testing Approach by Context

Follow TDD principles based on the context:

### Backend API Changes
1. Write Jest tests FIRST (RED phase)
2. Run tests to confirm they fail
3. Implement API endpoint or business logic (GREEN phase)
4. Run tests to confirm they pass
5. Refactor for clarity and performance (REFACTOR phase)

### Frontend Component Features
1. Write React Testing Library tests FIRST (RED phase) for component behavior
2. Run tests to confirm they fail
3. Implement component functionality (GREEN phase)
4. Run tests to confirm they pass
5. Refactor component code for clarity (REFACTOR phase)
6. Follow with manual browser testing for full UI flows and visual validation

**Key Principle**: Tests guide development. Code is written to pass tests, not the other way around.

## Workflow Patterns

### 1. TDD Development Workflow
- **Scenario**: Implementing a new backend endpoint or frontend component
- **Steps**:
  1. Write test cases (RED)
  2. Run tests and confirm failures
  3. Implement minimum code to pass tests (GREEN)
  4. Run tests and confirm passing
  5. Refactor for readability and performance (REFACTOR)
  6. Run tests one final time to ensure refactoring didn't break anything
- **Tools**: Jest for backend, React Testing Library for frontend

### 2. Code Quality Workflow
- **Scenario**: Addressing lint errors or code quality issues
- **Steps**:
  1. Run linter to identify issues
  2. Categorize issues (style, best practices, security, etc.)
  3. Fix issues systematically
  4. Re-run linter to confirm all issues resolved
  5. Run full test suite to ensure changes don't break functionality
- **Tools**: ESLint, Prettier, npm scripts

### 3. Integration Workflow
- **Scenario**: Debugging and fixing integration issues between frontend and backend
- **Steps**:
  1. Identify the issue (test failure, user report, etc.)
  2. Reproduce the issue locally
  3. Write a failing test to capture the issue
  4. Debug using test output and browser dev tools
  5. Implement the fix
  6. Confirm all tests pass
  7. Verify the fix end-to-end in the browser
- **Tools**: Jest, React Testing Library, browser dev tools, Playwright for critical journeys

### 4. UI Testing Workflow
- **Scenario**: Creating and maintaining Playwright UI tests for critical user journeys
- **Steps**:
  1. Define the critical user journey (e.g., "User creates a new TODO item")
  2. Write Playwright test for the journey
  3. Run the test and debug failures
  4. Refactor test for maintainability and reliability
  5. Validate test isolation (no dependencies on other tests)
  6. Document the test purpose and expectations
- **Tools**: Playwright, browser console for debugging
- **Ownership**: Delegated to test-engineer agent for authoring, execution, and failure triage

## Agent Usage

Specialized agents are available for different development contexts. Use the appropriate agent based on your task:

### tdd-developer
- **Purpose**: Implementation and unit/integration TDD cycles
- **Use When**: Writing backend tests, implementing API endpoints, writing React component tests, implementing component features
- **Scope**: Code implementation, test writing (Jest, React Testing Library), debugging failures
- **Do NOT**: Create or run Playwright UI tests in this mode

### code-reviewer
- **Purpose**: Addressing lint errors and code quality improvements
- **Use When**: Fixing linter errors, refactoring for readability, improving code patterns, resolving style issues
- **Scope**: Code quality, style consistency, best practices
- **Tools**: ESLint, Prettier, code analysis

### test-engineer
- **Purpose**: Playwright UI test authoring, execution, failure triage, and test isolation verification
- **Use When**: Creating UI tests, debugging Playwright failures, analyzing test reliability, validating test independence
- **Scope**: Playwright test development, failure analysis, test coverage validation
- **Ownership**: All UI/E2E test creation and maintenance

## Memory System

- **Persistent Memory**: This file (`.github/copilot-instructions.md`) contains foundational principles and workflows
- **Working Memory**: [.github/memory/](./memory/README.md) directory contains discoveries and patterns
- During active development, take notes in [.github/memory/scratch/working-notes.md](./memory/scratch/working-notes.md) (not committed)
- At end of session, summarize key findings into [.github/memory/session-notes.md](./memory/session-notes.md) (committed)
- Document recurring code patterns in [.github/memory/patterns-discovered.md](./memory/patterns-discovered.md) (committed)
- Reference these files when providing context-aware suggestions

## Workflow Utilities

### GitHub CLI Commands

Use these GitHub CLI commands for workflow automation (available to all modes):

- **List open issues**: `gh issue list --state open`
  - Shows all open issues in the repository
  
- **Get issue details**: `gh issue view <issue-number>`
  - Displays the issue title and description
  
- **Get issue with comments**: `gh issue view <issue-number> --comments`
  - Includes all comments (often contains step-by-step instructions)

### Exercise Workflow

The main exercise issue will have "Exercise:" in the title. Steps are posted as comments on the issue. When `/execute-step` or `/validate-step` prompts are invoked:

1. Use `gh issue list --state open` to find the main exercise issue
2. Use `gh issue view <issue-number> --comments` to retrieve all steps
3. Work through the steps systematically
4. Use provided validation commands to confirm progress

## Git Workflow

### Conventional Commits

Use conventional commit format for clear, semantic commit messages:

- `feat:` - New feature or enhancement
- `fix:` - Bug fix
- `chore:` - Maintenance, dependency updates, or build changes
- `docs:` - Documentation updates
- `test:` - Test additions or modifications
- `refactor:` - Code refactoring without feature or bug fix changes
- `style:` - Code style changes (formatting, linting)

**Example**: `feat: add todo item completion endpoint` or `fix: correct date validation in todo creation`

### Branch Strategies

- **Feature branches**: `feature/<descriptive-name>`
  - Example: `feature/add-todo-completion`
  - Used for new features and substantial changes
  
- **Bugfix branches**: `fix/<issue-description>`
  - Example: `fix/date-parsing-error`
  - Used for bug fixes tied to specific issues

### Committing Changes

1. **Stage all changes**: `git add .`
   - Ensures all modifications are included in the commit
   
2. **Commit with message**: `git commit -m "feat: description"`
   - Use conventional commit format
   - Write clear, descriptive messages
   
3. **Push to branch**: `git push origin <branch-name>`
   - Ensures branch is synced with remote repository

### Best Practices

- Commit frequently with logical, atomic changes
- Keep commits small and focused on a single concern
- Push regularly to avoid losing work
- Create pull requests for code review before merging to main
- Ensure all tests pass before pushing to main
