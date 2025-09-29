import { TimeSeries, ScenarioVariable } from '../types';

export function calculateGrowthRate(timeSeries: TimeSeries[]): number {
  if (timeSeries.length < 2) return 0;
  
  const firstValue = timeSeries[0].value;
  const lastValue = timeSeries[timeSeries.length - 1].value;
  const years = timeSeries.length - 1;
  
  if (firstValue === 0) return 0;
  
  return Math.pow(lastValue / firstValue, 1 / years) - 1;
}

export function calculateCAGR(timeSeries: TimeSeries[]): number {
  return calculateGrowthRate(timeSeries) * 100;
}

export function interpolateValue(timeSeries: TimeSeries[], targetYear: number): number {
  const sorted = [...timeSeries].sort((a, b) => a.year - b.year);
  
  if (targetYear <= sorted[0].year) return sorted[0].value;
  if (targetYear >= sorted[sorted.length - 1].year) return sorted[sorted.length - 1].value;
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    
    if (targetYear >= current.year && targetYear <= next.year) {
      const ratio = (targetYear - current.year) / (next.year - current.year);
      return current.value + (next.value - current.value) * ratio;
    }
  }
  
  return 0;
}

export function calculateSensitivityAnalysis(
  baseValue: number,
  optimistic: number,
  pessimistic: number
): { range: number; volatility: number } {
  const range = optimistic - pessimistic;
  const volatility = range / baseValue;
  
  return { range, volatility };
}

export function calculateScenarioVariance(scenarios: ScenarioVariable[]): number {
  if (scenarios.length < 2) return 0;
  
  const latestValues = scenarios.map(s => {
    const latest = s.timeSeries[s.timeSeries.length - 1];
    return latest ? latest.value : 0;
  });
  
  const mean = latestValues.reduce((sum, val) => sum + val, 0) / latestValues.length;
  const variance = latestValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / latestValues.length;
  
  return Math.sqrt(variance);
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
