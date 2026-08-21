#!/usr/bin/env bash
# Ralph runner, adapted for the Claude Code CLI (the skill's docs assume "Amp";
# this repo has `claude` installed, not `amp`, so this script drives that instead).
#
# Loops through ralph/prd.json in priority order. For each story with
# passes:false, spawns a FRESH, non-interactive `claude -p` process (no memory
# of prior iterations, by design).
#
# Runs with --dangerously-skip-permissions: no tool allowlist, no permission
# prompts of any kind. It CAN run any Bash command, including git push,
# rm -rf, git reset --hard, force operations — anything. The prompt below
# asks it not to push, but that's a request, not an enforced boundary; nothing
# stops it from doing so anyway. Only run this against a disposable branch you
# intend to review before merging, and only if you're comfortable being away
# while it has that much latitude.
#
# Usage: ./ralph/ralph.sh [max_attempts_per_story]

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PRD_JSON="$REPO_ROOT/ralph/prd.json"
PROGRESS="$REPO_ROOT/ralph/progress.txt"
BRANCH="$(jq -r '.branchName' "$PRD_JSON")"
MAX_ATTEMPTS="${1:-2}"

cd "$REPO_ROOT"

echo "Ralph run: branch=$BRANCH  prd=$PRD_JSON  max_attempts_per_story=$MAX_ATTEMPTS"

# Create/switch to the working branch off main.
if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH" main
fi

while true; do
  # Next story with passes:false, in priority order.
  STORY_ID=$(jq -r '[.userStories[] | select(.passes == false)] | sort_by(.priority) | .[0].id // empty' "$PRD_JSON")

  if [ -z "$STORY_ID" ]; then
    echo "All stories pass. Ralph run complete on branch $BRANCH."
    echo "Nothing was pushed — review the commits, then push/PR manually."
    exit 0
  fi

  STORY_TITLE=$(jq -r --arg id "$STORY_ID" '.userStories[] | select(.id == $id) | .title' "$PRD_JSON")
  echo ""
  echo "=== $STORY_ID: $STORY_TITLE ==="

  ATTEMPT=1
  SUCCESS=0
  while [ "$ATTEMPT" -le "$MAX_ATTEMPTS" ]; do
    echo "--- attempt $ATTEMPT/$MAX_ATTEMPTS ---"

    PROMPT="You are implementing exactly ONE user story from ralph/prd.json in this repo: $STORY_ID ($STORY_TITLE).

Read ralph/prd.json and find the full acceptanceCriteria list for $STORY_ID — implement ALL of them, nothing from any other story.

For full context on this specific step, also read docs/prd/0001-seo-remediation.md and docs/prd/0001-seo-remediation-implementation-plan.md (find the matching step by title/file paths).

Do the work, then verify: run 'npm run lint' and 'npx tsc --noEmit -p .' and confirm no new errors versus what already existed before your change. If the story's criteria mention a browser/visual check, describe what you'd verify (dev server isn't necessarily running in this headless context — note this limitation in your notes instead of skipping it silently).

When ALL acceptance criteria are genuinely met:
1. Update ralph/prd.json: set this story's 'passes' to true and 'notes' to a short (1-3 sentence) summary of what you changed and how you verified it.
2. Append a dated entry to ralph/progress.txt describing what was done.
3. git add the changed files (including ralph/prd.json and ralph/progress.txt) and git commit with a clear conventional-commit-style message. Do NOT git push — leave that for a human to review and do manually, even though you technically can.

If you cannot fully satisfy the criteria (missing info, blocked by something outside this story's scope, a criterion turns out to be wrong given the actual code), do NOT mark passes true. Instead set 'notes' in ralph/prd.json to a clear explanation of what's blocking it, commit nothing, and stop."

    if claude -p "$PROMPT" \
        --dangerously-skip-permissions \
        --add-dir "$REPO_ROOT"; then
      :
    fi

    PASSES=$(jq -r --arg id "$STORY_ID" '.userStories[] | select(.id == $id) | .passes' "$PRD_JSON")
    if [ "$PASSES" = "true" ]; then
      SUCCESS=1
      break
    fi

    echo "Story $STORY_ID not marked passing after attempt $ATTEMPT."
    ATTEMPT=$((ATTEMPT + 1))
  done

  if [ "$SUCCESS" -ne 1 ]; then
    NOTES=$(jq -r --arg id "$STORY_ID" '.userStories[] | select(.id == $id) | .notes' "$PRD_JSON")
    echo ""
    echo "STOPPING: $STORY_ID failed after $MAX_ATTEMPTS attempts."
    echo "Notes from last attempt: $NOTES"
    echo "Fix manually or adjust the story in ralph/prd.json, then re-run this script — it resumes from the first incomplete story."
    exit 1
  fi

  echo "$STORY_ID passed."
done
