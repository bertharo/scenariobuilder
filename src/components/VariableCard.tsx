import React from 'react';
import { 
  Database, 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2,
  TrendingUp,
  DollarSign,
  Percent,
  ToggleLeft,
  Type
} from 'lucide-react';
import { Variable } from '../types';

interface VariableCardProps {
  variable: Variable;
  onEdit: (variable: Variable) => void;
  onDuplicate?: (variable: Variable) => void;
  onDelete?: (variable: Variable) => void;
}

export default function VariableCard({ 
  variable, 
  onEdit, 
  onDuplicate, 
  onDelete 
}: VariableCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'currency':
        return <DollarSign className="h-4 w-4" />;
      case 'percentage':
        return <Percent className="h-4 w-4" />;
      case 'boolean':
        return <ToggleLeft className="h-4 w-4" />;
      case 'text':
        return <Type className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'currency':
        return 'text-green-600 bg-green-100';
      case 'percentage':
        return 'text-blue-600 bg-blue-100';
      case 'boolean':
        return 'text-purple-600 bg-purple-100';
      case 'text':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Database className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {variable.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {variable.description || 'No description'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(variable.type)}`}>
              {getTypeIcon(variable.type)}
              <span className="ml-1 capitalize">{variable.type}</span>
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
                        onEdit(variable);
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
                          onDuplicate(variable);
                          setShowMenu(false);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-3" />
                        Duplicate
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        onClick={() => {
                          onDelete(variable);
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {variable.category}
              </span>
            </div>
            <div className="text-right">
              {variable.unit && (
                <div className="text-xs text-gray-400">
                  Unit: {variable.unit}
                </div>
              )}
            </div>
          </div>
        </div>

        {variable.isKeyDriver && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-md">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-yellow-600 mr-2" />
              <div className="text-sm text-yellow-800">
                Key Driver Variable
              </div>
            </div>
          </div>
        )}

        {variable.dependencies && variable.dependencies.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-1">Dependencies:</div>
            <div className="flex flex-wrap gap-1">
              {variable.dependencies.slice(0, 3).map((depId) => (
                <span
                  key={depId}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {depId}
                </span>
              ))}
              {variable.dependencies.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  +{variable.dependencies.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={() => onEdit(variable)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Variable
          </button>
          
          <div className="flex items-center text-sm text-gray-500">
            {variable.formula && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Calculated
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
