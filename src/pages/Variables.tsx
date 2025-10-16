import { useState } from 'react';
import { Plus, Search, Database } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import VariableCard from '../components/VariableCard';
import VariableModal from '../components/VariableModal';
import { Variable } from '../types';

export default function Variables() {
  const { state, saveVariable } = useWorkspace();
  const [showModal, setShowModal] = useState(false);
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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

  const filteredVariables = workspace.variables.filter(variable => {
    const matchesSearch = variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variable.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || variable.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || variable.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const allCategories = Array.from(new Set(workspace.variables.map(v => v.category)));

  const handleCreateVariable = () => {
    setEditingVariable(null);
    setShowModal(true);
  };

  const handleEditVariable = (variable: Variable) => {
    setEditingVariable(variable);
    setShowModal(true);
  };

  const handleSaveVariable = async (variableData: Omit<Variable, 'id'>) => {
    const variable: Variable = {
      ...variableData,
      id: editingVariable?.id || crypto.randomUUID(),
    };

    const success = await saveVariable(variable);
    if (success) {
      setShowModal(false);
      setEditingVariable(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVariable(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Variable Configuration
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Define and manage modeling variables with advanced configuration options
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleCreateVariable}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Variable
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search variables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type-filter"
              name="type-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="number">Number</option>
              <option value="percentage">Percentage</option>
              <option value="currency">Currency</option>
              <option value="boolean">Boolean</option>
              <option value="text">Text</option>
            </select>
          </div>

          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category-filter"
              name="category-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Variables Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVariables.map((variable) => (
          <VariableCard
            key={variable.id}
            variable={variable}
            onEdit={handleEditVariable}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredVariables.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Database className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' 
              ? 'No variables match your filters'
              : 'No variables yet'
            }
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search criteria.'
              : 'Get started by creating a new variable.'
            }
          </p>
          {(!searchTerm && typeFilter === 'all' && categoryFilter === 'all') && (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCreateVariable}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Variable
              </button>
            </div>
          )}
        </div>
      )}

      {/* Variable Modal */}
      {showModal && (
        <VariableModal
          variable={editingVariable}
          onSave={handleSaveVariable}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
