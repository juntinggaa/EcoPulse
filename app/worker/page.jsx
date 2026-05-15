"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  workers as initialWorkers,
  jobs,
  trainingPathways,
  messageThreads,
} from "@/lib/mockData";
import {
  rankJobsForWorker,
  recommendTraining,
  workerActionLabel,
} from "@/lib/matching";
import ScoreBar from "@/components/ScoreBar";
import VerificationItem from "@/components/VerificationItem";

function threadFor(workerId, jobId) {
  return messageThreads.find(
    (t) => t.workerId === workerId && t.jobId === jobId
  );
}

function parseList(value) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function WorkerPortal() {
  const [worker, setWorker] = useState(initialWorkers[0]);

  const ranked = useMemo(() => rankJobsForWorker(worker, jobs), [worker]);
  const training = useMemo(
    () => recommendTraining(worker, jobs, trainingPathways),
    [worker]
  );

  const update = (patch) => setWorker((w) => ({ ...w, ...patch }));
  const updateVerification = (patch) =>
    setWorker((w) => ({
      ...w,
      verification: { ...w.verification, ...patch },
    }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="pill-green">Worker Portal</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Build your verified profile, see your matched jobs
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Live demo with sample worker <strong>{worker.name}</strong>. Tweak
            fields to see how match scores change.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Sample worker</label>
          <select
            className="field max-w-xs"
            value={worker.id}
            onChange={(e) =>
              setWorker(initialWorkers.find((w) => w.id === e.target.value))
            }
          >
            {initialWorkers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} · {w.location}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Worker application profile</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Full name</label>
              <input
                className="field"
                value={worker.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Phone number</label>
              <input
                className="field"
                value={worker.phone}
                onChange={(e) => update({ phone: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">ID verification</label>
              <select
                className="field"
                value={worker.verification.idDocument}
                onChange={(e) =>
                  updateVerification({ idDocument: e.target.value })
                }
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="No">Not submitted</option>
              </select>
            </div>
            <div>
              <label className="field-label">Location</label>
              <input
                className="field"
                value={worker.location}
                onChange={(e) => update({ location: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Preferred job type</label>
              <select
                className="field"
                value={worker.preferredJobType}
                onChange={(e) => update({ preferredJobType: e.target.value })}
              >
                <option value="Manufacturing operator">
                  Manufacturing operator
                </option>
                <option value="Warehouse / logistics">
                  Warehouse / logistics
                </option>
                <option value="Quality control trainee">
                  Quality control trainee
                </option>
                <option value="Construction / site work">
                  Construction / site work
                </option>
                <option value="Cleaning / facilities">
                  Cleaning / facilities
                </option>
                <option value="Food service / kitchen">
                  Food service / kitchen
                </option>
                <option value="Flexible / open">Flexible / open</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Skills</label>
              <input
                className="field"
                value={worker.skills.join(", ")}
                onChange={(e) =>
                  update({
                    skills: parseList(e.target.value),
                  })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Certifications</label>
              <input
                className="field"
                value={worker.certifications.join(", ")}
                onChange={(e) =>
                  update({
                    certifications: parseList(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="field-label">Availability</label>
              <select
                className="field"
                value={worker.availability}
                onChange={(e) => update({ availability: e.target.value })}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label className="field-label">Expected salary (RM / month)</label>
              <input
                type="number"
                className="field"
                value={worker.expectedSalary}
                onChange={(e) =>
                  update({ expectedSalary: Number(e.target.value) })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Training interest</label>
              <input
                className="field"
                value={worker.trainingInterest.join(", ")}
                onChange={(e) =>
                  update({
                    trainingInterest: parseList(e.target.value),
                  })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">
                Past work experience (optional)
              </label>
              <textarea
                className="field min-h-[96px] resize-y"
                value={worker.workExperience}
                onChange={(e) => update({ workExperience: e.target.value })}
                placeholder="Company, job role, tasks handled, duration"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold">Verification</h2>
          <p className="mt-1 text-sm text-slate-500">
            Simulated — identity, phone, and skill profile checks.
          </p>
          <div className="mt-3 divide-y divide-slate-100">
            <VerificationItem
              label="Real-name verification"
              status={worker.verification.realName}
            />
            <VerificationItem
              label="Phone verification"
              status={worker.verification.phone}
            />
            <VerificationItem
              label="ID verification"
              status={worker.verification.idDocument}
            />
            <VerificationItem
              label="Skill profile"
              status={worker.verification.skillProfile}
            />
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
            <div className="font-medium text-slate-700">Reliability score</div>
            <div className="mt-2">
              <ScoreBar score={worker.reliabilityScore} />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Based on prior placements, attendance, and employer feedback.
            </p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Recommended jobs</h2>
            <p className="text-sm text-slate-500">
              Ranked by EcoPulse match score · weights set in matching engine.
            </p>
          </div>
          <span className="pill-blue">{ranked.length} matches</span>
        </div>
        <div className="mt-4 grid gap-4">
          {ranked.map(({ job, score, reason }) => {
            const t = threadFor(worker.id, job.id);
            const msgHref = t
              ? `/messages?thread=${t.id}&view=worker`
              : "/messages?view=worker";
            return (
              <div
                key={job.id}
                className="rounded-xl border border-slate-100 p-4 flex flex-wrap items-center gap-4 justify-between"
              >
                <div className="min-w-[260px]">
                  <div className="font-semibold">{job.title}</div>
                  <div className="text-sm text-slate-500">
                    {job.company} · {job.location}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{reason}</div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Salary</div>
                    <div className="font-medium">
                      RM {job.salary.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Training</div>
                    <div className="font-medium">
                      {job.trainingProvided ? "Provided" : "—"}
                    </div>
                  </div>
                  <ScoreBar score={score} />
                  <span className="pill-green">{workerActionLabel(score)}</span>
                  <Link href={msgHref} className="btn-ghost text-xs px-3 py-1.5">
                    💬 Message HR
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              Funded training pathways for you
            </h2>
            <p className="text-sm text-slate-500">
              Prioritised by your stated interests and current market demand.
            </p>
            <p className="mt-2 text-xs text-slate-500 max-w-2xl">
              <strong>Matches interest</strong> = the pathway teaches a skill
              you said you want to learn. <strong>Market demand</strong> =
              number of open verified jobs in the platform that require this
              skill. EcoPulse routes you straight into HRD Corp Claimable or
              TVET-funded enrolment — no fees from you.
            </p>
          </div>
          <span className="pill-amber">HRD Corp / TVET funded</span>
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {training.map(({ pathway, demandScore, interestBoost, newSkills }) => (
            <div
              key={pathway.id}
              className="rounded-xl border border-slate-100 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{pathway.name}</div>
                {interestBoost ? (
                  <span className="pill-green">Matches interest</span>
                ) : (
                  <span className="pill-slate">In-demand</span>
                )}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {pathway.duration} · {pathway.funded ? "Fully funded" : "Self-pay"}
              </div>
              <div className="mt-3 text-xs text-slate-600">
                Adds: {newSkills.length ? newSkills.join(", ") : "refresher skills"}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <span className="pill-blue">Market demand · {demandScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
