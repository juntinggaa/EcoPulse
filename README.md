# EcoPulse — Coded MVP (Malaysia pilot)

EcoPulse is an AI-powered B2B2G workforce platform that connects Malaysia's
youth to verified blue-collar jobs and **HRD Corp / TVET-funded** training
pathways, helps Sdn Bhd employers hire better-fit workers, and gives MOHR /
HRD Corp / state agencies a real-time view of **B40 employment outcomes**
across Penang, Selangor, and Johor.

This repo is a **demoable MVP** built for a 5-minute business pitch. It is
intentionally not production-grade: there is no real auth, no real MyKad / SSM
verification, no real payments, and no real HRD Corp API integration.
Verification status, training enrolment, and employment outcomes are all
simulated so the product workflow can be told end-to-end.

## Tech stack

- Next.js 14 (App Router) + React 18
- Tailwind CSS
- Recharts for the government dashboard
- In-memory mock data (`lib/mockData.js`) — no database needed

## Install & run

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## What each page demonstrates

| Page | Path | What to show in the pitch |
|---|---|---|
| Landing | `/` | One-screen positioning: workers, employers, government, plus a live preview of EcoPulse match cards. |
| Job Seeker | `/worker` | Verified profile, simulated verification panel, AI-ranked job recommendations, funded training pathway recommendations. Edit any field to watch matches re-rank live. |
| Employer Portal | `/employer` | Verified employer panel, job posting form, table of matched candidates with skills, reliability, match score, and a suggested next action. |
| Matching Engine | `/matching` | The "AI" logic exposed — the weighted formula, a live per-component score breakdown for any worker × job pair, and a full sample matching table. Labeled as "MVP rule-based matching model — designed to evolve into ML prediction." |
| Government Dashboard | `/government` | KPI tiles, placements by sector (bar chart), match outcomes funnel (donut), training completion trend (line), and industry demand table. |

## Demo storyline (5 minutes)

1. **Landing** — EcoPulse is workforce infrastructure for Malaysia's verified blue-collar economy, serving workers, Sdn Bhd employers, and government in one platform.
2. **Job Seeker** — Ahmad Faizal (Penang Bayan Lepas) builds a verified profile, sees AI-ranked semiconductor / warehouse / QC jobs, and gets HRD Corp / TVET-funded training pathways tailored to him.
3. **Employer Portal** — switch hats to Penang Precision Manufacturing Sdn Bhd; show ranked candidates with reliability scores and suggested actions.
4. **Matching Engine** — open the formula, then change worker/job to demonstrate the score breakdown updating live.
5. **Government Dashboard** — close on the outcomes story: B40 verified placements, HRD Corp levy utilisation by state (Penang / Selangor / Johor), training completion, retention, sector demand. Position SEA expansion (Singapore B2G credibility → Indonesia / Vietnam → China) as upside.

## Project layout

```
app/
  layout.jsx              # global shell + nav + footer
  page.jsx                # landing
  worker/page.jsx         # job seeker portal
  employer/page.jsx       # employer portal
  matching/page.jsx       # matching engine
  government/page.jsx     # government dashboard
  globals.css             # Tailwind + design tokens
components/
  Navigation.jsx
  StatCard.jsx
  ScoreBar.jsx
  VerificationItem.jsx
lib/
  matching.js             # all matching logic in one place
  mockData.js             # workers, jobs, training, dashboard data
```

## Matching logic

The weighted formula lives in `lib/matching.js` and is intentionally easy to
tune:

```text
Match Score =
  0.30 × Skill Match
+ 0.20 × Location Match
+ 0.20 × Salary Match
+ 0.15 × Availability Match
+ 0.10 × Training Fit
+ 0.05 × Reliability Score
```

Each sub-score is a small pure function (`skillMatch`, `locationMatch`,
`salaryMatch`, `availabilityMatch`, `trainingFit`, `reliabilityComponent`).
`scoreMatch(worker, job)` returns `{ score, parts, reason }`. Two helpers wrap
it: `rankJobsForWorker(worker, jobs)` and `rankWorkersForJob(job, workers)`.

`recommendTraining(worker, jobs, pathways)` ranks pathways by the worker's
stated training interest plus market demand for the skills the pathway teaches.

`suggestedAction(score)` maps a match score to a human-readable next action
(`Invite to interview`, `Shortlist`, `Suggest training first`) so the employer
view always shows a recommended move.

## What is NOT built (by design)

- Real authentication / login
- Real ID, business licence, or payment verification APIs
- Real government data integrations
- Trained ML models — the matching is rule-based and clearly labeled as the
  v0 of a model that improves as placement/retention data accumulates
- Mobile app, billing, complex backend

These are simulated in the UI so the pitch can focus on the product workflow
and the IP story (matching, verification, scoring, outcome data).
