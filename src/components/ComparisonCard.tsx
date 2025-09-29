import React from 'react';
import { 
  GitCompare, 
  MoreVertical, 
  Edit, 
  BarChart3, 
  Calendar,
  Download
} from 'lucide-react';
import { Comparison, Scenario, Variable } from '../types';

interface ComparisonCardProps {
  comparison: Comparison;
  scenarios: Scenario[];
  variables: Variable[];
  onEdit: (comparison: Comparison) => void;
  onView?: (comparison: Comparison) => void;
  onExport?: (comparison: Comparison) => void;
}

export default function ComparisonCard({ 
  comparison, 
  scenarios,
  variables,
  onEdit, 
  onView,
  onExport
}: ComparisonCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getScenarioNames = () => {
    return comparison.scenarios
      .map(scenarioId => scenarios.find(s => s.id === scenarioId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getVariableNames = () => {
    return comparison.metrics
      .map(variableId => variables.find(v => v.id === variableId)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <GitCompare className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {comparison.name}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                type="button"
                className="bg-white rounded-full p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              
              {showMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        onEdit(comparison);
                        setShowMenu(false);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-3" />
                      Edit
                    </button>
                    {onView && (
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          onView(comparison);
                          setShowMenu(false);
                        }}
                      >
                        <BarChart3 className="h-4 w-4 mr-3" />
                        View Analysis
                      </button>
                    )}
                    {onExport && (
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          onExport(comparison);
                          setShowMenu(false);
                        }}
                      >
                        <Download className="h-4 w-4 mr-3" />
                        Export
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Updated {formatDate(comparison.updatedAt)}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">
                {comparison.scenarios.length} scenarios
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <div className="text-sm text-gray-600">Scenarios</div>
            <div className="text-sm font-medium text-gray-900 truncate">
              {getScenarioNames()}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Metrics</div>
            <div className="text-sm font-medium text-gray-900 truncate">
              {getVariableNames()}
              {comparison.metrics.length > 3 && ` +${comparison.metrics.length - 3} more`}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={() => onEdit(comparison)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Comparison
          </button>
          
          <div className="flex space-x-2">
            {onView && (
              <button
                type="button"
                onClick={() => onView(comparison)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View
              </button>
            )}
            {onExport && (
              <button
                type="button"
                onClick={() => onExport(comparison)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
