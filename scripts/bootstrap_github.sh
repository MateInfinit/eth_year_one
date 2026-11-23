#!/usr/bin/env bash
# Creates the GitHub repo, labels, milestones, starter issues and a project board.
# Run ONCE, from the repo root, by whoever owns the repo (usually W1).
#
# Needs: git, GitHub CLI (gh) logged in:   gh auth login
# For the project board also:              gh auth refresh -s project
# Windows: run in Git Bash.
#
# Usage:  bash scripts/bootstrap_github.sh [repo-name] [owner] [private|public]
#   e.g.  bash scripts/bootstrap_github.sh eth-year-one              (your account, private)
#         bash scripts/bootstrap_github.sh eth-year-one my-org private

set -euo pipefail

REPO_NAME="${1:-eth-year-one}"
OWNER="${2:-$(gh api user --jq .login)}"
VISIBILITY="${3:-private}"
FULL="$OWNER/$REPO_NAME"

echo "==> Target: $FULL ($VISIBILITY)"
gh auth status >/dev/null || { echo "Run: gh auth login"; exit 1; }
git lfs install >/dev/null 2>&1 || echo "!! Git LFS not found. Install it before adding art/audio."

# ---------- 1. Local repo + first commit ----------
if [ ! -d .git ]; then git init -q -b main; fi
git add -A
if ! git rev-parse HEAD >/dev/null 2>&1; then
  git commit -q -m "Project skeleton: docs, workflows, contracts, Cline rules"
fi

# ---------- 2. Create GitHub repo and push ----------
if gh repo view "$FULL" >/dev/null 2>&1; then
  echo "==> Repo exists, pushing"
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$FULL.git"
  git push -u origin main
else
  gh repo create "$FULL" "--$VISIBILITY" --source=. --remote=origin --push \
    --description "Undertale-style RPG about the first year of CS at ETH, built by 5 people + 5 AI agents"
fi

# ---------- 3. Labels ----------
echo "==> Labels"
label() { gh label create "$1" --repo "$FULL" --color "$2" --description "$3" --force >/dev/null; }
label "W1-core"         "5319e7" "Core & game state"
label "W2-overworld"    "0e8a16" "Overworld & campus"
label "W3-dialogue-ui"  "1d76db" "Dialogue, UI & writing"
label "W4-combat"       "d93f0b" "Boss combat"
label "W5-progression"  "fbca04" "Progression, Übungen, art & audio"
label "contract-change" "b60205" "Changes Core/Contracts - needs review by all owners"
label "joke"            "f9d0c4" "Inside-joke idea"
label "blocked"         "000000" "Waiting on someone else"
label "bug"             "ee0701" "Something is broken"

# ---------- 4. Milestones ----------
echo "==> Milestones"
milestone() {
  gh api "repos/$FULL/milestones" --jq '.[].title' | grep -qx "$1" \
    || gh api "repos/$FULL/milestones" -f title="$1" -f description="$2" >/dev/null
}
milestone "M0 - Setup"          "Everyone can open the project; contracts exist; all assemblies compile."
milestone "M1 - Vertical slice" "Campus -> CAB beer -> one Uebung -> level up -> one professor fight -> ECTS -> save."
milestone "M2 - Content"        "More buildings, Uebungen, bosses (one at a time), jokes."
milestone "M3 - Basispruefung"  "Final boss rush, polish, builds."

# ---------- 5. Issues ----------
echo "==> Issues"
ISSUE_URLS=()
issue() { # title, label, milestone, brief file
  local body="See the brief: [docs/workflows/$4](https://github.com/$FULL/blob/main/docs/workflows/$4)

Use the **Cline prompt** in the brief as a starting point. Plan mode first.

**Done when:** it works in Play mode, EditMode tests pass, PR merged."
  ISSUE_URLS+=("$(gh issue create --repo "$FULL" --title "$1" --label "$2" --milestone "$3" --body "$body")")
}

if [ "$(gh issue list --repo "$FULL" --state all --limit 1 --json number --jq length)" != "0" ]; then
  echo "    Repo already has issues - skipping issue creation (avoids duplicates)."
