# W5 — Progression, Übungsstunden, art & audio

**Mission:** why the player gets stronger (Übungen → XP → levels), and how everything looks and sounds.

**Owns:** `Assets/_Game/Progression/`, `Assets/_Game/Art/`, `Assets/_Game/Audio/`, scenes `Uebung_*`, all `UebungDefinition` assets, the XP table values, the audio clip library.
**Depends on:** W1 contracts (`UebungDefinition`, `RaiseUebungEnded`, audio ids).

## M1 — Vertical slice
- [ ] Übung framework: load minigame scene → play → result screen (XP earned, TA comment) → `RaiseUebungEnded`.
- [ ] Minigame 1: **quiz** (multiple choice from a ScriptableObject question list, timer).
- [ ] XP table values: how many Übungen until you can fight the first professor (target ~3).
- [ ] **Placeholder art** for player, NPC, vending machine, boss, tiles (coloured squares are fine) so nobody waits.
- [ ] Import presets: 16 PPU, Point filter, no compression. Apply via Preset Manager.
- [ ] Audio clip library asset with ids from `Core/Docs/Conventions.md`; placeholder blips/SFX.

## M2 — Content
- [ ] More minigames, each short (≤ 60 s) and joke-heavy, e.g.:
  - **Spot the bug** — click the wrong line in a code snippet before time runs out.
  - **Proof speed-round** — true/false on statements, faster and faster.
  - **"Any questions?"** — dodge the TA's eye contact (bullet-hell lite).
  - **23:59 submission** — upload bar vs. server crash.
- [ ] Beer effect: short buff with downside (e.g. stronger parry, screen wobble) via Core stat/modifier.
- [ ] Final art: character sprite sheets, tilesets for each building, portraits, boss sprites.
  Decide early who draws; agents can't produce good pixel art. Asset packs: keep licences in `Art/`.
- [ ] Music: one chiptune loop per area + one per boss. SFX for everything.

## First Cline prompt
> Workflow W5. In Assets/_Game/Progression/Scripts, create an UebungRunner that reads the current
> UebungDefinition from ActiveSession.Uebung (set by Core before the scene loads), runs a minigame
> implementing IUebungMinigame (Begin, event Completed(score 0..1)), shows a result panel, computes
> XP = round(def.xpReward * score), and calls GameEvents.RaiseUebungEnded(def, xp). Implement
> QuizMinigame with questions from a QuizQuestionSet ScriptableObject and a per-question timer.
> Put scoring logic in a plain C# class with EditMode tests. Tell me how to build the scene.
