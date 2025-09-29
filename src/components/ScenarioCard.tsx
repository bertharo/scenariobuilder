import React from 'react';
import { 
  FileText, 
  Calendar, 
  Tag, 
  MoreVertical, 
  Edit, 
  Copy, 
  Archive, 
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import { Scenario } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ScenarioCardProps {
  scenario: Scenario;
  onEdit: (scenario: Scenario) => void;
  onDuplicate?: (scenario: Scenario) => void;
  onArchive?: (scenario: Scenario) => void;
  onDelete?: (scenario: Scenario) => void;
}

export default function ScenarioCard({ 
  scenario, 
  onEdit, 
  onDuplicate, 
  onArchive, 
  onDelete 
}: ScenarioCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-3 w-3" />;
      case 'draft':
        return <Pause className="h-3 w-3" />;
      case 'archived':
        return <Archive className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getLatestValue = () => {
    if (scenario.variables.length === 0) return null;
    
    const latestVariable = scenario.variables[0];
    if (latestVariable.timeSeries.length === 0) return null;
    
    const latestTimeSeries = latestVariable.timeSeries[latestVariable.timeSeries.length - 1];
    return latestTimeSeries.value;
  };

  const latestValue = getLatestValue();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {scenario.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {scenario.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scenario.status)}`}>
              {getStatusIcon(scenario.status)}
              <span className="ml-1 capitalize">{scenario.status}</span>
            </span>
            
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
                        onEdit(scenario);
                        setShowMenu(false);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-3" />
                      Edit
                    </button>
                    {onDuplicate && (
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          onDuplicate(scenario);
                          setShowMenu(false);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-3" />
                        Duplicate
                      </button>
                    )}
                    {onArchive && (
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          onArchive(scenario);
                          setShowMenu(false);
                        }}
                      >
                        <Archive className="h-4 w-4 mr-3" />
                        Archive
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        onClick={() => {
                          onDelete(scenario);
                          setShowMenu(false);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-3" />
                        Delete
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
              Updated {formatDate(scenario.updatedAt)}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">
                {scenario.variables.length} variables
              </div>
            </div>
          </div>
        </div>

        {latestValue !== null && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-600">Latest Value</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(latestValue)}
            </div>
          </div>
        )}

        {scenario.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {scenario.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
              {scenario.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{scenario.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={() => onEdit(scenario)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Scenario
          </button>
          
          <div className="flex items-center text-sm text-gray-500">
            {scenario.isBaseCase && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Base Case
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
