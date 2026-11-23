# Architecture

## Modules

```
                 EthGame.Core  (W1)
     contracts · GameManager · stats · save · scenes · audio API
      ┌──────────────┬──────────────┬──────────────┬──────────────┐
EthGame.Overworld  EthGame.Dialogue  EthGame.Combat  EthGame.Progression
      (W2)          + EthGame.UI (W3)     (W4)             (W5)
      └──────────── talk to each other ONLY through Core ────────────┘
```

Each folder in `Assets/_Game/` is its own **Assembly Definition**:

| Assembly | May reference |
|----------|---------------|
| `EthGame.Core` | nothing (Unity only) |
| `EthGame.Overworld` | `EthGame.Core` |
| `EthGame.Dialogue` | `EthGame.Core` |
| `EthGame.UI` | `EthGame.Core` |
| `EthGame.Combat` | `EthGame.Core` |
| `EthGame.Progression` | `EthGame.Core` |

Because of this, a module **cannot** accidentally depend on another module. The compiler stops it.

## Contracts (`Assets/_Game/Core/Contracts/`)

| Contract | Purpose | Raised / implemented by | Listened to by |
|----------|---------|-------------------------|----------------|
| `IInteractable` | anything the player can press E on | W2 (vending machine, doors, NPCs) | W2 player controller |
| `IDamageable` | anything that can take damage | W4 (player, bosses) | W4 projectiles |
| `Stat` enum | Level, XP, ECTS, Sanity, Money, Beers | W1 | everyone |
| `GameEvents.OnStatChanged` | a stat changed | W1 `StatsSystem` | W3 HUD |
| `GameEvents.RequestStatChange` | "please add/remove X" | W2, W4, W5 | W1 `StatsSystem` |
| `GameEvents.RequestDialogue` | show a text box | W2, W4, W5 | W3 dialogue box |
| `GameEvents.OnDialogueFinished` | text box closed | W3 | whoever asked |
| `GameEvents.RequestBossFight` | start a professor fight | W2 (lecture hall door) | W1 (loads arena) → W4 |
| `GameEvents.RaiseBossFightEnded` | fight won/lost | W4 | W1 (grants ECTS, returns to campus) |
| `GameEvents.RequestUebung` | start an Übungsstunde | W2 | W1 (loads scene) → W5 |
| `GameEvents.RaiseUebungEnded` | Übung finished, XP earned | W5 | W1 |
| `GameEvents.RequestScene` | change scene | anyone | W1 `SceneLoader` |
| `GameEvents.RequestSfx` / `RequestMusic` | play audio by id | anyone | W1 `AudioManager` (sounds from W5) |
| `DialogueRequest` | speaker, portrait, lines, optional choices | anyone | W3 |
| `BossDefinition` (SO) | id, name, course, required level, ECTS, arena scene | W4 creates assets | W1, W2, W4 |
| `UebungDefinition` (SO) | id, course, minigame scene, XP reward | W5 creates assets | W1, W2, W5 |

## Game loop

```
Boot (W1) ──► MainMenu (W3) ──► Campus (W2)
                                  │
            ┌─────────────────────┼──────────────────────┐
            ▼                     ▼                      ▼
   CAB vending machine     Übungsstunde (W5)      Lecture hall door
   Money -1, Beers +1      XP +n → level up       required level? ──► Arena (W4)
                                                                     win → ECTS +n
                                                                     lose → Sanity -n
            └──────────────── back to Campus, save ─────────────────┘

Week 14 ──► Basisprüfung: boss rush through all professors (M3)
```

## Changing a contract

1. Open an issue labelled `contract-change` explaining why.
2. W1 makes the change on a branch, the PR is reviewed by **all** affected owners.
3. Prefer **adding** (new event, new optional field) over **changing/removing**, so nobody's code breaks.
