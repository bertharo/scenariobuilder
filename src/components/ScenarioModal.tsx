import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Calendar, Tag } from 'lucide-react';
import { Scenario, Variable, ScenarioVariable, TimeSeries } from '../types';
import { useWorkspace } from '../contexts/WorkspaceContext';

interface ScenarioModalProps {
  scenario?: Scenario | null;
  onSave: (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  variables: Variable[];
}

export default function ScenarioModal({ scenario, onSave, onClose, variables }: ScenarioModalProps) {
  const { state } = useWorkspace();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as 'draft' | 'active' | 'archived',
    tags: [] as string[],
    isBaseCase: false,
    variables: [] as ScenarioVariable[],
  });
  const [newTag, setNewTag] = useState('');
  const [selectedVariable, setSelectedVariable] = useState('');
  const [timeHorizon, setTimeHorizon] = useState({
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 10,
  });

  useEffect(() => {
    if (scenario) {
      setFormData({
        name: scenario.name,
        description: scenario.description,
        status: scenario.status,
        tags: scenario.tags,
        isBaseCase: scenario.isBaseCase,
        variables: scenario.variables,
      });
    }
  }, [scenario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleAddVariable = () => {
    if (selectedVariable) {
      const variable = variables.find(v => v.id === selectedVariable);
      if (variable) {
        const scenarioVariable: ScenarioVariable = {
          variableId: variable.id,
          timeSeries: generateTimeSeries(variable.type),
          assumptions: [],
          sensitivity: {
            optimistic: 1.2,
            pessimistic: 0.8,
          },
        };
        
        setFormData({
          ...formData,
          variables: [...formData.variables, scenarioVariable],
        });
        setSelectedVariable('');
      }
    }
  };

  const generateTimeSeries = (type: string): TimeSeries[] => {
    const series: TimeSeries[] = [];
    for (let year = timeHorizon.startYear; year <= timeHorizon.endYear; year++) {
      series.push({
        year,
        value: type === 'percentage' ? 0.05 : type === 'currency' ? 1000000 : 100,
        confidence: 'medium',
      });
    }
    return series;
  };

  const handleRemoveVariable = (variableId: string) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter(v => v.variableId !== variableId),
    });
  };

  const handleUpdateTimeSeries = (variableId: string, year: number, value: number) => {
    setFormData({
      ...formData,
      variables: formData.variables.map(v => 
        v.variableId === variableId 
          ? {
              ...v,
              timeSeries: v.timeSeries.map(ts => 
                ts.year === year ? { ...ts, value } : ts
              ),
            }
          : v
      ),
    });
  };

  const availableVariables = variables.filter(v => 
    !formData.variables.some(sv => sv.variableId === v.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {scenario ? 'Edit Scenario' : 'Create New Scenario'}
                </h3>
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Scenario Name
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
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      id="status"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isBaseCase"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={formData.isBaseCase}
                      onChange={(e) => setFormData({ ...formData, isBaseCase: e.target.checked })}
                    />
                    <label htmlFor="isBaseCase" className="ml-2 block text-sm text-gray-900">
                      Base Case Scenario
                    </label>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                          <button
                            type="button"
                            className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex">
                      <input
                        type="text"
                        className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                        onClick={handleAddTag}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variables Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Variables</h4>
                  <div className="flex">
                    <select
                      className="border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={selectedVariable}
                      onChange={(e) => setSelectedVariable(e.target.value)}
                    >
                      <option value="">Select a variable</option>
                      {availableVariables.map((variable) => (
                        <option key={variable.id} value={variable.id}>
                          {variable.name} ({variable.type})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                      onClick={handleAddVariable}
                      disabled={!selectedVariable}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {formData.variables.length > 0 && (
                  <div className="space-y-4">
                    {formData.variables.map((scenarioVar) => {
                      const variable = variables.find(v => v.id === scenarioVar.variableId);
                      if (!variable) return null;

                      return (
                        <div key={scenarioVar.variableId} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-medium text-gray-900">{variable.name}</h5>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleRemoveVariable(scenarioVar.variableId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {scenarioVar.timeSeries.map((ts) => (
                              <div key={ts.year} className="flex items-center space-x-2">
                                <label className="text-xs text-gray-500 w-12">{ts.year}</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                  value={ts.value}
                                  onChange={(e) => handleUpdateTimeSeries(scenarioVar.variableId, ts.year, parseFloat(e.target.value) || 0)}
                                />
                                <span className="text-xs text-gray-500">{variable.unit || ''}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {scenario ? 'Update Scenario' : 'Create Scenario'}
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
