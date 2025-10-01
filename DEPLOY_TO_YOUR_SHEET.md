# Deploy LRP Copilot Integration to Your Sheet

## Your Spreadsheet
**URL**: https://docs.google.com/spreadsheets/d/1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k/edit

**Spreadsheet ID**: `1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k`

---

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Open Apps Script Editor (1 minute)

1. **Open your spreadsheet**: 
   - Go to: https://docs.google.com/spreadsheets/d/1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k/edit
   
2. **Open Apps Script**:
   - Click **Extensions** → **Apps Script**
   - A new tab will open with the Apps Script editor

### Step 2: Copy the Integration Code (2 minutes)

1. **Open the file**: `INTEGRATED_APPS_SCRIPT.gs` (in this folder)

2. **Select ALL the code**:
   - Click in the file
   - Press `Ctrl+A` (Windows) or `Cmd+A` (Mac)
   - Or use your IDE's "Select All" feature

3. **Copy it**:
   - Press `Ctrl+C` (Windows) or `Cmd+C` (Mac)

4. **In the Apps Script editor**:
   - Delete any existing code (if there is any)
   - Paste the new code: `Ctrl+V` (Windows) or `Cmd+V` (Mac)
   - Click the **Save** icon (disk icon) or press `Ctrl+S` / `Cmd+S`

### Step 3: Deploy as Web App (2 minutes)

1. **Click the blue "Deploy" button** (top right corner)

2. **Select "New deployment"**

3. **Click the gear icon** ⚙️ next to "Select type"

4. **Choose "Web app"**

5. **Fill in the settings**:
   ```
   Description: LRP Copilot Web Integration
   Execute as: Me (your@email.com)
   Who has access: Anyone
   ```

6. **Click "Deploy"**

7. **Authorize access** (if prompted):
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" (if you see a warning)
   - Click "Go to [Your Project Name] (unsafe)"
   - Click "Allow"

8. **Copy the Web App URL**:
   - You'll see a URL like: `https://script.google.com/macros/s/AKfycby...long_string.../exec`
   - **IMPORTANT**: Copy this entire URL - you'll need it in the next step!

9. **Click "Done"**

### Step 4: Update Your Web App Config (30 seconds)

1. **Open the file**: `src/config/api.ts` (in this folder)

2. **Find this line** (around line 2):
   ```typescript
   GOOGLE_APPS_SCRIPT_URL: import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzz3ondZLtIoGvIjfKpmebmMSwwuVpV8oYe8DxwYX-vgccCx9qIhmO8i5hZZXznviaD/exec',
   ```

3. **Replace the URL** with YOUR deployment URL from Step 3:
   ```typescript
   GOOGLE_APPS_SCRIPT_URL: import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 'YOUR_NEW_URL_HERE',
   ```

4. **Save the file**: `Ctrl+S` / `Cmd+S`

### Step 5: Test Locally (1 minute)

1. **In your terminal**, navigate to the project folder:
   ```bash
   cd "/Users/bertharo/Scenario Builder"
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to: http://localhost:5173

4. **Test with a prompt**:
   - Enter: `"Increase EMEA ARR by $10M; Platform share ≤ 40%"`
   - Click Submit
   - Wait 10-15 seconds
   - **See the Scenario Analysis modal appear!** 🎉

---

## ✅ Verification Checklist

After deployment, verify these items:

### In Apps Script:
- [ ] Code is pasted and saved
- [ ] Deployment shows "Web app" type
- [ ] Web App URL is copied
- [ ] "Who has access" is set to "Anyone"

### In Your Project:
- [ ] `src/config/api.ts` has the new URL
- [ ] Spreadsheet ID is: `1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k`
- [ ] File is saved

### In Your Spreadsheet:
After running a test, these tabs should exist:
- [ ] Run_Registry (with your run data)
- [ ] Drivers_Snapshot (with BEFORE and AFTER rows)
- [ ] Outputs_Snapshot (with BEFORE and AFTER rows)
- [ ] VW_Deltas (with Before/After/Delta columns)

### In Your Web App:
- [ ] Scenario Analysis modal appears
- [ ] Shows real Run ID (like `RUN_20251001_223250_988`)
- [ ] Shows ARR Before value
- [ ] Shows ARR After value
- [ ] Shows Total Delta
- [ ] Shows Top Geography, Segment, Product

---

## 🔍 What to Check in Your Spreadsheet

Make sure your spreadsheet has these required tabs/sheets:

### Required Tabs (LRP Model):
- **Prompt** or **LRP Simulation** (with cell B3 for the prompt)
- **Scenario_MD** (with LRP Copilot configuration)
- **Settings** (with target settings)
- **Drivers_NetNew** (driver data)
- **Calc_NetNew** (calculations)
- **Calc_RollForward** (ARR rollforward)

### Auto-Created Tabs (by the script):
These will be created automatically on first run:
- **Run_Registry** (run history)
- **Drivers_Snapshot** (before/after drivers)
- **Outputs_Snapshot** (before/after outputs)
- **VW_Deltas** (comparison table)

---

## 🎯 What Happens When You Submit a Prompt

```
1. You type: "Increase EMEA ARR by $10M"
   ↓
