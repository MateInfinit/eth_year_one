# ETH: Year One, web prototype

A complete, playable browser version of the game, built while the Unity version is in progress.
Use it as a **design reference** and playtest it: what's fun here should be fun in Unity.

**Play:** open `web/index.html` in any browser (double-click it). No install, no server.
Click the game first so it gets your keyboard.

## What's in it
- Campus with **HG, CAB, Polymensa, Polyterrasse**, NPCs with jokes, notice board, signs
- **CAB beer vending machine**, Mensa food, a coffee machine that eats coins, a Hilfsassistent job
- 14-week semester, 3 AP (energy) per week, sanity, money, sleeping on Polyterrasse benches, burnout
- **Übungsstunden** = level-up minigames: find-the-bug (Java), math & logic quiz, "Any questions?" dodge
- **Cuphead-style boss fights** with phases, parry (pink), dash, super:
  Prof. Diskret (Discrete Math), Prof. Null (Intro to Programming), Prof. Eigen (Linear Algebra),
  Prof. Epsilon (Analysis), Prof. Gate (Digital Design) and **THE BASISPRÜFUNG** (5-part boss rush)
- Swiss grades (1–6), ECTS, levels (more HP), beer buff (+1 HP, wobbly screen), save/continue, two endings
- Chiptune music and sound effects generated in code (no asset files)

## Controls
- **Explore:** arrows/WASD move · Z talk/confirm · X menu · hold C to run
- **Fight:** ←→ move · Z jump · Z again in the air on something pink = parry · hold X shoot · C dash · V super · Esc pause
- M mutes

## Code
Plain JavaScript on a 640×360 canvas, no libraries. Edit the parts in `src/`, then run `./build.sh`.

| File | What |
|---|---|
| `src/1_core.js` | input, audio + music, drawing, sprites, save, dialogue |
| `src/2_world.js` | maps, tiles, NPCs, overworld, HUD |
| `src/3_flows.js` | interactions, weeks, menu, title, intro, endings |
| `src/4_games.js` | Übung minigames, professors, boss fight engine |
| `src/5_main.js` | main loop, boot |

Mapping to the Unity workflows: overworld → W2, dialogue/UI → W3, boss fights → W4,
Übungen/progression → W5, game state/save/weeks → W1.
