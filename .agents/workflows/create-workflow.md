---
description: Create a new workflow in .agents/workflows/
---

# Create Workflow

## Steps

1. Verify an equivalent workflow does not exist in `.agents/workflows/`.

2. Define the workflow name in kebab-case describing the outcome: `<verb>-<noun>.md` (e.g., `generate-chronicle.md`).

3. Create the file: `.agents/workflows/<name>.md`

4. Copy the template:

   ```text
   .agents/templates/workflow.template.md
   → .agents/workflows/<name>.md
   ```

5. Complete the frontmatter:

   ```yaml
   ---
   description: <One sentence describing what this workflow achieves>
   ---
   ```

6. Write the numbered steps. Each step must:
   - Start with an action verb
   - Be specific and executable without ambiguity
   - Be ordered by logical dependency

7. Mark auto-executable steps with `// turbo` on the line before the step (Windsurf convention; ignored by other agents).

8. Reference skills by name when a step delegates to one:

   ```text
   Use the `<skill-name>` skill to complete this step.
   ```

9. If the workflow should be available as a slash command in Windsurf, create the bridge in `.windsurf/workflows/<name>.md` with a stub format:

   ```markdown
   ---
   description: <same summarized purpose>
   ---

   # <Title>

   Follow exactly the steps defined in `.agents/workflows/<name>.md`.
   Do not duplicate logic in this file: this stub exists only to enable the slash command.
   ```

10. Add a `## Notes` section with warnings, edge cases, or relevant references.

11. Update `.agents/README.md` if the workflow is for general use.

## Notes

- Do not duplicate logic already existing in a skill — reference the skill.
- Workflows must be tool-agnostic except for `// turbo` annotations.
- Canonical workflows live in `.agents/workflows/`; `.windsurf/workflows/` only contains delegation stubs.