2. Web app sends to Apps Script
   ↓
3. Apps Script writes to cell B3
   ↓
4. Executes runPrompt() function
   ↓
5. Takes BEFORE snapshots
   ↓
6. Applies scenario changes
   ↓
7. Takes AFTER snapshots
   ↓
8. Builds VW_Deltas table
   ↓
9. Reads results and returns to web app
   ↓
10. Scenario Analysis modal appears with:
    • Run ID
    • ARR Before (from VW_Deltas Before column)
    • ARR After (from VW_Deltas After column)
    • Total Delta (from VW_Deltas Delta column)
    • Top changes by Geography, Segment, Product
    • 4 Strategic Options
    • Narrative and Agent Analysis
```

---

## 🆘 Troubleshooting

### "Cannot connect to Apps Script"

**Check**:
- [ ] Did you click "Deploy" (not just "Save")?
- [ ] Is the URL in `src/config/api.ts` correct?
- [ ] Is "Who has access" set to "Anyone"?

**Fix**: Redeploy the Apps Script and update the URL

### "Prompt sheet not found"

**Check**:
- [ ] Does your spreadsheet have a tab named "Prompt" or "LRP Simulation"?
- [ ] Does cell B3 exist in that tab?

**Fix**: Create a "Prompt" tab with cell B3 accessible

### "VW_Deltas returns zero values"

**Check**:
- [ ] Do you have "Calc_NetNew" and "Calc_RollForward" tabs?
- [ ] Do these tabs have columns: "Country", "Region", "Segment", "ARR — Ending"?

**Fix**: Make sure your LRP model is set up with these calculation tabs

### "Scenario_MD sheet not found"

**Check**:
- [ ] Does your spreadsheet have "Scenario_MD" tab?
- [ ] Does it have cells B3, B4, B7, B8, B13, B14, B19, B20?

**Fix**: Add the Scenario_MD tab with required cells

### Web app shows loading forever

**Check**:
- [ ] Look at Apps Script logs: Extensions → Apps Script → View → Logs
- [ ] Check for error messages

**Fix**: Review the error in the logs and fix the issue

---

## 📊 Example: What You'll See

### In VW_Deltas Tab:
```
RUN_ID                  | kind   | Region | Metric       | Before      | After       | Delta      
RUN_20251001_223250_988 | OUTPUT | EMEA   | ARR — Ending | 45,000,000  | 50,000,000  | 5,000,000
RUN_20251001_223250_988 | OUTPUT | NA     | ARR — Ending | 40,000,000  | 45,000,000  | 5,000,000
RUN_20251001_223250_988 | OUTPUT | APAC   | ARR — Ending | 30,000,000  | 35,000,000  | 5,000,000
```

### In Web App:
```
┌──────────────────────────────────────────────────────────┐
│  Scenario Analysis      Run ID: RUN_20251001_223250_988  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ARR Before: $115,000,000.00                             │
│  ARR After:  $130,000,000.00                             │
│  Total Delta: +$15,000,000.00 (+13.04% change)          │
│                                                           │
│  🌍 Top Geography: EMEA  +$5,000,000.00                  │
│  👥 Top Segment: Enterprise  +$7,000,000.00              │
│  📦 Top Product: Platform  +$8,000,000.00                │
└──────────────────────────────────────────────────────────┘
```

---

## 🎉 You're Ready!

Once you complete these steps:
1. ✅ Apps Script deployed to your spreadsheet
2. ✅ Web App URL updated in config
3. ✅ Test shows Scenario Analysis modal
4. ✅ VW_Deltas table has data

**You can start using it for real scenario planning!**

---

## 📝 Notes

- **Spreadsheet ID is already configured**: `1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k`
- **Both files updated**: `INTEGRATED_APPS_SCRIPT.gs` and `src/config/api.ts`
- **No manual changes needed** to the spreadsheet ID
- **Just deploy and test!**

---

## 🚀 Deploy to Vercel (Optional)

Once you've tested locally and everything works:

```bash
git add .
git commit -m "Add LRP Copilot integration with sheet 1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k"
git push origin main
```

If connected to Vercel, it will auto-deploy.

**Environment Variables for Vercel**:
```
VITE_GOOGLE_APPS_SCRIPT_URL = your_deployed_apps_script_url
VITE_DEFAULT_SPREADSHEET_ID = 1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k
```

---

**Ready to deploy? Start with Step 1!** 🚀

