// Test script for Google Apps Script API
const API_URL = 'https://script.google.com/macros/s/AKfycbwmvxvqF84_ekrQD6rbQsMiSYrPSn_tRUBT9x-YcjdmEA07br6ohfKcGL4iLQKgMBdx/exec';
const API_KEY = 'sk_lrp_prototype_2024_secure_key_12345';

// Replace with your actual Google Spreadsheet ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Scenarios';

async function testLoadScenarios() {
  try {
    const url = `${API_URL}?action=loadScenarios&spreadsheetId=${SPREADSHEET_ID}&sheetName=${SHEET_NAME}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });
    
    const data = await response.json();
    console.log('✅ Load Scenarios Response:', data);
    return data;
  } catch (error) {
    console.error('❌ Error loading scenarios:', error);
  }
}

async function testSaveScenario() {
  try {
    const testScenario = {
      id: 'test-scenario-' + Date.now(),
      name: 'Test Scenario',
      description: 'A test scenario created via API',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'test-user',
      variables: [],
      tags: ['test'],
      isBaseCase: false
    };

    const response = await fetch(`${API_URL}?action=saveScenario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        spreadsheetId: SPREADSHEET_ID,
        sheetName: SHEET_NAME,
        scenario: testScenario
      }),
    });
    
    const data = await response.json();
    console.log('✅ Save Scenario Response:', data);
    return data;
  } catch (error) {
    console.error('❌ Error saving scenario:', error);
  }
}

async function testLoadVariables() {
  try {
    const url = `${API_URL}?action=loadVariables&spreadsheetId=${SPREADSHEET_ID}&sheetName=${SHEET_NAME}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });
    
    const data = await response.json();
    console.log('✅ Load Variables Response:', data);
    return data;
  } catch (error) {
    console.error('❌ Error loading variables:', error);
  }
}

// Run tests
console.log('🧪 Testing Google Apps Script API...');
console.log('📝 Make sure to update SPREADSHEET_ID with your actual Google Spreadsheet ID');

// Uncomment the tests you want to run:
// testLoadScenarios();
// testSaveScenario();
// testLoadVariables();
