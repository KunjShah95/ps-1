"use client";

import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useSimulation, ZoneHistory } from '@/app/SimulationEngine';
import { motion } from 'framer-motion';

interface TrendChartProps {
  zoneId: string;
  zoneName: string;
}

export function TrendChart({ zoneId, zoneName }: TrendChartProps) {
  const { getZoneHistory } = useSimulation();
  const [history, setHistory] = useState<ZoneHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await getZoneHistory(zoneId, 15);
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch zone history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
    // Refresh every 30 seconds
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, [zoneId, getZoneHistory]);

  const chartData = history.map(h => ({
    time: new Date(h.timestamp.toMillis()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    percentage: h.percentage,
    count: h.count
  }));

  if (isLoading && history.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center glass border-white/5 rounded-3xl animate-pulse">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Syncing History...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass border-white/5 rounded-3xl p-5 shadow-2xl relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-xl font-bold tracking-tight mb-1">{zoneName} Trends</h4>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Historical Saturation Vectors</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">Live Feed</span>
        </div>
      </div>

      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPerc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="time" 
              hide 
            />
            <YAxis 
              hide 
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(2, 2, 2, 0.8)', 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              itemStyle={{ color: '#3b82f6' }}
            />
            <Area 
              type="monotone" 
              dataKey="percentage" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPerc)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
        <span>T-30m</span>
        <span>Current Velocity</span>
        <span>Real-time</span>
      </div>
    </motion.div>
  );
}
