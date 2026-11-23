# ETH: Year One, web prototype

A complete, playable browser version of the game, built while the Unity version is in progress.
Use it as a **design reference** and playtest it: what's fun here should be fun in Unity.

**Play:** open `web/index.html` in any browser (double-click it). No install, no server.
Click the game first so it gets your keyboard.

## What's in it
- **Real ETH places:** the Polyterrasse in front of Semper's HG facade with Gull's dark dome, the Polybahn and a view of the old town (Grossmünster, Fraumünster, St. Peter), the lake, the Alps and the Uetliberg.
- **Universitätstrasse & CAB:** the old 1886 chemistry building, tram stop "ETH/Universitätsspital" with a blue-and-white tram, bikes, a poster column.
- **Inside CAB:** the yellow Cray X-MP/28 you can sit on, the VIS office with the Prüfungssammlung (old exams: +1 HP in a Basisprüfung block), food&lab, the CABinett and the beer vending machine.
- **HG Haupthalle:** columns, lecture hall HG F 1, ETH-Bibliothek (study for XP), the exam room.
  Easter eggs set into the floor: **GOAT** in gold and **IOI** in blue (talk to them while standing on them).
- **HG F 6:** side door on the left of the Haupthalle. Curved birch-wood tiers, glossy dark-red floor, long blackboard over wooden cabinets,
  white lecturer desk, TV screen. Sit in on a lecture (1 AP, you might fall asleep), or challenge a professor at the desk:
  the fight then takes place in a side view of HG F 6.
- **Mensa Polyterrasse:** "natürlich vegi" and "LOCAL" lines, panorama windows, the Hilfsassistent job board.
- **The real Basisjahr:** weeks 1–7 Herbstsemester, weeks 8–14 Frühjahrssemester, 8 courses × 7 KP = 56 KP,
  then **Basisprüfung Block 1** (HS courses) and **Block 2** (FS courses).
- **Übungsstunden** = level-up minigames: find-the-bug (Java), quiz covering all 8 courses, "Any questions?" dodge.
- **Professors** (all fictional, Swiss pun names), Cuphead-style with three phases each:

| Semester | Course | Professor |
|---|---|---|
| HS | Diskrete Mathematik | Prof. Dr. Reto Beweisli |
| HS | Einführung in die Programmierung | Prof. Dr. Beat Nullpointer |
| HS | Lineare Algebra | Prof. Dr. Heidi Eigenwert |
| HS | Algorithmen und Datenstrukturen | Prof. Dr. Vreni Rekursion |
| FS | Analysis I | Prof. Dr. Urs Grenzwert |
| FS | Digital Design and Computer Architecture | Prof. Dr. Gion Gatter |
| FS | Algorithmen und Wahrscheinlichkeit | Prof. Dr. Erwin Erwartungswert |
| FS | Parallele Programmierung | Prof. Dr. Sämi Semaphor |

- Every professor has catchphrase speech bubbles during the fight (Prof. Beweisli: "Hut Hut!", Prof. Eigenwert: "Sind Sie vorbei???").
- **Block 1** follows the real February exam session: A&D (4:00), EProg (2:40), LinAlg (3:00), Diskrete Mathe (3:00), with a countdown per exam.
  Write your handwritten Zusammenfassung in the ETH-Bibliothek: allowed in LinAlg and Diskrete Mathe, it gives +2 super cards in those parts.
- Swiss grades (1–6), levels (more HP), beer buff, Polybahn night out in the Niederdorf, save/continue, two endings.
- Chiptune music and sound effects generated in code (no asset files).

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
