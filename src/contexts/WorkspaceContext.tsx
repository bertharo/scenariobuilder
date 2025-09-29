import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Workspace, Scenario, Variable, Projection, Comparison } from '../types';
import { GoogleSheetsService } from '../services/googleSheets';

interface WorkspaceState {
  workspace: Workspace | null;
  loading: boolean;
  error: string | null;
  googleSheetsService: GoogleSheetsService | null;
}

type WorkspaceAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WORKSPACE'; payload: Workspace }
  | { type: 'ADD_SCENARIO'; payload: Scenario }
  | { type: 'UPDATE_SCENARIO'; payload: Scenario }
  | { type: 'DELETE_SCENARIO'; payload: string }
  | { type: 'ADD_VARIABLE'; payload: Variable }
  | { type: 'UPDATE_VARIABLE'; payload: Variable }
  | { type: 'DELETE_VARIABLE'; payload: string }
  | { type: 'ADD_PROJECTION'; payload: Projection }
  | { type: 'UPDATE_PROJECTION'; payload: Projection }
  | { type: 'DELETE_PROJECTION'; payload: string }
  | { type: 'ADD_COMPARISON'; payload: Comparison }
  | { type: 'UPDATE_COMPARISON'; payload: Comparison }
  | { type: 'DELETE_COMPARISON'; payload: string }
  | { type: 'SET_GOOGLE_SHEETS_SERVICE'; payload: GoogleSheetsService };

const initialState: WorkspaceState = {
  workspace: null,
  loading: false,
  error: null,
  googleSheetsService: null,
};

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_WORKSPACE':
      return { ...state, workspace: action.payload, loading: false, error: null };
    case 'ADD_SCENARIO':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          scenarios: [...state.workspace.scenarios, action.payload],
        },
      };
    case 'UPDATE_SCENARIO':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          scenarios: state.workspace.scenarios.map(s =>
            s.id === action.payload.id ? action.payload : s
          ),
        },
      };
    case 'DELETE_SCENARIO':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          scenarios: state.workspace.scenarios.filter(s => s.id !== action.payload),
        },
      };
    case 'ADD_VARIABLE':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          variables: [...state.workspace.variables, action.payload],
        },
      };
    case 'UPDATE_VARIABLE':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          variables: state.workspace.variables.map(v =>
            v.id === action.payload.id ? action.payload : v
          ),
        },
      };
    case 'DELETE_VARIABLE':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          variables: state.workspace.variables.filter(v => v.id !== action.payload),
        },
      };
    case 'ADD_PROJECTION':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          projections: [...state.workspace.projections, action.payload],
        },
      };
    case 'UPDATE_PROJECTION':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          projections: state.workspace.projections.map(p =>
            p.id === action.payload.id ? action.payload : p
          ),
        },
      };
    case 'DELETE_PROJECTION':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          projections: state.workspace.projections.filter(p => p.id !== action.payload),
        },
      };
    case 'ADD_COMPARISON':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          comparisons: [...state.workspace.comparisons, action.payload],
        },
      };
    case 'UPDATE_COMPARISON':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          comparisons: state.workspace.comparisons.map(c =>
            c.id === action.payload.id ? action.payload : c
          ),
        },
      };
    case 'DELETE_COMPARISON':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          comparisons: state.workspace.comparisons.filter(c => c.id !== action.payload),
        },
      };
    case 'SET_GOOGLE_SHEETS_SERVICE':
      return { ...state, googleSheetsService: action.payload };
    default:
      return state;
  }
}

const WorkspaceContext = createContext<{
  state: WorkspaceState;
  dispatch: React.Dispatch<WorkspaceAction>;
  createWorkspace: (name: string, description: string) => void;
  saveScenario: (scenario: Scenario) => Promise<boolean>;
  loadScenarios: () => Promise<void>;
  saveVariable: (variable: Variable) => Promise<boolean>;
  loadVariables: () => Promise<void>;
  syncWithGoogleSheets: () => Promise<void>;
} | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  const createWorkspace = (name: string, description: string) => {
    const workspace: Workspace = {
      id: crypto.randomUUID(),
      name,
      description,
      users: [],
      variables: [],
      scenarios: [],
      projections: [],
      comparisons: [],
      settings: {
        currency: 'USD',
        timeZone: 'UTC',
        defaultTimeHorizon: 10,
      },
    };
    dispatch({ type: 'SET_WORKSPACE', payload: workspace });
  };

  const saveScenario = async (scenario: Scenario): Promise<boolean> => {
    if (state.googleSheetsService) {
      const success = await state.googleSheetsService.saveScenario(scenario);
      if (success) {
        dispatch({ type: 'ADD_SCENARIO', payload: scenario });
      }
      return success;
    } else {
      dispatch({ type: 'ADD_SCENARIO', payload: scenario });
      return true;
    }
  };

  const loadScenarios = async (): Promise<void> => {
    if (state.googleSheetsService) {
      dispatch({ type: 'SET_LOADING', payload: true });
      const scenarios = await state.googleSheetsService.loadScenarios();
      if (state.workspace) {
        dispatch({
          type: 'SET_WORKSPACE',
          payload: {
            ...state.workspace,
            scenarios,
          },
        });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveVariable = async (variable: Variable): Promise<boolean> => {
    if (state.googleSheetsService) {
      const success = await state.googleSheetsService.saveVariables([variable]);
      if (success) {
        dispatch({ type: 'ADD_VARIABLE', payload: variable });
      }
      return success;
    } else {
      dispatch({ type: 'ADD_VARIABLE', payload: variable });
      return true;
    }
  };

  const loadVariables = async (): Promise<void> => {
    if (state.googleSheetsService) {
      dispatch({ type: 'SET_LOADING', payload: true });
      const variables = await state.googleSheetsService.loadVariables();
      if (state.workspace) {
        dispatch({
          type: 'SET_WORKSPACE',
          payload: {
            ...state.workspace,
            variables,
          },
        });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const syncWithGoogleSheets = async (): Promise<void> => {
    if (state.googleSheetsService) {
      dispatch({ type: 'SET_LOADING', payload: true });
      const workspace = await state.googleSheetsService.syncFromSheets();
      if (workspace) {
        dispatch({ type: 'SET_WORKSPACE', payload: workspace });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    // Initialize with a default workspace if none exists
    if (!state.workspace) {
      createWorkspace('My Planning Workspace', 'Long range planning and scenario analysis');
    }
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        state,
        dispatch,
        createWorkspace,
        saveScenario,
        loadScenarios,
        saveVariable,
        loadVariables,
        syncWithGoogleSheets,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
