import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import RiskForm from "../components/RiskForm";
import StatCard from "../components/StatCard";
import RiskCard from "../components/RiskCard";
import RiskTable from "../components/RiskTable";
import RiskModal from "../components/RiskModal";
import mockResults from "../data/mockResults";

export default function Dashboard() {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState({
    modelType: "LLM Agent",
    dataSource: "Private",
    deployment: "Cloud",
    exposure: "Public API",
    auth: "OAuth2",
    monitoring: "Basic",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);

  function update(field, value) {
    setInputs(prev => ({ ...prev, [field]: value }));
  }

  async function analyze() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setResults(mockResults);
    setLoading(false);
    setStep(2);
  }

  function exportCSV() {
    if (!results) return;
    const rows = [
      ["Risk", "Category", "Severity", "Confidence", "Mitigation"],
      ...results.risks.map(r => [r.name, r.category, r.severity, r.confidence, r.mitigation]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AI_Risk_Report.csv";
    a.click();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-800">
      <Sidebar />
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">AI Security Risk Analyzer</h1>
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-2 bg-white border rounded shadow-sm text-sm"
              onClick={() => {
                setStep(1);
                setResults(null);
              }}
            >
              New Analysis
            </button>
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded shadow-sm text-sm"
              onClick={() => alert("Knowledge base coming soon")}
            >
              Knowledge Base
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-5">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-medium mb-3">System Input</h2>
              <RiskForm inputs={inputs} update={update} analyze={analyze} loading={loading} />
            </div>
          </section>

          <section className="col-span-7">
            <div className="bg-white p-4 rounded-lg shadow min-h-[300px]">
              {step === 1 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <p>Fill the form and click <strong>Run Analysis</strong> to see results.</p>
                </div>
              )}
              {step === 2 && results && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Analysis Results</h2>
                    <button onClick={exportCSV} className="px-3 py-2 border rounded">Export CSV</button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCard label="High" value={results.summary.high} color="red" />
                    <StatCard label="Medium" value={results.summary.medium} color="yellow" />
                    <StatCard label="Low" value={results.summary.low} color="green" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {results.risks.slice(0, 4).map(r => (
                      <RiskCard key={r.id} risk={r} onClick={() => setSelectedRisk(r)} />
                    ))}
                  </div>
                  <div className="mt-6">
                    <RiskTable risks={results.risks} onRowClick={r => setSelectedRisk(r)} />
                  </div>
                </>
              )}
              {loading && (
                <div className="flex items-center justify-center h-52">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>
          </section>
        </div>
        {selectedRisk && <RiskModal risk={selectedRisk} onClose={() => setSelectedRisk(null)} />}
      </main>
    </div>
  );
}
