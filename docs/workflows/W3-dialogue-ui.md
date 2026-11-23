# W3 — Dialogue, UI & writing (the voice of the game)

**Mission:** everything the player reads. The text box is the soul of an Undertale-like, and most of the jokes live in text.

**Owns:** `Assets/_Game/Dialogue/`, `Assets/_Game/UI/`, scene `MainMenu`, `docs/JOKES.md` (curator).
**Depends on:** W1 contracts. Everyone else calls your text box via `GameEvents.RequestDialogue`.

## M1 — Vertical slice
- [ ] Undertale-style dialogue box: black box, white border, portrait, typewriter effect.
- [ ] Per-character blip sound (per-speaker blip id), punctuation pauses, skip/fast-forward, advance on input.
- [ ] Blocks player input while open; raises `OnDialogueFinished`.
- [ ] HUD: Level, ECTS, Sanity, Money, Beers (listens to `OnStatChanged`).
- [ ] Main menu (New game / Continue / Settings / Quit) and pause menu.

## M2 — Content
- [ ] Choices in dialogue (2–4 options) with result callback.
- [ ] Dialogue as ScriptableObjects (or evaluate Yarn Spinner if we need real branching).
- [ ] Inventory screen (beer, coffee, cheat sheets…) with joke descriptions.
- [ ] Boss intro / defeat text screens (W4 provides lines in `BossDefinition`).
- [ ] EN/DE text (localisation table), text speed setting.
- [ ] **Writing pass:** turn docs/JOKES.md into NPC lines, item text, loading-screen tips.

## Notes
- Use TextMeshPro with a pixel font; disable font atlas filtering.
- Don't hardcode any text in other people's code — give them a pattern to put text in ScriptableObjects.

## First Cline prompt
> Workflow W3. In Assets/_Game/UI/Scripts (or Dialogue/Scripts for the logic), build a DialogueBox
> that subscribes to GameEvents.OnDialogueRequested, shows speaker name + portrait, types the text
> letter by letter (configurable chars/sec, longer pause after . , ! ?), requests a blip sfx per
> visible character via GameEvents.RequestSfx, completes the line instantly on input if still
> typing, otherwise advances; raises OnDialogueFinished at the end. Put the typing logic in a
> plain C# class with EditMode tests. Tell me how to build the UI prefab.
