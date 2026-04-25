"use client";

import { useState, useEffect, useRef } from "react";
import { useSimulation } from "@/app/SimulationEngine";
import { motion, AnimatePresence } from "framer-motion";
import { CommandHeader, CommandPage, EyebrowPill, Panel } from "@/components/command-center";
import {
  Maximize2, RefreshCw, AlertTriangle, Users, Wind, Zap,
  Eye, Radio, Camera, Thermometer, Navigation, ChevronRight,
  Activity, Shield, Clock, ArrowUpRight,
} from "lucide-react";

const ZONES: Record<string, { x: number; y: number; w: number; h: number; label: string; capacity: number }> = {
  "north-stand": { x: 180, y: 60,  w: 240, h: 75, label: "North Stand",    capacity: 8200 },
  "south-stand": { x: 180, y: 465, w: 240, h: 75, label: "South Stand",    capacity: 7800 },
  "west-stand":  { x: 25,  y: 155, w: 85,  h: 290, label: "West Stand",   capacity: 6500 },
  "east-stand":  { x: 490, y: 155, w: 85,  h: 290, label: "East Stand",   capacity: 6500 },
  "pitch":       { x: 195, y: 155, w: 210, h: 290, label: "Pitch / Field", capacity: 0   },
};

const GATES = [
  { x: 300, y: 22,  label: "Gate A", dir: "N", open: true  },
  { x: 300, y: 578, label: "Gate B", dir: "S", open: true  },
  { x: 15,  y: 300, label: "Gate C", dir: "W", open: true  },
  { x: 585, y: 300, label: "Gate D", dir: "E", open: false },
];

const CAMERAS = [
  { x: 195, y: 92,  id: "CAM-01", zone: "North" },
  { x: 405, y: 92,  id: "CAM-02", zone: "North" },
  { x: 195, y: 508, id: "CAM-03", zone: "South" },
  { x: 405, y: 508, id: "CAM-04", zone: "South" },
  { x: 62,  y: 200, id: "CAM-05", zone: "West"  },
  { x: 62,  y: 400, id: "CAM-06", zone: "West"  },
  { x: 538, y: 200, id: "CAM-07", zone: "East"  },
  { x: 538, y: 400, id: "CAM-08", zone: "East"  },
];

function statusColor(s: string, alpha = 0.5) {
  if (s === "critical") return `rgba(239,68,68,${alpha})`;
  if (s === "high")     return `rgba(245,158,11,${alpha})`;
  if (s === "medium")   return `rgba(59,130,246,${alpha})`;
  return                       `rgba(16,185,129,${alpha})`;
}
function statusHex(s: string) {
  if (s === "critical") return "#ef4444";
  if (s === "high")     return "#f59e0b";
  if (s === "medium")   return "#3b82f6";
  return                       "#10b981";
}

