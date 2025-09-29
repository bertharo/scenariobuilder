import React from 'react';
import { 
  TrendingUp, 
  MoreVertical, 
  Edit, 
  BarChart3, 
  Calendar,
  Play,
  Download
} from 'lucide-react';
import { Projection, Scenario, Variable } from '../types';

interface ProjectionCardProps {
  projection: Projection;
  scenarios: Scenario[];
  variables: Variable[];
  onEdit: (projection: Projection) => void;
  onRun?: (projection: Projection) => void;
  onExport?: (projection: Projection) => void;
}

export default function ProjectionCard({ 
  projection, 
  scenarios,
  variables,
  onEdit, 
  onRun,
  onExport
}: ProjectionCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getScenarioNames = () => {
    return projection.scenarios
      .map(scenarioId => scenarios.find(s => s.id === scenarioId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getVariableNames = () => {
    return projection.metrics
      .map(variableId => variables.find(v => v.id === variableId)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');
  };

  const timeHorizonYears = projection.timeHorizon.endYear - projection.timeHorizon.startYear + 1;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {projection.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {projection.description}
              </p>
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
                        onEdit(projection);
                        setShowMenu(false);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-3" />
                      Edit
                    </button>
                    {onRun && (
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          onRun(projection);
                          setShowMenu(false);
                        }}
                      >
                        <Play className="h-4 w-4 mr-3" />
                        Run Projection
                      </button>
                    )}
                    {onExport && (
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          onExport(projection);
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
              Updated {formatDate(projection.updatedAt)}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">
                {timeHorizonYears} years
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
              {projection.metrics.length > 3 && ` +${projection.metrics.length - 3} more`}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Time Horizon
            </div>
            <div className="text-sm font-medium text-gray-900">
              {projection.timeHorizon.startYear} - {projection.timeHorizon.endYear}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={() => onEdit(projection)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Projection
          </button>
          
          <div className="flex space-x-2">
            {onRun && (
              <button
                type="button"
                onClick={() => onRun(projection)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Play className="h-4 w-4 mr-2" />
                Run
              </button>
            )}
            {onExport && (
              <button
                type="button"
                onClick={() => onExport(projection)}
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
