---
description: Close out a generic update — capture reusable patterns into skills/workflows/rules and synchronize project documentation.
---

# Change Closeout

Execute the canonical skill `.agents/skills/change-closeout/SKILL.md`.

## Steps

1. Read `.agents/skills/change-closeout/SKILL.md` completely.
2. Execute its steps in order.
3. The skill will delegate to `.agents/skills/update-project-docs/SKILL.md` for documentation updates.

## Notes

- This workflow is the canonical entry point for closeout; the legacy `phase-closeout` was removed when the project moved away from the F(N) roadmap model.
- Skip closeout entirely when the change is self-contained and does not introduce new patterns, dependencies, domain concepts, or cross-cutting impact.
- Do not duplicate business logic outside the canonical skill.
