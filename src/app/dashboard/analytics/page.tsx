"use client";

import { useState } from "react";
import { useSimulation } from "@/app/SimulationEngine";
import { Users, Clock, AlertTriangle, Activity, BarChart3, TrendingUp, TrendingDown, ArrowUpRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const TIME_RANGES = ["1h", "6h", "24h", "7d"];

const STATUS_GRADIENT: Record<string, string> = {
  low: "from-emerald-600 to-emerald-400",
  medium: "from-yellow-600 to-yellow-400",
  high: "from-amber-600 to-amber-400",
  critical: "from-red-600 to-rose-400",
};

const STATUS_TEXT: Record<string, string> = {
  low: "text-emerald-400",
  medium: "text-yellow-400",
  high: "text-amber-400",
  critical: "text-red-400",
};

export default function AnalyticsPage() {
  const { zones, insights } = useSimulation();
  const [timeRange, setTimeRange] = useState("1h");
  const sortedZones = [...zones].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="p-6 lg:p-12">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Live Data Stream</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Live Analytics</h1>
          <p className="text-white/40 text-sm font-medium">Historical data and AI-powered predictive insights.</p>
        </motion.div>
        <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-2xl p-1.5">
          {TIME_RANGES.map((r) => (
            <button key={r} onClick={() => setTimeRange(r)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${timeRange === r ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-white/30 hover:text-white/60"}`}>
              {r}
            </button>
          ))}
        </div>
      </header>

      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">01 — Core Metrics</h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
        {[
          { icon: <Users className="w-5 h-5 text-blue-400" />, label: "Total Occupancy", value: insights?.totalPeople?.toLocaleString() ?? "0", trend: "+12.4%", up: true, sub: "People tracked across all zones" },
          { icon: <Clock className="w-5 h-5 text-purple-400" />, label: "Avg Wait Time", value: `${insights?.averageWaitTime ?? 0}m`, trend: "-2m", up: true, sub: "Mean queue processing time" },
          { icon: <AlertTriangle className="w-5 h-5 text-amber-400" />, label: "Critical Zones", value: String(insights?.criticalZones ?? 0), trend: insights?.criticalZones ? "Elevated" : "Nominal", up: !insights?.criticalZones, sub: "Zones above 85% saturation" },
          { icon: <Activity className="w-5 h-5 text-emerald-400" />, label: "Throughput Rate", value: `${insights?.throughputRate ?? 0}%`, trend: "+5.2%", up: true, sub: "Real-time flow efficiency" },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -5 }}
            className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-white/15 transition-all group relative overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="p-4 bg-white/5 rounded-[1.25rem] group-hover:scale-110 transition-all duration-500 ring-1 ring-white/10">{m.icon}</div>
              <div className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border ${m.up ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                {m.up ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}{m.trend}
              </div>
            </div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{m.label}</p>
            <p className="text-4xl font-bold tracking-tighter mb-2">{m.value}</p>
            <p className="text-[10px] text-white/30 font-medium italic">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">02 — Zone Performance</h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="grid xl:grid-cols-2 gap-8 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg tracking-tight">Zone Saturation</h3>
              <p className="text-white/30 text-xs font-medium mt-1">Real-time density across all sectors</p>
            </div>
            <BarChart3 className="w-5 h-5 text-white/20" />
          </div>
          <div className="space-y-6">
            {sortedZones.slice(0, 6).map((zone, i) => (
              <div key={zone.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white/70">{zone.name}</span>
                  <span className={`text-sm font-black tabular-nums ${STATUS_TEXT[zone.status]}`}>{zone.percentage}%</span>
                </div>
                <div className="h-2.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${zone.percentage}%` }} transition={{ duration: 1, delay: i * 0.08, ease: "circOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${STATUS_GRADIENT[zone.status]}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg tracking-tight">AI Predictions</h3>
              <p className="text-white/30 text-xs font-medium mt-1">30-minute lookahead forecast</p>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live</span>
            </div>
          </div>
          <div className="space-y-4">
            {sortedZones.slice(0, 5).map((zone, i) => {
              const predicted = Math.min(100, zone.percentage + 8);
              const delta = predicted - zone.percentage;
              return (
                <motion.div key={zone.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-bold text-white/80">{zone.name}</h4>
                      <span className={`text-xs font-black flex items-center gap-1 ${delta > 5 ? "text-red-400" : "text-emerald-400"}`}>
                        {delta > 5 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}+{delta}%
                      </span>
                    </div>
                    <p className="text-[11px] text-white/30 font-medium">
                      Now: <span className="text-white/60 font-bold">{zone.percentage}%</span>{"  →  "}30min: <span className="text-white/60 font-bold">{predicted}%</span>
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-blue-400 transition-colors" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">03 — Full Data Table</h2>
        <div className="h-px flex-1 bg-white/5" />
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors group">
          <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />Refresh
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Zone", "Occupancy", "Capacity", "Saturation", "Wait Time", "Status"].map((h) => (
                  <th key={h} className="text-left py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zones.map((zone, i) => (
                <tr key={zone.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-bold text-sm">{zone.name}</td>
                  <td className="py-4 px-6 text-sm text-white/60 tabular-nums">{zone.count.toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm text-white/60 tabular-nums">{zone.capacity.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${STATUS_GRADIENT[zone.status]} rounded-full`} style={{ width: `${zone.percentage}%` }} />
                      </div>
                      <span className={`text-sm font-bold tabular-nums ${STATUS_TEXT[zone.status]}`}>{zone.percentage}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-white/60 tabular-nums">{zone.waitTime}m</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      zone.status === "low" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      zone.status === "medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                      zone.status === "high" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                      {zone.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}