else
# M0
issue "[W1] Create Unity project (URP 2D) and commit Packages/ProjectSettings/metas" "W1-core" "M0 - Setup" "W1-core.md"
issue "[W1] Review & merge Core contracts, fill Conventions.md"                      "W1-core" "M0 - Setup" "W1-core.md"
issue "[ALL] Every member: complete SETUP.md and open a test PR"                     "W1-core" "M0 - Setup" "W1-core.md"
issue "[W5] Placeholder sprites + import presets (16 PPU, Point, no compression)"    "W5-progression" "M0 - Setup" "W5-progression-art-audio.md"

# M1 - W1
issue "[W1] GameManager + StatsSystem (XP table, level-up) + tests"                  "W1-core" "M1 - Vertical slice" "W1-core.md"
issue "[W1] SaveSystem (JSON)"                                                       "W1-core" "M1 - Vertical slice" "W1-core.md"
issue "[W1] SceneLoader with fade; handle boss/Uebung requests and returns"          "W1-core" "M1 - Vertical slice" "W1-core.md"
issue "[W1] AudioManager (play by id) + F1 debug menu"                               "W1-core" "M1 - Vertical slice" "W1-core.md"
# M1 - W2
issue "[W2] Top-down player controller + interaction raycast"                        "W2-overworld" "M1 - Vertical slice" "W2-overworld.md"
issue "[W2] CAB scene + beer vending machine"                                        "W2-overworld" "M1 - Vertical slice" "W2-overworld.md"
issue "[W2] Doors/scene transitions, Uebung door, lecture hall door (level check)"   "W2-overworld" "M1 - Vertical slice" "W2-overworld.md"
# M1 - W3
issue "[W3] Undertale-style dialogue box (typewriter, blips, portraits) + tests"     "W3-dialogue-ui" "M1 - Vertical slice" "W3-dialogue-ui.md"
issue "[W3] HUD (Level, ECTS, Sanity, Money, Beers)"                                 "W3-dialogue-ui" "M1 - Vertical slice" "W3-dialogue-ui.md"
issue "[W3] Main menu + pause menu"                                                  "W3-dialogue-ui" "M1 - Vertical slice" "W3-dialogue-ui.md"
issue "[W3] Curate docs/JOKES.md and write first NPC/vending-machine lines"          "W3-dialogue-ui" "M1 - Vertical slice" "W3-dialogue-ui.md"
# M1 - W4
issue "[W4] Side-view combat player (run, jump, dash, shoot, parry, HP)"             "W4-combat" "M1 - Vertical slice" "W4-combat.md"
issue "[W4] Pooled projectile system"                                                "W4-combat" "M1 - Vertical slice" "W4-combat.md"
issue "[W4] Boss framework (phases, attacks as ScriptableObjects) + tests"           "W4-combat" "M1 - Vertical slice" "W4-combat.md"
issue "[W4] First boss: Discrete Mathematics"                                        "W4-combat" "M1 - Vertical slice" "W4-combat.md"
# M1 - W5
issue "[W5] Uebung framework (runner, result screen, XP) + tests"                    "W5-progression" "M1 - Vertical slice" "W5-progression-art-audio.md"
issue "[W5] First minigame: quiz"                                                    "W5-progression" "M1 - Vertical slice" "W5-progression-art-audio.md"
issue "[W5] XP table values + audio clip library with placeholder sounds"            "W5-progression" "M1 - Vertical slice" "W5-progression-art-audio.md"
# M3
issue "[W4] Basispruefung boss rush"                                                 "W4-combat" "M3 - Basispruefung" "W4-combat.md"
fi

# ---------- 6. Project board (optional, needs 'project' scope) ----------
echo "==> Project board"
if PROJECT_NUM=$(gh project create --owner "$OWNER" --title "ETH: Year One" --format json --jq .number 2>/dev/null); then
  gh project link "$PROJECT_NUM" --owner "$OWNER" --repo "$FULL" >/dev/null 2>&1 || true
  for url in ${ISSUE_URLS[@]+"${ISSUE_URLS[@]}"}; do
    gh project item-add "$PROJECT_NUM" --owner "$OWNER" --url "$url" >/dev/null
  done
  echo "    Project #$PROJECT_NUM created with ${#ISSUE_URLS[@]} items."
else
  echo "    Skipped. To enable: gh auth refresh -s project   then re-run this script."
fi

echo
echo "Done: https://github.com/$FULL"
echo "Next:"
echo "  1. Settings -> Collaborators: invite the 4 teammates."
echo "  2. Fill in names in README.md and usernames in .github/CODEOWNERS."
echo "  3. Assign each issue to its workflow owner."
