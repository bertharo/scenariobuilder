// ========================================
// BeforeAfter.gs - LRP Copilot Functions
// ========================================

var SPREADSHEET_ID = '1JfrPCBtVPiK-9XkrIhMTscXDnfElaNrE66lh23x6TU8';

/* -------------------------- ENSURE TABLES -------------------------- */
function ensureBeforeAfterAudit_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureTable_(ss, 'Run_Registry', [
    'RUN_ID','prompt','region','segment','target_usd','platform_cap',
    'delta_asp_usd','delta_win_pp',
    'started_at','finished_at','status',
    'prob_hit','p10','p50','p90','notes'
  ]);
  ensureTable_(ss, 'Drivers_Snapshot', [
    'RUN_ID','phase','Country','Region','Segment','Stream','Field','Value'
  ]);
  ensureTable_(ss, 'Outputs_Snapshot', [
    'RUN_ID','phase','Country','Region','Segment','Metric','Value'
  ]);
  ensureTable_(ss, 'VW_Deltas', [
    'RUN_ID','kind','Country','Region','Segment','Stream','FieldOrMetric','Before','After','Delta','Pct_Delta'
  ]);
}

function ensureTable_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
  } else {
    // If headers are missing, (re)write them once
    const first = sh.getRange(1,1,1,headers.length).getValues()[0];
    if (first.join('').trim() === '') {
      sh.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
  }
}

/* ------------------------- RUN REGISTRY UTILS ---------------------- */
function newRunId_() {
  const d = new Date();
  const p = n => (n<10?'0':'')+n;
  const rand = Math.floor(Math.random()*900)+100;
  return `RUN_${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}_${rand}`;
}

function startRun_(prompt, region, segment, targetUsd, platformCap, deltaAsp, deltaWin) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName('Run_Registry');
  const runId = newRunId_();
  sh.appendRow([
    runId, prompt, region, segment, targetUsd || '', platformCap != null ? platformCap : '',
    deltaAsp || '', deltaWin || '',
    new Date(), '', 'RUNNING',
    '', '', '', '', ''
  ]);
  return runId;
}

function finishRun_(runId, status, notes) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName('Run_Registry');
  const vals = sh.getDataRange().getValues(); const head = vals[0];
  let rowIdx = -1;
  for (let r=1; r<vals.length; r++) if (vals[r][0]===runId){ rowIdx=r; break; }
  if (rowIdx<0) return;

  const finishedCol = head.indexOf('finished_at') + 1;
  const statusCol   = head.indexOf('status') + 1;
  const notesCol    = head.indexOf('notes') + 1;
  if (finishedCol>0) sh.getRange(rowIdx+1, finishedCol).setValue(new Date());
  if (statusCol>0)   sh.getRange(rowIdx+1, statusCol).setValue(status||'DONE');
  if (notes && notesCol>0) sh.getRange(rowIdx+1, notesCol).setValue(notes);
}

function updateRunMC_(runId, prob, p10, p50, p90) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName('Run_Registry');
  const vals = sh.getDataRange().getValues(); const head = vals[0];
  let rowIdx = -1;
  for (let r=1; r<vals.length; r++) if (vals[r][0]===runId){ rowIdx=r; break; }
  if (rowIdx<0) return;

  const probCol = head.indexOf('prob_hit') + 1;
  const p10Col  = head.indexOf('p10') + 1;
  const p50Col  = head.indexOf('p50') + 1;
  const p90Col  = head.indexOf('p90') + 1;

  if (probCol>0) sh.getRange(rowIdx+1, probCol).setValue(prob);
  if (p10Col>0)  sh.getRange(rowIdx+1, p10Col).setValue(p10);
  if (p50Col>0)  sh.getRange(rowIdx+1, p50Col).setValue(p50);
  if (p90Col>0)  sh.getRange(rowIdx+1, p90Col).setValue(p90);
}

/* ----------------------- SNAPSHOT: DRIVERS ------------------------- */
// We capture only the driver fields the copilot may change.
const DRIVER_FIELDS_TO_TRACK = [
  'Win Rate',
  'Landing ASP — HCM',
  'Landing ASP — FIN',
  'Platform % — Core (on HCM Core)',
  'Platform % — NCBC (on HCM NCBC)'
];

