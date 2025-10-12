export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-gradient-to-r from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold">AI</div>
        <div>
          <div className="font-semibold">AI Risk Analyzer</div>
          <div className="text-xs text-gray-500">OWASP Top 10 (ML/LLM)</div>
        </div>
      </div>
      <nav className="flex flex-col gap-2 text-sm">
        <a className="px-3 py-2 rounded hover:bg-gray-50">Dashboard</a>
        <a className="px-3 py-2 rounded hover:bg-gray-50">Reports</a>
        <a className="px-3 py-2 rounded hover:bg-gray-50">API / CI-CD</a>
        <a className="px-3 py-2 rounded hover:bg-gray-50">Settings</a>
      </nav>
    </aside>
  );
}
