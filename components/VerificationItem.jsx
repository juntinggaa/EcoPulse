export default function VerificationItem({ label, status }) {
  const map = {
    Verified: "pill-green",
    Completed: "pill-green",
    Pending: "pill-amber",
    No: "pill-slate",
  };
  const cls = map[status] || "pill-slate";
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-700">{label}</span>
      <span className={cls}>{status}</span>
    </div>
  );
}
