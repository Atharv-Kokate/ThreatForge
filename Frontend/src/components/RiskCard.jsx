export default function RiskCard({ risk, onClick }) {
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
    <div
      className={`p-4 rounded-lg border-2 ${styles.bg} ${styles.border} cursor-pointer hover:shadow-md transition-all duration-200 group`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {risk.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{risk.category}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">{styles.icon}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
            {risk.severity}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{Math.round(risk.confidence * 100)}% confidence</span>
        </div>
        <div className="text-blue-600 group-hover:text-blue-700 font-medium">
          View Details →
        </div>
      </div>
    </div>
  );
}
