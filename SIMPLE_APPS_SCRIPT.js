// ========================================
// SIMPLE LRP PROMPT WRITER
// ========================================
// This just writes your NLP prompt to B3 in Google Sheets
// Spreadsheet ID: 1JfrPCBtVPiK-9XkrIhMTscXDnfElaNrE66lh23x6TU8

var SPREADSHEET_ID = '1JfrPCBtVPiK-9XkrIhMTscXDnfElaNrE66lh23x6TU8';

// Handle GET requests
function doGet(e) {
  return handleRequest(e);
}

// Handle POST requests
function doPost(e) {
  return handleRequest(e);
}

// Handle OPTIONS requests (CORS preflight)
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

// Main request handler
function handleRequest(e) {
  try {
    console.log('=== SIMPLE LRP PROMPT WRITER ===');
    
    if (!e) {
      return createErrorResponse('No request data received');
    }
    
    var query = null;
    var action = null;
    
    // Parse request parameters
    if (e.postData && e.postData.contents) {
      var data = JSON.parse(e.postData.contents);
      query = data.query;
      action = data.action;
    } else if (e.parameter) {
      query = e.parameter.query;
      action = e.parameter.action;
    }
    
    console.log('Action:', action);
    console.log('Query:', query);
    
    if (action === 'processScenarioQuery' && query) {
      return writePromptToSheet(query);
    } else {
      return createSuccessResponse({
        success: true,
        message: "Simple LRP Prompt Writer is ready!",
        timestamp: new Date().toISOString(),
        usage: "Use action=processScenarioQuery and query=your_scenario"
      });
    }
    
  } catch (error) {
    console.error('HandleRequest error:', error);
    return createErrorResponse(error.message);
  }
}

// Write prompt to B3 in Google Sheets
function writePromptToSheet(query) {
  try {
    console.log('=== WRITING PROMPT TO SHEET ===');
    console.log('Query:', query);
    
    // Open the spreadsheet
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Find the right sheet (try different names)
    var sheet = ss.getSheetByName('Prompt') || 
                ss.getSheetByName('LRP Simulation') || 
                ss.getSheets()[0];
    
    // Write prompt to B3
    sheet.getRange('B3').setValue(query);
    console.log('✅ Wrote prompt to B3:', query);
    
    SpreadsheetApp.flush();
    
    // Return success response
    var response = {
      success: true,
      message: "Prompt written to Google Sheets B3!",
      prompt: query,
      instructions: {
        step1: "✅ Prompt written to cell B3",
        step2: "👆 Click 'LRP Copilot → Run Prompt' in your spreadsheet", 
        step3: "🔄 Refresh this page to see results",
        spreadsheetUrl: "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/edit"
      },
      timestamp: new Date().toISOString()
    };
    
    return createSuccessResponse(response);
    
  } catch (error) {
    console.error('WritePromptToSheet error:', error);
    return createErrorResponse('Error writing prompt: ' + error.message);
  }
}

// Create success response
function createSuccessResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Create error response
function createErrorResponse(message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      error: message
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function
function test() {
  var result = writePromptToSheet("Increase EMEA ARR by $10M; Platform share ≤ 40%");
  Logger.log(result.getContent());
}
