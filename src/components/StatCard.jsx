export default function StatCard({ label, value }) {
  return (
    <div className="p-3 rounded border text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
