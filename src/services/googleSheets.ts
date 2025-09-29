import { Scenario, Variable, Workspace, GoogleSheetsConfig } from '../types';

export class GoogleSheetsService {
  private config: GoogleSheetsConfig;
  private scriptUrl: string;

  constructor(config: GoogleSheetsConfig, scriptUrl: string) {
    this.config = config;
    this.scriptUrl = scriptUrl;
  }

  async saveScenario(scenario: Scenario): Promise<boolean> {
    try {
      const response = await fetch(`${this.scriptUrl}/saveScenario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${this.scriptUrl}/loadScenarios?spreadsheetId=${this.config.spreadsheetId}&sheetName=${this.config.sheetName}`);
      
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
      const response = await fetch(`${this.scriptUrl}/saveVariables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${this.scriptUrl}/loadVariables?spreadsheetId=${this.config.spreadsheetId}&sheetName=${this.config.sheetName}`);
      
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
      const response = await fetch(`${this.scriptUrl}/exportWorkspace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
`;
