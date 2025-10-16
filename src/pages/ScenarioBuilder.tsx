import { useState } from 'react';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import ScenarioCard from '../components/ScenarioCard';
import ScenarioModal from '../components/ScenarioModal';
import { Scenario } from '../types';

export default function ScenarioBuilder() {
  const { state, saveScenario } = useWorkspace();
  const [showModal, setShowModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

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

  const filteredScenarios = workspace.scenarios.filter(scenario => {
    const matchesSearch = scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || scenario.status === statusFilter;
    const matchesTag = tagFilter === 'all' || scenario.tags.includes(tagFilter);
    
    return matchesSearch && matchesStatus && matchesTag;
  });

  const allTags = Array.from(new Set(workspace.scenarios.flatMap(s => s.tags)));

  const handleCreateScenario = () => {
    setEditingScenario(null);
    setShowModal(true);
  };

  const handleEditScenario = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setShowModal(true);
  };

  const handleSaveScenario = async (scenarioData: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => {
    const scenario: Scenario = {
      ...scenarioData,
      id: editingScenario?.id || crypto.randomUUID(),
      createdAt: editingScenario?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    const success = await saveScenario(scenario);
    if (success) {
      setShowModal(false);
      setEditingScenario(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingScenario(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Scenario Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create, analyze, and manage modeling scenarios with AI-powered insights
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            type="button"
            onClick={handleCreateScenario}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Scenario
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
                placeholder="Search scenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status-filter"
              name="status-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700">
              Tag
            </label>
            <select
              id="tag-filter"
              name="tag-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onEdit={handleEditScenario}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredScenarios.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Filter className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm || statusFilter !== 'all' || tagFilter !== 'all' 
              ? 'No scenarios match your filters'
              : 'No scenarios yet'
            }
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || tagFilter !== 'all'
              ? 'Try adjusting your search criteria.'
              : 'Get started by creating a new scenario.'
            }
          </p>
          {(!searchTerm && statusFilter === 'all' && tagFilter === 'all') && (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCreateScenario}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Scenario
              </button>
            </div>
          )}
        </div>
      )}

      {/* Scenario Modal */}
      {showModal && (
        <ScenarioModal
          scenario={editingScenario}
          onSave={handleSaveScenario}
          onClose={handleCloseModal}
          variables={workspace.variables}
        />
      )}
    </div>
  );
}
