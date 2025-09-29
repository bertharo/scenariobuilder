import { useState } from 'react';
import { Send, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { AIQueryProcessor, BusinessQuery, QueryResult } from '../services/aiQueryProcessor';
import { Scenario, Variable } from '../types';

interface QueryInterfaceProps {
  variables: Variable[];
  scenarios: Scenario[];
  onScenarioCreated: (scenario: Scenario) => void;
}

export default function QueryInterface({ variables, scenarios, onScenarioCreated }: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  const exampleQueries = [
    "Increase total ARR by $5M",
    "Increase total ARR by $15M; EMEA ≤ $2M",
    "Reduce churn by 2% across all products",
    "Increase revenue by 20% in Q4",
    "Decrease customer acquisition cost by 15%"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const processor = new AIQueryProcessor(variables, scenarios);
      const queryResult = await processor.processQuery(query);
      
      setResult(queryResult);
      
      if (queryResult.success && queryResult.scenario) {
        onScenarioCreated(queryResult.scenario);
        setQueryHistory(prev => [query, ...prev.slice(0, 4)]); // Keep last 5 queries
        setQuery('');
      }
    } catch (error) {
      console.error('Error processing query:', error);
      setResult({
        success: false,
        message: "An error occurred while processing your query.",
        suggestions: ["Please try again or contact support."]
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Scenario Builder</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Describe your business scenario in natural language and I'll create a structured scenario for you.
      </p>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: 'Increase total ARR by $5M' or 'Reduce churn by 2%'"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!query.trim() || isProcessing}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>

      {/* Example Queries */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Try these examples:</h4>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Query History */}
      {queryHistory.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent queries:</h4>
          <div className="space-y-1">
            {queryHistory.map((historyQuery, index) => (
              <button
                key={index}
                onClick={() => setQuery(historyQuery)}
                className="block w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors"
              >
                {historyQuery}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className={`p-4 rounded-lg ${
          result.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </p>
              
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Suggestions:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
