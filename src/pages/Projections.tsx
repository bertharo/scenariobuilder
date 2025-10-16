import { useState } from 'react';
import { Plus, Search, TrendingUp, Download } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import ProjectionCard from '../components/ProjectionCard';
import ProjectionModal from '../components/ProjectionModal';
import { Projection } from '../types';

export default function Projections() {
  const { state } = useWorkspace();
  const [showModal, setShowModal] = useState(false);
  const [editingProjection, setEditingProjection] = useState<Projection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProjections = workspace.projections.filter(projection =>
    projection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProjection = () => {
    setEditingProjection(null);
    setShowModal(true);
  };

  const handleEditProjection = (projection: Projection) => {
    setEditingProjection(projection);
    setShowModal(true);
  };

  const handleSaveProjection = (projectionData: Omit<Projection, 'id' | 'createdAt' | 'updatedAt'>) => {
    const projection: Projection = {
      ...projectionData,
      id: editingProjection?.id || crypto.randomUUID(),
      createdAt: editingProjection?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    // Here you would typically save to your backend
    console.log('Saving projection:', projection);
    setShowModal(false);
    setEditingProjection(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProjection(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Financial Projections
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Generate advanced financial projections with Monte Carlo simulations and AI insights
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            type="button"
            onClick={handleCreateProjection}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Projection
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="max-w-md">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Projections
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
              placeholder="Search projections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Projections Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjections.map((projection) => (
          <ProjectionCard
            key={projection.id}
            projection={projection}
            scenarios={workspace.scenarios}
            variables={workspace.variables}
            onEdit={handleEditProjection}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProjections.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <TrendingUp className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm 
              ? 'No projections match your search'
              : 'No projections yet'
            }
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search criteria.'
              : 'Get started by creating a new projection.'
            }
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCreateProjection}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Projection
              </button>
            </div>
          )}
        </div>
      )}

      {/* Projection Modal */}
      {showModal && (
        <ProjectionModal
          projection={editingProjection}
          onSave={handleSaveProjection}
          onClose={handleCloseModal}
          scenarios={workspace.scenarios}
          variables={workspace.variables}
        />
      )}
    </div>
  );
}
