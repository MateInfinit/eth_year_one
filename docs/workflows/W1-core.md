# W1 — Core & game state

**Owner:** Matei

**Mission:** the foundation everything else plugs into. You go first; others build against your contracts.

**Owns:** `Assets/_Game/Core/`, scene `Boot`, Build Settings, `ProjectSettings/`, `Packages/`, CI.
**Depends on:** nobody. **Everybody depends on you.**

## M0 — Setup (first 1–2 days, blocks everyone)
- [ ] Create the Unity project (see SETUP.md → *One-time*), commit `Packages/`, `ProjectSettings/`, metas.
- [ ] Review/extend the contracts in `Core/Contracts/` (already drafted). Merge fast.
- [ ] Confirm all 6 assemblies compile and the EditMode test runner works.
- [ ] Keep `Core/Docs/Conventions.md` up to date (tags, layers, scene names, ids).

## M1 — Vertical slice
- [ ] `GameManager` (only singleton), `DontDestroyOnLoad`, lives in `Boot`.
- [ ] `StatsSystem`: handles `RequestStatChange`, clamps values, raises `OnStatChanged`, level-up from XP table (ScriptableObject).
- [ ] `SaveSystem`: JSON to `Application.persistentDataPath`; save on returning to campus.
- [ ] `SceneLoader`: handles `RequestScene`, `RequestBossFight`, `RequestUebung`, with pixel fade transition.
- [ ] Flow: `RaiseBossFightEnded` → grant ECTS or remove Sanity → back to the door you came from.
- [ ] `AudioManager`: plays clips by id (`RequestSfx`, `RequestMusic`), clip library as ScriptableObject (W5 fills it).
- [ ] **Debug menu** (F1): add XP/money, set level, jump to any boss/Übung/scene. Everyone needs this.

## M2/M3
- [ ] Semester calendar: week 1 → 14, things unlock by week; week 14 → Basisprüfung.
- [ ] Settings persistence (volume, text speed, language).
- [ ] Builds for Windows/macOS; optional GameCI on GitHub Actions running tests on each PR.

## First Cline prompt
> Workflow W1. In Assets/_Game/Core/Scripts, implement StatsSystem as a plain C# class (testable)
> plus a StatsSystemBehaviour MonoBehaviour that subscribes to GameEvents.OnStatChangeRequested
> and raises GameEvents.OnStatChanged. Level-up thresholds come from an XpTable ScriptableObject.
> Add EditMode tests in Core/Tests for: adding XP, levelling up across two thresholds, money
> never going negative. Tell me what to set up in the Boot scene.
