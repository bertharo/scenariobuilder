import { useState } from 'react';
import { 
  Save, 
  Cloud, 
  Download, 
  Upload,
  Database
} from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';

export default function Settings() {
  const { state, syncWithGoogleSheets } = useWorkspace();
  const [googleSheetsConfig, setGoogleSheetsConfig] = useState({
    spreadsheetId: '',
    sheetName: 'Scenarios',
    apiKey: '',
  });
  const [workspaceSettings, setWorkspaceSettings] = useState({
    currency: 'USD',
    timeZone: 'UTC',
    defaultTimeHorizon: 10,
  });

  const { workspace } = state;

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">No workspace found</h3>
        </div>
      </div>
    );
  }

  const handleGoogleSheetsConfigChange = (field: string, value: string) => {
    setGoogleSheetsConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkspaceSettingsChange = (field: string, value: string | number) => {
    setWorkspaceSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveGoogleSheetsConfig = () => {
    // Here you would save the Google Sheets configuration
    console.log('Saving Google Sheets config:', googleSheetsConfig);
  };

  const handleSaveWorkspaceSettings = () => {
    // Here you would save the workspace settings
    console.log('Saving workspace settings:', workspaceSettings);
  };

  const handleSyncWithGoogleSheets = async () => {
    await syncWithGoogleSheets();
  };

  const handleExportData = () => {
    // Here you would export all data
    console.log('Exporting data...');
  };

  const handleImportData = () => {
    // Here you would import data
    console.log('Importing data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Modeling Copilot Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure your modeling environment, integrations, and AI preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Workspace Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Workspace Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Default Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={workspaceSettings.currency}
                  onChange={(e) => handleWorkspaceSettingsChange('currency', e.target.value)}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>

              <div>
                <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">
                  Time Zone
                </label>
                <select
                  id="timeZone"
                  name="timeZone"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={workspaceSettings.timeZone}
                  onChange={(e) => handleWorkspaceSettingsChange('timeZone', e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Chicago">America/Chicago</option>
                  <option value="America/Denver">America/Denver</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>

              <div>
                <label htmlFor="defaultTimeHorizon" className="block text-sm font-medium text-gray-700">
                  Default Time Horizon (years)
                </label>
                <input
                  type="number"
                  name="defaultTimeHorizon"
                  id="defaultTimeHorizon"
                  min="1"
                  max="50"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={workspaceSettings.defaultTimeHorizon}
                  onChange={(e) => handleWorkspaceSettingsChange('defaultTimeHorizon', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleSaveWorkspaceSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </div>

        {/* LRP Copilot Integration */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              LRP Copilot Integration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="lrpScriptUrl" className="block text-sm font-medium text-gray-700">
                  Apps Script URL
                </label>
                <input
                  type="url"
                  name="lrpScriptUrl"
                  id="lrpScriptUrl"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="https://script.google.com/macros/s/..."
                  value={googleSheetsConfig.spreadsheetId}
                  onChange={(e) => handleGoogleSheetsConfigChange('spreadsheetId', e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Your deployed LRP Copilot Apps Script URL
                </p>
              </div>

              <div>
                <label htmlFor="defaultSpreadsheet" className="block text-sm font-medium text-gray-700">
                  Default Spreadsheet ID
                </label>
                <input
                  type="text"
                  name="defaultSpreadsheet"
                  id="defaultSpreadsheet"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k"
                  value={googleSheetsConfig.sheetName}
                  onChange={(e) => handleGoogleSheetsConfigChange('sheetName', e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-500">
                  The default Google Spreadsheet for LRP Copilot operations
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleSaveGoogleSheetsConfig}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save LRP Configuration
              </button>
              
              <button
                type="button"
                onClick={handleSyncWithGoogleSheets}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Cloud className="h-4 w-4 mr-2" />
                Test LRP Connection
              </button>
            </div>
          </div>
        </div>

        {/* AI Configuration */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              AI & Analytics Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700">
                  AI Model
                </label>
                <select
                  id="aiModel"
                  name="aiModel"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="lrp-copilot">LRP Copilot (Built-in)</option>
                  <option value="openai-gpt4">OpenAI GPT-4</option>
                  <option value="anthropic-claude">Anthropic Claude</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Choose the AI model for natural language processing and insights
                </p>
              </div>

              <div>
                <label htmlFor="confidenceThreshold" className="block text-sm font-medium text-gray-700">
                  Confidence Threshold
                </label>
                <input
                  type="range"
                  name="confidenceThreshold"
                  id="confidenceThreshold"
                  min="0.5"
                  max="0.95"
                  step="0.05"
                  className="mt-1 block w-full"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Minimum confidence level for AI-generated insights (0.5 - 0.95)
                </p>
              </div>

              <div className="flex items-center">
                <input
                  id="enableAdvancedAnalytics"
                  name="enableAdvancedAnalytics"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="enableAdvancedAnalytics" className="ml-2 block text-sm text-gray-900">
                  Enable Advanced Analytics
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="enableMonteCarlo"
                  name="enableMonteCarlo"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="enableMonteCarlo" className="ml-2 block text-sm text-gray-900">
                  Enable Monte Carlo Simulations
                </label>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleSaveGoogleSheetsConfig}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save AI Configuration
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Data Management
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Export Data</div>
                    <div className="text-sm text-gray-500">Download all scenarios and variables</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Upload className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Import Data</div>
                    <div className="text-sm text-gray-500">Upload scenarios and variables from file</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleImportData}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Workspace Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-900">Workspace Name</div>
                <div className="text-sm text-gray-500">{workspace.name}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-900">Description</div>
                <div className="text-sm text-gray-500">{workspace.description}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">Scenarios</div>
                  <div className="text-sm text-gray-500">{workspace.scenarios.length}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Variables</div>
                  <div className="text-sm text-gray-500">{workspace.variables.length}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Projections</div>
                  <div className="text-sm text-gray-500">{workspace.projections.length}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Comparisons</div>
                  <div className="text-sm text-gray-500">{workspace.comparisons.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
