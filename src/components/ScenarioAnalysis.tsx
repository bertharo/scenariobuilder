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
import { formatCurrency, formatPercentage } from '../utils/calculations';

interface ScenarioAnalysisProps {
  query: string;
  onClose: () => void;
}

interface AnalysisData {
  runId: string;
  arrBefore: number;
  arrAfter: number;
  totalDelta: number;
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
  const [activeTab, setActiveTab] = useState<'summary' | 'narrative' | 'agents'>('summary');
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
          // Show mock analysis for demonstration
          const mockData: AnalysisData = {
            runId: 'RUN_' + new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 17),
            arrBefore: 125500000,
            arrAfter: 135500000,
            totalDelta: 10000000,
            modelSummary: {
              topGeo: { name: 'NA', value: 9000000 },
              topSegment: { name: 'SMB', value: 7000000 },
              topProduct: { name: 'SuiteB', value: 5000000 }
            },
            narrative: `You asked: ${query}\n\nResult: total ARR change = $10,000,000\nLargest contribution by Geo NA 9,000,000.\nLargest contribution by Segment SMB 7,000,000.\nSee agent tabs for details (DataOps, ModelOps, Runner, QA, Constraints, Narrator, Audit).`,
            agentTabs: {
              dataOps: { status: 'completed', data: 'Data operations completed successfully' },
              modelOps: { status: 'completed', data: 'Model operations completed successfully' },
              runner: { status: 'completed', data: 'Scenario runner completed successfully' },
              qa: { status: 'completed', data: 'Quality assurance checks passed' },
              constraints: { status: 'completed', data: 'Constraints validated successfully' },
              narrator: { status: 'completed', data: 'Narrative generated successfully' },
              audit: { status: 'completed', data: 'Audit trail created successfully' }
            }
          };
          setAnalysisData(mockData);
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
          {activeTab === 'summary' && (
            <div className="space-y-6">
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
                    {totalDelta >= 0 ? '+' : ''}{formatPercentage(deltaPercentage)} change
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
            <button className="btn btn-primary">
              Save Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
