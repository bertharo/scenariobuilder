# Scenario Builder Output Guide

## 🎯 Where to Find Your Query Results

### 1. **Dashboard - Query Interface (Top)**
```
┌─────────────────────────────────────────────────────────┐
│ 🤖 AI-Powered Scenario Builder                         │
│                                                         │
│ [Increase total ARR by $5M                    ] [Send]  │
│                                                         │
│ ✅ Created scenario: Increase ARR by $5M               │
│                                                         │
│ Suggestions:                                           │
│ • View the generated scenario: "Increase ARR by $5M"   │
│ • Modify the time series data to refine the scenario   │
│ • Add additional constraints or variables              │
│ • Compare with existing scenarios                       │
└─────────────────────────────────────────────────────────┘
```

### 2. **Dashboard - Recent Scenarios Section**
```
┌─────────────────────────────────────────────────────────┐
│ Recent Scenarios                                       │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📄 Increase ARR by $5M                             │ │
│ │ Generated from query: "Increase total ARR by $5M"  │ │
│ │ Status: Draft                    [Edit Scenario]   │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3. **Scenarios Page - Full Details**
```
┌─────────────────────────────────────────────────────────┐
│ Scenarios                                              │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📄 Increase ARR by $5M                             │ │
│ │ Generated from query: "Increase total ARR by $5M"  │ │
│ │ Status: Draft                    [Edit Scenario]   │ │
│ │                                                     │ │
│ │ Variables: 1    Tags: ai-generated, increase, arr  │ │
│ │ Created: Today  Updated: Today                     │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 4. **Google Sheets - Data Storage**
```
Spreadsheet: LRP Copilot (Prototype) vWDAY
Sheet: Scenarios

| Scenario ID | Name                | Description                    | Status | Variables |
|-------------|---------------------|--------------------------------|--------|-----------|
| scenario-123| Increase ARR by $5M | Generated from query: "..."    | draft  | 1         |
```

## 🔍 **Detailed Output Structure**

### **Generated Scenario Data:**
```json
{
  "id": "scenario-123",
  "name": "Increase ARR by $5M",
  "description": "Generated from query: 'Increase total ARR by $5M'",
  "status": "draft",
  "variables": [
    {
      "variableId": "arr-variable-id",
      "timeSeries": [
        { "year": 2024, "value": 1000000, "confidence": "medium" },
        { "year": 2025, "value": 1500000, "confidence": "medium" },
        { "year": 2026, "value": 2000000, "confidence": "medium" }
      ],
      "assumptions": [
        "Based on query: Increase total ARR by $5M",
        "Target increase of $5000000USD",
        "Global impact"
      ]
    }
  ],
  "tags": ["ai-generated", "increase", "arr"]
}
```

## 🚀 **How to Access Each Output:**

### **1. Immediate Feedback:**
- Type query → See success message in Query Interface
- View suggestions for next steps

### **2. Scenario Details:**
- Click "Edit Scenario" on any scenario card
- See full time series data, assumptions, and variables

### **3. Google Sheets Data:**
- Open your Google Spreadsheet
- Navigate to "Scenarios" sheet
- See all generated scenarios in tabular format

### **4. Export Options:**
- Use "Export" button to download scenarios
- Export to Excel, CSV, or PDF formats

## 📊 **What Gets Generated:**

For query: **"Increase total ARR by $5M"**

1. **Scenario Name**: "Increase ARR by $5M"
2. **Time Series**: 5 years of projected ARR values
3. **Variables**: ARR variable with calculated projections
4. **Assumptions**: Business logic and constraints
5. **Tags**: Automatic categorization
6. **Sensitivity**: Optimistic/pessimistic ranges

## 🎯 **Next Steps After Query:**

1. **Review** the generated scenario
2. **Edit** time series data if needed
3. **Add** more variables or constraints
4. **Compare** with other scenarios
5. **Export** for presentations or analysis