export default function StadiumPage() {
  const { zones } = useSimulation();
  const [selected, setSelected] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"heat" | "flow" | "capacity">("heat");
  const [tick, setTick] = useState(0);
  const [showCams, setShowCams] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mapped = zones.filter(z => ZONES[z.id]).map(z => ({ ...z, key: z.id }));
  const totalCrowd  = mapped.reduce((a, z) => a + z.count, 0);
  const avgSat      = mapped.length ? Math.round(mapped.reduce((a, z) => a + z.percentage, 0) / mapped.length) : 0;
  const critCount   = mapped.filter(z => z.status === "critical").length;
  const flowRate    = Math.round(totalCrowd / 55);
  const selectedZone = selected ? mapped.find(z => z.key === selected) ?? null : null;

  const kpis = [
    { label: "Total Crowd",      value: totalCrowd.toLocaleString(),   icon: Users,         color: "text-blue-400",   glow: "shadow-blue-500/20"   },
    { label: "Avg Saturation",   value: `${avgSat}%`,                  icon: Thermometer,   color: "text-purple-400", glow: "shadow-purple-500/20" },
    { label: "Critical Zones",   value: critCount.toString(),           icon: AlertTriangle, color: critCount > 0 ? "text-red-400" : "text-emerald-400", glow: critCount > 0 ? "shadow-red-500/20" : "shadow-emerald-500/20" },
    { label: "Flow Rate",        value: `${flowRate}/min`,              icon: Wind,          color: "text-amber-400",  glow: "shadow-amber-500/20"  },
  ];

  return (
    <CommandPage>
      <CommandHeader
        eyebrow={<EyebrowPill>Live stadium feed</EyebrowPill>}
        title="Stadium View"
        subtitle={
          <>
            Bird&apos;s-eye overlay · <span className="text-white/70">{zones.length}</span> zones synchronized
          </>
        }
        right={
          <div className="flex items-center gap-2 flex-wrap">
          {(["heat","flow","capacity"] as const).map(m => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors border ${
                viewMode === m
                  ? "bg-blue-500 border-blue-500/40 text-white"
                  : "bg-white/[0.03] border-white/10 text-white/55 hover:bg-white/[0.05]"
              }`}
            >{m}</button>
          ))}
          <button
            onClick={() => setShowCams(c => !c)}
            className={`px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors border flex items-center gap-2 ${
              showCams ? "bg-white/[0.06] border-white/15 text-white/80" : "bg-white/[0.03] border-white/10 text-white/55"
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Cameras
          </button>
          <button className="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.05] transition-colors">
            <RefreshCw className="w-4 h-4 text-white/30" />
          </button>
          </div>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {kpis.map(kpi => (
          <motion.div key={kpi.label} whileHover={{ y: -4 }}
            className={`p-5 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-4 shadow-xl backdrop-blur-sm`}>
            <div className={`p-3 bg-white/5 rounded-2xl ring-1 ring-white/10 shadow-lg ${kpi.glow}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-0.5">{kpi.label}</p>
              <p className={`text-2xl font-bold tracking-tighter ${kpi.color}`}>{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6" />

      {/* Main grid */}
      <div className="grid xl:grid-cols-12 gap-8">

        {/* SVG Stadium */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="xl:col-span-8">
          <Panel title="Stadium Overlay" className="overflow-hidden">

          {/* Legend */}
          <div className="absolute top-5 left-6 flex items-center gap-3 z-10 flex-wrap">
            {[["Low","#10b981"],["Medium","#3b82f6"],["High","#f59e0b"],["Critical","#ef4444"]].map(([l,c]) => (
              <span key={l} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </span>
            ))}
          </div>

          <div className="absolute top-5 right-6 z-10 flex items-center gap-2">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest tabular-nums">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <Maximize2 className="w-4 h-4 text-white/40" />
            </button>
          </div>

          <svg viewBox="0 0 600 600" className="w-full h-auto max-h-[620px]" style={{ display: "block" }}>
            {/* Stadium shells */}
            <ellipse cx="300" cy="300" rx="288" ry="278" fill="rgba(255,255,255,0.005)" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <ellipse cx="300" cy="300" rx="245" ry="235" fill="rgba(255,255,255,0.008)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

            {/* Pitch */}
            <rect x="195" y="155" width="210" height="290" rx="14" fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.18)" strokeWidth="1.5" />
            <rect x="215" y="175" width="170" height="250" rx="8" fill="none" stroke="rgba(16,185,129,0.10)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="215" y1="300" x2="385" y2="300" stroke="rgba(16,185,129,0.10)" strokeWidth="1" />
            <circle cx="300" cy="300" r="32" fill="none" stroke="rgba(16,185,129,0.14)" strokeWidth="1" />
            <circle cx="300" cy="300" r="2.5" fill="rgba(16,185,129,0.5)" />
            {/* Goal boxes */}
            <rect x="255" y="155" width="90" height="28" rx="4" fill="none" stroke="rgba(16,185,129,0.10)" strokeWidth="1" />
            <rect x="255" y="417" width="90" height="28" rx="4" fill="none" stroke="rgba(16,185,129,0.10)" strokeWidth="1" />

            {/* Zone heat overlays */}
            {mapped.map(zone => {
              const pos = ZONES[zone.key];
              if (!pos || zone.key === "pitch") return null;
              const sel = selected === zone.key;
              const fill = statusColor(zone.status, viewMode === "capacity" ? 0.65 : 0.42);
              const hex  = statusHex(zone.status);
              const pulseOp = (Math.sin(tick * 1.8) + 1) / 2;
              return (
                <g key={zone.key} style={{ cursor: "pointer" }} onClick={() => setSelected(sel ? null : zone.key)}>
                  <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx="10"
                    fill={fill} stroke={hex} strokeWidth={sel ? 2.5 : 1} strokeOpacity={sel ? 1 : 0.45}
                    style={{ transition: "all 0.4s" }} />
                  {sel && (
                    <rect x={pos.x - 5} y={pos.y - 5} width={pos.w + 10} height={pos.h + 10}
                      rx="15" fill="none" stroke={hex} strokeWidth="1.5" strokeOpacity={0.4} strokeDasharray="6 4" />
                  )}
                  {/* Progress bar inside zone */}
                  <rect x={pos.x + 10} y={pos.y + pos.h - 12} width={pos.w - 20} height="4" rx="2" fill="rgba(0,0,0,0.3)" />
                  <rect x={pos.x + 10} y={pos.y + pos.h - 12} width={Math.max(0, (pos.w - 20) * zone.percentage / 100)} height="4" rx="2" fill={hex} opacity={0.7} />
                  <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 - 8} textAnchor="middle"
                    fill="white" fontSize="15" fontWeight="800" fontFamily="sans-serif" opacity={0.95}>{zone.percentage}%</text>
                  <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 + 10} textAnchor="middle"
                    fill="white" fontSize="9" fontWeight="700" fontFamily="sans-serif" opacity={0.4} letterSpacing="1">
                    {pos.label.toUpperCase()}
                  </text>
                  {zone.status === "critical" && (
                    <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx="10"
                      fill="rgba(239,68,68,0.06)" stroke="#ef4444" strokeWidth="1" strokeOpacity={pulseOp} />
                  )}
                </g>
              );
            })}

            {/* Flow arrows */}
            {viewMode === "flow" && (
              <g opacity={0.7}>
                {[
                  { x1:300, y1:70,  x2:300, y2:135, color:"#3b82f6" },
                  { x1:300, y1:530, x2:300, y2:460, color:"#10b981" },
                  { x1:70,  y1:300, x2:155, y2:300, color:"#f59e0b" },
                  { x1:530, y1:300, x2:445, y2:300, color:"#3b82f6" },
                ].map((a, i) => {
                  const dx = a.x2 - a.x1, dy = a.y2 - a.y1;
                  const len = Math.sqrt(dx*dx+dy*dy);
                  const ux = dx/len, uy = dy/len, px = -uy, py = ux, hw=7, hl=12;
                  const tip={x:a.x2,y:a.y2};
                  const b1={x:a.x2-ux*hl+px*hw, y:a.y2-uy*hl+py*hw};
                  const b2={x:a.x2-ux*hl-px*hw, y:a.y2-uy*hl-py*hw};
                  return (
                    <g key={i}>
                      <line x1={a.x1} y1={a.y1} x2={a.x2-ux*hl} y2={a.y2-uy*hl}
                        stroke={a.color} strokeWidth="2.5" strokeDasharray="6 3" />
                      <polygon points={`${tip.x},${tip.y} ${b1.x},${b1.y} ${b2.x},${b2.y}`} fill={a.color} />
                      {[0, 1, 2].map((p) => (
                        <circle key={p} r="2.5" fill="white" opacity="0.9">
                          <animate 
                            attributeName="cx" 
                            values={`${a.x1};${a.x2-ux*hl}`} 
                            dur="2s" 
                            repeatCount="indefinite" 
                            begin={`${p * 0.66}s`} 
                          />
                          <animate 
                            attributeName="cy" 
                            values={`${a.y1};${a.y2-uy*hl}`} 
                            dur="2s" 
                            repeatCount="indefinite" 
                            begin={`${p * 0.66}s`} 
                          />
                          <animate 
                            attributeName="opacity" 
                            values="0;1;0" 
                            dur="2s" 
                            repeatCount="indefinite" 
                            begin={`${p * 0.66}s`} 
                          />
                        </circle>
                      ))}
                    </g>
                  );
                })}
              </g>
            )}

            {/* Camera icons */}
            {showCams && CAMERAS.map(cam => (
              <g key={cam.id}>
                <circle cx={cam.x} cy={cam.y} r="8" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity={0.6} />
                <text x={cam.x} y={cam.y+3.5} textAnchor="middle" fill="#93c5fd" fontSize="7" fontWeight="900" fontFamily="sans-serif">●</text>
              </g>
            ))}

            {/* Gate markers */}
            {GATES.map(g => (
              <g key={g.label}>
                <circle cx={g.x} cy={g.y} r="14" fill={g.open ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"}
                  stroke={g.open ? "#10b981" : "#ef4444"} strokeWidth="1.5" strokeOpacity={0.7} />
                <text x={g.x} y={g.y+4} textAnchor="middle" fill={g.open ? "#6ee7b7" : "#fca5a5"} fontSize="8" fontWeight="900" fontFamily="sans-serif">{g.dir}</text>
              </g>
            ))}

            {/* Compass */}
            <g transform="translate(560,45)">
              <circle cx="0" cy="0" r="15" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
              <text x="0" y="-4" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontWeight="900" fontFamily="sans-serif">N</text>
              <line x1="0" y1="-12" x2="0" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            </g>
          </svg>
          </Panel>
        </motion.div>

        {/* Right sidebar */}
        <div className="xl:col-span-4 space-y-5">

          {/* Zone list */}
          <Panel title="Zone Status">
            <div className="flex items-center justify-between mb-5">
              <Eye className="w-4 h-4 text-white/20" />
            </div>
            <div className="space-y-2.5">
              {mapped.filter(z => z.key !== "pitch").map(zone => {
                const pos = ZONES[zone.key];
                const sel = selected === zone.key;
                return (
                  <button key={zone.key} onClick={() => setSelected(sel ? null : zone.key)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                      sel ? "bg-white/[0.06] border-white/20" : "bg-white/[0.01] border-white/5 hover:border-white/10"
                    }`}>
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: statusHex(zone.status), boxShadow: `0 0 8px ${statusHex(zone.status)}70` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white/80 leading-none mb-1.5">{pos?.label ?? zone.name}</p>
                      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${zone.percentage}%`, background: statusHex(zone.status) }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black tabular-nums" style={{ color: statusHex(zone.status) }}>{zone.percentage}%</p>
                      <p className="text-[10px] text-white/20">{zone.count.toLocaleString()}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Panel>

          {/* Selected zone detail */}
          <AnimatePresence mode="wait">
            {selectedZone && (
              <motion.div key={selectedZone.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                style={{ borderColor: statusHex(selectedZone.status) + "40" }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Selected Zone</p>
                    <h3 className="font-bold text-lg tracking-tight">{ZONES[selectedZone.key]?.label ?? selectedZone.name}</h3>
                  </div>
                  <span className="text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border"
                    style={{ color: statusHex(selectedZone.status), background: statusColor(selectedZone.status, 0.1), borderColor: statusHex(selectedZone.status) + "40" }}>
                    {selectedZone.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Occupancy", value: selectedZone.count.toLocaleString() },
                    { label: "Capacity",  value: selectedZone.capacity.toLocaleString() },
                    { label: "Saturation",value: `${selectedZone.percentage}%` },
                    { label: "Wait Time", value: `${selectedZone.waitTime}m` },
                  ].map(d => (
                    <div key={d.label} className="bg-white/[0.02] rounded-2xl p-3 border border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{d.label}</p>
                      <p className="text-xl font-bold tracking-tighter">{d.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20">
                    Dispatch Staff
                  </button>
                  <button className="flex-1 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                    View History
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gate Status */}
          <Panel title="Gate Status">
            <div className="grid grid-cols-2 gap-3">
              {GATES.map(g => (
                <div key={g.label} className="p-3 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white/70">{g.label}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${g.open ? "text-emerald-400" : "text-red-400"}`}>
                      {g.open ? "Open" : "Sealed"}
                    </p>
                  </div>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${g.open ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-red-500"}`} />
                </div>
              ))}
            </div>
          </Panel>

          {/* Camera feeds grid */}
          <Panel title="Camera Feeds" right={<span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">{CAMERAS.length} active</span>}>
            <div className="grid grid-cols-4 gap-2">
              {CAMERAS.map(cam => (
                <div key={cam.id}
                  className="aspect-square bg-black/40 rounded-xl border border-white/5 relative overflow-hidden group cursor-pointer hover:border-blue-500/40 transition-all">
                  {/* Simulated camera noise */}
                  <div className="absolute inset-0 opacity-20"
                    style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)" }} />
                  <div className="absolute inset-0 flex items-end p-1">
                    <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">{cam.id}</span>
                  </div>
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </CommandPage>
  );
}
