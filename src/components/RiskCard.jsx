export default function RiskCard({ risk, onClick }) {
  const color =
    risk.severity === "High"
      ? "border-red-400"
      : risk.severity === "Medium"
      ? "border-yellow-400"
      : "border-green-400";
  return (
    <div
      className={`p-3 rounded border ${color} cursor-pointer hover:bg-gray-50`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{risk.name}</div>
          <div className="text-xs text-gray-500">{risk.category}</div>
        </div>
        <div className="text-sm">{risk.severity}</div>
      </div>
    </div>
  );
}
