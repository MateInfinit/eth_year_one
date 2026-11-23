# ETH: Year One

An Undertale-style, 8-bit RPG about surviving the first year of Computer Science at ETH Zürich.
Walk around campus, get a beer from the vending machine in CAB, level up in Übungsstunden,
and beat your professors in Cuphead-style boss fights, all the way to the Basisprüfung.

> Working title. Rename freely.

## Team & workflows

The project is built by **5 people, each with their own AI agent (Cline in VS Code) on their own PC**.
Every person owns one workflow, one set of folders and one set of scenes.

| # | Owner | Workflow | Owns (folders) | Owns (scenes) | Brief |
|---|-------|----------|----------------|---------------|-------|
| W1 | **Matei** | Core & game state | `Core/` | `Boot` | [docs/workflows/W1-core.md](docs/workflows/W1-core.md) |
| W2 | **Tudor** | Overworld & campus | `Overworld/` | `Campus_*`, `CAB`, `HG`, `Mensa`, `Polyterrasse` | [docs/workflows/W2-overworld.md](docs/workflows/W2-overworld.md) |
| W3 | **Ana** | Dialogue, UI & writing | `Dialogue/`, `UI/` | `MainMenu` | [docs/workflows/W3-dialogue-ui.md](docs/workflows/W3-dialogue-ui.md) |
| W4 | **Costin** | Boss combat | `Combat/` | `Arena_*` | [docs/workflows/W4-combat.md](docs/workflows/W4-combat.md) |
| W5 | **Stefan** | Progression, Übungen, art & audio | `Progression/`, `Art/`, `Audio/` | `Uebung_*` | [docs/workflows/W5-progression-art-audio.md](docs/workflows/W5-progression-art-audio.md) |

GitHub: Matei = @MateInfinit (others: add your usernames here and in `.github/CODEOWNERS`).

## Play the web prototype

A complete playable version runs in the browser: open [`web/index.html`](web/index.html) locally
(see [web/README.md](web/README.md)). Use it as the design reference for the Unity build.

## Start here

1. **[SETUP.md](SETUP.md)** — install Unity, VS Code, Cline, Git. Do this first.
2. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — how the modules talk to each other.
3. **[docs/WORKFLOW.md](docs/WORKFLOW.md)** — branches, PRs, scene ownership, daily rhythm.
4. Your own brief in [docs/workflows/](docs/workflows/).
5. **[docs/JOKES.md](docs/JOKES.md)** — the shared inside-joke list. Everyone adds to it.

## Golden rules

1. **Only edit your own folders and scenes.** Need something elsewhere? Ask the owner.
2. **Modules talk only through `Core/Contracts`.** Never reference another module's classes directly.
3. **Contracts change only through W1**, with a PR everyone can see.
4. **Small branches, merged daily.** Long-lived branches = merge hell.
5. **Never hand-edit `.unity`, `.prefab` or `.meta` files** (and don't let your agent do it either).

## Milestones

- **M0 – Setup:** everyone can open the project, contracts exist, all folders compile.
- **M1 – Vertical slice:** campus → CAB → buy beer → one Übungsstunde → level up → one professor fight → ECTS → save.
- **M2 – Content:** more buildings, more Übungen, more bosses (one at a time), more jokes.
- **M3 – Basisprüfung:** final boss rush, polish, build.
