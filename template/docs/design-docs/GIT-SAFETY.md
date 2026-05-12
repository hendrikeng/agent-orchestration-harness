# Git Safety

Status: canonical
Owner: {{DOC_OWNER}}
Last Updated: {{LAST_UPDATED_ISO_DATE}}
Source of Truth: This document.

## File and Git Safety Rules

- Never revert/delete work you did not author unless explicitly requested in-thread.
- Never run destructive git/file commands without explicit written instruction.
- Never use `git stash` unless explicitly requested in-thread.
- Never switch branches or create/remove/modify git worktrees unless explicitly requested in-thread.
- Avoid repo-wide blind search/replace scripts; keep edits path-scoped and reviewable.
- Never edit `.env` or environment variable files.
- Keep commits atomic and path-explicit.
- Never use `git add .` or `git commit -am`.
- For tracked files, commit path-explicit: `git commit -m "<scoped message>" -- path/to/file1 path/to/file2`.
- For new files, stage explicitly: `git restore --staged :/ && git add "path/to/file1" "path/to/file2" && git commit -m "<scoped message>" -- path/to/file1 path/to/file2`.
- `git restore --staged :/` is allowed only for index cleanup in the commit flow above, never for content rollback.
- Never use `git restore`/`git checkout` to revert files you did not author.
- Quote git paths containing brackets/parentheses when staging or committing.
- One logical change per commit; no mixed concerns.
- Do not amend commits unless explicitly approved in this conversation.
- For multi-line GitHub issue/PR comments via `gh`, use heredoc (`-F - <<'EOF'`) to preserve newlines and avoid shell escaping corruption.
- Do not rewrite, rebase, squash, or force-push shared history unless explicitly requested and the branch owner is known.
- Do not push broad dirty worktree changes just because they are present; stage only the files that belong to the current slice.
- If the worktree is dirty before you start, inspect relevant paths and treat unrelated changes as user-owned.
- Generated files may be committed only when they are expected artifacts for the same slice and their generator was run intentionally.

## Team Git Workflow

- Treat atomic commits as an optional slice-local checkpoint and review aid inside one checkout, not as a coordination mechanism for multiple developers on one shared branch.
- Branch classes are the default shared workflow boundary: `slice/*` for planned work, `fix/*` for isolated low-risk fixes, and `release/*` for release preparation.
- Solo repositories may use atomic commits more heavily, but shared repositories should still prefer short-lived branches so CI, PR templates, review policy, and release gates have a stable target.
- Run one harness session per checkout. Do not have multiple developers or multiple harness runs commit directly to the same branch at the same time.
- For a small independent change, branch from the stable baseline branch and merge back through normal review.
- For a larger coordinated rollout, keep the stable baseline branch clean, create one temporary initiative branch, and branch each rollout slice from that initiative branch.
- Default to short-lived slice branches that each cover one executable plan or bounded task, rather than long-lived branches named after individual developers.
- Merge slice branches back through normal review and verification instead of using `git stash` or ad hoc worktree juggling.
- Example rollout shape: `main -> feature/app-redesign -> feature/app-redesign-shell`, `feature/app-redesign-nav`, `feature/app-redesign-mobile`.
- If multiple slices would churn the same files heavily, assign ownership and land the shared shell first before parallel follow-on slices branch from that updated baseline.

## Commit Readiness

- Confirm the staged diff contains only the intended files.
- Confirm validation commands and evidence match the changed surface.
- Use a scoped commit message that names the durable change, not the tool that made it.
- Keep implementation, generated artifacts, docs, and tests together only when they prove the same slice.
- Split unrelated cleanup, formatting, or policy edits into separate commits.

## Recovery Rules

- If a command changes unexpected files, stop and inspect before continuing.
- If a merge or generated output conflicts with user-owned work, preserve the user-owned work and ask only when the safe path is not obvious.
- If rollback is needed, use a forward corrective patch unless the user explicitly asks for a revert operation.
- If a branch, index, or worktree state is ambiguous, report the exact state before taking further git actions.
