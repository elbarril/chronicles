---
description: Create a new skill in .agents/skills/
---

# Create Skill

## Steps

1. Verify an equivalent skill does not exist in `.agents/skills/`. If it does, use the `update-skill` workflow instead.

2. Define the skill name in kebab-case with format `<domain>-<action>` (e.g., `chronicle-generator`).

3. Create the directory:

   ```text
   .agents/skills/<skill-name>/
   ```

4. Copy the template to the new skill:

   ```text
   .agents/templates/skill.template.md
   → .agents/skills/<skill-name>/SKILL.md
   ```

5. Complete all mandatory sections of SKILL.md:
   - **Description**: one sentence
   - **Trigger Conditions**: when to use it (minimum 2 conditions)
   - **Steps**: numbered, start with a verb, ordered by dependency
   - **Constraints**: what is FORBIDDEN to do (mandatory section)

6. Add support scripts in `.agents/skills/<skill-name>/scripts/` if the skill requires them.
   Each script must include a usage comment at the beginning.

7. Log the creation in `.agents/memory/decisions.md`:
   - Format: `## [YYYY-MM-DD] Skill <skill-name> created`
   - Include: Context, Decision, Justification, Consequences

8. Update the skills index in `.agents/README.md` if the skill is for general use.

## Notes

- A new skill must not duplicate logic from an existing one. Reference the existing skill from the steps.
- Skills must be self-contained: do not depend on undocumented external tools.
- If the skill has a counterpart as a Windsurf workflow, also create `.windsurf/workflows/<skill-name>.md` as a delegation stub to `.agents/workflows/<skill-name>.md` (without duplicating logic).
