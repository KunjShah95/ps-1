"use client";

import { useState } from "react";
import { AlertTriangle, ShieldAlert, Radio, Phone, Users, CheckCircle2, Zap, Volume2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CRISIS_SCENARIOS = [
  { id: "stampede", name: "Stampede Risk", level: 5, description: "Critical crowd density approaching stampede threshold", color: "red" },
  { id: "fire", name: "Fire Emergency", level: 5, description: "Fire detected — immediate evacuation protocol required", color: "red" },
  { id: "overcrowding", name: "Critical Overcrowding", level: 4, description: "Multiple zones exceeding safe capacity limits", color: "amber" },
  { id: "medical", name: "Mass Casualty Event", level: 4, description: "Multiple simultaneous medical emergencies reported", color: "amber" },
  { id: "security", name: "Security Threat", level: 5, description: "Active security threat detected in perimeter", color: "red" },
  { id: "weather", name: "Severe Weather", level: 3, description: "Dangerous weather conditions approaching venue", color: "yellow" },
];

const LEVEL_STYLE: Record<number, string> = {
  5: "bg-red-500/10 text-red-400 border-red-500/20",
  4: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  3: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const CARD_STYLE: Record<string, string> = {
  red: "border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5",
  amber: "border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5",
  yellow: "border-yellow-500/20 hover:border-yellow-500/40 hover:bg-yellow-500/5",
};

export default function CrisisPage() {
  const [activeCrisis, setActiveCrisis] = useState<string | null>(null);
  const [sirensActive, setSirensActive] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);

  const triggerCrisis = (id: string) => {
    if (!activeCrisis) setActiveCrisis(id);
  };

  const resolveCrisis = () => {
    setActiveCrisis(null);
    setSirensActive(false);
  };

  const sendBroadcast = () => {
    if (broadcastMsg.trim()) {
      setBroadcastSent(true);
      setTimeout(() => setBroadcastSent(false), 3000);
      setBroadcastMsg("");
    }
  };

  const activeScenario = CRISIS_SCENARIOS.find((s) => s.id === activeCrisis);

  return (
    <div className="p-6 lg:p-12">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${activeCrisis ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" : "bg-emerald-500"}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${activeCrisis ? "text-red-500" : "text-emerald-500"}`}>
              {activeCrisis ? "Crisis Active — Response Required" : "Standby Mode"}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Crisis Management</h1>
          <p className="text-white/40 text-sm font-medium">Emergency response protocols and incident triggers.</p>
        </motion.div>

        <div className="flex items-center gap-3">
          <button onClick={() => setSirensActive(!sirensActive)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${sirensActive ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse" : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/15"}`}>
            <Volume2 className={`w-4 h-4 ${sirensActive ? "animate-pulse" : ""}`} />
            Sirens: {sirensActive ? "ON" : "OFF"}
          </button>
          {activeCrisis && (
            <button onClick={resolveCrisis}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
              <CheckCircle2 className="w-4 h-4" />Resolve Crisis
            </button>
          )}
        </div>
      </header>

      {/* Active Crisis Banner */}
      <AnimatePresence>
        {activeCrisis && activeScenario && (
          <motion.div key="crisis-banner" initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-red-500/10 border-2 border-red-500/40 rounded-[2rem] p-8 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-6 mb-6 relative z-10">
              <div className="p-4 bg-red-500/20 rounded-2xl border border-red-500/30">
                <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">🚨 Crisis Active</span>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-black rounded-lg border border-red-500/20">Level {activeScenario.level}</span>
                </div>
                <h2 className="text-2xl font-bold text-red-300 tracking-tight">{activeScenario.name}</h2>
                <p className="text-red-400/60 text-sm mt-1">{activeScenario.description}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 relative z-10">
              {[
                { icon: <Phone className="w-4 h-4" />, label: "Call Emergency Services" },
                { icon: <Users className="w-4 h-4" />, label: "Dispatch Response Team" },
                { icon: <Radio className="w-4 h-4" />, label: "PA Broadcast Alert" },
              ].map((a) => (
                <button key={a.label} className="flex items-center justify-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all font-bold text-sm text-red-300">
                  {a.icon}{a.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Broadcast */}
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">01 — Emergency Broadcast</h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] mb-12 backdrop-blur-sm">
        <p className="text-white/40 text-sm font-medium mb-6">Broadcast a message to all venue PA systems and staff devices.</p>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Radio className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input type="text" placeholder="Enter emergency broadcast message..." value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10 font-medium" />
          </div>
          <button onClick={sendBroadcast} className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${broadcastSent ? "bg-emerald-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"}`}>
            {broadcastSent ? "Sent!" : "Broadcast"}
          </button>
        </div>
      </div>

      {/* Crisis Scenarios */}
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">02 — Scenario Triggers</h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-12">
        {CRISIS_SCENARIOS.map((s, i) => (
          <motion.button key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            onClick={() => triggerCrisis(s.id)} disabled={!!activeCrisis && activeCrisis !== s.id} whileHover={!activeCrisis ? { scale: 1.02 } : {}} whileTap={!activeCrisis ? { scale: 0.98 } : {}}
            className={`p-6 bg-white/[0.02] border rounded-[2rem] text-left transition-all backdrop-blur-sm ${
              activeCrisis === s.id ? "border-red-500/50 bg-red-500/10" : CARD_STYLE[s.color]
            } ${activeCrisis && activeCrisis !== s.id ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl border ${LEVEL_STYLE[s.level]} w-fit`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className={`px-3 py-1 text-[10px] font-black rounded-xl border uppercase tracking-widest ${LEVEL_STYLE[s.level]}`}>
                Level {s.level}
              </span>
            </div>
            <h3 className="font-bold text-base mb-2 tracking-tight">{s.name}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{s.description}</p>
            {activeCrisis === s.id && (
              <div className="flex items-center gap-2 mt-4 text-red-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">03 — Quick Actions</h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: <Zap className="w-5 h-5" />, label: "Start Evacuation", accent: "hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-400" },
          { icon: <ShieldAlert className="w-5 h-5" />, label: "Venue Lockdown", accent: "hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-400" },
          { icon: <Users className="w-5 h-5" />, label: "Call All Staff", accent: "hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-400" },
          { icon: <XCircle className="w-5 h-5" />, label: "Clear All Alerts", accent: "hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-400" },
        ].map((a) => (
          <button key={a.label} className={`flex flex-col items-center gap-3 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] transition-all text-white/40 ${a.accent}`}>
            {a.icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}