# How we work together

## Ownership

| Scene / folder | Owner | Everyone else |
|----------------|-------|---------------|
| `Boot`, Build Settings, `Core/` | W1 (Matei) | ask W1 |
| `Campus_*`, `CAB`, `HG`, `Mensa`, `Polyterrasse`, `Overworld/` | W2 (Tudor) | give W2 a prefab |
| `MainMenu`, `Dialogue/`, `UI/` | W3 (Ana) | use the dialogue events |
| `Arena_*`, `Combat/` | W4 (Costin) | give W4 a `BossDefinition` idea |
| `Uebung_*`, `Progression/`, `Art/`, `Audio/` | W5 (Stefan) | anyone may **add** art/audio files |

**Never open someone else's scene and save it.** If you need something placed there,
make a prefab and ask the owner to drop it in.

## Branches

- `main` is always playable.
- One branch per task: `w2/vending-machine`, `w4/boss-phase-system`, `w3/fix-typewriter-skip`.
- Branch from fresh `main`, merge back within **1–2 days**.

## Daily loop

1. `git pull` on `main` and create your branch.
2. Pick an issue from the project board that's assigned to you, move it to **In progress**.
3. Give Cline the issue text. Plan mode first, read the plan, then Act.
4. Review the diff yourself (`git diff`). Did the agent touch files outside your folders? Revert that.
5. Test in Unity (Play mode + `Test Runner`).
6. Commit, push, open a PR with the template. Link the issue (`Closes #12`).
7. Someone else reviews (their agent may do a first pass). Squash-merge.

## Sync

- **10 min daily** (call or chat): what I did, what I'm doing, which shared thing I need.
- Anything touching `Core/Contracts` → issue with label `contract-change` first.

## Prompting Cline well

Good:
> "Workflow W2. In Assets/_Game/Overworld/Scripts, create VendingMachine : IInteractable.
> Interact() requests Money -2.5 and Beers +1 via GameEvents.RequestStatChange, and requests a
> dialogue 'Clunk. A cold beer drops.' If Money < 2.5, show 'Insufficient funds. Like your ECTS.'
> instead. Tell me what to wire in the CAB scene."

Bad:
> "Make the vending machine work."

Always name: **workflow, folder, contracts to use, expected behaviour, what to tell you at the end.**
