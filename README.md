# Pokémon Pack Opener

A virtual Pokémon TCG booster-pack simulator with real card artwork from every era (Base Set through Mega Evolution). Rip packs with authentic pull rates, track your binder and set completion, and draft teams for ROM-hack playthroughs.

**Live:** https://jsunaldo.github.io/pokemon-pack-opener/

## Features
- Real booster-pack artwork and card images for every set
- Card-by-card "rip" reveal with holo shine, sound, and haptics
- Authentic per-era pack structure, with an optional **No Dupes** (one Pokémon per evolution line) mode
- **My Binder** with lifetime pull stats, best-pulls shelf, and per-set completion tracking
- **Playthroughs** — save packs as a team, auto-evolve members, add packs as you progress
- Card Tracker and full Pokémon × set table
- Installable PWA — works fully offline once sets are downloaded
- Backup export/import to move progress between devices

## Tech
Single-file app (`index.html`) — no build step. Card data from the [pokemon-tcg-data](https://github.com/PokemonTCG/pokemon-tcg-data) repo and the pokemontcg.io API; pack art from Bulbagarden Archives. Offline support via `pack-opener-sw.js`. All progress lives in the browser (localStorage); nothing is sent to a server.
