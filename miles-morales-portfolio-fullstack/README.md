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

### Contact form → email notifications

Submitting the contact form does two things:

1. Always saves the message to the `contact_messages` table.
2. If SMTP is configured, emails it straight to you (`NOTIFY_TO_EMAIL`,
   defaults to the resume's address) with **Reply-To set to the sender**, so
   hitting Reply in your inbox goes straight back to the recruiter.

If SMTP isn't configured, step 2 is skipped (logged, not an error) and the
frontend falls back to opening the visitor's own mail client instead — see
`frontend/src/components/sections/ContactSection.tsx`.

To enable it, set these env vars on the backend:

| Variable           | Required | Notes                                                  |
|---------------------|----------|---------------------------------------------------------|
| `SMTP_HOST`          | to enable | e.g. `smtp.gmail.com`, or your provider's relay host    |
| `SMTP_PORT`          | no        | defaults to `587`                                       |
| `SMTP_USERNAME`      | yes*      | SMTP auth username                                       |
| `SMTP_PASSWORD`      | yes*      | SMTP auth password / app password                        |
| `NOTIFY_TO_EMAIL`    | no        | where notifications land; defaults to the resume email   |
| `NOTIFY_FROM_EMAIL`  | no        | "From" header; defaults to `SMTP_USERNAME`                |

\* required once `SMTP_HOST` is set.

Two easy ways to get SMTP credentials:

- **Gmail**: enable 2-Step Verification, then create an
  [App Password](https://myaccount.google.com/apppasswords). Use
  `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, your Gmail address as
  `SMTP_USERNAME`, and the 16-character app password as `SMTP_PASSWORD`.
- **A transactional email service** (Brevo, Resend, SendGrid, etc.) — all of
  these give you an SMTP relay + credentials on their free tier, and don't
  require touching your personal Gmail security settings at all.

On Render, add these as environment variables on the backend service. In
Docker Compose, export them in your shell before `docker compose up` (or put
them in a `.env` file next to `docker-compose.yml`) — they're already wired
through in `docker-compose.yml`.

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

- **No audio file ships with this repo.** The BGM player looks for
  `frontend/public/assets/audio/theme.mp3`. Drop your own licensed track there
  and it loops automatically, labelled from the `BGM_TRACK` constant in
  `src/audio/soundEngine.ts`. With no file present it falls back to a short
  original procedural loop synthesized with the Web Audio API, and the HUD
  says so — nothing 404s or goes silently dead.
- The backend hasn't been compiled/run in the environment this was built in
  (no Maven Central access there) — it's written carefully against standard
  Spring Boot 3.3 / Java 21 conventions, but give `docker compose up --build`
  a real run before treating it as verified.

## Theming

Every colour resolves through CSS variables defined in `src/index.css`
(`:root` for the night suit, `html.light` for the day suit). The web-shooter
button in the navbar fires a web across the screen and swaps the palette
behind it. An inline script in `index.html` applies the saved choice before
first paint so the light theme never flashes dark on load.
