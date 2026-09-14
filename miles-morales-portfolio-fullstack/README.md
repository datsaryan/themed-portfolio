# Miles Morales Portfolio — Full-Stack

Aryan Singh's portfolio, split into two independently runnable pieces:

```
frontend/   React + Vite + TypeScript + Tailwind — the actual site
backend/    Spring Boot REST API + PostgreSQL — serves projects, skills,
            certifications, and stores contact submissions
```

## Why split it up

The frontend works completely standalone (it ships with the same content
baked into `frontend/src/data/resumeData.ts` as a fallback). Point it at the
backend via an env var and it transparently switches to live data — no
component code changes needed either way. That's what
`frontend/src/data/useResumeData.ts` does: try the API first, fall back to
the static file if the API isn't configured or isn't reachable.

## Run it locally

**Backend + database** (from the repo root):

```bash
docker compose up --build
```

This starts Postgres and the Spring Boot API on `:8080`, running the Flyway
migrations (schema + seed data) automatically on first boot.

**Frontend** (in a separate terminal):

```bash
cd frontend
cp .env.example .env      # sets VITE_API_BASE_URL=http://localhost:8080
npm install
npm run dev
```

Leave `.env` out (or point `VITE_API_BASE_URL` at nothing) and the frontend
runs fine on its own, serving the static resume data — useful for deploying
just the frontend as a static site with no backend at all.

## API

| Method | Path                  | Description                          |
|--------|-----------------------|---------------------------------------|
| GET    | `/api/profile`        | Personal info + education             |
| GET    | `/api/projects`       | All projects, in display order        |
| GET    | `/api/skills`         | Skill categories, in display order    |
| GET    | `/api/certifications` | Certifications/credentials            |
| POST   | `/api/contact`        | `{ name, email, message }` → stored   |

`/api/profile` is an addition beyond the 4 endpoints described for the
sibling "Personal Portfolio Full-Stack" project on the resume — added here
for completeness so *all* content is backend-managed, not just three of the
four sections.

## Deploying

Same pattern as the sibling project: Postgres on Neon, backend on Render (or
any host that runs a Docker image / JAR), frontend as a static build on
Vercel with `VITE_API_BASE_URL` set to the deployed backend URL, and
`APP_CORS_ALLOWED_ORIGINS` on the backend set to the deployed frontend URL.

## Known gaps

- **`public/assets/audio/sunflower_miles_morales.mp3` is not included.** It's
  the actual commercial recording of "Sunflower" (Post Malone & Swae Lee),
  and redistributing it isn't something this rebuild does. The code path in
  `src/audio/soundEngine.ts` still points at that file path — it'll just
  silently fail to play until you either license your own copy of a track
  and place it there, or swap in something royalty-free.
- The backend hasn't been compiled/run in the environment this was built in
  (no Maven Central access there) — it's written carefully against standard
  Spring Boot 3.3 / Java 21 conventions, but give `docker compose up --build`
  a real run before treating it as verified.
