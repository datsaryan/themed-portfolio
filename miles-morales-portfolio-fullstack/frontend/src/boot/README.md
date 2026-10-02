# Boot cinematic

A Spider-Verse-style rescue (Miles dives after a falling Gwen) that doubles as
the app's real loading and failure UI. It reacts to the actual load result; it
never decides the outcome itself.

```
main.tsx ── loadLiveData() starts immediately (shared, memoised, abortable)
   └─ BootGate ── lazy-loads CinematicLoader, mounts <App/> only when needed
        └─ CinematicLoader
             ├─ useBootSequence   one rAF loop · binds the load promise · audio cues · quality governor
             ├─ bootMachine       PURE state machine (time injected) — all race logic lives here
             ├─ choreography      PURE: BootState -> Frame (poses, camera, fx)
             └─ scene/            Stage (compositor) · Figure (rig art) · Layers · Fx · LoadingState · FailureState · RevealWeb
```

**Outcome logic.** The story runs to a decision point (7s of story time) and
*holds* there until the real result arrives. Result in time -> catch -> web-wipe
reveal. Failure/timeout -> Gwen hits the ground -> failure card. If the result
arrives early, the story fast-forwards (6x) instead of making you wait. Results
carry an attempt id, so a late response from a previous attempt can't resolve
the current one after *Try again*.

**Readiness.** `loadLiveData()` is `ok` when `/api/profile` succeeds, or when no
backend is configured (the static content *is* the app). Other endpoints failing
just leave their sections on static content. *Enter portfolio anyway* is
therefore a genuinely working option.

**Tuning.** Every timing is in `bootConfig.ts` (`LOAD.TIMEOUT_S` is the
deadline; `BEAT`/`BRANCH` shape the story).

**Behaviour switches**
- `prefers-reduced-motion`: static poster, text only, 0.35s crossfade.
- Repeat visit in a session that loads instantly: straight to the reveal.
  `?cinematic=full` replays the whole story.
- Slow device: a governor sheds detail (extras, then layers) if frames stay slow.
- Audio: cues only play if the site's sound is already unmuted.
- Dev only: `?simulate=fail|500|slow` exercises the failure/slow paths.

**Testing against a backend**
```
node scripts/mock-api.mjs 8080            # then: curl localhost:8080/__mode/ok|500|slow|hang|down
VITE_API_BASE_URL=http://127.0.0.1:8080 npm run dev
npm test                                   # state machine + choreography invariants
```
