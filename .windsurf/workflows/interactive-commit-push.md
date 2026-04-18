---
description: Create commit and push with interactive branch and change type selection.
---

# Interactive Commit Push

## Steps

1. Validate repository state with `git status --short --branch` and list changes for context.

2. Interactively ask if the current branch should be used:
   - Prompt: `Do you want to commit and push to the current branch (<branch>)? [y/n]`
   - If `y`, continue directly without asking for branch again.
   - If `n`, ask for the destination branch and validate its existence locally/remotely.

3. Show available change types and ask for selection:
   - `feat`: new feature
   - `fix`: bug fix
   - `docs`: documentation
   - `refactor`: internal improvement without functional change
   - `perf`: performance improvement
   - `test`: tests
   - `chore`: maintenance/technical task
   - `style`: formatting/style without logical changes

4. Categorize repository changes by change type before confirming commit:
   - Suggest splitting into multiple commits if there is a mix (e.g., `feat` + `docs`).
   - Show files by group so the user can confirm what to include in this commit.

5. Request a commit message using Conventional Commits format:
   - Format: `<type>(<optional-scope>): <summary>`
   - Examples:
     - `feat(observations): add filter by activity`
     - `fix(chronicle): correct temporal order in narrative`
     - `docs(readme): document generation flow`

6. Confirm staging and commit in a single final validation:
   - Prompt: `I will run add/commit/push on <branch>. Continue? [y/n]`
   - If confirmed, run `git add` (selective or full based on previous decision), `git commit`, and `git push`.
   - If cancelled, stop without additional changes.

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
