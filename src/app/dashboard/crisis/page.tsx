"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ShieldAlert, Radio, Phone, Users, CheckCircle2, Zap, Volume2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/client/api";
import { CommandHeader, CommandPage, EyebrowPill, Panel } from "@/components/command-center";

type CrisisIncident = {
  id: string;
  title?: string;
  description?: string;
  type?: string;
  severity?: string;
  status?: string;
  created_at?: unknown;
};

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
  const [activeCrisisId, setActiveCrisisId] = useState<string | null>(null);
  const [sirensActive, setSirensActive] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [incidents, setIncidents] = useState<CrisisIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiFetch<{ incidents: CrisisIncident[] }>("/api/crisis?status=active&limit=20");
        if (!alive) return;
        const list = res.incidents ?? [];
        setIncidents(list);
        setActiveCrisisId(list[0]?.id ?? null);
      } catch {
        if (!alive) return;
        setIncidents([]);
        setActiveCrisisId(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const triggerCrisis = async (scenarioId: string) => {
    const scenario = CRISIS_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;
    const res = await apiFetch<{ id: string }>("/api/crisis", {
      method: "POST",
      body: JSON.stringify({
        action: "create",
        title: scenario.name,
        description: scenario.description,
        type: scenario.id,
        severity: scenario.level >= 5 ? "critical" : scenario.level >= 4 ? "high" : "medium",
      }),
    });
    const id = res?.id;
    if (id) {
      setActiveCrisisId(id);
      const refreshed = await apiFetch<{ incidents: CrisisIncident[] }>("/api/crisis?status=active&limit=20");
      setIncidents(refreshed.incidents ?? []);
    }
  };

  const resolveCrisis = async () => {
    if (!activeCrisisId) return;
    await apiFetch("/api/crisis", {
      method: "POST",
      body: JSON.stringify({ action: "resolve", id: activeCrisisId, resolution: "Resolved via dashboard" }),
    });
    setSirensActive(false);
    const refreshed = await apiFetch<{ incidents: CrisisIncident[] }>("/api/crisis?status=active&limit=20");
    setIncidents(refreshed.incidents ?? []);
    setActiveCrisisId((refreshed.incidents ?? [])[0]?.id ?? null);
  };

  const sendBroadcast = () => {
    if (broadcastMsg.trim()) {
      setBroadcastSent(true);
      setTimeout(() => setBroadcastSent(false), 3000);
      setBroadcastMsg("");
    }
  };

  const activeIncident = useMemo(() => incidents.find((i) => i.id === activeCrisisId) ?? null, [incidents, activeCrisisId]);
  const activeScenario = CRISIS_SCENARIOS.find((s) => s.id === (activeIncident?.type ?? activeCrisisId));

  return (
    <CommandPage>
      <CommandHeader
        eyebrow={
          <EyebrowPill dotClassName={activeCrisisId ? "bg-red-500" : "bg-emerald-500"}>
            {activeCrisisId ? "Crisis active — response required" : "Standby mode"}
          </EyebrowPill>
        }
        title="Crisis Management"
        subtitle="Emergency response protocols and incident triggers."
        right={
          <>
            <button
              onClick={() => setSirensActive(!sirensActive)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                sirensActive
                  ? "bg-red-500/15 border-red-500/30 text-red-200"
                  : "bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.05]"
              }`}
            >
              <Volume2 className={`h-4 w-4 ${sirensActive ? "animate-pulse" : ""}`} />
              Sirens: {sirensActive ? "On" : "Off"}
            </button>
            {activeCrisisId ? (
              <button
                onClick={resolveCrisis}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-emerald-400 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Resolve
              </button>
            ) : null}
          </>
        }
      />

      {/* Active Crisis Banner */}
      <AnimatePresence>
        {activeCrisisId && activeScenario && (
          <motion.div key="crisis-banner" initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
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
      <Panel title="Emergency Broadcast">
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
      </Panel>

      {/* Crisis Scenarios */}
      <div className="mt-6" />
      <Panel title="Scenario Triggers">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-12">
        {CRISIS_SCENARIOS.map((s, i) => (
          <motion.button key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            onClick={() => triggerCrisis(s.id)} disabled={false} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className={`p-6 glass border-white/10 rounded-[2rem] text-left transition-all backdrop-blur-sm ${
              activeScenario?.id === s.id ? "border-red-500/50 bg-red-500/10" : CARD_STYLE[s.color]
            } cursor-pointer`}>
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
            {activeScenario?.id === s.id && (
              <div className="flex items-center gap-2 mt-4 text-red-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
              </div>
            )}
          </motion.button>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 xl:col-span-3 p-10 glass border-white/5 rounded-[2rem] text-center text-white/30">
            Syncing active incidents…
          </motion.div>
        )}
      </div>
      </Panel>

      {/* Quick Actions */}
      <Panel title="Quick Actions" className="mt-6">
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: <Zap className="w-5 h-5" />, label: "Start Evacuation", accent: "hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-400" },
          { icon: <ShieldAlert className="w-5 h-5" />, label: "Venue Lockdown", accent: "hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-400" },
          { icon: <Users className="w-5 h-5" />, label: "Call All Staff", accent: "hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-400" },
          { icon: <XCircle className="w-5 h-5" />, label: "Clear All Alerts", accent: "hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-400" },
        ].map((a) => (
          <button key={a.label} className={`flex flex-col items-center gap-3 p-6 glass border-white/10 rounded-[2rem] transition-all text-white/40 ${a.accent}`}>
            {a.icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{a.label}</span>
          </button>
        ))}
      </div>
      </Panel>
    </CommandPage>
  );
}