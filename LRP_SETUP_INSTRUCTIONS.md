# LRP Simulation - Apps Script Setup Instructions

## 🎯 Goal
Connect your React app (https://scenariobuilder.vercel.app/) to your LRP Simulation spreadsheet so that:
1. Natural language prompts from the React app get written to cell B1
2. The spreadsheet calculates the 4 strategic options
3. The options are read back and displayed in the React app

---

## 📋 Step 1: Deploy the Apps Script

### 1.1 Open Your Spreadsheet
Open this spreadsheet: https://docs.google.com/spreadsheets/d/1JfrPCBtVPiK-9XkrIhMTscXDnfElaNrE66lh23x6TU8/edit

### 1.2 Open Apps Script Editor
- Click **Extensions** → **Apps Script**
- This will open the Apps Script editor in a new tab

### 1.3 Paste the Code
- Delete any existing code in the editor
- Copy ALL the code from `LRP_APPS_SCRIPT.js` (in this folder)
- Paste it into the Apps Script editor

### 1.4 Verify the Spreadsheet ID
Look at line 7 in the code:
```javascript
var SPREADSHEET_ID = '1JfrPCBtVPiK-9XkrIhMTscXDnfElaNrE66lh23x6TU8';
```
This should match your spreadsheet ID. ✅ Already correct!

### 1.5 Verify the Sheet Name
Look at line 8:
```javascript
var SHEET_NAME = 'LRP Simulation';
```
**Important:** Check your spreadsheet tab name. If it's different, update this line.

Common tab names:
- `LRP Simulation` (default)
- `Sheet1` (if it's the first sheet)
- `Output Cards` (if that's your main tab)

### 1.6 Test the Script (Optional but Recommended)
- In the Apps Script editor, select the `test` function from the dropdown
- Click the **Run** button (▶️)
- You may need to authorize the script (click "Review Permissions")
- Check the logs (View → Logs) to see if it works

### 1.7 Deploy as Web App
- Click **Deploy** → **New deployment**
- Click the gear icon ⚙️ next to "Select type"
- Choose **Web app**
- Set the following:
  - **Description**: "LRP Simulation API"
  - **Execute as**: "Me"
  - **Who has access**: "Anyone"
- Click **Deploy**
- **IMPORTANT**: Copy the Web app URL (it looks like: `https://script.google.com/macros/s/AKfycby.../exec`)

---

## 🔗 Step 2: Connect Your React App

### 2.1 Update Environment Variables in Vercel

Go to your Vercel dashboard:
1. Open https://vercel.com/dashboard
2. Select your project (Scenario Builder)
3. Go to **Settings** → **Environment Variables**
4. Update or add these variables:

```bash
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_URL/exec
VITE_DEFAULT_SPREADSHEET_ID=1JfrPCBtVPiK-9XkrIhMTscXDnfElaNrE66lh23x6TU8
VITE_DEFAULT_SHEET_NAME=LRP Simulation
```

**Replace** `YOUR_NEW_DEPLOYMENT_URL` with the URL you copied in step 1.7.

### 2.2 Redeploy Your App
After updating environment variables, redeploy:
- Go to **Deployments** tab
- Click **Redeploy** on the latest deployment
- OR push a new commit to trigger a deployment

---

## 🧪 Step 3: Test the Integration

### 3.1 Open Your React App
Go to https://scenariobuilder.vercel.app/

### 3.2 Test with a Prompt
1. Type a natural language query, for example:
   ```
   Increase total ARR by $5M
   ```
2. Click **"View Comprehensive Analysis"**

### 3.3 What Should Happen
✅ The prompt is written to cell B1 in your spreadsheet
✅ The React app reads the 4 options from your spreadsheet
✅ You see the options displayed in the analysis view

### 3.4 Check Your Spreadsheet
Open your spreadsheet and verify:
- Cell B1 should now contain your prompt
- The 4 options should have their data (feasibility scores, metrics, ARR changes)

---

## 🔍 Troubleshooting

### Issue 1: "Cannot connect to Apps Script"
**Solution**: 
- Check that your Apps Script is deployed as a web app
- Verify the deployment URL is correct in Vercel
- Make sure "Who has access" is set to "Anyone"

### Issue 2: "Invalid response format"
**Solution**:
- Check the sheet name in the Apps Script code matches your actual tab name
- Run the `test()` function in Apps Script editor to see the output
- Check Apps Script logs for errors

### Issue 3: Prompt not appearing in B1
**Solution**:
- Verify cell B1 is not protected or locked
- Check that the sheet name is correct
- Look at Apps Script logs for write errors

### Issue 4: Options not displaying correctly
**Solution**:
- Verify the cell ranges in `readOptionsFromSheet()` match your spreadsheet layout
- Make sure the cells contain numbers (not text)
- Check that formulas are calculating correctly

---

## 📊 Cell Mapping Reference

The Apps Script reads data from these cells:

### Option 1: Presentation Rate Only
- Feasibility Score: **B4**
- Old Presentation Rate: **B6**
- New Presentation Rate: **B7**
- ARR Change: **B9**

### Option 2: Win Rate Only
- Feasibility Score: **E4**
- Old Win Rate: **D6**
- New Win Rate: **D7**
- ARR Change: **D9**

### Option 3: ASP Only
- Feasibility Score: **B13**
- Old ASP: **B15**
- New ASP: **B16**
- ARR Change: **B18**

### Option 4: Blended
- Feasibility Score: **D13**
- Old Presentation Rate: **D15**
- New Presentation Rate: **D16**
- Old Win Rate: **D17**
- New Win Rate: **D18**
- Old ASP: **D19**
- New ASP: **D20**
- ARR Change: **D22**

**If your spreadsheet layout is different**, update the cell references in the `readOptionsFromSheet()` function.

---

## ✅ Success Checklist

- [ ] Apps Script code is pasted and saved
- [ ] Spreadsheet ID is correct
- [ ] Sheet name matches your tab name
- [ ] Apps Script is deployed as web app
- [ ] Deployment URL is copied
- [ ] Vercel environment variables are updated
- [ ] React app is redeployed
- [ ] Test prompt works end-to-end
- [ ] Prompt appears in cell B1
- [ ] Options display correctly in React app

---

## 🎉 You're Done!

Your React app is now connected to your LRP Simulation spreadsheet. Every time you enter a prompt:
1. It writes to cell B1
2. Your spreadsheet calculates the scenarios
3. The results are displayed in the React app

**Next Steps:**
- Customize the cell mappings if your layout is different
- Add more sophisticated prompt parsing
- Enhance the narrative generation logic

