"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Layers,
  Cpu,
  Radio,
  DatabaseZap,
  Globe,
  GitBranch,
} from "lucide-react";
import { Icon } from "@iconify/react";

const NAV_LINKS = [
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/security", label: "Security" },
];

const PLATFORM_PILLARS = [
  {
    number: "01",
    icon: "mdi:heat-wave",
    title: "Live Heatmaps",
    desc: "See crowd levels across your entire venue in real time. Color-coded zones make it easy to spot where things are getting busy.",
    color: "text-amber-400",
    accent: "bg-amber-500",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    items: ["Works with your cameras", "Updates every 200ms", "Easy zone setup", "Works on any device"],
  },
  {
    number: "02",
    icon: "mdi:robot-excited",
    title: "Smart Predictions",
    desc: "Our AI predicts where crowds will form 5-15 minutes ahead. Get ahead of problems before they start.",
    color: "text-teal-400",
    accent: "bg-teal-500",
    border: "border-teal-500/20",
    bg: "bg-teal-500/5",
    items: ["Predicts 5-15 min ahead", "Learns from your data", "Gives clear recommendations", "Gets better over time"],
  },
  {
    number: "03",
    icon: "mdi:alarm-light",
    title: "Instant Alerts",
    desc: "Get notified the moment areas get too crowded. Choose how and when to be alerted.",
    color: "text-orange-400",
    accent: "bg-orange-500",
    border: "border-orange-500/20",
    bg: "bg-orange-500/5",
    items: ["Set your own thresholds", "Alerts via SMS, email, or app", "Built-in response steps", "Escalates if unanswered"],
  },
  {
    number: "04",
    icon: "mdi:chart-timeline-variant",
    title: "Easy Reports",
    desc: "See what happened at past events. Use that knowledge to plan better future events.",
    color: "text-cyan-400",
    accent: "bg-cyan-500",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
    items: ["Compare past events", "See peak times", "Staff performance reports", "Export to PDF or Excel"],
  },
];

const INTEGRATIONS = [
  { name: "Genetec", icon: "mdi:camera-outline" },
  { name: "AXIS", icon: "mdi:cctv" },
  { name: "Milestone", icon: "mdi:monitor-dashboard" },
  { name: "Ticketmaster", icon: "mdi:ticket-outline" },
  { name: "AxxonSoft", icon: "mdi:shield-account" },
  { name: "Hikvision", icon: "mdi:video-box" },
  { name: "Bosch", icon: "mdi:motion-sensor" },
  { name: "Firebase", icon: "mdi:firebase" },
];

