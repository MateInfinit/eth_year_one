# W2 — Overworld & campus (the Undertale part)

**Owner:** Tudor

**Mission:** the world you walk around in. Top-down, cosy, full of things to press E on.

**Owns:** `Assets/_Game/Overworld/`, scenes `Campus_Zentrum`, `CAB`, `HG`, `Mensa`, `Polyterrasse`.
**Depends on:** W1 contracts (`IInteractable`, `GameEvents`). Uses W3's dialogue box through events.

## M1 — Vertical slice
- [ ] Top-down player controller, 4 directions, Input System, Undertale-like feel (no diagonal sprite needed).
- [ ] Interaction: check in front of the player, call `IInteractable.Interact()`, show `PromptText`.
- [ ] Camera follow with room bounds, Pixel Perfect Camera.
- [ ] `Door` / `SceneTransition` → `GameEvents.RequestScene`, spawn points per entrance.
- [ ] **CAB** scene with the **beer vending machine** (Money − , Beers +1, funny dialogue).
- [ ] One Übungsstunde room door → `RequestUebung`.
- [ ] One lecture hall door → checks level, then `RequestBossFight` (or a "you're not ready" line).

## M2 — Content
- [ ] `Campus_Zentrum` connecting the buildings, `HG`, `Mensa` (queue!), `Polyterrasse`.
- [ ] NPCs: idle/wander, face player on talk, trigger `RequestDialogue`. Students, TAs, a lost exchange student…
- [ ] Simple NPC schedule by semester week (some appear only before exams).
- [ ] Secrets / easter eggs in every building (coordinate jokes with W3 via docs/JOKES.md).

## Notes
- Tilemaps: one Grid per scene, layers `Ground` / `Walls` / `Decor`, collision via TilemapCollider2D + CompositeCollider2D.
- Interactables are prefabs so other people can give you new ones to place.

## First Cline prompt
> Workflow W2. In Assets/_Game/Overworld/Scripts, create a top-down PlayerController using the
> new Input System (Move + Interact actions), 4-directional movement with a facing direction, and
> a short raycast in the facing direction that calls IInteractable.Interact() on the Interact action.
> Show the PromptText of the interactable in front of the player via a small world-space label.
> Then create VendingMachine : IInteractable that requests Money -2 and Beers +1 through
> GameEvents, or a "not enough money" dialogue. Tell me what to set up in the CAB scene.
