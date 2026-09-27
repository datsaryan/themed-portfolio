# ARYAN SINGH — STRANGER THINGS FULL-STACK PORTFOLIO

> **Hawkins National Laboratory Archive // Classification: Confidential**
> A production-grade, immersive personal portfolio built with Spring Boot 3, Java 21, React 19, TypeScript, and PostgreSQL, themed in the visual and sonic language of *Stranger Things*.

---

## ⚡ Highlights

- **Dual Dimension Engine:** Seamless real-time shift between **Hawkins 1986** (Right Side Up) and **The Upside Down** with DOM class transformations, atmospheric color variables, and sound effects.
- **1980s Analog Synthesizer:** Pure Web Audio API procedural audio engine synthesizing vintage analog drone chords, arpeggios, UI glitch clicks, and low-frequency Upside Down rumble without any external audio asset dependencies.
- **Floating Spores Particle System:** Dynamic HTML5 canvas rendering ambient spore dust in Hawkins mode and intensifying ash spores in the Upside Down.
- **Hawkins Case File Dossiers:** Real projects (*HireTrack ATS*, *Face-Based Attendance System*, *InAmigos Foundation Website*, *Personal Portfolio Full-Stack*) styled as Department of Energy classified incident records.
- **Lab Mainframe Terminal (JWT Admin):** Secure administrative modal with Spring Security JWT authentication (`admin` / `hawkins1983`), live database telemetry, and an encrypted transmission viewer with read-status dispatch toggles.
- **Resilient Fallback Architecture:** Zero-latency instantaneous frontend rendering backed by full offline resume data cache, synchronizing seamlessly with Spring Boot REST API when live.

---

## 🛠️ Technology Stack

### Backend
- **Java 21**
- **Spring Boot 3.3.4** (Web, JPA / Hibernate, Validation, Security, Mail)
- **Spring Security 6** with Stateless JWT Authentication (HMAC-SHA256)
- **Flyway** database migrations (V1 schema, V2 users)
- **PostgreSQL 16** (production) / **H2 Database** (in-memory test profile)
- **Lombok**
- **JUnit 5 & Mockito** (8/8 integration tests passing)

### Frontend
- **React 19 & TypeScript 5**
- **Vite 6**
- **Tailwind CSS 3** with custom Stranger Things / Hawkins color tokens & animations
- **Lucide React** & Custom SVG vector icons
- **Canvas Confetti**
- **Web Audio API** procedural synth

---

## 🚀 Quick Start

### Option 1: Docker Compose (All-in-One)
```bash
cd stranger-things-portfolio-fullstack
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend REST API: `http://localhost:8080/api`
- Postgres Database: `localhost:5432`

---

### Option 2: Local Development

#### 1. Backend (Spring Boot)
```bash
cd stranger-things-portfolio-fullstack/backend
mvn clean spring-boot:run
```
*Note: Run tests anytime with `mvn test`.*

#### 2. Frontend (React + Vite)
```bash
cd stranger-things-portfolio-fullstack/frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔐 Admin Terminal Credentials

To access the Hawkins National Laboratory Mainframe Terminal:
- Click the **TERMINAL** button in the navbar.
- **Operator ID:** `admin`
- **Passphrase:** `hawkins1983`
- Authenticates against `/api/auth/login` to obtain an HMAC-SHA256 JWT Bearer token and unlocks database metrics and incoming transmissions.

---

## 👤 Portfolio Owner

**Aryan Singh**
- 🎓 B.Tech CSE (2023 - 2027), OP Jindal University, Raigarh (CGPA 7.8/10)
- 💼 Web Developer Intern, InAmigos Foundation
- 📧 [aryansobdh@gmail.com](mailto:aryansobdh@gmail.com)
- 🐙 [GitHub: datsaryan](https://github.com/datsaryan)
- 💼 [LinkedIn: aryan-singh-19b0a2293](https://www.linkedin.com/in/aryan-singh-19b0a2293/)
- 💡 [LeetCode: datsaryan](https://leetcode.com/u/datsaryan/)
