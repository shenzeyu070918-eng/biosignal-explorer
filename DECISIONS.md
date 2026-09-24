# Decision Log

Record each meaningful choice when it is made. Revisit a decision only when new evidence warrants it.

## Decision template

### Decision

Short title and date.

### Context

What problem or constraint required a choice?

### Options considered

- Option A
- Option B

### Final choice

The selected option.

### Reason

Why this is the smallest suitable choice now.

### Trade-offs

What this choice gives up or leaves for later.

---

## Decision: Minimal documentation-first skeleton — 2026-09-24

### Context

The project directory was empty and the current work package is foundation only. No application behavior has been approved for implementation yet.

### Options considered

- Create a full framework project now.
- Create only the agreed documents, a source placeholder, and local Git history.

### Final choice

Create the six requested documents, `src/` placeholder, `.gitignore`, and local Git repository. Defer application files and framework selection.

### Reason

This establishes a clear place for future code and a reviewable checkpoint without committing the project to unneeded dependencies.

### Trade-offs

There is no runnable application or development command yet. Phase 1 remains open until those are chosen and accepted. GitHub synchronization waits for a repository decision.

## Open decisions

- Minimal local run/development method for Phase 1.
- GitHub repository name, owner, and whether it should be public or private.
- Time and voltage units, CSV validation rules, and sampling-rate definition before Phases 2 and 4.
