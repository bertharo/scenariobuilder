import { Scenario, Variable, ScenarioVariable, TimeSeries } from '../types';

export interface BusinessQuery {
  query: string;
  intent: 'increase' | 'decrease' | 'maintain' | 'constraint';
  metric: string;
  value: number;
  unit: string;
  constraints?: {
    region?: string;
    product?: string;
    timeframe?: string;
  };
  confidence: number;
}

export interface QueryResult {
  success: boolean;
  scenario?: Scenario;
  variables?: ScenarioVariable[];
  message: string;
  suggestions?: string[];
}

export class AIQueryProcessor {
  private variables: Variable[] = [];
  private scenarios: Scenario[] = [];

  constructor(variables: Variable[], scenarios: Scenario[]) {
    this.variables = variables;
    this.scenarios = scenarios;
  }

  async processQuery(query: string): Promise<QueryResult> {
    try {
      // Parse the natural language query
      const parsedQuery = this.parseBusinessQuery(query);
      
      if (!parsedQuery) {
        return {
          success: false,
          message: "I couldn't understand your query. Please try rephrasing it.",
          suggestions: [
            "Try: 'Increase revenue by $5M'",
            "Try: 'Reduce churn by 2%'",
            "Try: 'Increase ARR by $15M in EMEA'"
          ]
        };
      }

      // Generate scenario based on query
      const scenario = await this.generateScenarioFromQuery(parsedQuery);
      
      return {
        success: true,
        scenario,
        message: `Created scenario: ${scenario.name}`,
        suggestions: this.generateSuggestions(parsedQuery)
      };

    } catch (error) {
      console.error('Error processing query:', error);
      return {
        success: false,
        message: "Sorry, I encountered an error processing your request.",
        suggestions: ["Please try again or contact support."]
      };
    }
  }

  private parseBusinessQuery(query: string): BusinessQuery | null {
    const lowerQuery = query.toLowerCase();
    
    // ARR patterns
    if (lowerQuery.includes('arr') || lowerQuery.includes('annual recurring revenue')) {
      return this.parseARRQuery(query);
    }
    
    // Revenue patterns
    if (lowerQuery.includes('revenue') || lowerQuery.includes('revenue')) {
      return this.parseRevenueQuery(query);
    }
    
    // Churn patterns
    if (lowerQuery.includes('churn')) {
      return this.parseChurnQuery(query);
    }
    
    // Growth patterns
    if (lowerQuery.includes('growth') || lowerQuery.includes('increase') || lowerQuery.includes('decrease')) {
      return this.parseGrowthQuery(query);
    }
    
    return null;
  }

  private parseARRQuery(query: string): BusinessQuery | null {
    const arrMatch = query.match(/(increase|decrease|reduce)\s+(?:total\s+)?arr\s+by\s+\$?([\d,]+)m?/i);
    if (!arrMatch) return null;

    const intent = arrMatch[1].toLowerCase() === 'increase' ? 'increase' : 'decrease';
    const value = parseFloat(arrMatch[2].replace(',', '')) * 1000000; // Convert to actual dollars

    // Check for regional constraints
    const regionMatch = query.match(/(?:in|for)\s+([a-z]+)/i);
    const region = regionMatch ? regionMatch[1].toUpperCase() : undefined;

    return {
      query,
      intent,
      metric: 'ARR',
      value,
      unit: 'USD',
      constraints: region ? { region } : undefined,
      confidence: 0.9
    };
  }

  private parseRevenueQuery(query: string): BusinessQuery | null {
    const revenueMatch = query.match(/(increase|decrease|reduce)\s+(?:total\s+)?revenue\s+by\s+\$?([\d,]+)m?/i);
    if (!revenueMatch) return null;

    const intent = revenueMatch[1].toLowerCase() === 'increase' ? 'increase' : 'decrease';
    const value = parseFloat(revenueMatch[2].replace(',', '')) * 1000000;

    return {
      query,
      intent,
      metric: 'Revenue',
      value,
      unit: 'USD',
      confidence: 0.9
    };
  }

  private parseChurnQuery(query: string): BusinessQuery | null {
    const churnMatch = query.match(/(reduce|decrease|increase)\s+churn\s+by\s+([\d.]+)%?/i);
    if (!churnMatch) return null;

    const intent = churnMatch[1].toLowerCase() === 'reduce' || churnMatch[1].toLowerCase() === 'decrease' ? 'decrease' : 'increase';
    const value = parseFloat(churnMatch[2]);

    return {
      query,
      intent,
      metric: 'Churn Rate',
      value,
      unit: '%',
      confidence: 0.9
    };
  }

