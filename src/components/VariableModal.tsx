import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { Variable } from '../types';

interface VariableModalProps {
  variable?: Variable | null;
  onSave: (variable: Omit<Variable, 'id'>) => void;
  onClose: () => void;
}

export default function VariableModal({ variable, onSave, onClose }: VariableModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'number' as 'number' | 'percentage' | 'currency' | 'boolean' | 'text',
    unit: '',
    category: '',
    isKeyDriver: false,
    dependencies: [] as string[],
    formula: '',
  });
  const [newDependency, setNewDependency] = useState('');

  useEffect(() => {
    if (variable) {
      setFormData({
        name: variable.name,
        description: variable.description || '',
        type: variable.type,
        unit: variable.unit || '',
        category: variable.category,
        isKeyDriver: variable.isKeyDriver,
        dependencies: variable.dependencies || [],
        formula: variable.formula || '',
      });
    }
  }, [variable]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddDependency = () => {
    if (newDependency.trim() && !formData.dependencies.includes(newDependency.trim())) {
      setFormData({
        ...formData,
        dependencies: [...formData.dependencies, newDependency.trim()],
      });
      setNewDependency('');
    }
  };

  const handleRemoveDependency = (dependencyToRemove: string) => {
    setFormData({
      ...formData,
      dependencies: formData.dependencies.filter(dep => dep !== dependencyToRemove),
    });
  };

  const typeOptions = [
    { value: 'number', label: 'Number', description: 'Numeric values' },
    { value: 'percentage', label: 'Percentage', description: 'Percentage values (0-100)' },
    { value: 'currency', label: 'Currency', description: 'Monetary values' },
    { value: 'boolean', label: 'Boolean', description: 'True/False values' },
    { value: 'text', label: 'Text', description: 'Text strings' },
  ];

  const categoryOptions = [
    'Financial',
    'Operational',
    'Market',
    'Regulatory',
    'Technology',
    'Environmental',
    'Social',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {variable ? 'Edit Variable' : 'Create New Variable'}
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
                      Variable Name *
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
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      name="category"
                      id="category"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
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

                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Variable Type *
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {typeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`relative rounded-lg p-4 cursor-pointer focus:outline-none ${
                          formData.type === option.value
                            ? 'ring-2 ring-primary-500 bg-primary-50'
                            : 'ring-1 ring-gray-300 bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => setFormData({ ...formData, type: option.value as any })}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="type"
                            value={option.value}
                            checked={formData.type === option.value}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-500">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unit */}
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    id="unit"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g., USD, %, units, etc."
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>

                {/* Key Driver */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isKeyDriver"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.isKeyDriver}
                    onChange={(e) => setFormData({ ...formData, isKeyDriver: e.target.checked })}
                  />
                  <label htmlFor="isKeyDriver" className="ml-2 block text-sm text-gray-900">
                    Key Driver Variable
                  </label>
                </div>

                {/* Dependencies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dependencies
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.dependencies.map((dependency) => (
                      <span
                        key={dependency}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {dependency}
                        <button
                          type="button"
                          className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                          onClick={() => handleRemoveDependency(dependency)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Add dependency variable ID"
                      value={newDependency}
                      onChange={(e) => setNewDependency(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDependency())}
                    />
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                      onClick={handleAddDependency}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Formula */}
                <div>
                  <label htmlFor="formula" className="block text-sm font-medium text-gray-700">
                    Formula (Optional)
                  </label>
                  <input
                    type="text"
                    name="formula"
                    id="formula"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g., A1 * B1 + C1"
                    value={formData.formula}
                    onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Use variable IDs in your formula (e.g., revenue * growth_rate)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {variable ? 'Update Variable' : 'Create Variable'}
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
