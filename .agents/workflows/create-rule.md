---
description: Create a new canonical rule in .agents/rules/ and its IDE bridges
---

# Create Rule

## Steps

1. Verify an equivalent rule does not exist in `.agents/rules/`.

2. Define the rule name in kebab-case: `<scope>-<topic>.md` (e.g., `agents-bootstrap.md`).

3. Create the canonical file: `.agents/rules/<name>.md`.

4. Write the complete logic of the rule ONLY in the canonical file in `.agents/rules/`.

5. If the rule applies to Windsurf, create the bridge in `.windsurf/rules/<name>.md` with minimal content:

   ```markdown
   ---
   trigger: always_on
   description: Bridge to canonical rule in .agents/rules/
   ---

   Follow exactly the instructions defined in `.agents/rules/<name>.md`.
   Do not duplicate the logic in this file.
   ```

6. If the rule applies to Cursor, create the bridge in `.cursor/rules/<name>.mdc` with minimal content:

   ```markdown
   ---
   description: Bridge to canonical rule in .agents/rules/
   alwaysApply: true
   ---

   Follow exactly the instructions defined in `.agents/rules/<name>.md`.
   Do not duplicate the logic in this file.
   ```

7. Verify consistency: any future rule changes must be made first in `.agents/rules/<name>.md`.

8. Update `.agents/README.md` if the rule is for general use.

## Notes

- Canonical rules live in `.agents/rules/`.
- `.windsurf/rules/` and `.cursor/rules/` are compatibility bridges per IDE.
- Do not duplicate or diverge content between bridge files and canonical files.