  private parseGrowthQuery(query: string): BusinessQuery | null {
    const growthMatch = query.match(/(increase|decrease|grow)\s+([a-z\s]+)\s+by\s+([\d,]+)%?/i);
    if (!growthMatch) return null;

    const intent = growthMatch[1].toLowerCase() === 'increase' || growthMatch[1].toLowerCase() === 'grow' ? 'increase' : 'decrease';
    const metric = growthMatch[2].trim();
    const value = parseFloat(growthMatch[3].replace(',', ''));

    return {
      query,
      intent,
      metric,
      value,
      unit: '%',
      confidence: 0.8
    };
  }

  private async generateScenarioFromQuery(parsedQuery: BusinessQuery): Promise<Scenario> {
    const scenarioName = this.generateScenarioName(parsedQuery);
    const scenarioDescription = this.generateScenarioDescription(parsedQuery);
    
    // Find or create relevant variables
    const variables = this.findOrCreateVariables(parsedQuery);
    
    // Generate time series data
    const scenarioVariables = variables.map(variable => 
      this.generateScenarioVariable(variable, parsedQuery)
    );

    return {
      id: crypto.randomUUID(),
      name: scenarioName,
      description: scenarioDescription,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'ai-query-processor',
      variables: scenarioVariables,
      tags: this.generateTags(parsedQuery),
      isBaseCase: false
    };
  }

  private generateScenarioName(query: BusinessQuery): string {
    const action = query.intent === 'increase' ? 'Increase' : 'Decrease';
    const value = query.unit === 'USD' ? `$${query.value / 1000000}M` : `${query.value}%`;
    const region = query.constraints?.region ? ` (${query.constraints.region})` : '';
    
    return `${action} ${query.metric} by ${value}${region}`;
  }

  private generateScenarioDescription(query: BusinessQuery): string {
    const action = query.intent === 'increase' ? 'increasing' : 'decreasing';
    const value = query.unit === 'USD' ? `$${query.value / 1000000}M` : `${query.value}%`;
    const region = query.constraints?.region ? ` in ${query.constraints.region}` : '';
    
    return `Scenario for ${action} ${query.metric} by ${value}${region}. Generated from query: "${query.query}"`;
  }

  private findOrCreateVariables(query: BusinessQuery): Variable[] {
    const relevantVariables: Variable[] = [];
    
    // Find existing variables that match the metric
    const matchingVariables = this.variables.filter(v => 
      v.name.toLowerCase().includes(query.metric.toLowerCase()) ||
      v.category.toLowerCase().includes(query.metric.toLowerCase())
    );
    
    relevantVariables.push(...matchingVariables);
    
    // If no matching variables found, create a new one
    if (relevantVariables.length === 0) {
      const newVariable: Variable = {
        id: crypto.randomUUID(),
        name: query.metric,
        description: `Variable for ${query.metric} tracking`,
        type: query.unit === 'USD' ? 'currency' : 'percentage',
        unit: query.unit,
        category: 'Financial',
        isKeyDriver: true,
        dependencies: []
      };
      relevantVariables.push(newVariable);
    }
    
    return relevantVariables;
  }

  private generateScenarioVariable(variable: Variable, query: BusinessQuery): ScenarioVariable {
    const timeSeries: TimeSeries[] = [];
    const currentYear = new Date().getFullYear();
    
    // Generate 5 years of data
    for (let i = 0; i < 5; i++) {
      const year = currentYear + i;
      let baseValue = 1000000; // Default base value
      
      if (variable.type === 'currency') {
        baseValue = 1000000; // $1M base
      } else if (variable.type === 'percentage') {
        baseValue = 0.05; // 5% base
      }
      
      // Apply the query intent to the value
      let adjustedValue = baseValue;
      if (query.intent === 'increase') {
        adjustedValue = baseValue * (1 + (query.value / 100));
      } else if (query.intent === 'decrease') {
        adjustedValue = baseValue * (1 - (query.value / 100));
      }
      
      timeSeries.push({
        year,
        value: adjustedValue,
        confidence: 'medium',
        notes: `Generated from query: ${query.query}`
      });
    }
    
    return {
      variableId: variable.id,
      timeSeries,
      assumptions: [
        `Based on query: ${query.query}`,
        `Target ${query.intent} of ${query.value}${query.unit}`,
        query.constraints?.region ? `Regional focus: ${query.constraints.region}` : 'Global impact'
      ],
      sensitivity: {
        optimistic: 1.2,
        pessimistic: 0.8
      }
    };
  }

  private generateTags(query: BusinessQuery): string[] {
    const tags = ['ai-generated', query.intent, query.metric.toLowerCase()];
    
    if (query.constraints?.region) {
      tags.push(query.constraints.region.toLowerCase());
    }
    
    return tags;
  }

  private generateSuggestions(query: BusinessQuery): string[] {
    const suggestions = [
      `View the generated scenario: "${this.generateScenarioName(query)}"`,
      "Modify the time series data to refine the scenario",
      "Add additional constraints or variables",
      "Compare with existing scenarios"
    ];
    
    return suggestions;
  }
}
