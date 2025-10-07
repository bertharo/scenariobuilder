// ========================================
// Prompt.gs - Prompt Processing Functions
// ========================================

var SPREADSHEET_ID = '1JfrPCBtVPiK-9XkrIhMTscXDnfElaNrE66lh23x6TU8';

// ========================================
// PROMPT PROCESSING FUNCTIONS
// ========================================

/**
 * Enhanced NLP prompt parsing
 */
function parseNLPPrompt(query) {
  console.log('Parsing NLP prompt:', query);
  
  // Validate input
  if (!query || typeof query !== 'string') {
    console.log('Invalid query provided:', query);
    return {
      region: 'EMEA',
      target: 10000000,
      constraints: [],
      intent: 'increase',
      metric: 'ARR'
    };
  }
  
  // Default values
  var parsed = {
    region: 'EMEA',
    target: 10000000,
    constraints: [],
    intent: 'increase',
    metric: 'ARR'
  };
  
  // Extract region (look for common region names)
  var regionPatterns = [
    /(\bNA\b|\bNorth America\b)/i,
    /(\bEMEA\b)/i,
    /(\bAPAC\b|\bAsia\b)/i,
    /(\bLATAM\b|\bLatin America\b)/i,
    /(\bUK\b|\bUnited Kingdom\b)/i,
    /(\bGermany\b)/i,
    /(\bFrance\b)/i,
    /(\bAustralia\b)/i
  ];
  
  for (var i = 0; i < regionPatterns.length; i++) {
    var match = query && query.match ? query.match(regionPatterns[i]) : null;
    if (match) {
      parsed.region = match[1].toUpperCase();
      break;
    }
  }
  
  // Extract intent (increase/decrease)
  if (query && /decrease|reduce|lower|drop/i.test(query)) {
    parsed.intent = 'decrease';
  } else if (query && /increase|boost|raise|grow/i.test(query)) {
    parsed.intent = 'increase';
  }
  
  // Extract dollar amount with various formats
  var amountPatterns = [
    /\$?(\d+(?:,\d+)*(?:\.\d+)?)\s*([mkb]|million|thousand|billion)?/i,
    /(\d+(?:,\d+)*(?:\.\d+)?)\s*([mkb]|million|thousand|billion)?/i
  ];
  
  for (var i = 0; i < amountPatterns.length; i++) {
    var match = query && query.match ? query.match(amountPatterns[i]) : null;
    if (match) {
      var amount = parseFloat(match[1].replace(/,/g, ''));
      var suffix = (match[2] || '').toLowerCase();
      
      if (suffix === 'm' || suffix === 'million') amount *= 1000000;
      if (suffix === 'k' || suffix === 'thousand') amount *= 1000;
      if (suffix === 'b' || suffix === 'billion') amount *= 1000000000;
      
      parsed.target = amount;
      break;
    }
  }
  
  // Extract constraints
  var constraints = [];
  
  // Platform share constraints
  var platformMatch = query && query.match ? query.match(/platform\s+share\s*(?:<=|≤|<\\=)?\s*(\d+(?:\.\d+)?)\s*%?/i) : null;
  if (platformMatch) {
    constraints.push('Platform share ≤ ' + platformMatch[1] + '%');
  }
  
  // Segment constraints
  if (query && /\benterprise\b/i.test(query)) {
    constraints.push('Enterprise segment focus');
  }
  if (query && /\bsmb\b/i.test(query)) {
    constraints.push('SMB segment focus');
  }
  
  // Geography constraints
  if (query && /\bglobal\b/i.test(query)) {
    constraints.push('Global scope');
  }
  
  // Time constraints
  var timeMatch = query && query.match ? query.match(/(\d+)\s*(year|quarter|month)/i) : null;
  if (timeMatch) {
    constraints.push(timeMatch[1] + ' ' + timeMatch[2] + ' timeline');
  }
  
  parsed.constraints = constraints;
  
  console.log('Parsed prompt result:', parsed);
  return parsed;
}

/**
 * Validate prompt requirements
 */
