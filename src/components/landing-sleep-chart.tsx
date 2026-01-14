"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 72 },
  { name: 'Wed', score: 68 },
  { name: 'Thu', score: 85 },
  { name: 'Fri', score: 82 },
  { name: 'Sat', score: 90 },
  { name: 'Sun', score: 88 },
  { name: 'Mon', score: 65 }, // Added to make it look looped/longer if needed
];

export function LandingSleepChart() {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717A', fontSize: 12 }} 
            dy={10}
            interval={1}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717A', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#18181B', 
              border: '1px solid #27272A', 
              borderRadius: '8px',
              color: '#fff'
            }}
            itemStyle={{ color: '#fff' }}
            cursor={{ stroke: '#27272A', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#6366F1" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorScore)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
