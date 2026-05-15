"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  jobs as initialJobs,
  workers,
  messageThreads,
  trainingProgress,
} from "@/lib/mockData";
import { rankWorkersForJob, suggestedAction } from "@/lib/matching";
import ScoreBar from "@/components/ScoreBar";
import VerificationItem from "@/components/VerificationItem";

function threadFor(workerId, jobId) {
  return messageThreads.find(
    (t) => t.workerId === workerId && t.jobId === jobId
  );
}

function trainingPillFor(workerId) {
  const tp = trainingProgress[workerId];
  if (!tp) return null;
  const map = {
    enrolled: { cls: "pill-blue", label: "Enrolled" },
    in_progress: {
      cls: "pill-green",
      label: `In training · ${tp.weeksCompleted}/${tp.durationWeeks}w`,
    },
    at_risk: {
      cls: "pill-amber",
      label: `⚠ At risk · ${tp.attendance}% attendance`,
    },
    completed: { cls: "pill-green", label: "✓ Trained" },
    dropped: { cls: "pill-slate", label: "Dropped" },
  };
  return map[tp.status] || null;
}

export default function EmployerPortal() {
  const [job, setJob] = useState(initialJobs[0]);
  const update = (patch) => setJob((j) => ({ ...j, ...patch }));

  const ranked = useMemo(() => rankWorkersForJob(job, workers), [job]);

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

      <div className="card p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Matched candidates</h2>
            <p className="text-sm text-slate-500">
              Ranked by EcoPulse match score with an AI-suggested next action —
              these are <strong>recommendations</strong>, not actions already
              taken.
            </p>
            <p className="mt-2 text-xs text-slate-500 max-w-2xl">
              <strong>Invite to interview</strong> = strong match, contact
              directly. <strong>Shortlist</strong> = good match, review before
              inviting. <strong>Suggest training first</strong> = EcoPulse can
              route this worker into an HRD Corp / TVET-funded course (you
              don&apos;t pay or arrange it) and re-introduce them once
              interview-ready.
            </p>
          </div>
          <span className="pill-blue">{ranked.length} candidates</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Worker</th>
                <th className="py-2 pr-4">Skills</th>
                <th className="py-2 pr-4">Location</th>
                <th className="py-2 pr-4">Reliability</th>
                <th className="py-2 pr-4 min-w-[180px]">Match score</th>
                <th className="py-2 pr-4">Suggested action (AI)</th>
                <th className="py-2 pr-4">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ranked.map(({ worker, score, reason }) => {
                const t = threadFor(worker.id, job.id);
                const msgHref = t
                  ? `/messages?thread=${t.id}&view=employer`
                  : "/messages?view=employer";
                const tPill = trainingPillFor(worker.id);
                return (
                  <tr key={worker.id} className="align-top">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{worker.name}</div>
                      <div className="text-xs text-slate-500">
                        {worker.age} · {worker.availability}
                      </div>
                      {tPill && (
                        <div className="mt-1.5">
                          <span className={tPill.cls}>{tPill.label}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4 max-w-[260px]">
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
                      <span className="pill-green">
                        {suggestedAction(score)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <Link
                        href={msgHref}
                        className="btn-ghost text-xs px-3 py-1.5 whitespace-nowrap"
                      >
                        💬 Message
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
