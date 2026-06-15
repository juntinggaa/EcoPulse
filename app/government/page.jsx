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
  LabelList,
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
  malaysiaTrainingHeatmap,
} from "@/lib/mockData";
import StatCard from "@/components/StatCard";

const SECTOR_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
const TRAFFIC_LIGHT = {
  low: {
    color: "#ef4444",
    text: "#7f1d1d",
    pill: "pill-red",
    label: "Needs attention",
  },
  medium: {
    color: "#f59e0b",
    text: "#78350f",
    pill: "pill-amber",
    label: "Moderate",
  },
  high: {
    color: "#10b981",
    text: "#064e3b",
    pill: "pill-green",
    label: "Strong",
  },
  neutral: {
    color: "#64748b",
    text: "#334155",
    pill: "pill-slate",
    label: "Baseline",
  },
};

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

const FUNNEL_STAGE_STATUS = {
  "Verified workers": {
    level: "neutral",
    label: "Baseline verified pool",
  },
  "Training enrolled": {
    level: "low",
    label: "Needs enrolment growth",
  },
  "Training completed": {
    level: "high",
    label: "Strong completion",
  },
  "Job matched": {
    level: "medium",
    label: "Matching pipeline",
  },
  "Job placed": {
    level: "high",
    label: "Strong placement",
  },
  "30-day retained": {
    level: "medium",
    label: "Watch retention",
  },
};

const MALAYSIA_MAP_SHAPES = [
  {
    state: "Perlis",
    code: "PLS",
    d: "M140 36 L180 44 L172 76 L132 70 L124 50 Z",
    labelX: 149,
    labelY: 60,
  },
  {
    state: "Kedah",
    code: "KDH",
    d: "M130 72 L185 78 L178 132 L120 134 L112 98 Z",
    labelX: 147,
    labelY: 110,
  },
  { state: "Penang", code: "PNG", circle: [103, 124, 15], labelX: 103, labelY: 128 },
  {
    state: "Perak",
    code: "PRK",
    d: "M125 136 L188 136 L198 220 L156 250 L112 212 Z",
    labelX: 154,
    labelY: 197,
  },
  {
    state: "Kelantan",
    code: "KTN",
    d: "M195 72 L260 90 L260 145 L220 160 L178 132 L185 80 Z",
    labelX: 223,
    labelY: 120,
  },
  {
    state: "Terengganu",
    code: "TRG",
    d: "M260 146 L294 175 L278 250 L230 228 L220 162 Z",
    labelX: 260,
    labelY: 206,
  },
  {
    state: "Pahang",
    code: "PHG",
    d: "M198 222 L278 252 L290 310 L224 335 L165 292 L156 250 Z",
    labelX: 226,
    labelY: 288,
  },
  {
    state: "Selangor",
    code: "SGR",
    d: "M112 220 L157 252 L163 290 L118 300 L92 270 Z",
    labelX: 126,
    labelY: 266,
  },
  { state: "Kuala Lumpur", code: "KL", circle: [139, 265, 9], labelX: 139, labelY: 268 },
  { state: "Putrajaya", code: "PJ", circle: [150, 287, 7], labelX: 150, labelY: 290 },
  {
    state: "Negeri Sembilan",
    code: "NS",
    d: "M118 303 L165 294 L210 335 L178 365 L124 345 Z",
    labelX: 160,
    labelY: 334,
  },
  {
    state: "Melaka",
    code: "MLK",
    d: "M132 350 L178 370 L166 395 L126 378 Z",
    labelX: 151,
    labelY: 374,
  },
  {
    state: "Johor",
    code: "JHR",
    d: "M180 366 L230 340 L296 382 L266 430 L206 430 L166 396 Z",
    labelX: 230,
    labelY: 397,
  },
  {
    state: "Sarawak",
    code: "SWK",
    d: "M470 305 C530 275 620 260 715 284 L795 322 L752 380 L640 392 L528 365 Z",
    labelX: 630,
    labelY: 335,
  },
  {
    state: "Sabah",
    code: "SBH",
    d: "M765 205 L842 180 L918 205 L938 255 L890 300 L812 292 L760 250 Z",
    labelX: 850,
    labelY: 244,
  },
  { state: "Labuan", code: "LBN", circle: [780, 252, 8], labelX: 780, labelY: 255 },
];

function trafficLevelForTraining(value, max) {
  const ratio = max ? value / max : 0;
  if (ratio >= 0.65) return "high";
  if (ratio >= 0.35) return "medium";
  return "low";
}

function heatColor(value, max) {
  return TRAFFIC_LIGHT[trafficLevelForTraining(value, max)].color;
}

function heatTextColor(value, max) {
  return trafficLevelForTraining(value, max) === "high" ? "#ffffff" : "#111827";
}

