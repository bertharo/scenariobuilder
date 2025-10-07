# Debug Guide - Why Am I Seeing Default Values?

## The Problem

After the first successful run, subsequent prompts show hardcoded/default values instead of real data from your spreadsheet.

## Why This Happens

The Apps Script returns default values when:
1. ❌ `runPrompt()` function fails to execute
2. ❌ VW_Deltas table is empty or has no data for the RUN_ID
3. ❌ Column names in your spreadsheet don't match expected names
4. ❌ Required sheets are missing (Calc_NetNew, Calc_RollForward, etc.)

## How to Debug

### Step 1: Check Apps Script Execution Logs

1. **Open your spreadsheet**: https://docs.google.com/spreadsheets/d/1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k/edit

2. **Open Apps Script**:
   - Extensions → Apps Script

3. **View Logs**:
   - Click **View** → **Logs** (or **Executions** for detailed history)

4. **Look for errors**:
   - Red error messages
   - "Scenario_MD sheet not found"
   - "Drivers_NetNew sheet not found"
   - Any execution failures

### Step 2: Check VW_Deltas Table

1. **Go to your spreadsheet**

2. **Look for the "VW_Deltas" tab**:
   - Does it exist?
   - Does it have data?
   - What's the most recent RUN_ID?

3. **Check the structure**:
   ```
   Expected columns:
   - RUN_ID
   - kind
   - Country
   - Region
   - Segment
   - Stream
   - FieldOrMetric
   - Before
   - After
   - Delta
   - Pct_Delta
   ```

4. **Verify data**:
   - Are there rows with `kind = "OUTPUT"`?
   - Are there rows with `FieldOrMetric = "ARR — Ending"`?
   - Do the Before/After columns have numbers (not zeros)?

### Step 3: Check Run_Registry

1. **Go to "Run_Registry" tab** in your spreadsheet

2. **Check the most recent run**:
   - Does it show status = "DONE"?
   - Or does it show status = "RUNNING" or "ERROR"?
   - What's the RUN_ID?

3. **Compare with VW_Deltas**:
   - Does VW_Deltas have rows for that same RUN_ID?

### Step 4: Verify Required Sheets Exist

Your spreadsheet needs these tabs for the integration to work:

**Required for LRP Model:**
- [ ] "Prompt" (or "LRP Simulation") - with cell B3
- [ ] "Scenario_MD" - LRP configuration
- [ ] "Settings" - target settings
- [ ] "Drivers_NetNew" - driver data
- [ ] "Calc_NetNew" - net new calculations
- [ ] "Calc_RollForward" - ARR rollforward

**Auto-created by Script:**
- [ ] "Run_Registry" - execution log
- [ ] "Drivers_Snapshot" - before/after drivers
- [ ] "Outputs_Snapshot" - before/after outputs  
- [ ] "VW_Deltas" - comparison table

### Step 5: Test the runPrompt() Function Directly

1. **In Apps Script editor**:
   - Extensions → Apps Script

2. **Add this test function**:
   ```javascript
   function testRunPrompt() {
     // First, set the prompt
     var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
     var promptSheet = ss.getSheetByName('Prompt') || ss.getSheetByName('LRP Simulation');
     promptSheet.getRange('B3').setValue('Increase EMEA ARR by $10M; Platform share ≤ 40%');
     
     // Then run the prompt
     runPrompt();
     
     // Check the results
     var runRegistry = ss.getSheetByName('Run_Registry');
     var lastRow = runRegistry.getLastRow();
     var runId = runRegistry.getRange(lastRow, 1).getValue();
     Logger.log('Run ID: ' + runId);
     
     var vwDeltas = ss.getSheetByName('VW_Deltas');
     Logger.log('VW_Deltas has ' + vwDeltas.getLastRow() + ' rows');
   }
   ```

3. **Run it**:
   - Select `testRunPrompt` from the function dropdown
   - Click ▶️ Run
   - Check the logs

### Step 6: Common Issues & Fixes

#### Issue: "Scenario_MD sheet not found"

**Fix**: Your spreadsheet is missing the Scenario_MD tab. This tab should have:
- Cell B3: Region selector
- Cell B4: Segment selector
- Cells B7, B8: Sensitivities
- Cells B13, B14: Headroom values
- Cells B19, B20: Max values

#### Issue: "VW_Deltas has 1 row" (only header)

