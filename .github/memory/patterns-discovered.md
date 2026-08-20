# Patterns Discovered

Accumulated code patterns and conventions found in this codebase. Unlike `session-notes.md` (chronological history), this file is organized by pattern and should be **updated in place** whenever a pattern recurs, is refined, or a better example is found.

This file is committed to git.

## Pattern Template

Copy this template when documenting a new pattern:

```markdown
### <Pattern Name>

**Context**: When/where this pattern applies.

**Problem**: What issue or ambiguity this pattern resolves.

**Solution**: The convention or approach to follow.

**Example**:
\`\`\`js
// code example
\`\`\`

**Related files**: List of files where this pattern appears or is relevant.
```

---

## Accumulated Patterns

### Service initialization: empty array vs `null`

**Context**: Backend (and frontend) services/modules that manage a collection of items (lists, caches, queues).

**Problem**: Initializing collection state as `null` before the first item is added forces every consumer to null-check before calling array methods (`.map`, `.filter`, `.length`), which is error-prone and leads to `TypeError: Cannot read properties of null` bugs when something reads state too early (e.g., during startup or before the first write).

**Solution**: Always initialize collection-like state as an empty array (`[]`), never `null` or `undefined`. This makes "no items yet" and "has items" the same shape, so all array operations are safe immediately after initialization.

**Example**:
```js
// Avoid
class TodoService {
  constructor() {
    this.todos = null; // unsafe: consumers must null-check before use
  }
}

// Prefer
class TodoService {
  constructor() {
    this.todos = []; // safe: consumers can call .map/.filter/.length immediately
  }
}
```

**Related files**: `packages/backend/src/app.js`, `packages/backend/__tests__/app.test.js`
