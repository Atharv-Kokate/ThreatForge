export default function StatCard({ label, value, color }) {
  const getColorStyles = (color) => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-600",
          icon: "🔴",
          gradient: "from-red-500 to-red-600"
        };
      case "yellow":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-600",
          icon: "🟡",
          gradient: "from-yellow-500 to-yellow-600"
        };
      case "green":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-600",
          icon: "🟢",
          gradient: "from-green-500 to-green-600"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-600",
          icon: "⚪",
          gradient: "from-gray-500 to-gray-600"
        };
    }
  };

  const styles = getColorStyles(color);

  return (
    <div className={`p-6 rounded-xl border-2 ${styles.bg} ${styles.border} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{styles.icon}</span>
          <h3 className="text-sm font-medium text-gray-700">{label}</h3>
        </div>
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${styles.gradient}`}></div>
      </div>
      
      <div className="text-center">
        <div className={`text-3xl font-bold ${styles.text} mb-1`}>
          {value}
        </div>
        <div className="text-xs text-gray-500">
          {value === 1 ? 'risk found' : 'risks found'}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Risk Level</span>
          <span>{value > 0 ? 'Active' : 'None'}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${styles.gradient} transition-all duration-500`}
            style={{ width: `${Math.min((value / 5) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