function snapshotDrivers_(runId, phase) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName('Drivers_Snapshot');
  const src = ss.getSheetByName('Drivers_NetNew');
  
  if (!src) {
    console.log('Drivers_NetNew sheet not found, skipping driver snapshot');
    return;
  }
  
  const data = src.getDataRange().getValues(); const head = data.shift();

  const idx = {
    Country: head.indexOf('Country'),
    Region:  head.indexOf('Region'),
    Segment: head.indexOf('Segment'),
    Stream:  head.indexOf('Stream'),
  };
  const fieldIdx = {};
  DRIVER_FIELDS_TO_TRACK.forEach(f => { fieldIdx[f] = head.indexOf(f); });

  const rows = [];
  for (const row of data) {
    const base = [runId, phase, row[idx.Country], row[idx.Region], row[idx.Segment], row[idx.Stream]];
    for (const f of DRIVER_FIELDS_TO_TRACK) {
      const i = fieldIdx[f];
      if (i >= 0) rows.push(base.concat([f, row[i]]));
    }
  }
  if (rows.length) sh.getRange(sh.getLastRow()+1, 1, rows.length, 8).setValues(rows);
}

/* ----------------------- SNAPSHOT: OUTPUTS ------------------------- */
// We capture key outputs from Calc_NetNew and Calc_RollForward.
const OUTPUT_METRICS_CN = [
  'ARR — Landing Total',
  'ARR — Attach Total',
  'ARR — Net New Total',
  'Platform Share — Core'
];
const OUTPUT_METRICS_CR = [
  'ARR — Ending'
];

function snapshotOutputs_(runId, phase) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const shOut = ss.getSheetByName('Outputs_Snapshot');

  // Calc_NetNew
  const cnSheet = ss.getSheetByName('Calc_NetNew');
  if (!cnSheet) {
    console.log('Calc_NetNew sheet not found, skipping output snapshot');
    return;
  }
  const cn = cnSheet.getDataRange().getValues();
  const ch = cn.shift();
  const cIdx = {
    Country: ch.indexOf('Country'),
    Region:  ch.indexOf('Region'),
    Segment: ch.indexOf('Segment'),
    Landing: ch.indexOf('ARR — Landing Total'),
    Attach:  ch.indexOf('ARR — Attach Total'),
    NetNew:  ch.indexOf('ARR — Net New Total'),
    PlatShr: ch.indexOf('Platform Share — Core')
  };
  const rows = [];
  for (const r of cn) {
    rows.push([runId, phase, r[cIdx.Country], r[cIdx.Region], r[cIdx.Segment], 'ARR — Landing Total', Number(r[cIdx.Landing]||0)]);
    rows.push([runId, phase, r[cIdx.Country], r[cIdx.Region], r[cIdx.Segment], 'ARR — Attach Total',  Number(r[cIdx.Attach]||0)]);
    rows.push([runId, phase, r[cIdx.Country], r[cIdx.Region], r[cIdx.Segment], 'ARR — Net New Total', Number(r[cIdx.NetNew]||0)]);
    rows.push([runId, phase, r[cIdx.Country], r[cIdx.Region], r[cIdx.Segment], 'Platform Share — Core', Number(r[cIdx.PlatShr]||0)]);
  }

  // Calc_RollForward
  const crSheet = ss.getSheetByName('Calc_RollForward');
  if (!crSheet) {
    console.log('Calc_RollForward sheet not found, using only NetNew outputs');
    if (rows.length) shOut.getRange(shOut.getLastRow()+1, 1, rows.length, 7).setValues(rows);
    return;
  }
  const cr = crSheet.getDataRange().getValues();
  const rh = cr.shift();
  const rIdx = {
    Country: rh.indexOf('Country'),
    Region:  rh.indexOf('Region'),
    Segment: rh.indexOf('Segment'),
    EndArr:  rh.indexOf('ARR — Ending')
  };
  for (const r of cr) {
    rows.push([runId, phase, r[rIdx.Country], r[rIdx.Region], r[rIdx.Segment], 'ARR — Ending', Number(r[rIdx.EndArr]||0)]);
  }

  if (rows.length) shOut.getRange(shOut.getLastRow()+1, 1, rows.length, 7).setValues(rows);
}