function MalaysiaTrainingMap({ data }) {
  const dataByState = Object.fromEntries(data.map((row) => [row.state, row]));
  const maxCompleted = Math.max(...data.map((row) => row.trainingCompleted));
  const topStates = [...data]
    .sort((a, b) => b.trainingCompleted - a.trainingCompleted)
    .slice(0, 5);

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Malaysia training completion heatmap
          </h2>
          <p className="text-sm text-slate-500">
            Traffic-light view of funded training completion by state or
            federal territory: red needs attention, amber is moderate, green is
            strong.
          </p>
        </div>
        <span className="pill-green">Training completion by region</span>
      </div>

      <div className="mt-5 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-slate-50 p-4">
          <svg
            viewBox="0 0 980 470"
            role="img"
            aria-label="Malaysia heatmap showing training completions by state"
            className="h-[360px] w-full"
          >
            <rect width="980" height="470" rx="24" fill="#f8fafc" />
            <text x="88" y="34" fill="#64748b" fontSize="13" fontWeight="600">
              Peninsular Malaysia
            </text>
            <text x="620" y="204" fill="#64748b" fontSize="13" fontWeight="600">
              Sabah & Sarawak
            </text>

            {MALAYSIA_MAP_SHAPES.map((shape) => {
              const row = dataByState[shape.state];
              const value = row?.trainingCompleted ?? 0;
              const fill = heatColor(value, maxCompleted);
              const labelColor = heatTextColor(value, maxCompleted);
              const level = trafficLevelForTraining(value, maxCompleted);
              const title = `${shape.state}: ${value} training completed · ${TRAFFIC_LIGHT[level].label}`;

              return (
                <g key={shape.state}>
                  <title>{title}</title>
                  {shape.circle ? (
                    <circle
                      cx={shape.circle[0]}
                      cy={shape.circle[1]}
                      r={shape.circle[2]}
                      fill={fill}
                      stroke="#ffffff"
                      strokeWidth="3"
                    />
                  ) : (
                    <path
                      d={shape.d}
                      fill={fill}
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                  )}
                  <text
                    x={shape.labelX}
                    y={shape.labelY}
                    textAnchor="middle"
                    fill={labelColor}
                    fontSize={shape.code.length > 2 ? "12" : "13"}
                    fontWeight="700"
                  >
                    {shape.code}
                  </text>
                  <text
                    x={shape.labelX}
                    y={shape.labelY + 14}
                    textAnchor="middle"
                    fill={labelColor}
                    fontSize="11"
                    fontWeight="700"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            <g transform="translate(600 404)">
              <text x="0" y="-16" fill="#334155" fontSize="13" fontWeight="700">
                Completion status
              </text>
              {[
                ["Needs attention", TRAFFIC_LIGHT.low.color],
                ["Moderate", TRAFFIC_LIGHT.medium.color],
                ["Strong", TRAFFIC_LIGHT.high.color],
              ].map(([label, color], index) => (
                <g key={label} transform={`translate(${index * 118} 0)`}>
                  <rect
                    x="0"
                    y="0"
                    width="18"
                    height="18"
                    rx="4"
                    fill={color}
                  />
                  <text x="24" y="14" fill="#475569" fontSize="12" fontWeight="600">
                    {label}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        <div className="rounded-xl border border-slate-100 p-4">
          <div className="text-sm font-semibold text-slate-800">
            Highest training completion
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {topStates.map((row, index) => (
              <div
                key={row.state}
                className="flex items-center justify-between gap-3 py-2"
              >
                <div>
                  <div className="text-sm font-medium">{row.state}</div>
                  <div className="text-xs text-slate-500">
                    {row.placements} placements · {row.retention30Day}% 30-day retention
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      TRAFFIC_LIGHT[
                        trafficLevelForTraining(row.trainingCompleted, maxCompleted)
                      ].pill
                    }
                  >
                    {
                      TRAFFIC_LIGHT[
                        trafficLevelForTraining(row.trainingCompleted, maxCompleted)
                      ].label
                    }
                  </span>
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: heatColor(
                        row.trainingCompleted,
                        maxCompleted
                      ),
                    }}
                  />
                  <span className={index < 2 ? "pill-green" : "pill-slate"}>
                    {row.trainingCompleted} completed
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
            Government can use this view to see where funded training is
            converting into completion, then compare it with placement and
            retention signals.
          </div>
        </div>
      </div>
    </div>
  );
}

function funnelRowsWithStatus(rows) {
  return rows.map((row) => {
    const meta = FUNNEL_STAGE_STATUS[row.stage] || {
      level: "neutral",
      label: "Track",
    };
    return {
      ...row,
      ...meta,
      fill: TRAFFIC_LIGHT[meta.level].color,
      chartLabel: `${row.count.toLocaleString()} · ${meta.label}`,
    };
  });
}

export default function GovernmentDashboard() {
  const m = governmentMetrics;
  const funnelRows = funnelRowsWithStatus(trainingToPlacementFunnel);
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

      <MalaysiaTrainingMap data={malaysiaTrainingHeatmap} />

      <div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Training-to-Placement Funnel</h2>
          <p className="text-sm text-slate-500">
            Matched workers move through funded training, training attendance,
            completion, job placement, work attendance, and 30-day retention.
            Traffic-light labels show where government should intervene.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="pill-red">Red = needs attention</span>
            <span className="pill-amber">Amber = watch / moderate</span>
            <span className="pill-green">Green = strong outcome</span>
            <span className="pill-slate">Grey = baseline</span>
          </div>
          <div className="mt-4 h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelRows}
                layout="vertical"
                margin={{ left: 40, right: 210 }}
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
                  {funnelRows.map((row) => (
                    <Cell key={row.stage} fill={row.fill} />
                  ))}
                  <LabelList
                    dataKey="chartLabel"
                    position="right"
                    fill="#334155"
                    fontSize={12}
                    fontWeight={700}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {funnelRows.map((row) => (
              <div
                key={row.stage}
                className="rounded-lg border border-slate-100 bg-slate-50/60 p-3"
              >
                <div className="font-semibold text-slate-800">{row.stage}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={TRAFFIC_LIGHT[row.level].pill}>
                    {row.label}
                  </span>
                  <span className="text-slate-500">
                    {row.count.toLocaleString()} people
                  </span>
                </div>
              </div>
            ))}
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