const ARCH_LAYERS = [
  { label: "Sensor & Camera Network", icon: <Radio className="w-4 h-4" />, color: "bg-amber-500/10 border-amber-500/30" },
  { label: "Edge Processing Layer", icon: <Cpu className="w-4 h-4" />, color: "bg-teal-500/10 border-teal-500/30" },
  { label: "SmartFlow AI Core", icon: <Activity className="w-4 h-4" />, color: "bg-amber-500/20 border-amber-500/50" },
  { label: "Firestore Real-Time DB", icon: <DatabaseZap className="w-4 h-4" />, color: "bg-teal-500/10 border-teal-500/30" },
  { label: "Web & Mobile Clients", icon: <Globe className="w-4 h-4" />, color: "bg-white/5 border-white/15" },
];

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">
      {/* GRID BACKGROUND */}
      <div className="fixed inset-0 grid-animation opacity-20 pointer-events-none" style={{ backgroundSize: "60px 60px" }} />
      
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-600/30">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">
              SmartFlow <span className="text-amber-500">AI</span>
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${l.href === "/platform" ? "text-white bg-white/[0.08]" : "text-white/50 hover:text-white hover:bg-white/[0.06]"}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden lg:block text-sm font-medium text-white/50 hover:text-white transition-colors px-4 py-2.5">Sign In</Link>
            <Link href="/auth/register" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-600/25">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-44 pb-24 px-6 lg:px-12 relative">
        {/* Ambient glow */}
        <div className="absolute top-32 left-[15%] w-[450px] h-[450px] bg-amber-600/6 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-48 right-[10%] w-[350px] h-[350px] bg-teal-600/4 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[850px] mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs font-semibold px-5 py-2.5 rounded-full mb-10 uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5" /> Platform Architecture
            </div>
            <h1 className="text-6xl lg:text-7xl font-heading font-bold tracking-tight leading-[0.98] mb-7">
              See Everything.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                Act Faster.
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/40 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
              SmartFlow gives you real-time visibility into your venue. Know what's happening, predict problems, and make smart decisions.
            </p>
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-8 py-4.5 rounded-xl transition-all shadow-xl shadow-amber-600/25"
            >
              Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ARCH DIAGRAM */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-[600px] mx-auto">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-white/25 mb-12">System Architecture</h2>
          <div className="space-y-2.5 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/0 via-amber-500/30 to-amber-500/0 -translate-x-1/2 pointer-events-none" />
            {ARCH_LAYERS.map((layer, i) => (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl border ${layer.color} relative z-10`}
              >
                {layer.icon}
                <span className="text-sm font-medium">{layer.label}</span>
                {i < ARCH_LAYERS.length - 1 && (
                  <ChevronRight className="w-3 h-3 ml-auto text-white/15" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM PILLARS */}
      <section className="py-28 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-18">
            <h2 className="text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-5">Four Core Pillars</h2>
            <p className="text-white/35 text-lg max-w-xl">Each layer of the SmartFlow platform is independently scalable and configurable to your venue&apos;s unique needs.</p>
          </div>

          <div className="space-y-4">
            {PLATFORM_PILLARS.map((p, i) => (
              <motion.div
                key={p.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-8 lg:p-10 ${p.bg} border ${p.border} rounded-2xl grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 hover:border-white/[0.15] transition-all`}
              >
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-5 mb-6">
                    <span className={`text-5xl font-heading font-black ${p.color} opacity-20`}>{p.number}</span>
                    <div className={`w-12 h-12 rounded-xl ${p.accent}/10 flex items-center justify-center`}>
                      <Icon icon={p.icon} className={`w-6 h-6 ${p.color}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-heading font-bold mb-4">{p.title}</h3>
                  <p className="text-white/45 leading-relaxed text-lg">{p.desc}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/25 mb-5">Key Capabilities</p>
                  <ul className="space-y-3.5">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-white/55">
                        <div className={`w-1.5 h-1.5 rounded-full ${p.accent}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="py-28 px-6 lg:px-12 border-t border-white/[0.06]">
        <div className="max-w-[1000px] mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 text-teal-400 text-xs font-bold uppercase tracking-widest mb-5">
            <GitBranch className="w-3.5 h-3.5" /> Open Integration Layer
          </div>
          <h2 className="text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-5">Works With Your Setup</h2>
          <p className="text-white/35 text-lg max-w-lg mx-auto mb-14">
            Connect to cameras and systems you already have. We support the top brands in the industry.
          </p>

          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
            {INTEGRATIONS.map((intg) => (
              <div key={intg.name} className="aspect-square bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-white/[0.15] hover:bg-white/[0.04] transition-all p-3 group">
                <Icon icon={intg.icon} className="w-6 h-6 text-white/25 group-hover:text-white/50 transition-colors" />
                <span className="text-[10px] text-white/15 font-medium group-hover:text-white/30 transition-colors text-center">{intg.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 lg:px-12">
        <div className="max-w-[700px] mx-auto text-center">
          <div className="p-14 lg:p-16 bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.06] border border-amber-500/15 rounded-3xl">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-5">Ready to Deploy?</h2>
            <p className="text-white/45 text-lg mb-10 max-w-md mx-auto">
              Our engineering team will guide you through a tailored integration plan — from sensor onboarding to live dashboard in under 48 hours.
            </p>
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-8 py-4.5 rounded-xl transition-all shadow-xl shadow-amber-600/25"
            >
              Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-12 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-base">SmartFlow AI</span>
          </Link>
          <div className="flex items-center gap-8 text-sm text-white/30">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>
          <p className="text-white/15 text-xs">© 2025 SmartFlow AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}