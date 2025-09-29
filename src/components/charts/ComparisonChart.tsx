import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Scenario, Variable } from '../../types';

interface ComparisonChartProps {
  scenarios: Scenario[];
  variables: Variable[];
  selectedMetrics: string[];
  year: number;
}

export default function ComparisonChart({ 
  scenarios, 
  variables, 
  selectedMetrics, 
  year 
}: ComparisonChartProps) {
  const generateChartData = () => {
    const data: any[] = [];
    
    selectedMetrics.forEach(metricId => {
      const variable = variables.find(v => v.id === metricId);
      if (!variable) return;
      
      const metricData: any = {
        metric: variable.name,
        category: variable.category,
      };
      
      scenarios.forEach(scenario => {
        const scenarioVariable = scenario.variables.find(sv => sv.variableId === metricId);
        if (scenarioVariable) {
          const timeSeriesValue = scenarioVariable.timeSeries.find(ts => ts.year === year);
          if (timeSeriesValue) {
            metricData[scenario.name] = timeSeriesValue.value;
          }
        }
      });
      
      data.push(metricData);
    });
    
    return data;
  };

  const chartData = generateChartData();
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  const getBarColor = (index: number) => colors[index % colors.length];

  return (
    <div className="w-full h-96">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Scenario Comparison - {year}</h3>
        <p className="text-sm text-gray-500">Compare selected metrics across scenarios</p>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="metric" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={80}
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
            labelFormatter={(metric) => `Metric: ${metric}`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          {scenarios.map((scenario, index) => (
            <Bar
              key={scenario.id}
              dataKey={scenario.name}
              fill={getBarColor(index)}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
