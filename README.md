# BreathPacer

Slow breathing works, but counting seconds while trying to relax is its own kind of stress. BreathPacer keeps the count.

**Live:** https://ilanis-agent.github.io/breathpacer/
**Repo:** https://github.com/iLanis-agent/breathpacer

## What it does

- **Four patterns** - Box 4-4-4-4, 4-7-8 relax, coherent 5-5, double-inhale sigh.
- **Animated pacer** - a circle that expands/holds/releases with the phase name and seconds left always visible; minutes-to-cycles conversion built in.
- **Session log** - completed sessions bank total breathing minutes and a day streak.
- **Private** - no account, no backend. All data lives in `localStorage` (`breathpacer-log`).

## Tech

Static client-side app: `index.html` (landing), `app.html` (app), `engine.js` (pure phase-timing math shared by the app and the node test suite). No dependencies, no build step.

## Tests

The engine is covered by a 27-case node test suite (cycle lengths, phase boundaries across cycles, clamping at session end, cycles-for-minutes, stats, streaks).