function validatePrompt(prompt) {
  var errors = [];
  
  if (!prompt || prompt.trim().length === 0) {
    errors.push('Prompt cannot be empty');
  }
  
  if (prompt.length > 500) {
    errors.push('Prompt too long (max 500 characters)');
  }
  
  // Check for required elements
  if (!/\$?\d+/.test(prompt)) {
    errors.push('Prompt should include a dollar amount');
  }
  
  if (!/(increase|decrease|boost|reduce)/i.test(prompt)) {
    errors.push('Prompt should specify increase or decrease');
  }
  
  if (!/(arr|revenue|sales)/i.test(prompt)) {
    errors.push('Prompt should mention ARR, revenue, or sales');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Generate prompt suggestions
 */
function generatePromptSuggestions() {
  return [
    'Increase EMEA ARR by $10M; Platform share ≤ 40%',
    'Boost North America revenue by $25M in Enterprise segment',
    'Decrease SMB churn by 5% while maintaining ASP',
    'Increase global ARR by $50M with focus on new customer acquisition',
    'Optimize APAC pricing to increase ASP by 15%',
    'Increase win rate in UK market by 10 percentage points'
  ];
}

// ========================================
// PROMPT EXECUTION FUNCTIONS
// ========================================

/**
 * Execute prompt processing workflow
 */
function executePromptWorkflow(query) {
  try {
    console.log('Starting prompt workflow for:', query);
    
    // Validate prompt
    var validation = validatePrompt(query);
    if (!validation.valid) {
      throw new Error('Invalid prompt: ' + validation.errors.join(', '));
    }
    
    // Parse prompt
    var parsedPrompt = parseNLPPrompt(query);
    
    // Write to spreadsheet
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var promptSheet = ss.getSheetByName('Prompt') || ss.getSheetByName('LRP Simulation');
    
    if (promptSheet) {
      promptSheet.getRange('B3').setValue(query);
      console.log('Prompt written to B3');
    }
    
    return {
      success: true,
      parsedPrompt: parsedPrompt,
      message: 'Prompt processed successfully'
    };
    
  } catch (error) {
    console.error('Error in prompt workflow:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get prompt history
 */
function getPromptHistory() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var runRegistry = ss.getSheetByName('Run_Registry');
    
    if (!runRegistry) {
      return [];
    }
    
    var data = runRegistry.getDataRange().getValues();
    var headers = data[0];
    var promptIndex = headers.indexOf('prompt');
    var runIdIndex = headers.indexOf('RUN_ID');
    var timestampIndex = headers.indexOf('started_at');
    
    if (promptIndex === -1) {
      return [];
    }
    
    var history = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][promptIndex]) {
        history.push({
          runId: data[i][runIdIndex],
          prompt: data[i][promptIndex],
          timestamp: data[i][timestampIndex]
        });
      }
    }
    
    // Sort by timestamp (most recent first)
    history.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    return history.slice(0, 10); // Return last 10 prompts
    
  } catch (error) {
    console.error('Error getting prompt history:', error);
    return [];
  }
}

// ========================================
// PROMPT TEMPLATES
// ========================================

/**
 * Get prompt templates by category
 */
function getPromptTemplates() {
  return {
    revenue: [
      'Increase EMEA ARR by $10M',
      'Boost North America revenue by $25M',
      'Increase global ARR by $50M'
    ],
    segments: [
      'Focus on Enterprise segment growth',
      'Optimize SMB customer acquisition',
      'Increase mid-market win rate'
    ],
    geographies: [
      'EMEA market expansion',
      'APAC pricing optimization',
      'UK customer retention improvement'
    ],
    metrics: [
      'Increase win rate by 10 percentage points',
      'Improve ASP by 15%',
      'Reduce churn by 5%'
    ],
    constraints: [
      'Platform share ≤ 40%',
      'Enterprise focus only',
      '12-month timeline'
    ]
  };
}

/**
 * Generate contextual prompt suggestions
 */
function getContextualSuggestions(currentPrompt) {
  var suggestions = [];
  
  // If prompt mentions a region, suggest related regions
  if (/EMEA/i.test(currentPrompt)) {
    suggestions.push('Try: "Increase APAC ARR by $15M"');
    suggestions.push('Try: "Optimize North America pricing"');
  }
  
  // If prompt mentions ARR, suggest other metrics
  if (/ARR/i.test(currentPrompt)) {
    suggestions.push('Try: "Increase win rate by 10pp"');
    suggestions.push('Try: "Improve customer retention"');
  }
  
  // If prompt mentions increase, suggest decrease
  if (/increase/i.test(currentPrompt)) {
    suggestions.push('Try: "Decrease churn by 5%"');
  }
  
  return suggestions;
}
