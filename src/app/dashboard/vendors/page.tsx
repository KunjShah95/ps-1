"use client";

import { useState } from "react";
import { Store, Search, Clock, Star, MoreVertical, Utensils, ShoppingBag, Camera, Ticket, Plus, MapPin, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VENDORS = [
  { id: "1", name: "Burgers & Fries", type: "food", zone: "Food Court North", status: "open", queue: 5, rating: 4.5, revenue: "₹1,04,000" },
  { id: "2", name: "Team Store", type: "merchandise", zone: "Merch Hub", status: "open", queue: 12, rating: 4.8, revenue: "₹3,26,800" },
  { id: "3", name: "Fan Photo Booth", type: "photo", zone: "Gate A Concourse", status: "open", queue: 2, rating: 4.2, revenue: "₹47,000" },
  { id: "4", name: "Pizza Palace", type: "food", zone: "Food Court South", status: "busy", queue: 18, rating: 4.6, revenue: "₹1,76,400" },
  { id: "5", name: "Ticket Office", type: "ticket", zone: "Main Entrance", status: "closed", queue: 0, rating: 4.0, revenue: "₹0" },
  { id: "6", name: "Craft Beer Bar", type: "food", zone: "Upper Concourse", status: "open", queue: 7, rating: 4.7, revenue: "₹1,52,800" },
];

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  food: { icon: <Utensils className="w-4 h-4" />, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  merchandise: { icon: <ShoppingBag className="w-4 h-4" />, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  photo: { icon: <Camera className="w-4 h-4" />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  ticket: { icon: <Ticket className="w-4 h-4" />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  open: { label: "Open", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  busy: { label: "Busy", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500" },
  closed: { label: "Closed", color: "text-white/30 bg-white/5 border-white/10", dot: "bg-white/20" },
};

const TYPES = ["all", "food", "merchandise", "photo", "ticket"];

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = VENDORS.filter((v) => {
    if (typeFilter !== "all" && v.type !== typeFilter) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.zone.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: VENDORS.length,
    open: VENDORS.filter((v) => v.status === "open").length,
    busy: VENDORS.filter((v) => v.status === "busy").length,
    revenue: VENDORS.reduce((sum, v) => sum + parseInt(v.revenue.replace(/[^0-9]/g, "") || "0"), 0),
  };

  return (
    <div className="p-6 lg:p-12">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">{stats.open} Active Vendors</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Vendors</h1>
          <p className="text-white/40 text-sm font-medium">Monitor merchant locations, queues, and revenue.</p>
        </motion.div>
        <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" />Add Vendor
        </button>
      </header>

      {/* Stats */}
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">01 — Vendor Summary</h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
        {[
          { label: "Total Vendors", value: String(stats.total), color: "text-white", accent: "border-white/5" },
          { label: "Active Now", value: String(stats.open), color: "text-emerald-400", accent: "border-emerald-500/20" },
          { label: "High Queue", value: String(stats.busy), color: "text-amber-400", accent: "border-amber-500/20" },
          { label: "Est. Revenue", value: `₹${stats.revenue.toLocaleString()}`, color: "text-blue-400", accent: "border-blue-500/20" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-8 bg-white/[0.02] border rounded-[2.5rem] backdrop-blur-sm ${s.accent}`}>
            <div className="flex items-start justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{s.label}</p>
              <TrendingUp className="w-4 h-4 text-white/10" />
            </div>
            <p className={`text-4xl font-bold tracking-tighter ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col xl:flex-row xl:items-center gap-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">02 — Vendor Directory</h2>
        <div className="h-px flex-1 bg-white/5 hidden xl:block" />
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input type="text" placeholder="Search vendors or zones..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.02] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:border-blue-500/50 transition-all w-64 placeholder:text-white/20 font-medium" />
          </div>
          <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 rounded-2xl p-1">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === t ? "bg-blue-600 text-white" : "text-white/30 hover:text-white/60"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((vendor, idx) => {
            const type = TYPE_CONFIG[vendor.type];
            const status = STATUS_CONFIG[vendor.status];
            return (
              <motion.div key={vendor.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-white/10 hover:bg-white/[0.04] transition-all group backdrop-blur-sm">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform ${type.bg} ${type.border}`}>
                    <span className={type.color}>{type.icon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${status.color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${vendor.status === "open" ? "animate-pulse" : ""}`} />
                      {status.label}
                    </span>
                    <button className="p-1.5 hover:bg-white/5 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4 text-white/30" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base mb-1 tracking-tight">{vendor.name}</h3>
                <p className="flex items-center gap-1.5 text-white/30 text-xs mb-5">
                  <MapPin className="w-3 h-3" />{vendor.zone}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Queue</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white/30" />
                      <span className="text-sm font-bold">{vendor.queue > 0 ? `${vendor.queue}` : "—"}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold">{vendor.rating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Revenue</p>
                    <span className="text-sm font-bold text-emerald-400">{vendor.revenue}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full p-16 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-center">
              <Store className="w-12 h-12 text-white/10 mx-auto mb-6" />
              <p className="font-bold text-white/30 mb-1">No vendors found</p>
              <p className="text-white/20 text-sm">Try adjusting your search or category filter.</p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}