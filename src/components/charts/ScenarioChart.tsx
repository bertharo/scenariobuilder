import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Scenario, Variable } from '../../types';

interface ScenarioChartProps {
  scenarios: Scenario[];
  variables: Variable[];
  selectedMetrics: string[];
  timeHorizon: {
    startYear: number;
    endYear: number;
  };
}

export default function ScenarioChart({ 
  scenarios, 
  variables, 
  selectedMetrics, 
  timeHorizon 
}: ScenarioChartProps) {
  const generateChartData = () => {
    const data = [];
    
    for (let year = timeHorizon.startYear; year <= timeHorizon.endYear; year++) {
      const yearData: any = { year };
      
      scenarios.forEach(scenario => {
        selectedMetrics.forEach(metricId => {
          const scenarioVariable = scenario.variables.find(sv => sv.variableId === metricId);
          if (scenarioVariable) {
            const timeSeriesValue = scenarioVariable.timeSeries.find(ts => ts.year === year);
            if (timeSeriesValue) {
              const variable = variables.find(v => v.id === metricId);
              const key = `${scenario.name} - ${variable?.name || metricId}`;
              yearData[key] = timeSeriesValue.value;
            }
          }
        });
      });
      
      data.push(yearData);
    }
    
    return data;
  };

  const chartData = generateChartData();
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  const getLineColor = (index: number) => colors[index % colors.length];

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value.toString();
            }}
          />
          <Tooltip 
            formatter={(value: any, name: string) => [
              typeof value === 'number' ? value.toLocaleString() : value,
              name
            ]}
            labelFormatter={(year) => `Year: ${year}`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          {scenarios.map((scenario, scenarioIndex) => 
            selectedMetrics.map((metricId, metricIndex) => {
              const variable = variables.find(v => v.id === metricId);
              const key = `${scenario.name} - ${variable?.name || metricId}`;
              const colorIndex = scenarioIndex * selectedMetrics.length + metricIndex;
              
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={getLineColor(colorIndex)}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              );
            })
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
