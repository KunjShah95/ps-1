"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSimulation } from "../SimulationEngine";
import { TrendChart } from "@/components/TrendChart";
import { useAuth } from "@/lib/auth-context";
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldCheck,
  Bell,
  Search,
  Menu,
  ChevronRight,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

export default function DashboardPage() {
  const { zones, recommendation, alerts, insights, acknowledgeAlert } = useSimulation();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredZones = useMemo(() => 
    zones.filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [zones, searchQuery]
  );

  const getRelativeTime = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diff = Math.floor((currentTime.getTime() - date.getTime()) / 1000 / 60);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <>
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Live: Active</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2 text-glow">Command Console</h1>
            <p className="text-white/40 text-sm font-medium">Monitoring <span className="text-white">{zones.length}</span> active high-density zones.</p>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="relative hidden xl:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Search zones..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all w-96 placeholder:text-white/20 font-medium"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3.5 glass border-white/10 rounded-2xl hover:bg-white/[0.05] hover:border-white/20 transition-all relative group shadow-xl">
                <Bell className="w-5 h-5 text-white/60 group-hover:text-white" />
                {alerts.length > 0 && (
                  <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#020202] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                )}
              </button>
              <button className="lg:hidden p-3.5 glass border-white/10 rounded-2xl">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* 01 Statistics Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">01 — Core Metrics</h2>
          <div className="h-px flex-1 bg-white/5 mx-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <StatCard 
            icon={<Users className="w-5 h-5 text-blue-400" />} 
            label="Live Census" 
            value={insights?.totalPeople?.toLocaleString() || "0"} 
            trend="+12.4%" 
            sub="Active visitors"
          />
          <StatCard 
            icon={<Clock className="w-5 h-5 text-emerald-400" />} 
            label="Avg Wait Time" 
            value={`${insights?.averageWaitTime || 0} min`} 
            trend="-2 min" 
            sub="Average queue time"
          />
          <StatCard 
            icon={<AlertTriangle className="w-5 h-5 text-amber-400" />} 
            label="Critical Zones" 
            value={insights?.criticalZones?.toString() || "0"} 
            trend={insights?.criticalZones ? "Elevated" : "Nominal"}
            trendType={insights?.criticalZones ? "danger" : "success"}
            sub="Zones at capacity"
          />
          <StatCard 
            icon={<TrendingUp className="w-5 h-5 text-purple-400" />} 
            label="Flow Rate" 
            value={`${insights?.throughputRate || 0}/min`} 
            trend="+2.1%" 
            sub="Processing throughput"
          />
        </div>

        {/* 02 AI Command Recommendation */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">02 — Live Recommendation</h2>
          <div className="h-px flex-1 bg-white/5 mx-6" />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 p-10 glass border-white/5 rounded-[3rem] relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000" />
          
          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-8 z-10 relative">
            <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[1.5rem] shadow-2xl shadow-blue-600/30 ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-10 h-10 text-white animate-pulse-subtle" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-bold text-2xl tracking-tight">Flow Optimization</h3>
                <span className="flex items-center gap-1.5 text-[9px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] border border-blue-500/20 shadow-glow">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  Live
                </span>
              </div>
              <p className="text-white/60 text-xl leading-relaxed font-medium tracking-tight pr-12">{recommendation}</p>
            </div>
            <button className="px-8 py-4 bg-white hover:bg-blue-50 text-black rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95">
              Execute Recommendation
            </button>
          </div>
        </motion.div>

        {/* 03 Operational Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">03 — Zone Visualization</h2>
          <div className="h-px flex-1 bg-white/5 mx-6" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <div className="xl:col-span-8 space-y-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex gap-10">
                <TabButton label="Spatial Grid" active />
                <TabButton label="Heatmap" />
                <TabButton label="Zones" />
              </div>
              <button className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-3 group">
                Infrastructure Blueprint <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredZones.map((zone, idx) => (
                  <ZoneCard key={zone.id} zone={zone} index={idx} />
                ))}
              </AnimatePresence>
              {filteredZones.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-32 text-center glass border-dashed border-white/10 rounded-[3rem]"
                >
                  <Icon icon="mdi:map-marker-off" className="w-16 h-16 mx-auto mb-6 text-white/5" />
                  <p className="text-white/20 text-lg font-medium italic">No active sectors synchronized with &quot;{searchQuery}&quot;</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="xl:col-span-4 space-y-12">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold tracking-tight">Real-time Anomalies</h2>
                <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                   <span className="text-[10px] font-black text-red-400 uppercase tracking-tighter">
                    {alerts.length} Critical Events
                  </span>
                </div>
              </div>
              <div className="space-y-5">
                {alerts.length === 0 ? (
                  <div className="p-12 glass border-white/5 rounded-[2.5rem] text-center group">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform duration-500 border border-emerald-500/20">
                      <ShieldCheck className="w-10 h-10 text-emerald-500/40" />
                    </div>
                    <h4 className="font-bold mb-1 uppercase tracking-widest text-emerald-500/60">Perimeter Locked</h4>
                    <p className="text-white/20 text-xs font-medium">All systems report nominal.<br/>No manual intervention required.</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <AlertItem 
                      key={alert.id} 
                      alert={alert} 
                      timeLabel={getRelativeTime(alert.created_at)} 
                      onAcknowledge={() => acknowledgeAlert(alert.id)}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="p-10 glass border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
              <h3 className="font-bold text-xl mb-8 flex items-center justify-between">
                Saturation Monitor
                <TrendingUp className="w-5 h-5 text-white/10" />
              </h3>
              <div className="space-y-8">
                {zones.slice(0, 5).sort((a, b) => b.percentage - a.percentage).map(zone => (
                  <ProgressCircle 
                    key={zone.id}
                    label={zone.name} 
                    percentage={zone.percentage} 
                    color={zone.status === 'critical' ? 'text-red-400' : zone.status === 'high' ? 'text-amber-400' : 'text-blue-400'} 
                  />
                ))}
              </div>
              <button className="w-full mt-10 py-4 glass border-white/5 hover:bg-white/[0.05] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group shadow-xl">
                Refresh All Zones
              </button>
            </div>

            {/* Historical Trend Chart for the most active zone */}
            {zones.length > 0 && (
              <TrendChart 
                zoneId={zones.sort((a, b) => b.percentage - a.percentage)[0].id} 
                zoneName={zones.sort((a, b) => b.percentage - a.percentage)[0].name} 
              />
            )}
          </div>
        </div>
    </>
  );
}

function NavItem({ icon, label, active = false, count = 0, onClick }: { icon: any, label: string, active?: boolean, count?: number, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all cursor-pointer group relative ${active ? 'bg-white/5 text-white border border-white/10 shadow-glow shadow-blue-500/5' : 'text-white/30 hover:bg-white/[0.03] hover:text-white/60'}`}
    >
      {active && <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />}
      <div className={`transition-all duration-300 ${active ? 'text-blue-400 scale-110' : 'group-hover:text-white/60 group-hover:translate-x-1'}`}>
        {icon}
      </div>
      <span className={`text-sm font-bold tracking-tight flex-1 transition-colors ${active ? 'text-white' : ''}`}>{label}</span>
      {count > 0 && (
        <span className="bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-xl font-black shadow-lg shadow-red-500/30 ring-4 ring-red-500/10">
          {count}
        </span>
      )}
    </div>
  );
}

function TabButton({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <button className={`text-[10px] font-black tracking-[0.2em] uppercase pb-6 relative transition-all ${active ? 'text-white' : 'text-white/20 hover:text-white/40'}`}>
      {label}
      {active && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] rounded-full" />}
    </button>
  );
}

function StatCard({ icon, label, value, trend, trendType = 'success', sub }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 glass border-white/5 rounded-[2.5rem] hover:border-white/20 transition-all group relative overflow-hidden shadow-xl"
    >
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 group-hover:scale-110">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className="p-4 bg-white/5 rounded-[1.25rem] group-hover:scale-110 transition-all duration-500 shadow-inner ring-1 ring-white/10 group-hover:shadow-glow group-hover:shadow-blue-500/10">
          {icon}
        </div>
        <div className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border shadow-sm ${trendType === 'danger' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
          {trend}
        </div>
      </div>
      <div>
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{label}</p>
        <p className="text-4xl font-bold tracking-tighter mb-2 text-glow">{value}</p>
        <p className="text-[10px] text-white/30 font-medium italic tracking-tight">{sub}</p>
      </div>
    </motion.div>
  );
}

function ZoneCard({ zone, index }: { zone: any, index: number }) {
  const statusColors = {
    low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5",
    medium: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
    high: "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/5",
    critical: "text-red-400 bg-red-500/10 border-red-500/20 shadow-red-500/5 shadow-glow"
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="p-10 glass border-white/5 rounded-[3rem] hover:bg-white/[0.05] hover:border-white/20 transition-all group relative overflow-hidden shadow-2xl"
    >
      <div className={`absolute -top-12 -right-12 w-48 h-48 opacity-[0.03] blur-[80px] rounded-full transition-all duration-700 group-hover:opacity-[0.08] ${zone.status === 'critical' ? 'bg-red-500' : 'bg-blue-500'}`} />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] block mb-2">Zone</span>
          <h3 className="font-bold text-2xl tracking-tight">{zone.name}</h3>
        </div>
        <span className={`text-[9px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest border shadow-xl ${statusColors[zone.status as keyof typeof statusColors]}`}>
          {zone.status}
        </span>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-black mb-3">Occupancy</p>
            <p className="text-3xl font-bold tracking-tighter">
              {zone.count} 
              <span className="text-xs text-white/20 font-medium ml-2 italic">/ {zone.capacity}</span>
            </p>
          </div>
          <div className="text-right">
             <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-black mb-3">Saturation</p>
             <p className="text-3xl font-bold text-blue-400 tracking-tighter">{zone.percentage}<span className="text-sm font-medium ml-1 text-white/20">%</span></p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            <span>Status</span>
            <span className={zone.status === 'critical' ? 'text-red-400' : 'text-blue-400'}>{zone.status === 'critical' ? 'Alert' : 'Nominal'}</span>
          </div>
          <div className="h-3 bg-white/[0.03] rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${zone.percentage}%` }}
              transition={{ type: "spring", stiffness: 40, damping: 20 }}
              className={`h-full rounded-full shadow-glow ${
                zone.status === 'critical' ? 'bg-gradient-to-r from-red-600 to-rose-400 shadow-red-500/20' : 
                zone.status === 'high' ? 'bg-gradient-to-r from-amber-600 to-yellow-400 shadow-amber-500/20' : 
                'bg-gradient-to-r from-blue-600 to-indigo-400 shadow-blue-500/20'
              }`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AlertItem({ alert, timeLabel, onAcknowledge }: { alert: any, timeLabel: string, onAcknowledge: () => void }) {
  const typeStyles = {
    critical: "bg-red-500/10 text-red-500 border-red-500/20 ring-red-500/10 shadow-red-500/5",
    high: "bg-amber-500/10 text-amber-500 border-amber-500/20 ring-amber-500/10 shadow-amber-500/5",
    warning: "bg-blue-500/10 text-blue-500 border-blue-500/20 ring-blue-500/10 shadow-blue-500/5"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 glass border-white/5 rounded-[2rem] flex gap-6 transition-all hover:bg-white/[0.05] group shadow-xl ${alert.type === 'critical' ? 'bg-red-500/[0.03] border-red-500/10' : 'bg-white/[0.02]'}`}
    >
      <div className={`mt-1 p-4 rounded-2xl border self-start transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${typeStyles[alert.type as keyof typeof typeStyles]}`}>
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{alert.zoneName}</p>
          <span className="text-[10px] font-black text-white/20 tabular-nums">{timeLabel}</span>
        </div>
        <p className="text-md font-bold leading-relaxed text-white/80 tracking-tight group-hover:text-white transition-colors">{alert.message}</p>
        <div className="mt-5 flex gap-4">
          <button 
            onClick={onAcknowledge}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-blue-400 transition-all hover:translate-x-1"
          >
            Acknowledge
          </button>
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-all">Details</button>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressCircle({ label, percentage, color }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-[11px] font-bold text-white/40 tracking-tight uppercase">{label}</span>
        <span className={`text-sm font-black tabular-nums tracking-tighter ${color}`}>{percentage}%</span>
      </div>
      <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className={`h-full ${color.replace('text-', 'bg-')} rounded-full opacity-80 shadow-glow`} 
        />
      </div>
    </div>
  );
}
