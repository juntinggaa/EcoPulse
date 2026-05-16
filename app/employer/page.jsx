"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  jobs as initialJobs,
  workers,
  messageThreads,
  candidateJourneyRows,
  employerDashboardMetrics,
} from "@/lib/mockData";
import { rankWorkersForJob, suggestedAction } from "@/lib/matching";
import StatCard from "@/components/StatCard";
import ScoreBar from "@/components/ScoreBar";
import VerificationItem from "@/components/VerificationItem";

function threadFor(workerId, jobId) {
  return messageThreads.find(
    (t) => t.workerId === workerId && t.jobId === jobId
  );
}

function statusPillClass(status) {
  const value = (status || "").toLowerCase();
  if (
    value.includes("completed") ||
    value.includes("hired") ||
    value.includes("retained") ||
    value.includes("continue") ||
    value.includes("work attendance")
  ) {
    return "pill-green";
  }
  if (
    value.includes("risk") ||
    value.includes("progress") ||
    value.includes("interview") ||
    value.includes("shortlisted") ||
    value.includes("reminder") ||
    value.includes("confirm") ||
    value.includes("message")
  ) {
    return "pill-amber";
  }
  if (value.includes("dropped") || value.includes("high")) {
    return "pill-red";
  }
  return "pill-slate";
}

function trainingStatusLabel(row) {
  if (row.trainingAttendance == null) return row.trainingStatus;
  if (row.trainingStatus === "Training at risk") {
    return `Training at risk · ${row.trainingAttendance}% attendance`;
  }
  if (row.trainingStatus === "In progress") {
    return `In progress · ${row.trainingAttendance}% attendance`;
  }
  return row.trainingStatus;
}

function workAttendanceLabel(value) {
  return value == null ? "N/A" : `Work attendance · ${value}%`;
}

