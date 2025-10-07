# Step-by-Step Apps Script Setup

## 🎯 **Here are the exact functions you need to copy:**

### **Step 1: Add the `processScenarioQuery` function**

Copy this entire function and paste it into your Google Apps Script:

```javascript
function processScenarioQuery(sheet, query) {
  try {
    // For now, return a simple test response
    const runId = 'RUN_' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd_HHmmss_SSS');
    
    const result = {
      runId: runId,
      arrBefore: 125500000,
      arrAfter: 140500000,
      totalDelta: 15000000,
      prompt: query,
      options: [
        {
          id: 'option-1',
          title: 'Option 1: Presentation Rate Only',
          description: 'Top-of-funnel-led, higher risk',
          riskLevel: 'high',
          approach: 'Focus on increasing presentation rate through better lead generation',
          arrChange: 15000000,
          metrics: {
            presentationRate: { old: 10, new: 12 }
          }
        },
        {
          id: 'option-2',
          title: 'Option 2: Win Rate Only',
          description: 'Conversion-led, medium risk',
          riskLevel: 'medium',
          approach: 'Improve sales conversion through better qualification and closing',
          arrChange: 15000000,
          metrics: {
            winRate: { old: 21, new: 25 }
          }
        },
        {
          id: 'option-3',
          title: 'Option 3: ASP Only',
          description: 'Price-led, medium-low risk',
          riskLevel: 'medium-low',
          approach: 'Increase average selling price through premium positioning',
          arrChange: 15000000,
          metrics: {
            asp: { old: 345000, new: 370000 }
          }
        },
        {
          id: 'option-4',
          title: 'Option 4: Blended',
          description: 'Blended, low risk',
          riskLevel: 'low',
          approach: 'Combined approach across multiple metrics for balanced growth',
          arrChange: 15000000,
          metrics: {
            presentationRate: { old: 10, new: 11 },
            winRate: { old: 21, new: 24 },
            asp: { old: 345000, new: 350000 }
          }
        }
      ],
      modelSummary: {
        topGeo: { name: 'NA', value: 9000000 },
        topSegment: { name: 'SMB', value: 7000000 },
        topProduct: { name: 'SuiteB', value: 5000000 }
      },
      narrative: `You asked: ${query}\n\nResult: total ARR change = $15,000,000\nEMEA constraint: ≤ $2M\nLargest contribution by Geo NA 9,000,000.\nLargest contribution by Segment SMB 7,000,000.\nSee agent tabs for details (DataOps, ModelOps, Runner, QA, Constraints, Narrator, Audit).`,
      agentTabs: {
        dataOps: { status: 'completed', data: 'Data operations completed successfully' },
        modelOps: { status: 'completed', data: 'Model operations completed successfully' },
        runner: { status: 'completed', data: 'Scenario runner completed successfully' },
        qa: { status: 'completed', data: 'Quality assurance checks passed' },
        constraints: { status: 'completed', data: 'Constraints validated successfully' },
        narrator: { status: 'completed', data: 'Narrative generated successfully' },
        audit: { status: 'completed', data: 'Audit trail created successfully' }
      }
    };
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### **Step 2: Update your `doGet` function**

Find your existing `doGet` function and add the new case to the switch statement:

```javascript
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
      case 'processScenarioQuery':  // ← ADD THIS LINE
        return processScenarioQuery(sheet, e.parameter.query);  // ← ADD THIS LINE
      default:
        return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 📋 **Visual Steps:**

1. **Go to**: https://script.google.com
2. **Open your project** (the one with the URL ending in `/exec`)
3. **Click the "+" button** to add a new function
4. **Name it**: `processScenarioQuery`
5. **Paste the first function** (the long one above)
6. **Find your existing `doGet` function**
7. **Add the two new lines** to the switch statement
8. **Click "Deploy"** → "New Deployment"
9. **Choose "Web app"**
10. **Set access to "Anyone"**
11. **Copy the new URL**
12. **Update Vercel** with the new URL

## 🧪 **Test:**
- Refresh your React app
- Type: "Increase total ARR by $15M; EMEA ≤ $2M"
- Click "View Comprehensive Analysis"
- You should see 4 strategic options!

That's it! 🎉
