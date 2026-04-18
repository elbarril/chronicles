# Update Project Docs

## Description

Updates all project documentation consistently and without duplication, covering the technical, agent, and user layers.

## Trigger Conditions

Use this skill when:

- An implementation phase is completed (invoked from `phase-closeout`).
- A new dependency, architecture change, or new domain concept is introduced.
- The project's high-level folder structure is modified.
- Any other skill indicates that documentation must be updated.
- The user explicitly requests updating or synchronizing documentation.

## Prerequisites

- The agent must have read `AGENTS.md`, `.agents/memory/project-context.md`, and `docs/stack-and-architecture.md`.
- The code changes that motivate the update must be implemented.

## Steps

### 1. Collect changes

Identify what changed since the last documentation update:

- New or removed dependencies in `package.json`.
- Created or reorganized files/folders.
- New or renamed domain entities or concepts.
- New technical patterns (routing, persistence, testing, etc.).
- New configurations or scripts.

### 2. Update `docs/stack-and-architecture.md`

Follow the protocol in section 8 of the document:

1. **Section 3 (Stack):** add rows if there are new dependencies; update if a version changed.
2. **Section 4 (Domain):** add new entities or types; update schemas.
3. **Section 5.2 (Folder structure):** reflect new or reorganized folders.
4. **Section 5.3 (Persistence):** update tables if the Dexie schema changed.
5. **Section 6 (Roadmap):** mark the current phase as complete if applicable.
6. **Section 7 (Conventions):** add new conventions if established.
7. Update the "Last updated" date at the top of the document.

### 3. Update `.agents/memory/project-context.md`

Using workflow `.agents/workflows/update-memory.md`:

- Update the **State** row with the recently completed phase and date.
- Update **Technical Stack** if it changed.
- Keep it concise — this file is the context agents read each session.

### 4. Record in `.agents/memory/decisions.md`

Using workflow `.agents/workflows/update-memory.md`:

- Append an entry with the standard format.
- Include: which phase was completed, what was built, what technical decisions were made.
- If there were deviations from the original plan, document them explicitly.

### 5. Update `.agents/memory/glossary.md`

Using workflow `.agents/workflows/update-memory.md`:

- Add new terms in alphabetical order.
- If redefining an existing term, record the change in `decisions.md` first.

### 6. Update `README.md`

If the phase added:

- New commands → update the "Commands" section.
- New requirements → update the "Requirements" section.
- New usage flows → add or expand the description.

### 7. Update `.agents/README.md`

If new skills or workflows were created:

- Add rows to the "File Map" table.
- Maintain the existing format.

### 8. Verify cross-document consistency

Checklist:

- [ ] Dates in `project-context.md` and `stack-and-architecture.md` match.
- [ ] Glossary terms are used consistently across all documents.
- [ ] No contradictory information between `project-context.md` and `stack-and-architecture.md`.
- [ ] `decisions.md` has a record of all significant changes.
- [ ] No information duplicated between documents — each has its own responsibility.

### 9. Summary for the user

Produce a brief summary of all updated documents and the changes made in each.

## Responsibility Matrix

Each document has a clear role. Do not duplicate information between them:

| Document | Responsibility | Audience |
|-----------|----------------|-----------|
| `docs/stack-and-architecture.md` | Technical source of truth: stack, architecture, domain, conventions | Agents and human developers |
| `.agents/memory/project-context.md` | Concise current project state | Agents at session start |
| `.agents/memory/decisions.md` | Historical decision log | Agents and humans for traceability |
| `.agents/memory/glossary.md` | Canonical domain vocabulary | Agents and humans for consistency |
| `README.md` | Quick-start guide and commands | Users and human contributors |
| `.agents/README.md` | Operational index for the agent workspace | Agents |
| `AGENTS.md` | Global principles and bootstrap | All |

## Outputs

- Updated documents.
- Entry in `decisions.md`.
- Summary of changes for the user.

## Constraints

- NEVER edit previous entries in `decisions.md`.
- NEVER duplicate information between documents — respect the Responsibility Matrix.
- NEVER update `docs/stack-and-architecture.md` without following its section 8 protocol.
- NEVER omit the cross-document consistency checklist.
- NEVER make automatic commits — propose to the user.
