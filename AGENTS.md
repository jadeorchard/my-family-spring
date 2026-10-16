# Family Spring development workflow

- `main` is the approved release branch. Walt is connecting production hosting on Kinsta to this repository.
- Do ongoing work on `development`, or on a focused feature branch. Never make routine edits or commits on `main`.
- Before editing, inspect the working tree and current branch. Preserve other contributors' work. If on a clean `main`, switch to `development` before changing files.
- Push development work to its matching remote branch. Do not push directly to `main`, use `--no-verify` to bypass the main-branch push guard, force-push shared branches, or merge a PR without explicit user authorization for that release.
- Use a pull request from `development` to `main` for stakeholder review. Keep it draft while work is ongoing. Reuse an open PR for the same release rather than creating duplicates.
- A development push or a green check is not release authorization. Record the applicable agreement from Marvin, Walt, and the client before merging; an explicit user instruction to merge a particular PR authorizes that release.
- Run `python3 scripts/check_preview.py` and `node --check preview/review.js` before pushing. Visually check desktop and mobile layouts for UI changes.
- Kinsta production deployment is controlled by Walt and must follow `main` only. Do not deploy development changes to the production site or domain. Use a separate preview/staging environment only when requested or already configured for the task.
- The old Cloudflare project is a review environment, not the new production destination. Do not run the previous `wrangler ... --branch main` deployment routine as part of normal development.
- `preview/` is the static-site directory. The intake form and final privacy notice are still placeholders; the review toolbar and noindex settings remain intentional until a separate launch change is approved.
- Never commit credentials, form responses, or patient information.
