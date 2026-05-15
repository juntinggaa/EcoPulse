export default function StatCard({ label, value, sub, accent = "brand" }) {
  const accents = {
    brand: "text-brand-700 bg-brand-50",
    blue: "text-blue-700 bg-blue-50",
    amber: "text-amber-700 bg-amber-50",
    slate: "text-slate-700 bg-slate-100",
  };
  return (
    <div className="card p-5">
      <div className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${accents[accent]}`}>
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-sm text-slate-500">{sub}</div>}
    </div>
  );
}
