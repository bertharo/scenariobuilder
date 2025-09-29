# Apps Script Integration Guide

## 🎯 **Where Your Query Output Appears**

Based on your [Google Spreadsheet](https://docs.google.com/spreadsheets/d/13ZMlJWMPq9v_jreAYTZK3zOWP5fBQaVwWJ7bGkr-D6o/edit?gid=1815875864#gid=1815875864), here's exactly where users will see the comprehensive analysis:

### **1. React App - Query Interface**
```
┌─────────────────────────────────────────────────────────┐
│ 🤖 AI-Powered Scenario Builder                         │
│                                                         │
│ [Increase total ARR by $10M but EMEA can't increase...] │
│                                                         │
│ ✅ Scenario analysis completed! View detailed results   │
│                                                         │
│ [View Comprehensive Analysis] [Save Scenario] [Export]  │
└─────────────────────────────────────────────────────────┘
```

### **2. Comprehensive Analysis Modal**
When users click "View Comprehensive Analysis", they see:

#### **A. Summary Tab**
- **ARR Before**: $125,500,000
- **ARR After**: $135,500,000  
- **Total Delta**: +$10,000,000 (+8.0% change)
- **Largest Changes**:
  - Top Geography: NA (+$9M)
  - Top Segment: SMB (+$7M)
  - Top Product: SuiteB (+$5M)

#### **B. Narrative Tab**
- Complete analysis narrative
- Business impact explanation
- Agent execution summary

#### **C. Agent Analysis Tab**
- DataOps, ModelOps, Runner, QA, Constraints, Narrator, Audit
- Detailed execution logs and results

### **3. Google Spreadsheet Integration**
Your existing spreadsheet will be updated with:
- New scenario data in the "Scenarios" sheet
- Run ID tracking
- Complete audit trail

## 🔧 **Apps Script Integration Steps**

### **Step 1: Update Your Apps Script**

Replace your existing Apps Script with the enhanced version that includes the `processScenarioQuery` function:

```javascript
function processScenarioQuery(sheet, query) {
  try {
    // Generate unique run ID
    const runId = 'RUN_' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd_HHmmss_SSS');
    
    // Your existing LRP Copilot logic here
    // This should integrate with your current scenario processing
    
    // Example integration with your existing logic:
    const scenarioResult = runLRPCopilotScenario(query);
    
    return ContentService.createTextOutput(JSON.stringify({
      runId: runId,
      arrBefore: scenarioResult.arrBefore,
      arrAfter: scenarioResult.arrAfter,
      totalDelta: scenarioResult.totalDelta,
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
```

### **Step 2: Deploy Updated Apps Script**

1. Go to [Google Apps Script](https://script.google.com)
2. Open your existing project
3. Replace the code with the updated version
4. Deploy as web app with execute permissions for "Anyone"
5. Copy the new deployment URL

### **Step 3: Update Environment Variables**

In your Vercel deployment, update:
```
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_ID/exec
VITE_API_KEY=sk_lrp_prototype_2024_secure_key_12345
VITE_DEFAULT_SPREADSHEET_ID=13ZMlJWMPq9v_jreAYTZK3zOWP5fBQaVwWJ7bGkr-D6o
VITE_DEFAULT_SHEET_NAME=Scenarios
```

## 📊 **Expected Output Structure**

Based on your spreadsheet, the app will display:

### **Query**: "Increase Total ARR by $10M but EMEA can't increase by more than $1M and Enterprise can't grow by more than $3M"

### **Output**:
```json
{
  "runId": "RUN_20250924_150453_581",
  "arrBefore": 125500000,
  "arrAfter": 135500000,
  "totalDelta": 10000000,
  "modelSummary": {
    "topGeo": { "name": "NA", "value": 9000000 },
    "topSegment": { "name": "SMB", "value": 7000000 },
    "topProduct": { "name": "SuiteB", "value": 5000000 }
  },
  "narrative": "You asked: Increase Total ARR by $10M but EMEA can't increase by more than $1M and Enterprise can't grow by more than $3M\n\nResult: total ARR change = $10,000,000\nLargest contribution by Geo NA 9,000,000.\nLargest contribution by Segment SMB 7,000,000.\nSee agent tabs for details (DataOps, ModelOps, Runner, QA, Constraints, Narrator, Audit).",
  "agentTabs": {
    "dataOps": { "status": "completed", "data": "..." },
    "modelOps": { "status": "completed", "data": "..." },
    "runner": { "status": "completed", "data": "..." },
    "qa": { "status": "completed", "data": "..." },
    "constraints": { "status": "completed", "data": "..." },
    "narrator": { "status": "completed", "data": "..." },
    "audit": { "status": "completed", "data": "..." }
  }
}
```

## 🚀 **User Experience Flow**

1. **User types query**: "Increase total ARR by $10M but EMEA can't increase by more than $1M"
2. **App processes**: Sends query to your Apps Script
3. **Apps Script runs**: Your existing LRP Copilot logic executes
4. **Results displayed**: Comprehensive analysis modal shows:
   - ARR before/after with deltas
   - Model summary with largest changes
   - Complete narrative
   - Agent execution details
5. **Data saved**: Results stored in Google Spreadsheet
6. **Export options**: Users can export, save, or share results

## 🔗 **Integration Points**

- **React App** ↔ **Google Apps Script** ↔ **Google Spreadsheet**
- **Natural Language** → **Scenario Processing** → **Comprehensive Analysis**
- **Real-time Results** → **Persistent Storage** → **Export/Share Options**

Your existing LRP Copilot logic will power the comprehensive analysis that users see in the React app! 🎉
