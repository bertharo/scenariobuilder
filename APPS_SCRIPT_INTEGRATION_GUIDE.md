# Apps Script Integration Guide

## 🎯 **Ready for Real Apps Script Integration!**

Your React app is now configured to work with your actual LRP Copilot Apps Script instead of mock data.

## 🔧 **What You Need to Do:**

### **1. Update Your Apps Script**

Replace the `processScenarioQuery` function in your Apps Script with your actual LRP Copilot logic:

```javascript
function processScenarioQuery(sheet, query) {
  try {
    // Your existing LRP Copilot logic here
    // This should integrate with your existing agents and generate strategic options
    
    const runId = 'RUN_' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd_HHmmss_SSS');
    
    // Call your existing LRP Copilot functions
    const scenarioResult = runLRPCopilotScenario(query);
    
    // Format the response to match the expected structure
    const result = {
      runId: runId,
      arrBefore: scenarioResult.arrBefore,
      arrAfter: scenarioResult.arrAfter,
      totalDelta: scenarioResult.totalDelta,
      prompt: query,
      options: scenarioResult.strategicOptions, // Your generated options
      modelSummary: {
        topGeo: scenarioResult.topGeo,
        topSegment: scenarioResult.topSegment,
        topProduct: scenarioResult.topProduct
      },
      narrative: scenarioResult.narrative,
      agentTabs: {
        dataOps: scenarioResult.dataOps,
        modelOps: scenarioResult.modelOps,
        runner: scenarioResult.runner,
        qa: scenarioResult.qa,
        constraints: scenarioResult.constraints,
        narrator: scenarioResult.narrator,
        audit: scenarioResult.audit
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

### **2. Expected Data Structure**

Your Apps Script should return data in this exact format:

```javascript
{
  "runId": "RUN_20250924_150453_581",
  "arrBefore": 125500000,
  "arrAfter": 140500000,
  "totalDelta": 15000000,
  "prompt": "Increase total ARR by $15M; EMEA ≤ $2M",
  "options": [
    {
      "id": "option-1",
      "title": "Option 1: Presentation Rate Only",
      "description": "Top-of-funnel-led, higher risk",
      "riskLevel": "high",
      "approach": "Focus on increasing presentation rate through better lead generation",
      "arrChange": 15000000,
      "metrics": {
        "presentationRate": { "old": 10, "new": 12 }
      }
    },
    {
      "id": "option-2",
      "title": "Option 2: Win Rate Only",
      "description": "Conversion-led, medium risk",
      "riskLevel": "medium",
      "approach": "Improve sales conversion through better qualification and closing",
      "arrChange": 15000000,
      "metrics": {
        "winRate": { "old": 21, "new": 25 }
      }
    },
    {
      "id": "option-3",
      "title": "Option 3: ASP Only",
      "description": "Price-led, medium-low risk",
      "riskLevel": "medium-low",
      "approach": "Increase average selling price through premium positioning",
      "arrChange": 15000000,
      "metrics": {
        "asp": { "old": 345000, "new": 370000 }
      }
    },
    {
      "id": "option-4",
      "title": "Option 4: Blended",
      "description": "Blended, low risk",
      "riskLevel": "low",
      "approach": "Combined approach across multiple metrics for balanced growth",
      "arrChange": 15000000,
      "metrics": {
        "presentationRate": { "old": 10, "new": 11 },
        "winRate": { "old": 21, "new": 24 },
        "asp": { "old": 345000, "new": 350000 }
      }
    }
  ],
  "modelSummary": {
    "topGeo": { "name": "NA", "value": 9000000 },
    "topSegment": { "name": "SMB", "value": 7000000 },
    "topProduct": { "name": "SuiteB", "value": 5000000 }
  },
  "narrative": "You asked: Increase total ARR by $15M; EMEA ≤ $2M\n\nResult: total ARR change = $15,000,000\nEMEA constraint: ≤ $2M\nLargest contribution by Geo NA 9,000,000.\nLargest contribution by Segment SMB 7,000,000.\nSee agent tabs for details (DataOps, ModelOps, Runner, QA, Constraints, Narrator, Audit).",
  "agentTabs": {
    "dataOps": { "status": "completed", "data": "Your DataOps results" },
    "modelOps": { "status": "completed", "data": "Your ModelOps results" },
    "runner": { "status": "completed", "data": "Your Runner results" },
    "qa": { "status": "completed", "data": "Your QA results" },
    "constraints": { "status": "completed", "data": "Your Constraints results" },
    "narrator": { "status": "completed", "data": "Your Narrator results" },
    "audit": { "status": "completed", "data": "Your Audit results" }
  }
}
```

### **3. Strategic Options Requirements**

Each option in the `options` array should have:

- **id**: Unique identifier (e.g., "option-1", "option-2")
- **title**: Display name (e.g., "Option 1: Presentation Rate Only")
- **description**: Risk description (e.g., "Top-of-funnel-led, higher risk")
- **riskLevel**: One of "low", "medium", "medium-low", "high"
- **approach**: Detailed approach description
- **arrChange**: ARR change amount (number)
- **metrics**: Object with metric changes:
  - `presentationRate`: `{ old: number, new: number }`
  - `winRate`: `{ old: number, new: number }`
  - `asp`: `{ old: number, new: number }`

### **4. Deploy Your Updated Apps Script**

1. Go to [Google Apps Script](https://script.google.com)
2. Open your existing project
3. Replace the `processScenarioQuery` function with your LRP Copilot logic
4. Deploy as web app with execute permissions for "Anyone"
5. Copy the new deployment URL

### **5. Update Environment Variables**

In your Vercel deployment, ensure these environment variables are set:

```
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_API_KEY=sk_lrp_prototype_2024_secure_key_12345
VITE_DEFAULT_SPREADSHEET_ID=13ZMlJWMPq9v_jreAYTZK3zOWP5fBQaVwWJ7bGkr-D6o
VITE_DEFAULT_SHEET_NAME=Scenarios
```

## 🚀 **How It Works Now:**

1. **User types query**: "Increase total ARR by $15M; EMEA ≤ $2M"
2. **React app calls**: Your Apps Script `processScenarioQuery` function
3. **Apps Script runs**: Your LRP Copilot logic with all agents
4. **Apps Script returns**: Strategic options with risk assessment
5. **React app displays**: Interactive options interface
6. **User selects option**: Clicks to choose preferred strategy
7. **User saves scenario**: Navigates to summary with selected option

## 🔍 **Testing Your Integration:**

1. **Deploy your updated Apps Script**
2. **Update Vercel environment variables**
3. **Test with a query**: "Increase total ARR by $15M; EMEA ≤ $2M"
4. **Check browser console** for any errors
5. **Verify data structure** matches expected format

## 📝 **Error Handling:**

The app will show helpful error messages if:
- Apps Script is not accessible
- Response format is invalid
- Required fields are missing
- Network errors occur

Your React app is now ready to work with your real LRP Copilot Apps Script! 🎉
