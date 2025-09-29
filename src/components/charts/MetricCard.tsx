import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatPercentage, formatNumber } from '../../utils/calculations';

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  unit?: string;
  type?: 'currency' | 'percentage' | 'number';
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
  changePercent?: number;
}

export default function MetricCard({ 
  title, 
  value, 
  previousValue, 
  unit, 
  type = 'number',
  trend,
  change,
  changePercent 
}: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (type) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      default:
        return formatNumber(val, 0);
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const calculateTrend = () => {
    if (previousValue === undefined) return null;
    
    const change = value - previousValue;
    const changePercent = (change / previousValue) * 100;
    
    return {
      change,
      changePercent,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  const trendData = change !== undefined && changePercent !== undefined 
    ? { change, changePercent, trend: trend || 'neutral' }
    : calculateTrend();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-md bg-primary-100 flex items-center justify-center">
              {trendData && getTrendIcon()}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {formatValue(value)}
                {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
              </dd>
            </dl>
          </div>
        </div>
        
        {trendData && (
          <div className="mt-4">
            <div className={`flex items-center text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="ml-1">
                {trendData.changePercent > 0 ? '+' : ''}
                {trendData.changePercent.toFixed(1)}%
              </span>
              <span className="ml-2 text-gray-500">
                ({trendData.change > 0 ? '+' : ''}{formatValue(trendData.change)})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
