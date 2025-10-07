# Quick Check: Does Your Spreadsheet Have These?

Open your spreadsheet: https://docs.google.com/spreadsheets/d/1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k/edit

## Required Tabs (Must Exist)

Look at the tabs at the bottom of your spreadsheet. Do you have:

- [ ] **Prompt** (or "LRP Simulation" or "LRP Copilot — Prompt")
  - With cell B3 for entering prompts
  
- [ ] **Scenario_MD** 
  - With cells B3, B4, B7, B8, B13, B14, B19, B20
  - This tab has your LRP model configuration
  
- [ ] **Settings**
  - With cell B1 for target ARR
  
- [ ] **Drivers_NetNew**
  - With columns: Country, Region, Segment, Stream, Win Rate, Landing ASP, etc.
  
- [ ] **Calc_NetNew**
  - With calculated ARR values
  - Columns include: "ARR — Landing Total", "ARR — Attach Total", etc.
  
- [ ] **Calc_RollForward**
  - With final ARR rollforward
  - Must have column: "ARR — Ending"

## Auto-Created Tabs (Created on First Run)

After running once, you should also see:

- [ ] **Run_Registry** - List of all runs
- [ ] **Drivers_Snapshot** - Before/After driver snapshots
- [ ] **Outputs_Snapshot** - Before/After output snapshots
- [ ] **VW_Deltas** - The comparison table (THIS IS THE KEY!)

## If You're Missing Required Tabs

The script **requires** your LRP model structure to exist first. If you don't have these tabs, the integration can't work because there's no data to capture.

### What to Do:

1. **If you have a working LRP model**: Make sure all the calculation tabs exist
2. **If you're starting fresh**: You need to build the LRP model structure first
3. **If tabs have different names**: Update the Apps Script to use your tab names

## Check VW_Deltas Specifically

This is the most important tab. Open it and look for:

1. **Does it have data?**
   - Should have multiple rows (not just the header)
   
2. **Check the RUN_ID column**:
   - Should have values like `RUN_20251001_235526_988`
   
3. **Check the "kind" column**:
   - Should have rows with "OUTPUT"
   
4. **Check the "FieldOrMetric" column**:
   - Should have rows with "ARR — Ending" (note: em dash —, not hyphen -)
   
5. **Check Before/After columns**:
   - Should have numbers (like 45000000, not zeros)

## Example of What VW_Deltas Should Look Like

```
RUN_ID                  | kind   | Country | Region | Segment    | Stream | FieldOrMetric | Before      | After       | Delta      | Pct_Delta
RUN_20251001_235526_988 | OUTPUT |         | EMEA   | Enterprise |        | ARR — Ending  | 45,000,000  | 50,000,000  | 5,000,000  | 0.1111
RUN_20251001_235526_988 | OUTPUT |         | EMEA   | SMB        |        | ARR — Ending  | 30,000,000  | 35,000,000  | 5,000,000  | 0.1667
RUN_20251001_235526_988 | OUTPUT |         | NA     | Enterprise |        | ARR — Ending  | 40,000,000  | 45,000,000  | 5,000,000  | 0.1250
```

If you don't see data like this, the runPrompt() function isn't completing successfully.

## What to Check in Apps Script Logs

1. Go to: Extensions → Apps Script
2. Click: View → Executions
3. Look for your most recent execution
4. Click on it to see the log

**Look for errors like:**
- "Scenario_MD sheet not found"
- "Drivers_NetNew sheet not found"
- "Cannot read property..."
- Any red error messages

## Most Likely Issues

### Issue 1: Missing Tabs

**Symptom**: Error says "sheet not found"

**Fix**: Your spreadsheet is missing required tabs. The script needs your LRP model structure to exist.

### Issue 2: Wrong Column Names

**Symptom**: VW_Deltas is created but has no data (just header row)

**Fix**: Your calculation tabs might have different column names than expected. Check that you have:
- "ARR — Ending" (with em dash)
- "Country", "Region", "Segment"
- "Win Rate", "Landing ASP — HCM", etc.

### Issue 3: Formulas Not Recalculating

**Symptom**: VW_Deltas shows Before = After (no delta)

**Fix**: The spreadsheet formulas might not be updating. Try:
- Force recalculation in Google Sheets
- Check that Calc_NetNew and Calc_RollForward have formulas (not static values)

### Issue 4: applyDeltasToDrivers_ Not Working

**Symptom**: Scenario runs but nothing changes

**Fix**: The function that applies changes to your drivers might need to be implemented. This function should:
- Update Win Rate in Drivers_NetNew
- Update Landing ASP in Drivers_NetNew
- Apply the deltas based on your prompt

---

**Next Step**: Open your spreadsheet and check if all these tabs exist. Report back what you find!

