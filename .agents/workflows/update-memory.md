---
description: Update a memory file in .agents/memory/
---

## Steps

1. Identify which memory file corresponds to the change:

   | File | When |
   |--------|--------|
   | `project-context.md` | Changes in project state, stack, or purpose |
   | `decisions.md` | Architectural, technical, or product decisions |
   | `glossary.md` | New or redefined domain terms |

2. Open the identified memory file.

3. **If it is `decisions.md`**:
   - Append to the end of the file. NEVER edit existing entries. (Note: historical entries were translated once on 2026-04-18, but the append-only rule remains strictly enforced going forward).
   - Use this format:

     ```markdown
     ## [YYYY-MM-DD] <Decision Title>

     **Context:** <Why this decision was made>

     **Decision:** <What was decided>

     **Justification:** <Why this option over alternatives>

     **Consequences:**

     - <Consequence 1>
     - <Consequence 2>
     ```

4. **If it is `project-context.md`**:
   - Update the affected section directly.
   - Remove outdated facts to keep the file concise.
   - If the change is significant, also record it in `decisions.md`.

5. **If it is `glossary.md`**:
   - Add a row to the table in alphabetical order.
   - If redefining an existing term, record the change in `decisions.md` before editing the glossary.

6. Verify that the resulting file does not violate any principle of `AGENTS.md`.

## Notes

- Never remove entries from `decisions.md` — it is an append-only log.
- Keep `project-context.md` concise: it is the context agents read upon starting a session.
- The glossary defines canonical vocabulary: use it consistently across code and documentation.
