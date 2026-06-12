import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="pill-green">B2B2G workforce infrastructure · Malaysia pilot</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Workforce infrastructure for{" "}
            <span className="text-brand-600">Malaysia&apos;s verified</span>{" "}
            blue-collar economy.
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            EcoPulse routes Malaysia&apos;s youth into verified blue-collar jobs
            and <strong>HRD Corp / TVET-funded</strong> training pathways —
            helping employers hire better-fit workers and government agencies
            track <strong>B40 employment outcomes</strong> in real time across
            Penang, Selangor, and Johor.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/worker" className="btn-primary">
              Job Seeker
            </Link>
            <Link href="/employer" className="btn-ghost">
              Employer Portal
            </Link>
            <Link href="/government" className="btn-ghost">
              Government Dashboard
            </Link>
          </div>
          <div className="mt-6 text-sm text-slate-500">
            MVP demo · rule-based matching · designed to evolve into ML-driven
            prediction
          </div>
        </div>
        <div className="card p-6 grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-500">
              EcoPulse Match · Live preview
            </div>
            <span className="pill-blue">Match score</span>
          </div>
          <div className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Ahmad Faizal -&gt; Assembly Operator</div>
                <div className="text-sm text-slate-500">
                  Penang Bayan Lepas · Semiconductors
                </div>
              </div>
              <div className="text-2xl font-semibold text-brand-700">88%</div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
              <span className="pill-slate">Skill fit</span>
              <span className="pill-slate">Same district</span>
              <span className="pill-slate">RM 2,200</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Lim Wei Ming -&gt; Warehouse Assistant</div>
                <div className="text-sm text-slate-500">
                  Klang Valley · Logistics
                </div>
              </div>
              <div className="text-2xl font-semibold text-brand-700">82%</div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
              <span className="pill-slate">Forklift cert</span>
              <span className="pill-slate">Same state</span>
              <span className="pill-slate">Available now</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Priya Nair -&gt; QC Trainee (SKM L2)</div>
                <div className="text-sm text-slate-500">
                  Penang Bayan Lepas · TVET funded
                </div>
              </div>
              <div className="text-2xl font-semibold text-brand-700">76%</div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
              <span className="pill-slate">HRD Corp</span>
              <span className="pill-amber">Training at risk</span>
              <span className="pill-slate">42% training attendance</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-slate-600">
        <strong className="text-slate-800">Investor demo · all three views shown.</strong>{" "}
        In production, each user signs up and lands directly in their own
        portal (worker / employer / government agency). The three role cards
        below let you tour every view for this pitch.
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            tag: "Job seekers",
            color: "pill-green",
            title: "Verified jobs + HRD Corp / TVET training",
            body: "Malaysian youth get a verified profile, AI job recommendations across Penang / Selangor / Johor, and access to HRD Corp Claimable and SKM-recognised training pathways that lift their match score.",
            cta: "Open Job Seeker",
            href: "/worker",
          },
          {
            tag: "Employers",
            color: "pill-blue",
            title: "Better-fit Sdn Bhd hires",
            body: "Sdn Bhds post verified jobs and instantly see ranked, scored candidates — with reliability signals, suggested next actions, and HRD Corp levy-eligible training paths.",
            cta: "Open Employer Portal",
            href: "/employer",
          },
          {
            tag: "Government",
            color: "pill-amber",
            title: "B40 outcomes, in real time",
            body: "HRD Corp, MOHR, TalentCorp and state agencies see verified placements, training completion, 30-day retention, and B40 youth employment trends across pilot states.",
            cta: "Open Government Dashboard",
            href: "/government",
          },
        ].map((c) => (
          <div key={c.tag} className="card p-6 flex flex-col">
            <span className={c.color}>{c.tag}</span>
            <h3 className="mt-3 text-xl font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm text-slate-600 flex-1">{c.body}</p>
            <Link href={c.href} className="mt-5 btn-ghost self-start">
              {c.cta} →
            </Link>
          </div>
        ))}
      </section>

      <section className="card p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">The EcoPulse workflow</h2>
            <p className="mt-1 text-sm text-slate-500">
              One platform. Three stakeholders. Verified data at every step.
            </p>
          </div>
          <Link href="/matching" className="btn-ghost">
            See the matching engine →
          </Link>
        </div>
        <ol className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
          {[
            "Job seeker creates a verified profile",
            "Employer posts a verified blue-collar job",
            "EcoPulse scores worker × job matches",
            "Job seeker sees jobs + funded training",
            "Employer & worker chat in-platform (AI in thread)",
            "Government tracks placements & retention",
          ].map((step, i) => (
            <li
              key={step}
              className="rounded-xl border border-slate-100 p-4 bg-slate-50/60"
            >
              <div className="text-xs text-slate-500">Step {i + 1}</div>
              <div className="mt-1 font-medium text-ink-900">{step}</div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
