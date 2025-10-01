import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Globe, 
  Users, 
  Package, 
  FileText, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { GoogleSheetsService } from '../services/googleSheets';
import { API_CONFIG, GOOGLE_SHEETS_CONFIG } from '../config/api';
import { formatCurrency } from '../utils/calculations';

interface ScenarioAnalysisProps {
  query: string;
  onClose: () => void;
}

interface StrategicOption {
  id: string;
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'medium-low' | 'high';
  metrics: {
    presentationRate?: { old: number; new: number };
    winRate?: { old: number; new: number };
    asp?: { old: number; new: number };
  };
  arrChange: number;
  approach: string;
}

interface AnalysisData {
  runId: string;
  arrBefore: number;
  arrAfter: number;
  totalDelta: number;
  prompt: string;
  options: StrategicOption[];
  modelSummary: {
    topGeo: { name: string; value: number };
    topSegment: { name: string; value: number };
    topProduct: { name: string; value: number };
  };
  narrative: string;
  agentTabs: {
    dataOps: any;
    modelOps: any;
    runner: any;
    qa: any;
    constraints: any;
    narrator: any;
    audit: any;
  };
}

export default function ScenarioAnalysis({ query, onClose }: ScenarioAnalysisProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'options' | 'summary' | 'narrative' | 'agents'>('options');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const processQuery = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const googleSheetsService = new GoogleSheetsService(
          GOOGLE_SHEETS_CONFIG,
          API_CONFIG.GOOGLE_APPS_SCRIPT_URL
        );

        const result = await googleSheetsService.processScenarioQuery(query);
        
        if (result.success && result.data) {
          setAnalysisData(result.data);
        } else {
          // Show helpful setup message if Apps Script is not ready
          if (result.error && result.error.includes('Cannot connect to Apps Script')) {
            setError('Apps Script not ready yet. Please check the integration guide to set up your processScenarioQuery function.');
          } else {
            setError(result.error || 'Failed to process query with Apps Script');
          }
        }
      } catch (err) {
        setError(`Error: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    processQuery();
  }, [query]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-center mb-2">Processing Scenario</h3>
          <p className="text-gray-600 text-center">Running your query through the LRP Copilot...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-center mb-2 text-red-600">Error</h3>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={onClose}
            className="btn btn-primary w-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!analysisData) return null;

  const { runId, arrBefore, arrAfter, totalDelta, modelSummary, narrative, agentTabs } = analysisData;
  const deltaPercentage = ((totalDelta / arrBefore) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Scenario Analysis</h2>
            <p className="text-gray-600">Run ID: {runId}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn btn-outline flex items-center"
            >
              {showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
            <button
              onClick={onClose}
              className="btn btn-outline"
            >
              Close
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('options')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'options'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Strategic Options
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'summary'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Summary
          </button>
          <button
            onClick={() => setActiveTab('narrative')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'narrative'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Narrative
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'agents'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Agent Analysis
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'options' && (
            <div className="space-y-6">
              {/* Prompt */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Strategic Options</h3>
                <p className="text-gray-600 mb-4">
                  <strong>Prompt:</strong> {analysisData.prompt}
                </p>
                <p className="text-sm text-gray-500">
                  Choose from the strategic options below to achieve your ARR target of {formatCurrency(analysisData.totalDelta)}.
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisData.options.map((option) => (
                  <div
                    key={option.id}
                    className={`card p-6 cursor-pointer transition-all ${
                      selectedOption === option.id
                        ? 'ring-2 ring-primary-500 bg-primary-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedOption(selectedOption === option.id ? null : option.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{option.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        option.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                        option.riskLevel === 'medium-low' ? 'bg-yellow-100 text-yellow-800' :
                        option.riskLevel === 'medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {option.riskLevel.replace('-', ' ')} risk
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 italic mb-4">{option.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {option.metrics.presentationRate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Presentation Rate:</span>
                          <span className="font-medium">
                            {option.metrics.presentationRate.old}% → {option.metrics.presentationRate.new}%
                          </span>
                        </div>
                      )}
                      {option.metrics.winRate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Win Rate:</span>
                          <span className="font-medium">
                            {option.metrics.winRate.old}% → {option.metrics.winRate.new}%
                          </span>
                        </div>
                      )}
                      {option.metrics.asp && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">ASP:</span>
                          <span className="font-medium">
                            {formatCurrency(option.metrics.asp.old)} → {formatCurrency(option.metrics.asp.new)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        ARR Change: {formatCurrency(option.arrChange)}
                      </span>
                      {selectedOption === option.id && (
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    
                    {selectedOption === option.id && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Approach:</strong> {option.approach}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Selection Actions */}
              {selectedOption && (
                <div className="card p-6 bg-primary-50">
                  <h4 className="text-lg font-semibold text-primary-900 mb-2">Selected Option</h4>
                  <p className="text-primary-700 mb-4">
                    You've selected: <strong>{analysisData.options.find(opt => opt.id === selectedOption)?.title}</strong>
                  </p>
                  <div className="flex gap-3">
                    <button className="btn btn-primary">
                      Implement This Option
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => setActiveTab('summary')}
                    >
                      Save Scenario
                    </button>
                    <button className="btn btn-outline">
                      Export Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Selected Option Indicator */}
              {selectedOption && (
                <div className="card p-4 bg-primary-50 border-l-4 border-primary-500">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                    <div>
                      <h4 className="font-semibold text-primary-900">Selected Strategic Option</h4>
                      <p className="text-sm text-primary-700">
                        {analysisData.options.find(opt => opt.id === selectedOption)?.title}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ARR Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">ARR Before</h3>
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(arrBefore)}</p>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">ARR After</h3>
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(arrAfter)}</p>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Total Delta</h3>
                    {totalDelta >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <p className={`text-3xl font-bold ${totalDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalDelta >= 0 ? '+' : ''}{formatCurrency(totalDelta)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {totalDelta >= 0 ? '+' : ''}{deltaPercentage.toFixed(2)}% change
                  </p>
                </div>
              </div>

              {/* Model Summary */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Largest Changes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Top Geography</h4>
                    <p className="text-2xl font-bold text-blue-600">{modelSummary.topGeo.name}</p>
                    <p className="text-sm text-gray-600">+{formatCurrency(modelSummary.topGeo.value)}</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Top Segment</h4>
                    <p className="text-2xl font-bold text-green-600">{modelSummary.topSegment.name}</p>
                    <p className="text-sm text-gray-600">+{formatCurrency(modelSummary.topSegment.value)}</p>
                  </div>
                  <div className="text-center">
                    <Package className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Top Product</h4>
                    <p className="text-2xl font-bold text-purple-600">{modelSummary.topProduct.name}</p>
                    <p className="text-sm text-gray-600">+{formatCurrency(modelSummary.topProduct.value)}</p>
                  </div>
                </div>
              </div>

              {showDetails && (
                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Query Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 font-medium">Original Query:</p>
                    <p className="text-gray-900 mt-1">"{query}"</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'narrative' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysis Narrative</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {narrative}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(agentTabs).map(([agentName, agentData]) => (
                  <div key={agentName} className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                      {agentName.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {showDetails ? (
                        <pre className="whitespace-pre-wrap text-xs">
                          {JSON.stringify(agentData, null, 2)}
                        </pre>
                      ) : (
                        <p>Agent analysis completed successfully</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Generated by LRP Copilot • Run ID: {runId}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setActiveTab('summary')}
            >
              Save Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
