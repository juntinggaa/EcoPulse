export default function ScoreBar({ score }) {
  const v = Math.max(0, Math.min(100, score || 0));
  const color =
    v >= 85
      ? "bg-emerald-500"
      : v >= 70
      ? "bg-blue-500"
      : v >= 55
      ? "bg-amber-500"
      : "bg-rose-500";
  return (
    <div className="flex items-center gap-3 min-w-[160px]">
      <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${v}%` }}
        />
      </div>
      <span className="tabular-nums text-sm font-semibold">{v}%</span>
    </div>
  );
}
