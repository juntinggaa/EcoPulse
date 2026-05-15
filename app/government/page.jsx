"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  governmentMetrics,
  placementBySector,
  trainingCompletionTrend,
  matchOutcomes,
  placementByState,
  trainingROI,
  youthUnemploymentTrend,
  topEmployers,
  trainingToPlacementFunnel,
  atRiskTrainingRows,
  stateOutcomeBreakdown,
  sectorOutcomeBreakdown,
} from "@/lib/mockData";
import StatCard from "@/components/StatCard";

const SECTOR_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

function riskPillClass(level) {
  const value = level.toLowerCase();
  if (value.includes("high")) return "pill-red";
  if (value.includes("risk")) return "pill-amber";
  return "pill-slate";
}

function retentionPillClass(value) {
  if (value >= 70) return "pill-green";
  if (value >= 60) return "pill-amber";
  return "pill-red";
}

export default function GovernmentDashboard() {
  const m = governmentMetrics;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="pill-amber">Government Dashboard · MOHR / HRD Corp view</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Placement and retention dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-2xl">
            Aggregated view of verified B40 workers, HRD Corp training
            enrolments, training attendance risk, MyFutureJobs placements, and
            30-day retention across Malaysia&apos;s pilot states.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="pill-slate">Pilot: Penang · Selangor · Johor</span>
          <span className="pill-green">Live demo data</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Verified workers"
          value={m.verifiedWorkers.toLocaleString()}
          sub="MyKad + skill profile"
          accent="brand"
        />
        <StatCard
          label="Training enrolments"
          value={m.trainingEnrolments}
          sub="Levy-claimable pathways"
          accent="amber"
        />
        <StatCard
          label="Training completion"
          value={`${m.trainingCompletionRate}%`}
          sub="Last 90 days"
          accent="slate"
        />
        <StatCard
          label="Successful placements"
          value={m.successfulPlacements}
          sub="MyFutureJobs cross-checked"
          accent="brand"
        />
        <StatCard
          label="30-day retention"
          value={`${m.retention30Day}%`}
          sub="Across pilot states"
          accent="blue"
        />
        <StatCard
          label="At-risk trainees"
          value={m.atRiskTrainees}
          sub="Training attendance below threshold"
          accent="red"
        />
      </div>

      <div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Training-to-Placement Funnel</h2>
          <p className="text-sm text-slate-500">
            Matched workers move through funded training, training attendance,
            completion, job placement, work attendance, and 30-day retention.
          </p>
          <div className="mt-4 h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trainingToPlacementFunnel}
                layout="vertical"
                margin={{ left: 40, right: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" fontSize={12} stroke="#64748b" />
                <YAxis
                  type="category"
                  dataKey="stage"
                  fontSize={12}
                  stroke="#64748b"
                  width={120}
                />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {trainingToPlacementFunnel.map((_, i) => (
                    <Cell
                      key={i}
                      fill={`hsl(${158 - i * 8}, 70%, ${50 - i * 2}%)`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Conversion: {Math.round(
              (trainingToPlacementFunnel[5].count / trainingToPlacementFunnel[0].count) *
                100
            )}% of verified workers retained at 30 days. Training attendance is
            monitored before completion; work attendance starts only after job
            placement.
          </div>
        </div>

        {/* Cost per placement is intentionally hidden until pricing is validated. */}
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">At-risk training panel</h2>
            <p className="text-sm text-slate-500">
              These alerts are about funded programme attendance, not job
              attendance. Work attendance starts only after placement.
            </p>
          </div>
          <span className="pill-amber">Training attendance watchlist</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Worker</th>
                <th className="py-2 pr-4">Programme</th>
                <th className="py-2 pr-4">Training Attendance</th>
                <th className="py-2 pr-4">Risk Level</th>
                <th className="py-2 pr-4">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {atRiskTrainingRows.map((row) => (
                <tr key={row.worker}>
                  <td className="py-3 pr-4 font-medium">{row.worker}</td>
                  <td className="py-3 pr-4">{row.programme}</td>
                  <td className="py-3 pr-4 tabular-nums">
                    {row.attendance}%
                  </td>
                  <td className="py-3 pr-4">
                    <span className={riskPillClass(row.riskLevel)}>
                      {row.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{row.intervention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {[
          ["State breakdown", stateOutcomeBreakdown],
          ["Sector breakdown", sectorOutcomeBreakdown],
        ].map(([title, rows]) => (
          <div key={title} className="card p-6">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-slate-500">
              Workers verified, training completed, placements, and 30-day
              retention.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Workers verified</th>
                    <th className="py-2 pr-4">Training completed</th>
                    <th className="py-2 pr-4">Placements</th>
                    <th className="py-2 pr-4">30-day retention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <tr key={row.name}>
                      <td className="py-3 pr-4 font-medium">{row.name}</td>
                      <td className="py-3 pr-4">{row.workersVerified}</td>
                      <td className="py-3 pr-4">{row.trainingCompleted}</td>
                      <td className="py-3 pr-4">{row.placements}</td>
                      <td className="py-3 pr-4">
                        <span className={retentionPillClass(row.retention30Day)}>
                          {row.retention30Day}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Placements by sector</h2>
          <p className="text-sm text-slate-500">
            Where verified hires are landing across the pilot region.
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placementBySector}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="sector" fontSize={12} stroke="#64748b" />
                <YAxis fontSize={12} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="placements" radius={[6, 6, 0, 0]}>
                  {placementBySector.map((_, i) => (
                    <Cell
                      key={i}
                      fill={SECTOR_COLORS[i % SECTOR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold">Worker-job match outcomes</h2>
          <p className="text-sm text-slate-500">
            Pipeline funnel from match to hire.
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={matchOutcomes}
                  dataKey="count"
                  nameKey="bucket"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {matchOutcomes.map((_, i) => (
                    <Cell
                      key={i}
                      fill={SECTOR_COLORS[i % SECTOR_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Training completion trend</h2>
        <p className="text-sm text-slate-500">
          Funded pathway completion rate over the last 6 months.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trainingCompletionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" fontSize={12} stroke="#64748b" />
              <YAxis
                domain={[40, 100]}
                fontSize={12}
                stroke="#64748b"
                unit="%"
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              B40 youth unemployment · pilot vs national baseline
            </h2>
            <p className="text-sm text-slate-500">
              Reported by DOSM for the national rate; EcoPulse pilot rate is
              measured against verified worker registrations in Penang /
              Selangor / Johor.
            </p>
          </div>
          <span className="pill-green">
            −
            {(
              youthUnemploymentTrend[0].ecoPulsePilot -
              youthUnemploymentTrend[youthUnemploymentTrend.length - 1]
                .ecoPulsePilot
            ).toFixed(1)}
            pp in 6 months
          </span>
        </div>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={youthUnemploymentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" fontSize={12} stroke="#64748b" />
              <YAxis
                domain={[5, 13]}
                fontSize={12}
                stroke="#64748b"
                unit="%"
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="national"
                stroke="#94a3b8"
                strokeWidth={3}
                name="National (DOSM)"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="ecoPulsePilot"
                stroke="#10b981"
                strokeWidth={3}
                name="EcoPulse pilot"
                dot={{ r: 4, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              Training pathway ROI · placement & cost per pathway
            </h2>
            <p className="text-sm text-slate-500">
              Which HRD Corp Claimable / TVET pathways are converting levy
              spend into verified placements most efficiently.
            </p>
          </div>
          <span className="pill-amber">HRD Corp ROI feed</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Pathway</th>
                <th className="py-2 pr-4">Enrolments</th>
                <th className="py-2 pr-4">Completed</th>
                <th className="py-2 pr-4">Placed</th>
                <th className="py-2 pr-4">Placement rate</th>
                <th className="py-2 pr-4">Cost / placement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trainingROI.map((r) => {
                const rate = Math.round((r.placed / r.enrolments) * 100);
                return (
                  <tr key={r.pathway}>
                    <td className="py-3 pr-4 font-medium">{r.pathway}</td>
                    <td className="py-3 pr-4">{r.enrolments}</td>
                    <td className="py-3 pr-4">{r.completed}</td>
                    <td className="py-3 pr-4">{r.placed}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          rate >= 70
                            ? "pill-green"
                            : rate >= 55
                            ? "pill-blue"
                            : "pill-amber"
                        }
                      >
                        {rate}%
                      </span>
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      RM {r.costPerPlacement}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">State breakdown · placements & HRD Corp levy utilisation</h2>
            <p className="text-sm text-slate-500">
              Where Malaysia&apos;s training levy is converting into verified
              placements. Higher levy utilisation = more employer-funded
              training claimed for the state.
            </p>
          </div>
          <span className="pill-amber">HRD Corp data feed</span>
        </div>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={placementByState}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="state" fontSize={12} stroke="#64748b" />
              <YAxis fontSize={12} stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="placements"
                fill="#10b981"
                name="Verified placements"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="levyUtilisation"
                fill="#3b82f6"
                name="HRD Corp levy used (%)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Industry demand by sector</h2>
        <p className="text-sm text-slate-500">
          Open verified jobs awaiting matched workers — signals where training
          dollars produce the strongest placement ROI.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Sector</th>
                <th className="py-2 pr-4">Open verified jobs</th>
                <th className="py-2 pr-4">Avg match score</th>
                <th className="py-2 pr-4">30-day retention</th>
                <th className="py-2 pr-4">Training ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["Semiconductors & Electronics", 184, 81, "71%", "High"],
                ["Logistics & E-commerce", 122, 78, "69%", "High"],
                ["F&B / Food Processing", 76, 72, "63%", "Medium"],
                ["Automotive (Proton/Perodua suppliers)", 58, 70, "58%", "Medium"],
                ["Palm Oil & Plantation", 41, 74, "66%", "Medium"],
              ].map((r) => (
                <tr key={r[0]}>
                  <td className="py-3 pr-4 font-medium">{r[0]}</td>
                  <td className="py-3 pr-4">{r[1]}</td>
                  <td className="py-3 pr-4">{r[2]}%</td>
                  <td className="py-3 pr-4">{r[3]}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        r[4] === "High" ? "pill-green" : "pill-amber"
                      }
                    >
                      {r[4]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              Top verified employers · pilot leaderboard
            </h2>
            <p className="text-sm text-slate-500">
              Sdn Bhd companies converting verified hires into 30-day
              retention. Use for HRD Corp recognition and TalentCorp
              co-marketing.
            </p>
          </div>
          <span className="pill-blue">Updated daily</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Employer</th>
                <th className="py-2 pr-4">Verified placements</th>
                <th className="py-2 pr-4">30-day retention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topEmployers.map((e) => (
                <tr key={e.name}>
                  <td className="py-3 pr-4 font-medium">{e.name}</td>
                  <td className="py-3 pr-4">{e.placements}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        e.retention >= 72 ? "pill-green" : "pill-amber"
                      }
                    >
                      {e.retention}%
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
