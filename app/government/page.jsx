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
  workerPipeline,
  placementEconomics,
  trainingROI,
  youthUnemploymentTrend,
  topEmployers,
} from "@/lib/mockData";
import StatCard from "@/components/StatCard";

const SECTOR_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function GovernmentDashboard() {
  const m = governmentMetrics;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="pill-amber">Government Dashboard · MOHR / HRD Corp view</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Track B40 youth employment outcomes in real time
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-2xl">
            Aggregated view of verified B40 workers, HRD Corp training
            enrolments, MyFutureJobs placements, and 30-day retention across
            Malaysia&apos;s pilot states.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="pill-slate">Pilot: Penang · Selangor · Johor</span>
          <span className="pill-green">Live demo data</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="B40 verified workers"
          value={m.verifiedWorkers.toLocaleString()}
          sub="MyKad + skill profile"
          accent="brand"
        />
        <StatCard
          label="Verified Sdn Bhd employers"
          value={m.verifiedEmployers}
          sub="SSM licence + payment"
          accent="blue"
        />
        <StatCard
          label="HRD Corp enrolments"
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
          label="Verified placements"
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
          label="Youth employment MoM"
          value={`+${m.youthEmploymentMoM}%`}
          sub="Month-on-month, B40 cohort"
          accent="amber"
        />
        <StatCard
          label="Avg time-to-hire"
          value="9 days"
          sub="Verified profile → placement"
          accent="slate"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Worker journey funnel</h2>
          <p className="text-sm text-slate-500">
            From registration to 30-day retention — every drop-off tells HRD
            Corp and MOHR where to intervene.
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={workerPipeline}
                layout="vertical"
                margin={{ left: 20, right: 30 }}
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
                  {workerPipeline.map((_, i) => (
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
            Conversion: {Math.round((workerPipeline[6].count / workerPipeline[0].count) * 100)}% of
            registered workers retained at 30 days · sharpest drop is{" "}
            <strong>Skill-profiled → Trained</strong> (training capacity is the
            current bottleneck).
          </div>
        </div>

        <div className="card p-6 flex flex-col">
          <h2 className="text-lg font-semibold">Cost per placement</h2>
          <p className="text-sm text-slate-500">
            EcoPulse vs traditional blue-collar recruiter / agency channels.
          </p>
          <div className="mt-5 rounded-2xl bg-slate-900 text-slate-50 p-5">
            <div className="text-xs uppercase tracking-wider text-slate-300">
              EcoPulse
            </div>
            <div className="mt-1 text-4xl font-bold tabular-nums">
              RM {placementEconomics.ecoPulseCostPerPlacement}
            </div>
            <div className="mt-1 text-xs text-slate-300">
              per verified placement
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-slate-100 p-4">
            <div className="text-xs uppercase tracking-wider text-slate-500">
              Traditional agency
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-700">
              RM {placementEconomics.traditionalAgencyCost.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              per blue-collar hire (industry baseline)
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-emerald-50 p-3">
              <div className="text-emerald-700 font-semibold">
                {Math.round(
                  (1 -
                    placementEconomics.ecoPulseCostPerPlacement /
                      placementEconomics.traditionalAgencyCost) *
                    100
                )}
                % cheaper
              </div>
              <div className="text-emerald-700/80">than agencies</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <div className="text-blue-700 font-semibold">
                +{placementEconomics.retentionUpliftPP} pp
              </div>
              <div className="text-blue-700/80">retention uplift</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            HRD Corp levy claimable: RM{" "}
            {placementEconomics.hrdCorpLevyClaimable} avg per trained
            placement — employer net cost approaches zero.
          </div>
        </div>
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
