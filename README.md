# NWS Sovereign Stack — Node 0x363

Website and device-side deployment CLI for Nathan Wayne Salles. The page is static HTML with no runtime package dependencies. The CLI is written for Bash and works in Termux when Git and Node.js are installed.

## What is automated

1. `nws check` validates the page structure, unique element IDs, JavaScript element references, and in-page links.
2. `nws deploy` runs the check, stages changes, blocks common secret-file paths and recognizable token patterns, makes a commit, and pushes the current branch.
3. The GitHub Actions workflow runs `npm test` on pushes to `main`, pull requests, and manual dispatches.
4. A Vercel project connected to this repository can publish each push to `main` and create previews for other branches.

GitHub Actions validation and Vercel Git deployment are separate workflows by default. Configure Vercel Deployment Checks if the quality workflow must be a mandatory deployment gate.

## Install on Samsung / Termux

First install the required tools in Termux:

```bash
pkg update
pkg install git nodejs python
```

Clone the project and install the command:

```bash
cd ~
git clone https://github.com/sallesnathan-art/nws-sovereign-stack.git
cd ~/nws-sovereign-stack
bash install.sh
export PATH="$HOME/.local/bin:$PATH"
nws help
nws check
```

The installer creates a symlink to this repository's `bin/nws` command and adds `~/.local/bin` to your shell profile. Open a new Termux session or reload your profile if needed.

## Daily commands

```bash
nws status
nws check
nws build
nws local 4173
nws deploy
```

`nws local 4173` serves the website on `http://127.0.0.1:4173` until you stop it with Ctrl+C.

`nws deploy` publishes the current branch. On `main`, a connected Vercel project uses the push for production. On another branch, Vercel can create a preview. Use `nws deploy --prod` to require that the current branch is `main`.

The CLI only commits when there are staged changes. Git must already have a configured author name and email, and GitHub authentication must already work for pushes. The CLI does not request, store, or print a GitHub or Vercel token.

## Connect automatic hosting

Connect the Vercel project to the Git repository `sallesnathan-art/nws-sovereign-stack`, use the repository root as the project root, and leave the site as static HTML. Vercel's Git integration should publish `main` to production and use other branches for previews. No Vercel token is needed by the device CLI when Git-based deployment is active.

If a Vercel project has not been connected, `nws deploy` can still push source to GitHub, but it cannot make a website live by itself. Confirm the first deployment in the Vercel dashboard.

## Product checkout

Product prices and names on the page reflect the supplied catalog details. The buttons intentionally disclose that checkout is not configured. Replace that behavior only after real Lemon Squeezy checkout URLs and product availability are verified; this project does not fabricate an order flow.

## Security notes

- Do not commit `.env` files, Vercel project state, API tokens, private keys, or service-account credentials.
- The deploy command checks common sensitive file paths and recognizable token patterns. That is a safety net, not a complete secret scanner.
- The browser terminal is informational only. It cannot access the device shell, repository credentials, or deployment API.
- DID-like text in the page is an identity label, not proof of a W3C DID method or cryptographic control.
- The genome/AST visual is illustrative; it is not a real AST mutation engine or cryptographic watermark.

## Files

- `index.html` — responsive website, informational browser console, and numeric demo.
- `bin/nws` — device-side status, check, preview, update, and publish commands.
- `install.sh` — installs the `nws` shell command for the current user.
- `scripts/check-site.mjs` — dependency-free static sanity checks.
- `.github/workflows/quality.yml` — automated repository quality workflow.
- `vercel.json` — static hosting configuration and baseline security headers.
