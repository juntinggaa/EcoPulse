"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  messageThreads,
  workers,
  jobs,
  employerQuickActions,
  workerQuickDrafts,
  trainingProgress,
} from "@/lib/mockData";

const fmtTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
      <MessagesView />
    </Suspense>
  );
}

function MessagesView() {
  const params = useSearchParams();
  const qpView = params.get("view");
  const qpThread = params.get("thread");

  const [view, setView] = useState(qpView === "employer" ? "employer" : "worker");
  const [activeId, setActiveId] = useState(
    messageThreads.find((t) => t.id === qpThread)?.id || messageThreads[0].id
  );
  const [drafts, setDrafts] = useState({});
  const [extra, setExtra] = useState({});
  const [enrolled, setEnrolled] = useState({});
  const [drafting, setDrafting] = useState(null); // scenario id currently being drafted by AI
  const [aiError, setAiError] = useState(null);
  const [customIntent, setCustomIntent] = useState("");

  const thread = messageThreads.find((t) => t.id === activeId);
  const worker = workers.find((w) => w.id === thread.workerId);
  const job = jobs.find((j) => j.id === thread.jobId);
  const tp = trainingProgress[worker.id];

  const visibleMessages = useMemo(() => {
    const all = [...thread.messages, ...(extra[thread.id] || [])];
    return all.filter((m) => {
      if (m.from !== "ai") return true;
      const a = m.audience || "both";
      return a === "both" || a === view;
    });
  }, [thread, extra, view]);

  const send = (text, from = view, action = null, audience = "both") => {
    if (!text.trim() && !action) return;
    const msg = {
      id: `local-${Date.now()}`,
      from,
      text,
      time: `Today · ${fmtTime()}`,
      action,
      audience: from === "ai" ? audience : undefined,
    };
    setExtra((e) => ({
      ...e,
      [thread.id]: [...(e[thread.id] || []), msg],
    }));
    setDrafts((d) => ({ ...d, [thread.id]: "" }));
  };

  // Static template fill — instant fallback if AI draft fails (employer only).
  const fillStaticTemplate = (scenarioId) => {
    const action = employerQuickActions.find((q) => q.id === scenarioId);
    if (!action) return;
    const filled = action.template
      .replaceAll("{worker}", worker.name.split(" ")[0])
      .replaceAll("{location}", job.location)
      .replaceAll(
        "{pathway}",
        tp?.pathway || "HRD Corp Claimable · CNC Machining Basics"
      );
    setDrafts((d) => ({ ...d, [thread.id]: filled }));
  };

  // Live AI draft via DeepSeek (server-side proxy at /api/draft-reply).
  // Works for both worker and employer sides; supports a free-form `userIntent`.
  const draftReply = async (scenarioId, userIntent = null) => {
    setDrafting(scenarioId);
    setAiError(null);
    try {
      const res = await fetch("/api/draft-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: scenarioId,
          audience: view, // who is writing the message
          userIntent,
          worker: {
            name: worker.name,
            age: worker.age,
            location: worker.location,
            skills: worker.skills,
            reliabilityScore: worker.reliabilityScore,
            availability: worker.availability,
          },
          job: {
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            workingHours: job.workingHours,
            housingSupport: job.housingSupport,
            trainingProvided: job.trainingProvided,
          },
          training: tp || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.draft) {
        setDrafts((d) => ({ ...d, [thread.id]: data.draft }));
        if (scenarioId === "custom") setCustomIntent("");
      } else {
        setAiError(data.error || "AI draft unavailable.");
        // Only employer quick-actions have a static fallback.
        if (view === "employer" && scenarioId !== "custom") {
          fillStaticTemplate(scenarioId);
        }
      }
    } catch (err) {
      setAiError("Network error.");
      if (view === "employer" && scenarioId !== "custom") {
        fillStaticTemplate(scenarioId);
      }
    } finally {
      setDrafting(null);
    }
  };

  const handleCustomDraft = () => {
    if (!customIntent.trim() || drafting) return;
    draftReply("custom", customIntent.trim());
  };

  const enrol = (msgId, pathway) => {
    setEnrolled((e) => ({ ...e, [msgId]: true }));
    send(
      `Enrolled in ${pathway}. Start date confirmed by EcoPulse.`,
      "ai",
      null,
      "both"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="pill-blue">In-platform messaging · audit trail</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            2-way conversations between workers and employers
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-2xl">
            EcoPulse AI sits inside the thread — suggesting training, drafting
            employer messages, giving workers 1-click actions, and surfacing
            training progress + training attendance alerts. Every interaction is logged
            for HRD Corp audit.
          </p>
        </div>
        <div className="inline-flex rounded-xl bg-slate-100 p-1 text-sm">
          <button
            onClick={() => setView("worker")}
            className={`px-4 py-1.5 rounded-lg transition ${
              view === "worker"
                ? "bg-white shadow-sm font-semibold text-ink-900"
                : "text-slate-600"
            }`}
          >
            Worker view
          </button>
          <button
            onClick={() => setView("employer")}
            className={`px-4 py-1.5 rounded-lg transition ${
              view === "employer"
                ? "bg-white shadow-sm font-semibold text-ink-900"
                : "text-slate-600"
            }`}
          >
            Employer view
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <aside className="card p-3 lg:col-span-1 h-fit">
          <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Conversations
          </div>
          <ul className="space-y-1">
            {messageThreads.map((t) => {
              const w = workers.find((x) => x.id === t.workerId);
              const j = jobs.find((x) => x.id === t.jobId);
              const active = t.id === activeId;
              const headline =
                view === "worker"
                  ? `${j.company} · ${j.title}`
                  : `${w.name} · ${j.title}`;
              const sub =
                view === "worker"
                  ? t.employerContact
                  : `${w.location} · reliability ${w.reliabilityScore}`;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveId(t.id)}
                    className={`w-full text-left rounded-xl px-3 py-2.5 transition ${
                      active
                        ? "bg-brand-50 ring-1 ring-brand-200"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-sm truncate">
                        {headline}
                      </div>
                      {t.unread > 0 && (
                        <span className="pill-green text-[10px]">
                          {t.unread} new
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {sub}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      {t.lastUpdate}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="card p-0 lg:col-span-2 flex flex-col min-h-[640px]">
          <header className="border-b border-slate-100 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold">
                {view === "worker"
                  ? `${job.company} · ${job.title}`
                  : `${worker.name} · ${job.title}`}
              </div>
              <div className="text-xs text-slate-500">
                {view === "worker"
                  ? `${thread.employerContact} · ${job.location}`
                  : `${worker.location} · reliability ${worker.reliabilityScore} · ${worker.availability}`}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="pill-slate">Match score available</span>
              <span className="pill-green">
                Verified {view === "worker" ? "employer" : "worker"}
              </span>
            </div>
          </header>

          {view === "employer" && tp && (
            <TrainingProgressCard tp={tp} workerName={worker.name} />
          )}

          <div className="flex-1 px-5 py-4 space-y-3 bg-slate-50/40 overflow-y-auto">
            {visibleMessages.map((m) => (
              <MessageBubble
                key={m.id}
                m={m}
                view={view}
                worker={worker}
                enrolled={!!enrolled[m.id]}
                onEnrol={() => enrol(m.id, m.action?.pathway)}
              />
            ))}
          </div>

          <footer className="border-t border-slate-100 p-4 space-y-3">
            <DraftBar
              view={view}
              drafting={drafting}
              aiError={aiError}
              customIntent={customIntent}
              setCustomIntent={setCustomIntent}
              onQuickDraft={(id) => draftReply(id)}
              onCustomDraft={handleCustomDraft}
            />
            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                className="field flex-1 resize-none"
                placeholder={
                  view === "worker"
                    ? "Reply to employer…"
                    : "Reply to worker…"
                }
                value={drafts[thread.id] || ""}
                onChange={(e) =>
                  setDrafts((d) => ({ ...d, [thread.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(drafts[thread.id] || "");
                  }
                }}
              />
              <button
                className="btn-primary"
                onClick={() => send(drafts[thread.id] || "")}
              >
                Send
              </button>
            </div>
            <div className="text-[11px] text-slate-400">
              EcoPulse will scan this message for safety, language, and policy
              compliance — and log it for HRD Corp audit.
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}

function TrainingProgressCard({ tp, workerName }) {
  if (!tp) return null;
  const pct = Math.round((tp.weeksCompleted / tp.durationWeeks) * 100);
  const statusStyles = {
    enrolled: { label: "Enrolled · not started", pill: "pill-blue", bar: "bg-blue-500" },
    in_progress: { label: "In progress", pill: "pill-green", bar: "bg-emerald-500" },
    at_risk: { label: "Training at risk · low attendance", pill: "pill-amber", bar: "bg-amber-500" },
    completed: { label: "Completed", pill: "pill-green", bar: "bg-emerald-600" },
    dropped: { label: "Dropped out", pill: "pill-red", bar: "bg-red-500" },
  };
  const s = statusStyles[tp.status] || statusStyles.enrolled;
  const isRisk = tp.status === "at_risk" || tp.status === "dropped";

  return (
    <div
      className={`mx-5 mt-4 rounded-2xl border p-4 ${
        isRisk
          ? "bg-amber-50 border-amber-200"
          : "bg-emerald-50 border-emerald-200"
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            Training progress · employer-only view
          </div>
          <div className="mt-1 font-semibold text-ink-900">{tp.pathway}</div>
          <div className="text-xs text-slate-500">
            Funded by {tp.funder} · Provider: {tp.provider} · Enrolled{" "}
            {tp.enrolmentDate}
          </div>
        </div>
        <span className={s.pill}>{s.label}</span>
      </div>
      <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-xs text-slate-500">Weeks completed</div>
          <div className="mt-0.5 font-semibold">
            {tp.weeksCompleted} / {tp.durationWeeks}
          </div>
          <div className="mt-1.5 h-1.5 rounded bg-white/70 overflow-hidden">
            <div className={`h-full ${s.bar}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Training attendance</div>
          <div
            className={`mt-0.5 font-semibold ${
              tp.attendance < 70 ? "text-amber-700" : "text-emerald-700"
            }`}
          >
            {tp.attendance}%
          </div>
          <div className="text-[11px] text-slate-500">
            Threshold for risk alert: &lt;70%
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Last activity</div>
          <div className="mt-0.5 font-semibold">{tp.lastActivity}</div>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-white/70 p-3 text-xs text-slate-700">
        <strong className="text-slate-800">Next milestone:</strong>{" "}
        {tp.nextMilestone}
      </div>
      {isRisk && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-primary text-xs px-3 py-1.5">
            Send check-in to {workerName.split(" ")[0]}
          </button>
          <button className="btn-ghost text-xs px-3 py-1.5">
            Escalate to HRD Corp counsellor
          </button>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ m, view, worker, enrolled, onEnrol }) {
  if (m.from === "ai") {
    return (
      <div className="flex justify-center">
        <div className="max-w-2xl w-full rounded-xl border border-dashed border-amber-300 bg-amber-50/70 p-3 text-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-amber-500 text-white text-[10px]">
              AI
            </span>
            EcoPulse AI · system message
            <span className="ml-auto text-[11px] font-normal text-slate-500">
              {m.time}
            </span>
          </div>
          <div className="mt-1.5 text-slate-700">{m.text}</div>
          {m.action?.kind === "enrol" && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {enrolled ? (
                <span className="pill-green">
                  Enrolled · {m.action.pathway}
                </span>
              ) : view === "worker" ? (
                <button
                  className="btn-primary text-xs px-3 py-1.5"
                  onClick={onEnrol}
                >
                  Enrol now ({m.action.duration}, funded by {m.action.funder})
                </button>
              ) : (
                <span className="pill-slate">
                  Worker can enrol in 1 click ({m.action.funder})
                </span>
              )}
            </div>
          )}
          {m.action?.kind === "interview" && (
            <div className="mt-2 text-xs text-slate-600">
              Interview held: {m.action.date} · {m.action.time}
            </div>
          )}
        </div>
      </div>
    );
  }

  const isOwn =
    (view === "worker" && m.from === "worker") ||
    (view === "employer" && m.from === "employer");
  const senderLabel =
    m.from === "worker" ? worker.name.split(" ")[0] : "Employer · HR";

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isOwn
            ? "bg-brand-600 text-white"
            : "bg-white border border-slate-100 text-slate-800"
        }`}
      >
        <div
          className={`text-[11px] font-medium mb-1 ${
            isOwn ? "text-emerald-100" : "text-slate-500"
          }`}
        >
          {senderLabel} · {m.time}
        </div>
        <div className="whitespace-pre-line">{m.text}</div>
      </div>
    </div>
  );
}

function DraftBar({
  view,
  drafting,
  aiError,
  customIntent,
  setCustomIntent,
  onQuickDraft,
  onCustomDraft,
}) {
  const quickList =
    view === "employer" ? employerQuickActions : workerQuickDrafts;
  const placeholder =
    view === "employer"
      ? 'Or type custom intent — e.g. "ask about her dorm preference and shift availability"'
      : 'Or type custom intent — e.g. "ask about overtime pay and dorm options"';

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          ✨ AI quick-drafts
        </span>
        {quickList.map((q) => {
          const isLoading = drafting === q.id;
          return (
            <button
              key={q.id}
              onClick={() => onQuickDraft(q.id)}
              disabled={drafting !== null}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition ${
                isLoading
                  ? "bg-brand-600 text-white ring-brand-600 animate-pulse"
                  : "bg-brand-50 text-brand-700 ring-brand-200 hover:bg-brand-100 disabled:opacity-50"
              }`}
            >
              {isLoading ? "✨ Drafting with DeepSeek…" : `✨ ${q.label}`}
            </button>
          );
        })}
      </div>
      <div className="flex items-stretch gap-2">
        <input
          type="text"
          className="field flex-1 text-sm"
          placeholder={placeholder}
          value={customIntent}
          onChange={(e) => setCustomIntent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customIntent.trim() && !drafting) {
              e.preventDefault();
              onCustomDraft();
            }
          }}
          disabled={drafting !== null}
        />
        <button
          onClick={onCustomDraft}
          disabled={!customIntent.trim() || drafting !== null}
          className={`rounded-lg px-4 py-2 text-xs font-semibold ring-1 transition whitespace-nowrap ${
            drafting === "custom"
              ? "bg-brand-600 text-white ring-brand-600 animate-pulse"
              : "bg-brand-600 text-white ring-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
        >
          {drafting === "custom" ? "✨ Drafting…" : "✨ Draft with AI"}
        </button>
      </div>
      {aiError && (
        <div className="text-[11px] text-amber-700">{aiError}</div>
      )}
    </div>
  );
}