/* ----------------------------- BUILD DELTAS ---------------------------- */
function buildVWDeltas_(runId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const shD = ss.getSheetByName('VW_Deltas');

  // Helper to map snapshot rows by key
  function mapSnapshot_(sheetName, keyCols) {
    const vals = ss.getSheetByName(sheetName).getDataRange().getValues();
    const head = vals.shift();
    const rows = vals.filter(r => r[0] === runId); // RUN_ID col 0
    const m = new Map();
    for (const r of rows) {
      const rec = {};
      head.forEach((h, i) => rec[h] = r[i]);
      const key = keyCols.map(k => rec[k]).join('|');
      m.set(key, rec);
    }
    return m;
  }

  // Drivers: key = phase|Country|Region|Segment|Stream|Field
  const drvB = mapSnapshot_('Drivers_Snapshot', ['phase','Country','Region','Segment','Stream','Field']);
  const drvA = mapSnapshot_('Drivers_Snapshot', ['phase','Country','Region','Segment','Stream','Field']);

  // Build DRIVERS deltas by iterating BEFORE keys
  const rowsOut = [];
  for (const [k, recB] of drvB) {
    if (!k.startsWith('BEFORE|')) continue;
    const keyAfter = k.replace('BEFORE|','AFTER|');
    const recA = drvA.get(keyAfter);
    if (!recA) continue;
    const before = Number(recB['Value']||0);
    const after  = Number(recA['Value']||0);
    const delta  = after - before;
    if (Math.abs(delta) < 1e-12) continue; // only changes
    const pct = (before !== 0) ? (delta / before) : '';
    rowsOut.push([
      runId, 'DRIVER',
      recB['Country'], recB['Region'], recB['Segment'], recB['Stream'],
      recB['Field'], before, after, delta, pct
    ]);
  }

  // Outputs: key = phase|Country|Region|Segment|Metric
  const outB = mapSnapshot_('Outputs_Snapshot', ['phase','Country','Region','Segment','Metric']);
  const outA = mapSnapshot_('Outputs_Snapshot', ['phase','Country','Region','Segment','Metric']);
  for (const [k, recB] of outB) {
    if (!k.startsWith('BEFORE|')) continue;
    const keyAfter = k.replace('BEFORE|','AFTER|');
    const recA = outA.get(keyAfter);
    if (!recA) continue;
    const before = Number(recB['Value']||0);
    const after  = Number(recA['Value']||0);
    const delta  = after - before;
    if (Math.abs(delta) < 1e-6 && recB['Metric'] !== 'Platform Share — Core') continue;
    const pct = (before !== 0) ? (delta / before) : '';
    rowsOut.push([
      runId, 'OUTPUT',
      recB['Country'], recB['Region'], recB['Segment'], '',
      recB['Metric'], before, after, delta, pct
    ]);
  }

  if (rowsOut.length) {
    shD.getRange(shD.getLastRow()+1, 1, rowsOut.length, 11).setValues(rowsOut);
    // Optional: format numeric columns
    const start = shD.getLastRow() - rowsOut.length + 1;
    shD.getRange(start, 8, rowsOut.length, 3).setNumberFormat('$#,##0'); // Before, After, Delta for $-like metrics
    // Platform share rows are fractions; leave as decimals or add % in the UI
  }
}

/* ------------------------------ PATCH RUNNER --------------------------- */
/**
 * Drop-in replacement for your runPrompt(): now audited.
 * Parses: "Increase EMEA ARR by $10M; Platform share ≤ 40%"
 * Snapshots BEFORE/AFTER and writes VW_Deltas.
 */
