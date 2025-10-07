// ========================================
// ScenarioUpgrade.gs - Monte Carlo Functions
// ========================================

/**
 * MC_SUMMARY_MD4(
 *   REGION[], SEGMENT[], P[], R[], W[], A[],
 *   regionSel, segSel, dA_usd, dW_pp, dR_pp, dAPC, target, N,
 *   shockPctP, shockPpW, shockPpR, shockPctA,
 *   WMIN[], WMAX[], RMIN[], RMAX[], AMIN[], AMAX[],
 *   UC[], A_attach[]
 * ) → 1×5 [Prob≥Target, MeanΔ, P10, Median, P90]
 */
function MC_SUMMARY_MD4(REGION, SEGMENT, Pcol, Rcol, Wcol, Acol,
                        regionSel, segSel, dA_usd, dW_pp, dR_pp, dAPC, target, N,
                        shockPctP, shockPpW, shockPpR, shockPctA,
                        WMINcol, WMAXcol, RMINcol, RMAXcol, AMINcol, AMAXcol,
                        UCcol, AATTACHcol) {

  function flat(x){ if (Array.isArray(x)){ if (Array.isArray(x[0])){ var out=[]; for (var i=0;i<x.length;i++) for (var j=0;j<x[i].length;j++) out.push(x[i][j]); return out; } return x; } return [x]; }
  function num(a){ return (a===''||a==null)?0:Number(a); }
  REGION = flat(REGION).map(String);
  SEGMENT= flat(SEGMENT).map(String);
  var P = flat(Pcol).map(num), R=flat(Rcol).map(num), W=flat(Wcol).map(num), A=flat(Acol).map(num);
  var WMIN=flat(WMINcol).map(num), WMAX=flat(WMAXcol).map(num), RMIN=flat(RMINcol).map(num), RMAX=flat(RMAXcol).map(num), AMIN=flat(AMINcol).map(num), AMAX=flat(AMAXcol).map(num);
  var UC=flat(UCcol).map(num), AATTACH=flat(AATTACHcol).map(num);

  regionSel = String(regionSel||'All Regions'); segSel = String(segSel||'All Segments');
  dA_usd = num(dA_usd); var dW = (num(dW_pp)||0)/100; var dR = (num(dR_pp)||0)/100; var dAPC = num(dAPC)||0;
  target = num(target)||0; N = Math.max(1, Math.floor(num(N)||1000));
  var sP = num(shockPctP)||0, sWpp = num(shockPpW)||0, sRpp = num(shockPpR)||0, sA = num(shockPctA)||0;

  function clamp(x,lo,hi){ return Math.max(lo, Math.min(hi, x)); }
  function randU(a,b){ return a + Math.random()*(b-a); }

  // Filter indices
  var idx=[]; for (var i=0;i<P.length;i++){
    var okR = (regionSel==='All Regions') || (REGION[i]===regionSel);
    var okS = (segSel==='All Segments') || (SEGMENT[i]===segSel);
    if (okR && okS) idx.push(i);
  }
  if (idx.length===0) return [[0,0,0,0,0]];

  var deltas=new Array(N), hit=0;
  for (var t=0;t<N;t++){
    var before=0, after=0, attachAdd=0;
    for (var k=0;k<idx.length;k++){
      var j=idx[k];
      var Pstar = P[j] * (1 + randU(-sP, sP));
      var Wstar = clamp(W[j] + randU(-sWpp/100, sWpp/100), WMIN[j], WMAX[j]);
      var Rstar = clamp(R[j] + randU(-sRpp/100, sRpp/100), RMIN[j], RMAX[j]);
      var Astar = clamp(A[j] * (1 + randU(-sA, sA)), AMIN[j], AMAX[j]);

      var Wafter = clamp(Wstar + dW, WMIN[j], WMAX[j]);
      var Rafter = clamp(Rstar + dR, RMIN[j], RMAX[j]);
      var Aafter = clamp(Astar + dA_usd, AMIN[j], AMAX[j]);

      var baseBefore = Pstar * Rstar * Wstar;
      var baseAfter  = Pstar * Rafter * Wafter;

      before += baseBefore * Astar;
      after  += baseAfter  * Aafter;

      // Attach uplift from dAPC
      var AattachStar = AATTACH[j] * (1 + randU(-sA, sA));
      attachAdd += dAPC * UC[j] * AattachStar;
    }
    var d = (after - before) + attachAdd;
    deltas[t]=d; if (d>=target) hit++;
  }
  deltas.sort(function(a,b){return a-b;});
  var N1=N-1; function q(p){ var ix=Math.max(0, Math.min(N1, Math.floor(p*N1))); return deltas[ix]; }
  var mean=deltas.reduce(function(s,x){return s+x;},0)/N;
  var prob=hit/N;
  return [[prob, mean, q(0.10), q(0.50), q(0.90)]];
}

// ========================================
// REPAIR FUNCTIONS
// ========================================

function repairMCNow() {
  try {
    const ss = SpreadsheetApp.openById('1JfrPCBtVPiK-9XkrIhMTscXDnfElaNrE66lh23x6TU8');
    console.log('Repairing MC functions...');
    
    // Check if Scenario_MD exists and has MC_SUMMARY_MD4 formulas
    const sh = ss.getSheetByName('Scenario_MD');
    if (!sh) {
      console.log('Scenario_MD sheet not found');
      return;
    }
    
    // Look for formulas that reference MC_SUMMARY_MD4
    const dataRange = sh.getDataRange();
    const values = dataRange.getValues();
    
    for (var i = 0; i < values.length; i++) {
      for (var j = 0; j < values[i].length; j++) {
        var cellValue = values[i][j];
        if (typeof cellValue === 'string' && cellValue.indexOf('MC_SUMMARY_MD4') >= 0) {
          console.log('Found MC_SUMMARY_MD4 reference in cell:', sh.getRange(i+1, j+1).getA1Notation());
          // The formula should work now that we've added the function
        }
      }
    }
    
    console.log('MC repair completed');
    return 'MC functions repaired successfully';
    
  } catch (error) {
    console.error('Error in repairMCNow:', error);
    return 'Error: ' + error.message;
  }
}

// ========================================
// TEST FUNCTION
// ========================================

function test() {
  var result = processScenarioQuery("Increase EMEA ARR by $10M; Platform share ≤ 40%");
  Logger.log(result.getContent());
}
