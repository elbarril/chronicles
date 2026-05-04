# Update Project Docs

## Description

Updates project documentation consistently and without duplication, covering
the technical, agent, and user layers. Edits only the documents the change
actually impacts.

## Trigger Conditions

Use this skill when:

- Invoked from `change-closeout` after a non-trivial update.
- A new dependency, architectural change, or domain concept was introduced.
- The high-level folder structure was modified.
- Another skill explicitly indicates that documentation must be updated.
- The user explicitly requests synchronizing documentation.

## Prerequisites

- Mandatory bootstrap reads from `AGENTS.md` are complete.
- The code changes that motivate the update are already implemented (or
  staged in the current branch).

## Steps

### 1. Collect changes

Identify what changed since the last documentation update:

- New or removed dependencies in `package.json`.
- Created or reorganized files/folders.
- New or renamed domain entities or concepts.
- New technical patterns (routing, persistence, testing, infra layers).
- New configurations or scripts.

### 2. Decide which documents are actually affected

Only edit a document if the change touches its responsibility (see the
Responsibility Matrix below). Do not pad documents with cosmetic edits.

### 3. Update `docs/stack-and-architecture.md` (if affected)

Follow the protocol in section 8 of the document:

1. **Stack section:** add rows if there are new dependencies; update if a version changed.
2. **Domain section:** add or update entities and types.
3. **Folder structure:** reflect new or reorganized folders.
4. **Persistence:** update tables if the Dexie schema changed.
5. **Conventions:** add new conventions if established.
6. Update the "Last updated" date and the change note at the top of the document.

### 4. Update `.agents/memory/project-context.md` (if affected)

Using `.agents/workflows/update-memory.md`:

- Update the **State** row with the latest baseline (current functional state, not historical phases).
- Update **Technical Stack** if it changed.
- Keep it concise — this file is read by every agent at session start.
- Remove outdated facts. The file should reflect the current state, not the cumulative history (which lives in `decisions.md`).

### 5. Append `.agents/memory/decisions.md` (only if warranted)

Using `.agents/workflows/update-memory.md`:

- Append a new entry only when the change involves a meaningful product or
  technical decision that future agents may need to revisit.
- Format: `## [YYYY-MM-DD] <Decision Title>` with Context / Decision /
  Justification / Consequences.
- Do not append cosmetic entries. The file is already long; restraint matters.
- Do not edit previous entries.

### 6. Update `.agents/memory/glossary.md` (if affected)

- Add new terms in alphabetical order.
- If redefining an existing term, append a `decisions.md` entry first.

### 7. Update `README.md` (if affected)

- New commands → update the "Commands" section.
- New requirements → update the "Requirements" section.
- New high-level usage flows → adjust the description.

### 8. Update `.agents/README.md` (if affected)

- Add or remove rows in the "File Map" table when skills, rules, or
  workflows are created or removed.

### 9. Verify cross-document consistency

Checklist:

- [ ] Dates in `project-context.md` and `stack-and-architecture.md` match.
- [ ] Glossary terms are used consistently across all documents.
- [ ] No contradictory information between `project-context.md` and `stack-and-architecture.md`.
- [ ] `decisions.md` has an entry only if a decision actually warranted it.
- [ ] No information is duplicated across documents — each owns its responsibility.

### 10. Summary for the user

Produce a brief summary listing each updated document and the edits made.

## Responsibility Matrix

Each document has a clear role. Do not duplicate information between them:

| Document | Responsibility | Audience |
|---|---|---|
| `docs/stack-and-architecture.md` | Technical source of truth: stack, architecture, domain, conventions | Agents and human developers |
| `.agents/memory/project-context.md` | Concise current project state | Agents at session start |
| `.agents/memory/decisions.md` | Historical decision log (append-only) | Agents and humans for traceability |
| `.agents/memory/glossary.md` | Canonical domain vocabulary | Agents and humans for consistency |
| `README.md` | Quick-start guide and commands | Users and human contributors |
| `.agents/README.md` | Operational index for the agent workspace | Agents |
| `AGENTS.md` | Global principles and bootstrap | All |

## Outputs

- Updated documents (only those impacted by the change).
- Optional `decisions.md` entry.
- Brief summary for the user.

## Constraints

- NEVER edit previous entries in `decisions.md`.
- NEVER duplicate information between documents — respect the Responsibility Matrix.
- NEVER update `docs/stack-and-architecture.md` without following its section 8 protocol.
- NEVER update documents that the change does not actually affect.
- NEVER omit the cross-document consistency checklist.
- NEVER make automatic commits — propose to the user.
