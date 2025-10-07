// Add this to your Apps Script to debug the issue
// Run this function to see what's in VW_Deltas

function debugVWDeltas() {
  var ss = SpreadsheetApp.openById('1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k');
  var runId = 'RUN_20251001_172249_580'; // Your specific run ID
  
  Logger.log('=== DEBUGGING VW_DELTAS ===');
  Logger.log('Looking for RUN_ID: ' + runId);
  
  // Check if VW_Deltas exists
  var vwDeltasSheet = ss.getSheetByName('VW_Deltas');
  if (!vwDeltasSheet) {
    Logger.log('❌ VW_Deltas sheet NOT FOUND');
    return;
  }
  Logger.log('✅ VW_Deltas sheet exists');
  
  // Get all data
  var data = vwDeltasSheet.getDataRange().getValues();
  Logger.log('📊 Total rows in VW_Deltas: ' + data.length);
  
  // Check headers
  var headers = data[0];
  Logger.log('📋 Headers: ' + headers.join(', '));
  
  // Find column indices
  var runIdCol = headers.indexOf('RUN_ID');
  var kindCol = headers.indexOf('kind');
  var metricCol = headers.indexOf('FieldOrMetric');
  var beforeCol = headers.indexOf('Before');
  var afterCol = headers.indexOf('After');
  var deltaCol = headers.indexOf('Delta');
  
  Logger.log('Column indices:');
  Logger.log('  RUN_ID: ' + runIdCol);
  Logger.log('  kind: ' + kindCol);
  Logger.log('  FieldOrMetric: ' + metricCol);
  Logger.log('  Before: ' + beforeCol);
  Logger.log('  After: ' + afterCol);
  Logger.log('  Delta: ' + deltaCol);
  
  // Find matching rows
  var matchingRows = [];
  var arrEndingRows = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var currentRunId = row[runIdCol];
    
    if (currentRunId === runId) {
      matchingRows.push(row);
      
      var kind = row[kindCol];
      var metric = row[metricCol];
      
      Logger.log('\n📝 Row ' + (i + 1) + ':');
      Logger.log('  RUN_ID: ' + currentRunId);
      Logger.log('  kind: "' + kind + '"');
      Logger.log('  FieldOrMetric: "' + metric + '"');
      Logger.log('  Before: ' + row[beforeCol]);
      Logger.log('  After: ' + row[afterCol]);
      Logger.log('  Delta: ' + row[deltaCol]);
      
      // Check if it matches our criteria
      if (kind === 'OUTPUT' && metric === 'ARR — Ending') {
        arrEndingRows.push(row);
        Logger.log('  ✅ MATCHES CRITERIA (OUTPUT + ARR — Ending)');
      } else {
        Logger.log('  ❌ Does not match criteria');
        if (kind !== 'OUTPUT') {
          Logger.log('     - kind is "' + kind + '" (expected "OUTPUT")');
        }
        if (metric !== 'ARR — Ending') {
          Logger.log('     - metric is "' + metric + '" (expected "ARR — Ending")');
        }
      }
    }
  }
  
  Logger.log('\n=== SUMMARY ===');
  Logger.log('Total rows with RUN_ID "' + runId + '": ' + matchingRows.length);
  Logger.log('Rows with OUTPUT + "ARR — Ending": ' + arrEndingRows.length);
  
  if (arrEndingRows.length === 0) {
    Logger.log('\n⚠️  NO MATCHING ROWS FOUND!');
    Logger.log('This is why you\'re seeing default values.');
    Logger.log('\nPossible reasons:');
    Logger.log('1. No rows with kind = "OUTPUT"');
    Logger.log('2. No rows with FieldOrMetric = "ARR — Ending"');
    Logger.log('3. Column name might be different (check for hyphen vs em dash)');
  } else {
    // Calculate totals
    var totalBefore = 0;
    var totalAfter = 0;
    var totalDelta = 0;
    
    for (var i = 0; i < arrEndingRows.length; i++) {
      var row = arrEndingRows[i];
      totalBefore += Number(row[beforeCol]) || 0;
      totalAfter += Number(row[afterCol]) || 0;
      totalDelta += Number(row[deltaCol]) || 0;
    }
    
    Logger.log('\n✅ CALCULATED TOTALS:');
    Logger.log('ARR Before: $' + totalBefore.toLocaleString());
    Logger.log('ARR After: $' + totalAfter.toLocaleString());
    Logger.log('Total Delta: $' + totalDelta.toLocaleString());
    
    if (totalBefore === 0 && totalAfter === 0) {
      Logger.log('\n⚠️  All values are ZERO!');
      Logger.log('Check that Calc_NetNew and Calc_RollForward tabs have data.');
    }
  }
  
  Logger.log('\n=== END DEBUG ===');
}

// Also check what sheets exist
function checkSheetStructure() {
  var ss = SpreadsheetApp.openById('1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k');
  var sheets = ss.getSheets();
  
  Logger.log('=== SHEET STRUCTURE ===');
  Logger.log('Total sheets: ' + sheets.length);
  Logger.log('\nSheet names:');
  
  var requiredSheets = [
    'Prompt',
    'LRP Simulation',
    'Scenario_MD',
    'Settings',
    'Drivers_NetNew',
    'Calc_NetNew',
    'Calc_RollForward',
    'Run_Registry',
    'Drivers_Snapshot',
    'Outputs_Snapshot',
    'VW_Deltas'
  ];
  
  for (var i = 0; i < sheets.length; i++) {
    var sheetName = sheets[i].getName();
    var isRequired = requiredSheets.indexOf(sheetName) >= 0;
    Logger.log((i + 1) + '. ' + sheetName + (isRequired ? ' ✅' : ''));
  }
  
  Logger.log('\n=== CHECKING REQUIRED SHEETS ===');
  for (var i = 0; i < requiredSheets.length; i++) {
    var sheet = ss.getSheetByName(requiredSheets[i]);
    if (sheet) {
      Logger.log('✅ ' + requiredSheets[i] + ' - EXISTS');
    } else {
      Logger.log('❌ ' + requiredSheets[i] + ' - MISSING');
    }
  }
}