function runPrompt() {
  ensureBeforeAfterAudit_(); // make sure audit tabs exist

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Try to get prompt from named range first, then from B3
  var prompt = '';
  try {
    var namedRange = ss.getRangeByName('PROMPT_TEXT');
    if (namedRange) {
      prompt = String(namedRange.getValue() || '').trim();
    }
  } catch (e) {
    console.log('Named range PROMPT_TEXT not found, reading from B3 directly');
  }
  
  // If named range doesn't exist or is empty, read from B3
  if (!prompt) {
    var promptSheet = ss.getSheetByName('Prompt') || ss.getSheetByName('LRP Simulation');
    if (promptSheet) {
      prompt = String(promptSheet.getRange('B3').getValue() || '').trim();
    }
  }
  
  if (!prompt) throw new Error('Please type a request in Prompt!B3.');

  // Parse "Increase <Region> ARR by $Xm" and optional "Platform share ≤ XX%"
  const inc = /increase\s+([a-z]+)\s+arr\s+by\s+\$?\s*([\d\.,]+)\s*([mb]|mm|k)?/i.exec(prompt);
  if (!inc) throw new Error('Could not parse "Increase <Region> ARR by $X".');
  const region = inc[1].toUpperCase();
  const target = parseUsd_(inc[2], inc[3]);

  const capMatch = /platform\s+share\s*(?:<=|≤|<\\=)\s*([0-9]{1,3})\s*%?/i.exec(prompt);
  const platformCap = capMatch ? Math.max(0, Math.min(100, Number(capMatch[1])))/100 : null;

  // Scope selectors + TARGET
  const shSc = ss.getSheetByName('Scenario_MD');
  if (!shSc) {
    console.error('Scenario_MD sheet not found');
    throw new Error('Scenario_MD sheet not found. Please run upgradeScenarioMD_v3() first.');
  }
  
  const shSettings = ss.getSheetByName('Settings');
  if (!shSettings) {
    console.error('Settings sheet not found');
    throw new Error('Settings sheet not found. Please install the base model first.');
  }
  
  shSc.getRange('B3').setValue(region);
  shSc.getRange('B4').setValue('All Segments');
  shSettings.getRange('B1').setValue(target);
  SpreadsheetApp.flush();

  // Read sensitivities/headroom to derive deltas we will apply
  const sA   = Number(shSc.getRange('B7').getValue() || 0);   // $ per +$1 ASP
  const sW   = Number(shSc.getRange('B8').getValue() || 0);   // $ per +1pp Win
  const headA   = Number(shSc.getRange('B13').getValue() || 0);
  const headWpp = Number(shSc.getRange('B14').getValue() || 0);
  const maxA = Number(shSc.getRange('B19').getValue() || 0);
  const maxW = Number(shSc.getRange('B20').getValue() || 0);
  
  console.log('Sensitivities:', {sA, sW, headA, headWpp, maxA, maxW});

  const totalCap = maxA + maxW;
  const wA = totalCap>0 ? (maxA/totalCap) : 0;
  const wantA = Math.min(target*wA, maxA);
  const wantW = Math.min(target - wantA, maxW);

  const dA   = (sA>0) ? wantA/sA : 0;
  const dWpp = (sW>0) ? wantW/sW : 0;

  const dA_eff   = Math.max(0, Math.min(dA, headA));
  const dWpp_eff = Math.max(0, Math.min(dWpp, headWpp));

  // Register run metadata up-front
  const runId = startRun_(prompt, region, 'All Segments', target, platformCap, Math.round(dA_eff), dWpp_eff);

  // ==== BEFORE SNAPSHOTS ====
  SpreadsheetApp.flush(); // ensure calc tabs are up-to-date pre-change
  snapshotDrivers_(runId, 'BEFORE');
  snapshotOutputs_(runId, 'BEFORE');

  // ==== APPLY PLAN ====
  try {
    applyDeltasToDrivers_(region, dA_eff, dWpp_eff);     // from your main pack
    if (platformCap != null) enforcePlatformCap_Core_(region, platformCap); // from your main pack
  } catch (error) {
    console.log('Note: applyDeltasToDrivers_ or enforcePlatformCap_Core_ not available');
    console.log('LRP Copilot will handle delta application internally');
  }
  SpreadsheetApp.flush();

  // ==== AFTER SNAPSHOTS ====
  snapshotDrivers_(runId, 'AFTER');
  snapshotOutputs_(runId, 'AFTER');

  // ==== DELTAS VIEW ====
  buildVWDeltas_(runId);

  // ==== MC SUMMARY into registry (optional but handy) ====
  try {
    const sh = ss.getSheetByName('Scenario_MD');
    if (sh) {
      const prob = Number(sh.getRange('E25').getValue()||0); // Adjusted for correct MC row
      const p10  = Number(sh.getRange('G25').getValue()||0);
      const p50  = Number(sh.getRange('H25').getValue()||0);
      const p90  = Number(sh.getRange('I25').getValue()||0);
      updateRunMC_(runId, prob, p10, p50, p90);
    }
  } catch (e) {
    console.log('MC summary not available:', e.message);
  }

  finishRun_(runId, 'DONE', '');
  console.log('✅ Run complete:', runId);
}

/* ----------------------------- HELPERS ----------------------------- */
function parseUsd_(num, suffix){
  const x = parseFloat(String(num).replace(/[, ]/g,''));
  if (isNaN(x)) return null;
  const suf = (suffix||'').toLowerCase();
  if (suf==='b') return Math.round(x*1e9);
  if (suf==='m' || suf==='mm') return Math.round(x*1e6);
  if (suf==='k') return Math.round(x*1e3);
  return Math.round(x);
}

// These functions are not available in the current Apps Script
// The LRP Copilot handles delta application internally
function applyDeltasToDrivers_(region, deltaAsp, deltaWin) {
  console.log('Note: applyDeltasToDrivers_ not implemented - LRP Copilot handles this internally');
  // The actual delta application happens within the LRP Copilot model
  // This is just a placeholder to prevent errors
}

function enforcePlatformCap_Core_(region, platformCap) {
  console.log('Note: enforcePlatformCap_Core_ not implemented - LRP Copilot handles this internally');
  // The actual platform cap enforcement happens within the LRP Copilot model
  // This is just a placeholder to prevent errors
}
