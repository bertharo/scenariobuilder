import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  TrendingUp, 
  FileText, 
  Database, 
  GitCompare,
  BarChart3,
  Download,
  Upload
} from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { formatCurrency, formatPercentage } from '../utils/calculations';

export default function Dashboard() {
  const { state } = useWorkspace();
  const { workspace } = state;

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">No workspace found</h3>
          <p className="text-gray-500">Create a new workspace to get started</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Scenarios',
      value: workspace.scenarios.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Variables',
      value: workspace.variables.length,
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Projections',
      value: workspace.projections.length,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Comparisons',
      value: workspace.comparisons.length,
      icon: GitCompare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentScenarios = workspace.scenarios
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const quickActions = [
    {
      name: 'Create Scenario',
      description: 'Build a new scenario with variables and assumptions',
      href: '/scenarios',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Add Variable',
      description: 'Define a new variable for your scenarios',
      href: '/variables',
      icon: Database,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      name: 'Create Projection',
      description: 'Generate projections from your scenarios',
      href: '/projections',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      name: 'Compare Scenarios',
      description: 'Analyze differences between scenarios',
      href: '/comparisons',
      icon: GitCompare,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {workspace.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{workspace.description}</p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Scenarios */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Scenarios</h3>
            <div className="mt-5">
              {recentScenarios.length > 0 ? (
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {recentScenarios.map((scenario) => (
                      <li key={scenario.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-primary-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {scenario.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {scenario.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              scenario.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : scenario.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {scenario.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No scenarios</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new scenario.</p>
                  <div className="mt-6">
                    <Link
                      to="/scenarios"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Scenario
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.href}
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <div className="flex-shrink-0">
                      <action.icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">{action.name}</p>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
