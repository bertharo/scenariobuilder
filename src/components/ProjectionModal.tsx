import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Projection, Scenario, Variable } from '../types';

interface ProjectionModalProps {
  projection?: Projection | null;
  onSave: (projection: Omit<Projection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  scenarios: Scenario[];
  variables: Variable[];
}

export default function ProjectionModal({ 
  projection, 
  onSave, 
  onClose, 
  scenarios, 
  variables 
}: ProjectionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scenarios: [] as string[],
    timeHorizon: {
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 10,
    },
    metrics: [] as string[],
  });

  useEffect(() => {
    if (projection) {
      setFormData({
        name: projection.name,
        description: projection.description,
        scenarios: projection.scenarios,
        timeHorizon: projection.timeHorizon,
        metrics: projection.metrics,
      });
    }
  }, [projection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleScenarioToggle = (scenarioId: string) => {
    setFormData({
      ...formData,
      scenarios: formData.scenarios.includes(scenarioId)
        ? formData.scenarios.filter(id => id !== scenarioId)
        : [...formData.scenarios, scenarioId],
    });
  };

  const handleMetricToggle = (metricId: string) => {
    setFormData({
      ...formData,
      metrics: formData.metrics.includes(metricId)
        ? formData.metrics.filter(id => id !== metricId)
        : [...formData.metrics, metricId],
    });
  };

  const availableScenarios = scenarios.filter(s => s.status === 'active');
  const availableMetrics = variables.filter(v => v.isKeyDriver);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {projection ? 'Edit Projection' : 'Create New Projection'}
                </h3>
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Projection Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Time Horizon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Time Horizon *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startYear" className="block text-xs font-medium text-gray-500">
                        Start Year
                      </label>
                      <input
                        type="number"
                        name="startYear"
                        id="startYear"
                        required
                        min="2020"
                        max="2100"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.timeHorizon.startYear}
                        onChange={(e) => setFormData({
                          ...formData,
                          timeHorizon: {
                            ...formData.timeHorizon,
                            startYear: parseInt(e.target.value),
                          },
                        })}
                      />
                    </div>
                    <div>
                      <label htmlFor="endYear" className="block text-xs font-medium text-gray-500">
                        End Year
                      </label>
                      <input
                        type="number"
                        name="endYear"
                        id="endYear"
                        required
                        min="2020"
                        max="2100"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.timeHorizon.endYear}
                        onChange={(e) => setFormData({
                          ...formData,
                          timeHorizon: {
                            ...formData.timeHorizon,
                            endYear: parseInt(e.target.value),
                          },
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Scenarios Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Scenarios *
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableScenarios.map((scenario) => (
                      <div
                        key={scenario.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          id={`scenario-${scenario.id}`}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={formData.scenarios.includes(scenario.id)}
                          onChange={() => handleScenarioToggle(scenario.id)}
                        />
                        <label htmlFor={`scenario-${scenario.id}`} className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {scenario.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {scenario.description}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {availableScenarios.length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No active scenarios available. Create scenarios first.
                    </div>
                  )}
                </div>

                {/* Metrics Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Metrics *
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableMetrics.map((variable) => (
                      <div
                        key={variable.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          id={`metric-${variable.id}`}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={formData.metrics.includes(variable.id)}
                          onChange={() => handleMetricToggle(variable.id)}
                        />
                        <label htmlFor={`metric-${variable.id}`} className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {variable.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {variable.category} • {variable.type}
                            {variable.unit && ` • ${variable.unit}`}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {availableMetrics.length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No key driver variables available. Mark variables as key drivers first.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {projection ? 'Update Projection' : 'Create Projection'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
