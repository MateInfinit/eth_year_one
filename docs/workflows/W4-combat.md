# W4 — Boss combat (the Cuphead part)

**Mission:** professor fights. Side view, run-and-gun, phases, parry. The hardest and most impressive part.

**Owns:** `Assets/_Game/Combat/`, all `Arena_*` scenes, all `BossDefinition` assets.
**Depends on:** W1 contracts (`IDamageable`, `BossDefinition`, `RaiseBossFightEnded`). Uses W3 for intro text, W5 for art/sfx.

## M1 — Vertical slice (ONE boss, fully fun)
- [ ] Side-view player: run, jump, dash, shoot (hold), **parry** (jump-press on pink/marked projectiles).
- [ ] Player HP (3 hits), i-frames, hit flash, death → `RaiseBossFightEnded(boss, false)`.
- [ ] Pooled projectile system (straight, aimed, sine, radial burst).
- [ ] Boss framework: `BossController` with phases by HP %, attacks as ScriptableObjects (`BossAttack.Execute` coroutine), telegraphs.
- [ ] Fight flow: intro text → "FIGHT!" → phases → "KNOCKOUT"-style end → back to campus.
- [ ] First boss: **Discrete Mathematics** (or whichever the team finds funniest).

## M2 — More bosses (one at a time, each themed on its course)
Ideas — keep them parodies, no real names:
- **Discrete Mathematics** — throws proof steps; parry the ∎ to stun him.
- **Linear Algebra** — matrices rotate/shear the arena; only eigenvector lanes are safe.
- **Analysis** — ε-δ zones that shrink every phase.
- **Intro to Programming** — NullPointerExceptions rain down; a `while(true)` phase.
- **Algorithms & Data Structures** — bullets that sort themselves; a binary-search dodge.
- **Digital Design** — logic-gate turrets you rewire to shut off.

## M3
- [ ] **Basisprüfung boss rush** (all professors, shortened phases, no healing).
- [ ] Difficulty options, beer buff hook (W5 defines effect, you expose modifiers).

## First Cline prompt
> Workflow W4. In Assets/_Game/Combat/Scripts, create a BossController that implements
> IDamageable, has HP and a list of phases defined in a BossPhaseSet ScriptableObject
> (HP threshold + list of BossAttack). BossAttack is an abstract ScriptableObject with
> IEnumerator Execute(BossContext ctx). Implement RadialBurstAttack using a ProjectilePool
> (object pooling, no Instantiate per shot). On HP 0, call GameEvents.RaiseBossFightEnded(def, true).
> Put phase-selection logic in a plain C# class with EditMode tests. Tell me how to set up an
> Arena test scene.
