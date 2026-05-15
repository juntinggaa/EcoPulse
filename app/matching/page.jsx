"use client";

import { useMemo, useState } from "react";
import { workers, jobs } from "@/lib/mockData";
import {
  scoreMatch,
  MATCHING_WEIGHTS,
  suggestedAction,
} from "@/lib/matching";
import ScoreBar from "@/components/ScoreBar";

const WEIGHT_ROWS = [
  { key: "skill", label: "Skill match", desc: "Overlap of worker skills with required skills" },
  { key: "location", label: "Location match", desc: "Same district / city / region" },
  { key: "salary", label: "Salary match", desc: "Job pays at or above worker expectation" },
  { key: "availability", label: "Availability match", desc: "Working hours alignment" },
  { key: "training", label: "Training fit", desc: "Worker interest × employer-provided training" },
  { key: "reliability", label: "Reliability score", desc: "Past placement / retention signal" },
];

const MATCH_REASON_EXAMPLES = [
  {
    title: "Ahmad Faizal -> Assembly Operator",
    status: "Low retention risk",
    pill: "pill-green",
    reasons: [
      "Strong skill match",
      "Location fit: Penang Bayan Lepas",
      "Salary expectation aligned",
      "Training completed",
    ],
  },
  {
    title: "Priya Nair -> QC Trainee",
    status: "Training at risk",
    pill: "pill-amber",
    reasons: [
      "Good skill potential",
      "Training pathway aligned",
      "Training attendance is low",
      "Complete training pathway before placement",
    ],
  },
];

export default function MatchingEnginePage() {
  const [workerId, setWorkerId] = useState(workers[0].id);
  const [jobId, setJobId] = useState(jobs[0].id);

  const worker = workers.find((w) => w.id === workerId);
  const job = jobs.find((j) => j.id === jobId);

  const result = useMemo(() => scoreMatch(worker, job), [worker, job]);

  const allPairs = useMemo(() => {
    const rows = [];
    for (const w of workers) {
      for (const j of jobs) {
        rows.push({ worker: w, job: j, ...scoreMatch(w, j) });
      }
    }
    return rows.sort((a, b) => b.score - a.score);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <span className="pill-amber">EcoPulse Matching Engine · Transparency view</span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          The AI logic behind every recommendation
        </h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">
          EcoPulse starts with rule-based matching because it is explainable,
          auditable, and suitable for early-stage pilot data. As verified
          placement and retention data grows, the model can evolve into
          retention prediction and training ROI analysis.
        </p>
        <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-slate-600 max-w-3xl">
          <strong className="text-slate-800">Who sees this page?</strong>{" "}
          In production, workers and employers see only the final match score
          and a short &ldquo;why this match&rdquo; summary. The full weighted
          breakdown is exposed here for <strong>investors, regulators, HRD
          Corp auditors, and TalentCorp</strong> — so EcoPulse&apos;s decisions
          are explainable and auditable, not a black box.
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Formula</h2>
        <div className="mt-4 rounded-xl bg-slate-900 text-slate-50 p-5 font-mono text-sm leading-relaxed">
          <div>Match Score =</div>
          <div className="pl-4">0.30 × Skill Match</div>
          <div className="pl-4">+ 0.20 × Location Match</div>
          <div className="pl-4">+ 0.20 × Salary Match</div>
          <div className="pl-4">+ 0.15 × Availability Match</div>
          <div className="pl-4">+ 0.10 × Training Fit</div>
          <div className="pl-4">+ 0.05 × Reliability Score</div>
        </div>
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          {WEIGHT_ROWS.map((row) => (
            <div
              key={row.key}
              className="rounded-xl border border-slate-100 p-4 flex items-center justify-between gap-4"
            >
              <div>
                <div className="font-medium">{row.label}</div>
                <div className="text-xs text-slate-500">{row.desc}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Weight</div>
                <div className="font-semibold">
                  {Math.round(MATCHING_WEIGHTS[row.key] * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Match reason examples</h2>
            <p className="text-sm text-slate-500">
              Each recommendation explains why a worker fits, whether training
              is needed, and whether there is a risk flag.
            </p>
          </div>
          <span className="pill-blue">Explainable matching</span>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {MATCH_REASON_EXAMPLES.map((example) => (
            <div key={example.title} className="rounded-xl border border-slate-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">{example.title}</div>
                <span className={example.pill}>{example.status}</span>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                {example.reasons.map((reason) => (
                  <li key={reason}>- {reason}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Live score breakdown</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Worker</label>
            <select
              className="field"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} · {w.location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Job</label>
            <select
              className="field"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} · {j.company}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {WEIGHT_ROWS.map((row) => (
              <div
                key={row.key}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-3"
              >
                <div className="w-44">
                  <div className="text-sm font-medium">{row.label}</div>
                  <div className="text-xs text-slate-500">
                    weight {Math.round(MATCHING_WEIGHTS[row.key] * 100)}%
                  </div>
                </div>
                <ScoreBar score={Math.round(result.parts[row.key] * 100)} />
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-slate-900 text-slate-50 p-6 flex flex-col">
            <div className="text-xs uppercase tracking-wider text-slate-300">
              Total match
            </div>
            <div className="mt-3 text-6xl font-bold tabular-nums">
              {result.score}
              <span className="text-2xl text-slate-300">%</span>
            </div>
            <div className="mt-3 text-sm text-slate-200">
              {result.reason}
            </div>
            <div className="mt-auto pt-5">
              <span className="pill-green">{suggestedAction(result.score)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Sample matching results</h2>
            <p className="text-sm text-slate-500">
              All worker × job pairs in the demo dataset, ranked by EcoPulse score.
            </p>
          </div>
          <span className="pill-blue">{allPairs.length} pairs</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Worker</th>
                <th className="py-2 pr-4">Job</th>
                <th className="py-2 pr-4 min-w-[200px]">Match score</th>
                <th className="py-2 pr-4">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allPairs.map(({ worker, job, score, reason }) => (
                <tr key={`${worker.id}-${job.id}`}>
                  <td className="py-3 pr-4 font-medium">{worker.name}</td>
                  <td className="py-3 pr-4">{job.title}</td>
                  <td className="py-3 pr-4">
                    <ScoreBar score={score} />
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
