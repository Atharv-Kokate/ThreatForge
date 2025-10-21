export default function RiskModal({ risk, onClose }) {
  return (
    <div className="fixed right-6 bottom-6 bg-white border rounded-lg shadow-lg w-[420px] p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{risk.name}</h3>
          <p className="text-xs text-gray-500">{risk.category} • Confidence {Math.round(risk.confidence * 100)}%</p>
        </div>
        <button className="text-gray-500" onClick={onClose}>✕</button>
      </div>
      <hr className="my-3" />
      <p className="text-sm text-gray-700 mb-3">{risk.description}</p>
      <h4 className="font-medium text-sm mb-1">Suggested Mitigation</h4>
      <p className="text-sm text-gray-700">{risk.mitigation}</p>
    </div>
  );
}
