# My Family Spring

Static landing-page and thank-you-page prototypes for Family Spring's Google Ads campaign.

Repository: [jadeorchard/my-family-spring](https://github.com/jadeorchard/my-family-spring).
The repository is public, including its committed files and history. Keep non-public client materials and credentials out of commits.
Walt is connecting the new production site on Kinsta. Production changes must reach `main` through a reviewed pull request.

## Branches and release process

| Branch | Purpose | Deployment |
| --- | --- | --- |
| `development` | Ongoing work and stakeholder review | Local preview, or a separately configured staging site |
| `main` | Approved releases | Kinsta production, once Walt configures it |

1. Work on `development` (or a focused feature branch), never directly on `main`.
2. Preview locally and run the checks below.
3. Commit and push to the same development branch. This must not publish to the production site.
4. Open a draft PR from `development` into `main`. Additional pushes update the same PR. If one is already open, continue using it.
5. Record Marvin's, Walt's, and the client's applicable approvals in the PR. Mark it ready when the work is ready for final review.
6. Only after agreement, merge the approved PR into `main`. Walt's production integration should deploy that commit. Do not merge `main` locally and push it as a release shortcut.

Typical commands:

```sh
git switch development
git pull --ff-only
# Make edits and run checks.
git add <changed-files>
git commit -m "Describe the change"
git push origin development
# Create this only when there is no existing PR for the current release.
gh pr create --draft --base main --head development
```

After a PR is merged, synchronize the shared development branch without rewriting history:

```sh
git fetch origin
git switch development
git merge origin/main
git push origin development
```

Prefer a merge commit for PRs from this long-lived branch. Resolve any conflicts normally; do not reset or force-push shared history.

## Local push guard

This repository includes a pre-push hook that refuses any push targeting `refs/heads/main`, including `development:main` and branch deletion. Enable it in each checkout:

```sh
git config --local core.hooksPath .githooks
```

The hook is a local safety net and can be bypassed by Git options or another client. It does not protect GitHub's web UI or other contributors' checkouts.

GitHub branch protection is active on `main`:

- Pull requests need at least one approving review. New commits dismiss previous approvals.
- The branch must be up to date and the `Validate static preview` check from GitHub Actions must pass.
- Review conversations must be resolved.
- Force pushes and branch deletion are blocked.
- Administrators are subject to the same rules; no PR bypass allowance is configured.

The PR release-agreement checklist still records the applicable agreement from Marvin, Walt, and the client. GitHub's one-review requirement does not by itself establish client approval. Record public-safe approval confirmations rather than copying private client communications into the public PR.

## Local preview and checks

```sh
python3 -m http.server 8780 --bind 127.0.0.1 --directory preview
```

Open `http://127.0.0.1:8780/` for the landing page or `/thank-you/` for the confirmation preview. The toolbar switches designs and viewport modes. Clear & practical is the default; the URL preserves the selection (`?design=practical` or `?design=warm`). Changing designs reloads the page so only one OnceHub form is embedded at a time; changing viewport mode keeps the current form in place.

The consultation form connects to the live Family Spring intake flow. Submissions go to Family Spring through OnceHub. Do not submit test requests without authorization. OnceHub returned a provider error on localhost during verification; use the HTTPS development preview to review the form itself.

Before pushing:

```sh
python3 scripts/check_preview.py
node --check preview/review.js
```

GitHub Actions runs these checks on pushes to `development` and PRs targeting `main`. The checks validate local file references, duplicate HTML IDs, required files, and JavaScript syntax. They do not deploy the site or contact the map/intake providers. Visual changes also need desktop and mobile review.

## Kinsta handoff for Walt

- Connect `jadeorchard/my-family-spring` and use **`main` only** as the production source branch.
- The static site is in **`preview/`**. It requires no compilation. Configure the selected Kinsta service to publish that directory, not the repository root.
- Keep `development` separate from production. If a shared preview is needed, use a separate staging target and URL.
- Confirm the hosting service's response-header configuration. `preview/_headers` and `wrangler.jsonc` are Cloudflare-specific and may not be applied by Kinsta. The Maps iframe policy and noindex headers must be configured appropriately for the chosen host.
- This repo change does not configure or verify Kinsta access, deployment settings, DNS, or the final domain. Walt owns that setup.

The current site is still a review prototype with a live OnceHub intake form. Its review toolbar, draft privacy notice, and noindex settings remain intentional. Preparing the patient-facing launch is a separate reviewed change.

## OnceHub intake form

- The user-supplied embed uses website `WEB-2E96FEC366` and form `FORM-CEC381B1D3`. These are public embed identifiers, not credentials.
- `preview/index.html` loads the official `https://cdn.oncehub.com/fo/form.js` script after `review.js` selects the visible design. Only that design's form slot is activated, avoiding duplicate vendor iframe IDs. The thank-you preview does not load OnceHub.
- The form starts at 400px tall and can grow with OnceHub's iframe resize messages. It sits in the right consultation panel on desktop and below the hero copy on mobile. The page does not read form answers or add analytics events.
- Cloudflare's CSP permits the official embed script, its stylesheet and inline styles, and the `ccgw.oncehub.com` iframe. Kinsta must apply equivalent response headers for its deployment. The form runs in OnceHub's iframe and follows its existing configuration, including provider-managed cookies and submission handling.
- The shared form's questions, screening, routing, and completion destination have not been changed. The local `/thank-you/` route remains a design preview; a submission redirect to it and conversion tracking are not wired up by this embed change.

## Existing Cloudflare review site

The existing Cloudflare review site is separate from the new Kinsta production destination. Share preview links directly with reviewers instead of listing them in this README. Removing links here does not restrict access to the preview or remove URLs from Git history or other source files.

Do not use the old direct-to-main Cloudflare deployment routine for ongoing development. A preview deployment should be a separate, explicit task.

## Content and files

- `preview/`: static review site and image/icon assets.
- `design-reference/exported-mockups.html`: historical standalone mockup export; not a deployment directory.
- `wrangler.jsonc`: configuration retained for the existing Cloudflare review project.
- `.githooks/pre-push`: local main-push guard.
- `.github/`: PR template and validation workflow.
- `AGENTS.md`: development and release instructions for coding agents.

Tori Haugen, LMFT; Geralyn Gendron, LMFT; and Daniel Hagan, LMFT are shown using the photos and credentials supplied by Marvin. The San Rafael interior photography and logo come from the supplied asset folder. Both designs have custom trust-strip icons, including the approved green outlines on white in Clear & practical.

Both office cards use standard Google Maps iframe embeds with native lazy loading, full addresses, and Get Directions links. The source URLs come from Family Spring's public site. Maps connect the visitor's browser to Google; the final privacy review must account for that. No API key or Google Maps JavaScript library is used.

OnceHub is embedded on the landing page. Separate advertising tags and analytics are not installed. Do not commit credentials, form responses, or patient information. The previews have explicit Family Spring sharing metadata and noindex settings; noindex is not access control.
