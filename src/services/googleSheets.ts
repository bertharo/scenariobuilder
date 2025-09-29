import { Scenario, Variable, Workspace, GoogleSheetsConfig } from '../types';
import { API_CONFIG } from '../config/api';

export class GoogleSheetsService {
  private config: GoogleSheetsConfig;
  private scriptUrl: string;

  constructor(config: GoogleSheetsConfig, scriptUrl: string) {
    this.config = config;
    this.scriptUrl = scriptUrl;
  }

  async saveScenario(scenario: Scenario): Promise<boolean> {
    try {
      const response = await fetch(`${this.scriptUrl}?action=saveScenario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        },
        body: JSON.stringify({
          spreadsheetId: this.config.spreadsheetId,
          sheetName: this.config.sheetName,
          scenario,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error saving scenario:', error);
      return false;
    }
  }

  async loadScenarios(): Promise<Scenario[]> {
    try {
      const response = await fetch(`${this.scriptUrl}?action=loadScenarios&spreadsheetId=${this.config.spreadsheetId}&sheetName=${this.config.sheetName}`, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load scenarios');
      }

      const data = await response.json();
      return data.scenarios || [];
    } catch (error) {
      console.error('Error loading scenarios:', error);
      return [];
    }
  }

  async saveVariables(variables: Variable[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.scriptUrl}?action=saveVariables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        },
        body: JSON.stringify({
          spreadsheetId: this.config.spreadsheetId,
          sheetName: this.config.sheetName,
          variables,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error saving variables:', error);
      return false;
    }
  }

  async loadVariables(): Promise<Variable[]> {
    try {
      const response = await fetch(`${this.scriptUrl}?action=loadVariables&spreadsheetId=${this.config.spreadsheetId}&sheetName=${this.config.sheetName}`, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load variables');
      }

      const data = await response.json();
      return data.variables || [];
    } catch (error) {
      console.error('Error loading variables:', error);
      return [];
    }
  }

  async exportToSheets(workspace: Workspace, sheetName: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.scriptUrl}?action=exportWorkspace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        },
        body: JSON.stringify({
          spreadsheetId: this.config.spreadsheetId,
          sheetName,
          workspace,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error exporting to sheets:', error);
      return false;
    }
  }

  async syncFromSheets(): Promise<Workspace | null> {
    try {
      const response = await fetch(`${this.scriptUrl}/syncWorkspace?spreadsheetId=${this.config.spreadsheetId}&sheetName=${this.config.sheetName}`);
      
      if (!response.ok) {
        throw new Error('Failed to sync from sheets');
      }

      const data = await response.json();
      return data.workspace || null;
    } catch (error) {
      console.error('Error syncing from sheets:', error);
      return null;
    }
  }

  // New method to process natural language queries using the existing Apps Script logic
  async processScenarioQuery(query: string): Promise<{
    success: boolean;
    data?: {
      runId: string;
      arrBefore: number;
      arrAfter: number;
      totalDelta: number;
      prompt: string;
      options: Array<{
        id: string;
        title: string;
        description: string;
        riskLevel: 'low' | 'medium' | 'medium-low' | 'high';
        metrics: {
          presentationRate?: { old: number; new: number };
          winRate?: { old: number; new: number };
          asp?: { old: number; new: number };
        };
        arrChange: number;
        approach: string;
      }>;
      modelSummary: {
        topGeo: { name: string; value: number };
        topSegment: { name: string; value: number };
        topProduct: { name: string; value: number };
      };
      narrative: string;
      agentTabs: {
        dataOps: any;
        modelOps: any;
        runner: any;
        qa: any;
        constraints: any;
        narrator: any;
        audit: any;
      };
    };
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.scriptUrl}?action=processScenarioQuery&query=${encodeURIComponent(query)}&spreadsheetId=${this.config.spreadsheetId}&sheetName=${this.config.sheetName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Apps Script request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check if the response contains an error
      if (data.error) {
        return {
          success: false,
          error: data.error
        };
      }

      // Validate that we have the required data structure
      if (!data.runId || !data.options || !Array.isArray(data.options)) {
        return {
          success: false,
          error: 'Invalid response format from Apps Script'
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error processing scenario query:', error);
      return {
        success: false,
        error: `Failed to process query: ${(error as Error).message}`
      };
    }
  }
}

// Google Apps Script code that should be deployed
export const GOOGLE_APPS_SCRIPT_CODE = `
function doGet(e) {
  const action = e.parameter.action;
  const spreadsheetId = e.parameter.spreadsheetId;
  const sheetName = e.parameter.sheetName;
  
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.getActiveSheet();
    
    switch (action) {
      case 'loadScenarios':
        return loadScenarios(sheet);
      case 'loadVariables':
        return loadVariables(sheet);
      case 'syncWorkspace':
        return syncWorkspace(sheet);
      case 'processScenarioQuery':
        return processScenarioQuery(sheet, e.parameter.query);
      default:
        return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const { spreadsheetId, sheetName } = data;
  
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.getActiveSheet();
    
    switch (e.parameter.action) {
      case 'saveScenario':
        return saveScenario(sheet, data.scenario);
      case 'saveVariables':
        return saveVariables(sheet, data.variables);
      case 'exportWorkspace':
        return exportWorkspace(sheet, data.workspace);
      default:
        return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function loadScenarios(sheet) {
  const data = sheet.getDataRange().getValues();
  const scenarios = [];
  
  // Parse scenarios from sheet data
  // This is a simplified implementation - you'd need to adapt based on your sheet structure
  
  return ContentService.createTextOutput(JSON.stringify({ scenarios }))
    .setMimeType(ContentService.MimeType.JSON);
}

function loadVariables(sheet) {
  const data = sheet.getDataRange().getValues();
  const variables = [];
  
  // Parse variables from sheet data
  // This is a simplified implementation - you'd need to adapt based on your sheet structure
  
  return ContentService.createTextOutput(JSON.stringify({ variables }))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveScenario(sheet, scenario) {
  // Save scenario to sheet
  // This is a simplified implementation - you'd need to adapt based on your sheet structure
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveVariables(sheet, variables) {
  // Save variables to sheet
  // This is a simplified implementation - you'd need to adapt based on your sheet structure
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function exportWorkspace(sheet, workspace) {
  // Export entire workspace to sheet
  // This is a simplified implementation - you'd need to adapt based on your sheet structure
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function syncWorkspace(sheet) {
  // Sync entire workspace from sheet
  // This is a simplified implementation - you'd need to adapt based on your sheet structure
  
  return ContentService.createTextOutput(JSON.stringify({ workspace: {} }))
    .setMimeType(ContentService.MimeType.JSON);
}

function processScenarioQuery(sheet, query) {
  try {
    // TODO: Replace this with your actual LRP Copilot logic
    // This function should integrate with your existing LRP Copilot logic
    // Based on your spreadsheet, it should:
    // 1. Process the natural language query
    // 2. Run the scenario through your existing agents (DataOps, ModelOps, Runner, QA, Constraints, Narrator, Audit)
    // 3. Generate strategic options with risk assessment
    // 4. Return the comprehensive analysis
    
    // Example structure for your Apps Script response:
    const runId = 'RUN_' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd_HHmmss_SSS');
    
    // Your LRP Copilot should return data in this format:
    const result = {
      runId: runId,
      arrBefore: 125500000, // Get from your baseline data
      arrAfter: 140500000,  // Calculate from your scenario
      totalDelta: 15000000, // Calculate the difference
      prompt: query,
      options: [
        // Generate these from your LRP Copilot logic
        // Each option should have: id, title, description, riskLevel, metrics, arrChange, approach
      ],
      modelSummary: {
        topGeo: { name: 'NA', value: 9000000 },
        topSegment: { name: 'SMB', value: 7000000 },
        topProduct: { name: 'SuiteB', value: 5000000 }
      },
      narrative: 'Your LRP Copilot narrative here...',
      agentTabs: {
        dataOps: { status: 'completed', data: 'Your DataOps results' },
        modelOps: { status: 'completed', data: 'Your ModelOps results' },
        runner: { status: 'completed', data: 'Your Runner results' },
        qa: { status: 'completed', data: 'Your QA results' },
        constraints: { status: 'completed', data: 'Your Constraints results' },
        narrator: { status: 'completed', data: 'Your Narrator results' },
        audit: { status: 'completed', data: 'Your Audit results' }
      }
    };
    
    // For now, return an error to indicate Apps Script needs implementation
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: 'Apps Script processScenarioQuery function needs to be implemented with your LRP Copilot logic' 
    }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
