"use client";

import { useState } from "react";
import { Users, UserPlus, Search, CheckCircle2, Clock, Shield, Stethoscope, ClipboardList, MoreVertical, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STAFF = [
  { id: "1", name: "James Hartley", role: "security", zone: "Gate A", status: "active", checkIn: "17:30", shift: "Evening" },
  { id: "2", name: "Sarah Chen", role: "medical", zone: "First Aid Bay", status: "active", checkIn: "17:00", shift: "Evening" },
  { id: "3", name: "Mike Rodriguez", role: "usher", zone: "Section 101", status: "break", checkIn: "16:45", shift: "Afternoon" },
  { id: "4", name: "Emily Davis", role: "security", zone: "Gate B", status: "active", checkIn: "18:00", shift: "Evening" },
  { id: "5", name: "Chris Wilson", role: "cleaning", zone: "Food Court", status: "off", checkIn: "—", shift: "Morning" },
  { id: "6", name: "Priya Patel", role: "security", zone: "Perimeter South", status: "active", checkIn: "17:15", shift: "Evening" },
  { id: "7", name: "Tom Baker", role: "medical", zone: "Gate C", status: "active", checkIn: "16:30", shift: "Afternoon" },
  { id: "8", name: "Anita Osei", role: "usher", zone: "Level 2 North", status: "break", checkIn: "17:00", shift: "Evening" },
];

const ROLE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  security: { icon: <Shield className="w-4 h-4" />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  medical: { icon: <Stethoscope className="w-4 h-4" />, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  usher: { icon: <Users className="w-4 h-4" />, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  cleaning: { icon: <ClipboardList className="w-4 h-4" />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: "Active", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  break: { label: "On Break", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", dot: "bg-yellow-500" },
  off: { label: "Off Duty", color: "text-white/30 bg-white/5 border-white/10", dot: "bg-white/20" },
};

const ROLES = ["all", "security", "medical", "usher", "cleaning"];

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = STAFF.filter((m) => {
    if (roleFilter !== "all" && m.role !== roleFilter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.zone.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: STAFF.length,
    active: STAFF.filter((m) => m.status === "active").length,
    onBreak: STAFF.filter((m) => m.status === "break").length,
    off: STAFF.filter((m) => m.status === "off").length,
  };

  return (
    <div className="p-6 lg:p-12">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">{stats.active} Operators On-Site</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Staff Management</h1>
          <p className="text-white/40 text-sm font-medium">Manage personnel deployment and shift tracking.</p>
        </motion.div>
        <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30">
          <UserPlus className="w-4 h-4" />Add Staff Member
        </button>
      </header>

      {/* Stats */}
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">01 — Personnel Status</h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
        {[
          { label: "Total Personnel", value: stats.total, color: "text-white", accent: "bg-white/5 border-white/10" },
          { label: "Active On-Site", value: stats.active, color: "text-emerald-400", accent: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "On Break", value: stats.onBreak, color: "text-yellow-400", accent: "bg-yellow-500/10 border-yellow-500/20" },
          { label: "Off Duty", value: stats.off, color: "text-white/30", accent: "bg-white/[0.02] border-white/5" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-8 border rounded-[2.5rem] backdrop-blur-sm ${s.accent}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">{s.label}</p>
            <p className={`text-5xl font-bold tracking-tighter ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters + Table */}
      <div className="mb-6 flex flex-col xl:flex-row xl:items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">02 — Personnel Roster</h2>
        <div className="h-px flex-1 bg-white/5 hidden xl:block" />
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input type="text" placeholder="Search staff or zone..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.02] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:border-blue-500/50 transition-all w-64 placeholder:text-white/20 font-medium" />
          </div>
          <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 rounded-2xl p-1">
            {ROLES.map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${roleFilter === r ? "bg-blue-600 text-white" : "text-white/30 hover:text-white/60"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {filtered.map((member, idx) => {
            const role = ROLE_CONFIG[member.role];
            const status = STATUS_CONFIG[member.status];
            return (
              <motion.div key={member.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-white/10 hover:bg-white/[0.04] transition-all group backdrop-blur-sm">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border flex-shrink-0 ${role.bg} ${role.border} group-hover:scale-110 transition-transform`}>
                  <span className={role.color}>{role.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm tracking-tight mb-0.5">{member.name}</h3>
                  <div className="flex items-center gap-3 text-white/30 text-xs">
                    <span className={`font-bold capitalize ${role.color}`}>{member.role}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{member.zone}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-white/30 text-xs">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium">Check-in: {member.checkIn}</span>
                </div>
                <div className="hidden md:block text-white/20 text-xs font-medium">{member.shift}</div>
                <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${status.color}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${member.status === "active" ? "animate-pulse" : ""}`} />
                  {status.label}
                </span>
                <button className="p-2 hover:bg-white/5 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4 text-white/30" />
                </button>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-center">
              <Users className="w-12 h-12 text-white/10 mx-auto mb-6" />
              <p className="font-bold text-white/30 mb-1">No staff found</p>
              <p className="text-white/20 text-sm">Try adjusting your search or filter.</p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}