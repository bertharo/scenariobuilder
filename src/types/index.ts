export interface Variable {
  id: string;
  name: string;
  description?: string;
  type: 'number' | 'percentage' | 'currency' | 'boolean' | 'text';
  unit?: string;
  category: string;
  isKeyDriver: boolean;
  dependencies?: string[]; // IDs of other variables this depends on
  formula?: string; // Mathematical formula for calculated variables
}

export interface TimeSeries {
  year: number;
  value: number;
  confidence?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface ScenarioVariable {
  variableId: string;
  timeSeries: TimeSeries[];
  assumptions: string[];
  sensitivity?: {
    optimistic: number;
    pessimistic: number;
  };
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  variables: ScenarioVariable[];
  tags: string[];
  isBaseCase: boolean;
  parentScenarioId?: string; // For scenario variants
}

export interface Projection {
  id: string;
  name: string;
  description: string;
  scenarios: string[]; // Scenario IDs
  timeHorizon: {
    startYear: number;
    endYear: number;
  };
  metrics: string[]; // Variable IDs to include in projection
  createdAt: Date;
  updatedAt: Date;
}

export interface Comparison {
  id: string;
  name: string;
  scenarios: string[];
  metrics: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  permissions: string[];
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  users: User[];
  variables: Variable[];
  scenarios: Scenario[];
  projections: Projection[];
  comparisons: Comparison[];
  settings: {
    currency: string;
    timeZone: string;
    defaultTimeHorizon: number;
  };
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  apiKey: string;
  lastSync: Date;
}

export interface ExportOptions {
  format: 'excel' | 'csv' | 'pdf';
  includeCharts: boolean;
  includeAssumptions: boolean;
  timeRange: {
    startYear: number;
    endYear: number;
  };
}
