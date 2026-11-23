# Conventions (W1 maintains this list — agents must not invent new ones)

## Scene names
- `Boot`, `MainMenu`
- `Campus_Zentrum`, `CAB`, `HG`, `Mensa`, `Polyterrasse`
- `Arena_<bossId>`  (e.g. `Arena_discrete_math`)
- `Uebung_<uebungId>`  (e.g. `Uebung_quiz_eprog`)

## Tags
- `Player`
- `Interactable`
- `Boss`
- `PlayerProjectile`, `EnemyProjectile`

## Layers
- `Ground`, `Walls`, `Player`, `Enemies`, `Projectiles`, `Interactables`

## Sorting layers (back → front)
- `Background`, `Ground`, `Objects`, `Characters`, `Foreground`, `UI`

## Audio ids
- Music: `music_campus`, `music_cab`, `music_boss_<bossId>`, `music_menu`
- SFX: `sfx_blip_default`, `sfx_vending`, `sfx_hit`, `sfx_parry`, `sfx_levelup`

## Ids
- Boss ids: `discrete_math`, `linear_algebra`, `analysis`, `eprog`, `ad`, `ddca`
- lowercase_snake_case for every id.
