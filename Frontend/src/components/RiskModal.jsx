export default function RiskModal({ risk, onClose }) {
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "High":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          badge: "bg-red-100 text-red-800",
          icon: "🔴"
        };
      case "Medium":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-800",
          badge: "bg-yellow-100 text-yellow-800",
          icon: "🟡"
        };
      default:
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800",
          badge: "bg-green-100 text-green-800",
          icon: "🟢"
        };
    }
  };

  const styles = getSeverityStyles(risk.severity);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`${styles.bg} ${styles.border} border-b-2 p-6`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{styles.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{risk.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                    {risk.severity} Risk
                  </span>
                  <span className="text-sm text-gray-600">{risk.category}</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(risk.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              onClick={onClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Risk Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{risk.description}</p>
          </div>

          {/* Mitigation */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recommended Mitigation
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{risk.mitigation}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Risk Category</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {risk.category}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Confidence Level</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${risk.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(risk.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              // Here you could add functionality to create a task or reminder
              alert('Task creation feature coming soon!');
            }}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