export default function EmployerPortal() {
  const [job, setJob] = useState(initialJobs[0]);
  const update = (patch) => setJob((j) => ({ ...j, ...patch }));
  const m = employerDashboardMetrics;

  const [shortlisted, setShortlisted] = useState({});
  const ranked = useMemo(() => rankWorkersForJob(job, workers), [job]);
  const toggleShortlist = (id) =>
    setShortlisted((s) => ({ ...s, [id]: !s[id] }));
  const shortlistCount = Object.values(shortlisted).filter(Boolean).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="pill-blue">Employer Portal</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Post a verified job, see ranked candidates
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sample employer profile shown below. Edit job fields to re-rank
            candidates instantly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Sample job</label>
          <select
            className="field max-w-xs"
            value={job.id}
            onChange={(e) =>
              setJob(initialJobs.find((j) => j.id === e.target.value))
            }
          >
            {initialJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} · {j.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Open roles" value={m.openRoles} sub="Active hiring needs" accent="blue" />
        <StatCard
          label="Matched candidates"
          value={m.matchedCandidates}
          sub="Ranked by fit score"
          accent="brand"
        />
        <StatCard
          label="Training-ready candidates"
          value={m.trainingReadyCandidates}
          sub="Completed or near completion"
          accent="amber"
        />
        <StatCard label="Placed workers" value={m.placedWorkers} sub="Started work" accent="brand" />
        <StatCard
          label="30-day retention"
          value={`${m.retention30Day}%`}
          sub="Placed cohort"
          accent="blue"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Job posting</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Company name</label>
              <input
                className="field"
                value={job.company}
                onChange={(e) => update({ company: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Job title</label>
              <input
                className="field"
                value={job.title}
                onChange={(e) => update({ title: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Location</label>
              <input
                className="field"
                value={job.location}
                onChange={(e) => update({ location: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Salary (RM / month)</label>
              <input
                type="number"
                className="field"
                value={job.salary}
                onChange={(e) => update({ salary: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="field-label">Working hours</label>
              <select
                className="field"
                value={job.workingHours}
                onChange={(e) => update({ workingHours: e.target.value })}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="shift work">Shift work</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label className="field-label">Housing support</label>
              <input
                className="field"
                value={job.housingSupport}
                onChange={(e) => update({ housingSupport: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">
                Skills required (comma separated)
              </label>
              <input
                className="field"
                value={job.skillsRequired.join(", ")}
                onChange={(e) =>
                  update({
                    skillsRequired: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="training"
                type="checkbox"
                checked={job.trainingProvided}
                onChange={(e) =>
                  update({ trainingProvided: e.target.checked })
                }
                className="h-4 w-4 accent-emerald-600"
              />
              <label htmlFor="training" className="text-sm text-slate-700">
                Training provided on the job
              </label>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold">Employer verification</h2>
          <p className="mt-1 text-sm text-slate-500">
            Simulated — business licence, contact, and payment account checks.
          </p>
          <div className="mt-3 divide-y divide-slate-100">
            <VerificationItem
              label="Business licence"
              status={job.verification.businessLicence}
            />
            <VerificationItem
              label="Company contact"
              status={job.verification.companyContact}
            />
            <VerificationItem
              label="Payment account"
              status={job.verification.paymentAccount}
            />
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <div className="text-sm font-medium text-slate-700">
              Job quality score
            </div>
            <div className="mt-2">
              <ScoreBar score={job.jobQualityScore} />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Composite signal: salary fairness, housing, training, retention
              history.
            </p>
          </div>
        </div>
      </div>

      {/* STAGE 1 — Discovery: AI sources & ranks, employer decides */}
      <div className="card p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="pill-amber">Stage 1 · Discover</span>
            <h2 className="mt-2 text-lg font-semibold">
              New AI matches — sourced &amp; ranked for this role
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl">
              You don&apos;t search. EcoPulse auto-sources verified candidates
              for your posted job and ranks them by fit. Review the AI&apos;s
              reasoning, then shortlist or message — you decide who to engage.
              Edit the job above and this list re-ranks instantly.
            </p>
          </div>
          <span className="pill-blue">
            {ranked.length} matches · {shortlistCount} shortlisted
          </span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Worker</th>
                <th className="py-2 pr-4">Skills</th>
                <th className="py-2 pr-4">Location</th>
                <th className="py-2 pr-4">Reliability</th>
                <th className="py-2 pr-4 min-w-[160px]">Match score</th>
                <th className="py-2 pr-4">AI suggests</th>
                <th className="py-2 pr-4">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ranked.map(({ worker, score, reason }) => {
                const t = threadFor(worker.id, job.id);
                const msgHref = t
                  ? `/messages?thread=${t.id}&view=employer`
                  : "/messages?view=employer";
                const isShort = !!shortlisted[worker.id];
                return (
                  <tr key={worker.id} className="align-top">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{worker.name}</div>
                      <div className="text-xs text-slate-500">
                        {worker.age} · {worker.availability}
                      </div>
                    </td>
                    <td className="py-3 pr-4 max-w-[240px]">
                      <div className="flex flex-wrap gap-1">
                        {worker.skills.map((s) => (
                          <span key={s} className="pill-slate">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {reason}
                      </div>
                    </td>
                    <td className="py-3 pr-4">{worker.location}</td>
                    <td className="py-3 pr-4">
                      <ScoreBar score={worker.reliabilityScore} />
                    </td>
                    <td className="py-3 pr-4">
                      <ScoreBar score={score} />
                    </td>
                    <td className="py-3 pr-4">
                      <span className="pill-amber">
                        {suggestedAction(score)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-col gap-1.5 min-w-[150px]">
                        <button
                          onClick={() => toggleShortlist(worker.id)}
                          className={
                            isShort
                              ? "rounded-lg px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white"
                              : "rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50"
                          }
                        >
                          {isShort
                            ? "✓ Shortlisted → in pipeline"
                            : "+ Shortlist"}
                        </button>
                        <Link
                          href={msgHref}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 ring-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 text-center"
                        >
                          💬 Message
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Shortlisted candidates move into the pipeline tracker below, where
          EcoPulse follows them from training → placement → 30/60/90-day
          retention.
        </p>
      </div>

      {/* STAGE 2 — Pipeline: candidates the employer has engaged */}
      <div className="card p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="pill-amber">Stage 2 · Track</span>
            <h2 className="mt-2 text-lg font-semibold">
              In pipeline — candidates you&apos;ve engaged
            </h2>
            <p className="text-sm text-slate-500">
              Once shortlisted, EcoPulse separates training attendance from
              work attendance. Training attendance tracks whether a worker is
              completing a funded training pathway. Work attendance starts only
              after the worker is placed into a job.
            </p>
            <p className="mt-2 text-xs text-slate-500 max-w-2xl">
              This view tracks each engaged worker from matched to training
              enrolled, training attendance, completion, placement, work
              attendance, and 30/60/90-day retention.
            </p>
          </div>
          <span className="pill-blue">{candidateJourneyRows.length} candidates</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Worker</th>
                <th className="py-2 pr-4">Recommended Role</th>
                <th className="py-2 pr-4 min-w-[180px]">Match Score</th>
                <th className="py-2 pr-4">Training Status</th>
                <th className="py-2 pr-4">Hiring Status</th>
                <th className="py-2 pr-4">Work Attendance</th>
                <th className="py-2 pr-4">Retention Status</th>
                <th className="py-2 pr-4">Suggested Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidateJourneyRows.map((worker) => (
                <tr key={worker.id} className="align-top">
                  <td className="py-3 pr-4">
                    <div className="font-medium">{worker.name}</div>
                    <div className="text-xs text-slate-500">
                      {worker.location} · {worker.availability}
                    </div>
                  </td>
                  <td className="py-3 pr-4">{worker.recommendedRole}</td>
                  <td className="py-3 pr-4">
                    <ScoreBar score={worker.matchScore} />
                  </td>
                  <td className="py-3 pr-4">
                    <span className={statusPillClass(worker.trainingStatus)}>
                      {trainingStatusLabel(worker)}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={statusPillClass(worker.hiringStatus)}>
                      {worker.hiringStatus}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={statusPillClass(workAttendanceLabel(worker.workAttendance))}>
                      {workAttendanceLabel(worker.workAttendance)}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={statusPillClass(worker.retentionStatus)}>
                      {worker.retentionStatus}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={statusPillClass(worker.suggestedAction)}>
                      {worker.suggestedAction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
