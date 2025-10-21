export default function RiskForm({ inputs, update, analyze, loading }) {
  return (
    <div>
      {Object.keys(inputs).map(key => (
        <div key={key} className="mb-4">
          <label className="text-sm font-medium capitalize">{key}</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            value={inputs[key]}
            onChange={e => update(key, e.target.value)}
          />
        </div>
      ))}
      <button
        className="px-4 py-2 bg-green-600 text-white rounded shadow w-full"
        onClick={analyze}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Run Analysis"}
      </button>
    </div>
  );
}
