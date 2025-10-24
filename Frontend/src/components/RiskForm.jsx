export default function RiskForm({ inputs, update, analyze, loading }) {
  const formFields = [
    {
      key: 'modelType',
      label: 'Model Type',
      type: 'select',
      options: ['LLM Agent', 'Fine-tuned Model', 'Pre-trained Model', 'Custom Model'],
      description: 'Type of AI model being used'
    },
    {
      key: 'dataSource',
      label: 'Data Source',
      type: 'select',
      options: ['Private', 'Public', 'Mixed', 'Synthetic'],
      description: 'Source of training data'
    },
    {
      key: 'deployment',
      label: 'Deployment Environment',
      type: 'select',
      options: ['Cloud', 'On-premise', 'Edge', 'Hybrid'],
      description: 'Where the model is deployed'
    },
    {
      key: 'exposure',
      label: 'API Exposure',
      type: 'select',
      options: ['Public API', 'Internal API', 'No API', 'REST API'],
      description: 'How the model is exposed to users'
    },
    {
      key: 'auth',
      label: 'Authentication',
      type: 'select',
      options: ['OAuth2', 'API Key', 'JWT', 'None', 'Multi-factor'],
      description: 'Authentication method used'
    },
    {
      key: 'monitoring',
      label: 'Monitoring Level',
      type: 'select',
      options: ['Basic', 'Advanced', 'Real-time', 'None'],
      description: 'Level of monitoring and logging'
    }
  ];

  return (
    <div className="space-y-6">
      {formFields.map(field => (
        <div key={field.key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={inputs[field.key]}
            onChange={e => update(field.key, e.target.value)}
          >
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500">{field.description}</p>
        </div>
      ))}
      
      <div className="pt-4">
        <button
          className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
          } text-white flex items-center justify-center gap-2`}
          onClick={analyze}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run Security Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
}