**Fix**: The runPrompt() function didn't complete successfully. Check:
1. Do Drivers_Snapshot and Outputs_Snapshot have data?
2. Check Apps Script logs for errors during snapshot creation
3. Verify Drivers_NetNew and Calc_NetNew tabs exist

#### Issue: Column names don't match

**Fix**: Check that your calculation tabs have these exact column names:
- "ARR — Ending" (with em dash —, not hyphen -)
- "Country"
- "Region"
- "Segment"

#### Issue: All values are zeros

**Fix**: The BEFORE and AFTER snapshots might be identical. This happens when:
1. The scenario changes weren't applied (check applyDeltasToDrivers_ function)
2. The formulas in Calc_NetNew aren't updating
3. You need to recalculate the sheet

## Quick Fix: Add More Logging

Let's add debug logging to see what's happening:

1. **In Apps Script**, find the `readResultsFromVWDeltas` function

2. **Add these console.log statements**:

```javascript
function readResultsFromVWDeltas(ss, runId) {
  try {
    var vwDeltasSheet = ss.getSheetByName('VW_Deltas');
    
    if (!vwDeltasSheet) {
      console.warn('⚠️ VW_Deltas sheet not found');
      return { arrBefore: 0, arrAfter: 0, totalDelta: 0 };
    }
    
    var data = vwDeltasSheet.getDataRange().getValues();
    console.log('📊 VW_Deltas has ' + data.length + ' rows (including header)');
    
    var headers = data[0];
    console.log('📋 Headers:', headers);
    
    // ... rest of function
    
    // Before the return, add:
    console.log('✅ Final totals:', {
      runId: runId,
      arrBefore: arrBefore,
      arrAfter: arrAfter,
      totalDelta: totalDelta,
      matchingRows: matchingRowCount // add counter
    });
    
    // If no matching rows found
    if (arrBefore === 0 && arrAfter === 0) {
      console.warn('⚠️ No matching rows found for RUN_ID: ' + runId);
      console.warn('⚠️ Check that VW_Deltas has rows with:');
      console.warn('   - RUN_ID = "' + runId + '"');
      console.warn('   - kind = "OUTPUT"');
      console.warn('   - FieldOrMetric = "ARR — Ending"');
    }
    
    return {
      arrBefore: arrBefore,
      arrAfter: arrAfter,
      totalDelta: totalDelta
    };
    
  } catch (error) {
    console.error('❌ Error reading from VW_Deltas:', error);
    return { arrBefore: 0, arrAfter: 0, totalDelta: 0 };
  }
}
```

3. **Save and deploy**

4. **Run another test** and check the logs

## Expected Behavior

When working correctly, you should see:

**In Apps Script Logs:**
```
✅ Run complete: RUN_20251001_235526_988
📊 VW_Deltas has 45 rows (including header)
📋 Headers: [RUN_ID, kind, Country, Region, Segment, Stream, FieldOrMetric, Before, After, Delta, Pct_Delta]
✅ Final totals: {runId: "RUN_20251001_235526_988", arrBefore: 125500000, arrAfter: 140500000, totalDelta: 15000000, matchingRows: 12}
```

**In VW_Deltas:**
```
RUN_ID                  | kind   | Region | FieldOrMetric | Before      | After       | Delta
RUN_20251001_235526_988 | OUTPUT | EMEA   | ARR — Ending  | 45,000,000  | 50,000,000  | 5,000,000
RUN_20251001_235526_988 | OUTPUT | NA     | ARR — Ending  | 40,000,000  | 45,000,000  | 5,000,000
```

## Still Not Working?

If you're still seeing default values:

1. **Share your Apps Script logs** - Copy the entire log output
2. **Check VW_Deltas** - Take a screenshot of the last few rows
3. **Check Run_Registry** - What's the status of your last run?
4. **Test locally** - Try running on http://localhost:3001 and check browser console

## Test Locally First

Before deploying to Vercel, test locally:

```bash
# Your dev server is already running on http://localhost:3001
# Open browser to: http://localhost:3001
# Open DevTools (F12) and check Console tab
# Submit a prompt and watch for errors
```

Look for:
- ✅ "Apps Script response data: {success: true, runId: '...', ...}"
- ❌ "Error processing scenario query"
- ❌ "Cannot connect to Apps Script"

---

**The most common issue**: Your spreadsheet structure doesn't match what the script expects. Verify all required sheets exist and have the correct column names.

