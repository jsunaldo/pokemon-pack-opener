#!/bin/sh
# One-command deploy: commit, push, and nudge GitHub Pages.
# Usage: ./deploy.sh ["commit message"]
# NOTE: only bump the CACHE name in pack-opener-sw.js when the service worker
# itself changes — bumping wipes every downloaded card image on users' devices.
set -e
cd "$(dirname "$0")"

MSG="${1:-Update $(date '+%Y-%m-%d %H:%M')}"

git add -A
if git diff --cached --quiet; then
  echo "Nothing to deploy — working tree clean."
else
  git commit -m "$MSG"
fi
git push origin main

# GitHub Pages classic builds occasionally stall; requesting a build is harmless
gh api -X POST repos/jsunaldo/pokemon-pack-opener/pages/builds >/dev/null 2>&1 || true

echo "🚀 Pushed — live in ~1 min at https://jsunaldo.github.io/pokemon-pack-opener/"
