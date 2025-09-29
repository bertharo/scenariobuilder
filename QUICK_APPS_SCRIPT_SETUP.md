# Quick Apps Script Setup

## 🚨 **Current Issue: Apps Script Not Ready**

The error `net::ERR_FAILED` means your Apps Script doesn't have the `processScenarioQuery` function yet.

## 🔧 **Quick Fix (5 minutes):**

### **1. Go to Google Apps Script**
- Open: https://script.google.com
- Find your existing project (the one with URL ending in `/exec`)

### **2. Add This Function**
Add this function to your Apps Script:

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

### **3. Update doGet Function**
Make sure your `doGet` function includes the new action:

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
```

### **4. Deploy**
- Click "Deploy" → "New Deployment"
- Choose "Web app"
- Execute as: "Me"
- Who has access: "Anyone"
- Click "Deploy"
- Copy the new deployment URL

### **5. Update Vercel**
- Go to your Vercel dashboard
- Update environment variable:
  - `VITE_GOOGLE_APPS_SCRIPT_URL` = your new deployment URL

## 🧪 **Test It:**
1. Refresh your React app
2. Type: "Increase total ARR by $15M; EMEA ≤ $2M"
3. Click "View Comprehensive Analysis"
4. You should see the strategic options!

## 🔄 **Next Steps:**
Once this works, replace the test data in `processScenarioQuery` with your actual LRP Copilot logic.
