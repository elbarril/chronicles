---
description: Create commit and push with interactive branch and change type selection.
---

# Interactive Commit Push

## Steps

1. Validate repository state with `git status --short --branch` and list changes for context.

2. **Interactive branch selection** (UI buttons):
   - Show current branch and present two options:
     - **Button: "Usar rama actual (<branch>)"** → Continue without asking for branch again.
     - **Button: "Cambiar rama"** → Open text input to enter destination branch, validate existence locally/remotely.

3. **Interactive change type selection** (UI dropdown):
   - Present dropdown with options:
     - `feat`: nueva funcionalidad
     - `fix`: corrección de bug
     - `docs`: documentación
     - `refactor`: mejora interna sin cambio funcional
     - `perf`: mejora de performance
     - `test`: tests
     - `chore`: tarea de mantenimiento/técnica
     - `style`: formato/estilo sin cambios lógicos

4. **Interactive file selection** (UI checkboxes):
   - Categorize repository changes by type.
   - Show checkboxes for each file group so the user can select which files to include.
   - **Button: "Seleccionar todos"** / **Button: "Deseleccionar todos"**
   - Suggest splitting into multiple commits if there is a mix (e.g., `feat` + `docs`).

5. **Interactive commit message input** (UI form):
   - Show input field with Conventional Commits format:
     - `<type>(<optional-scope>): <summary>`
   - Provide quick-select buttons for common scopes based on project structure.
   - Show format examples below the input:
     - `feat(observations): add filter by activity`
     - `fix(chronicle): correct temporal order in narrative`
     - `docs(readme): document generation flow`

6. **Final confirmation** (UI buttons):
   - Show summary card with:
     - Rama: `<branch>`
     - Tipo: `<type>`
     - Archivos: `<count>`
     - Mensaje: `<commit-message>`
   - Present two options:
     - **Button: "Confirmar y ejecutar"** → Run `git add`, `git commit`, and `git push`.
     - **Button: "Cancelar"** → Stop without additional changes.

7. Report final result:
   - Branch used.
   - Change type used.
   - Short hash of the commit.
   - Push status (ok/error) and suggested action if it fails.

## Notes

- Prioritize atomic commits: one primary change type per commit.
- If the user chooses the current branch, do not open a new prompt for branch selection.
- If there are no staged/unstaged changes, abort early with a clear message.
- Do not force push (`--force`) unless explicitly requested by the user.
- All user-facing text must be in rioplatense Spanish (natural, not formal).
