import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Cloud, 
  Download, 
  Upload,
  Database,
  Globe,
  DollarSign,
  Clock
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
            Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your workspace and integration settings
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

        {/* Google Sheets Integration */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Google Sheets Integration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="spreadsheetId" className="block text-sm font-medium text-gray-700">
                  Spreadsheet ID
                </label>
                <input
                  type="text"
                  name="spreadsheetId"
                  id="spreadsheetId"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  value={googleSheetsConfig.spreadsheetId}
                  onChange={(e) => handleGoogleSheetsConfigChange('spreadsheetId', e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-500">
                  The ID of your Google Spreadsheet (found in the URL)
                </p>
              </div>

              <div>
                <label htmlFor="sheetName" className="block text-sm font-medium text-gray-700">
                  Sheet Name
                </label>
                <input
                  type="text"
                  name="sheetName"
                  id="sheetName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={googleSheetsConfig.sheetName}
                  onChange={(e) => handleGoogleSheetsConfigChange('sheetName', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  API Key
                </label>
                <input
                  type="password"
                  name="apiKey"
                  id="apiKey"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Your Google Sheets API key"
                  value={googleSheetsConfig.apiKey}
                  onChange={(e) => handleGoogleSheetsConfigChange('apiKey', e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Your Google Sheets API key for authentication
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
                Save Configuration
              </button>
              
              <button
                type="button"
                onClick={handleSyncWithGoogleSheets}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Cloud className="h-4 w-4 mr-2" />
                Sync with Google Sheets
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
