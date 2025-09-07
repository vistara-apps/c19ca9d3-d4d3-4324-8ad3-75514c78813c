'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from './Card';

interface NutritionData {
  name: string;
  current: number;
  target: number;
  unit: string;
}

interface NutritionChartProps {
  data: NutritionData[];
  type?: 'bar' | 'pie';
  title: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export function NutritionChart({ data, type = 'bar', title }: NutritionChartProps) {
  if (type === 'pie') {
    const pieData = data.map((item, index) => ({
      name: item.name,
      value: item.current,
      color: COLORS[index % COLORS.length]
    }));

    return (
      <Card className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value}g`,
                  name
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(215, 20%, 15%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'hsl(0, 0%, 95%)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {pieData.map((item, index) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-text-secondary">{item.name}</span>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(0, 0%, 70%)"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(0, 0%, 70%)"
              fontSize={12}
            />
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                `${value}${props.payload.unit}`,
                name === 'current' ? 'Current' : 'Target'
              ]}
              contentStyle={{
                backgroundColor: 'hsl(215, 20%, 15%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'hsl(0, 0%, 95%)'
              }}
            />
            <Bar dataKey="current" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
