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
    await new Promise(r => setTimeout(r, 2000));
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

  function resetAnalysis() {
    setStep(1);
    setResults(null);
    setSelectedRisk(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Security Risk Analyzer</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">OWASP Top 10 for Machine Learning & LLM Security</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={resetAnalysis}
            >
              New Analysis
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => alert("Knowledge base coming soon")}
            >
              Knowledge Base
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Input Form */}
          <section className="xl:col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">System Configuration</h2>
              </div>
              <RiskForm inputs={inputs} update={update} analyze={analyze} loading={loading} />
            </div>
          </section>

          {/* Results Section */}
          <section className="xl:col-span-7">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 min-h-[400px] lg:min-h-[500px]">
              {step === 1 && (
                <div className="flex flex-col items-center justify-center h-80 sm:h-96 text-center px-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
                  <p className="text-gray-600 max-w-sm text-sm sm:text-base">Configure your system parameters and click <strong>Run Analysis</strong> to identify potential security risks.</p>
                </div>
              )}

              {step === 2 && results && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Analysis Results</h2>
                    </div>
                    <button 
                      onClick={exportCSV} 
                      className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">Export CSV</span>
                      <span className="sm:hidden">Export</span>
                    </button>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <StatCard label="High Risk" value={results.summary.high} color="red" />
                    <StatCard label="Medium Risk" value={results.summary.medium} color="yellow" />
                    <StatCard label="Low Risk" value={results.summary.low} color="green" />
                  </div>

                  {/* Risk Cards */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 sm:mb-4">Top Risks</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {results.risks.slice(0, 4).map(r => (
                        <RiskCard key={r.id} risk={r} onClick={() => setSelectedRisk(r)} />
                      ))}
                    </div>
                  </div>

                  {/* Risk Table */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 sm:mb-4">All Risks</h3>
                    <RiskTable risks={results.risks} onRowClick={r => setSelectedRisk(r)} />
                  </div>
                </>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-80 sm:h-96">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Security Risks</h3>
                  <p className="text-gray-600 text-sm sm:text-base">This may take a few moments...</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Risk Modal */}
        {selectedRisk && <RiskModal risk={selectedRisk} onClose={() => setSelectedRisk(null)} />}
      </main>
    </div>
  );
}
