export default function RiskTable({ risks, onRowClick }) {
  return (
    <div className="bg-white p-3 rounded border">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th className="py-2">Risk</th>
            <th>Category</th>
            <th>Severity</th>
            <th>Confidence</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {risks.map(r => (
            <tr key={r.id} className="border-t">
              <td className="py-2">{r.name}</td>
              <td>{r.category}</td>
              <td>{r.severity}</td>
              <td>{Math.round(r.confidence * 100)}%</td>
              <td>
                <button className="px-2 py-1 border rounded text-xs" onClick={() => onRowClick(r)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
