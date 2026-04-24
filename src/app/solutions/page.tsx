"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Trophy,
  Train,
  Music2,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Icon } from "@iconify/react";

const NAV_LINKS = [
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/security", label: "Security" },
];

const VERTICALS = [
  {
    icon: <Trophy className="w-6 h-6" />,
    iconMdi: "mdi:trophy-outline",
    name: "Sports Venues",
    tagline: "Know what's happening",
    desc: "Keep fans safe with real-time crowd tracking. Reduce wait times at gates, manage concession lines, and get people out faster after events.",
    color: "from-blue-600/15 to-blue-600/5 border-blue-600/20",
    iconBg: "bg-blue-600/20 text-blue-400",
    metrics: ["38% faster entry", "0 safety incidents", "6 min faster exit"],
    useCases: [
      "Gate crowd levels",
      "Concession line alerts",
      "Emergency routing",
      "Staff scheduling",
    ],
  },
  {
    icon: <Train className="w-6 h-6" />,
    iconMdi: "mdi:train",
    name: "Transit Hubs",
    tagline: "Keep trains and platforms safe",
    desc: "Airports, train stations, and ferry terminals use SmartFlow to stop dangerous crowding on platforms and at exits.",
    color: "from-purple-600/15 to-purple-600/5 border-purple-600/20",
    iconBg: "bg-purple-600/20 text-purple-400",
    metrics: ["52% less crowding", "4 min early warning", "Real-time PA alerts"],
    useCases: [
      "Platform crowding alerts",
      "Disruption management",
      "Dynamic signs",
      "Accessibility monitoring",
    ],
  },
  {
    icon: <Music2 className="w-6 h-6" />,
    iconMdi: "mdi:music-note",
    name: "Concerts & Festivals",
    tagline: "Safe crowds, great shows",
    desc: "Track standing crowds at stages, pit areas, and entry points. Keep fans safe while they enjoy the music.",
    color: "from-amber-500/15 to-amber-500/5 border-amber-500/20",
    iconBg: "bg-amber-500/20 text-amber-400",
    metrics: ["Live crowd density", "Stage area alerts", "Weather planning"],
    useCases: [
      "Standing crowd tracking",
      "Barrier pressure alerts",
      "Multiple stage coordination",
      "Exit planning",
    ],
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    iconMdi: "mdi:office-building",
    name: "Convention Centers",
    tagline: "Smooth flows, happy attendees",
    desc: "Trade shows and conferences get crowded. SmartFlow helps manage registration lines, session rooms, and exhibitor areas.",
    color: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/20",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    metrics: ["Hall-by-hall view", "Session fill alerts", "Booth traffic reports"],
    useCases: [
      "Registration lines",
      "Session capacity",
      "Exhibitor heatmaps",
      "Catering planning",
    ],
  },
];

const WHY_ITEMS = [
  { icon: "mdi:timer-sand", label: "Quick Setup", desc: "Live in 2 days, not months." },
  { icon: "mdi:api", label: "Works With Your Systems", desc: "Connect to what you already have." },
  { icon: "mdi:shield-check", label: "Secure", desc: "Enterprise-grade protection." },
  { icon: "mdi:headset", label: "24/7 Support", desc: "Help whenever you need it." },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">SmartFlow <span className="text-blue-500">AI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${l.href === "/solutions" ? "text-white bg-white/5" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden md:block text-sm text-white/60 hover:text-white transition-colors px-4 py-2">Sign In</Link>
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-2">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-xs font-semibold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Industry Solutions
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none mb-6">
              One Platform.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Every Venue Type.
              </span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              SmartFlow works for stadiums, transit hubs, concerts, and conventions. Get the same powerful tools customized for your venue.
            </p>
          </motion.div>
        </div>
      </section>

      {/* VERTICALS */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {VERTICALS.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-8 bg-gradient-to-br ${v.color} border rounded-2xl grid grid-cols-1 lg:grid-cols-2 gap-10`}
            >
              <div>
                <div className={`inline-flex items-center gap-3 ${v.iconBg} px-4 py-2 rounded-full mb-6`}>
                  {v.icon}
                  <span className="font-bold text-sm">{v.name}</span>
                </div>
                <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-2">{v.tagline}</p>
                <h2 className="text-2xl font-bold mb-4">{v.name}</h2>
                <p className="text-white/60 leading-relaxed mb-6">{v.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {v.metrics.map((m) => (
                    <span key={m} className="bg-white/5 border border-white/10 text-white/60 text-xs px-3 py-1 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-white/30 mb-5">Key Use Cases</p>
                <ul className="space-y-3">
                  {v.useCases.map((uc) => (
                    <li key={uc} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-white/70">{uc}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Explore solution <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY SMARTFLOW */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Why Operations Teams Choose SmartFlow</h2>
          <p className="text-white/40 max-w-lg mx-auto mb-14">We don&apos;t just provide data — we deliver operational clarity at the moment it matters most.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {WHY_ITEMS.map((item) => (
              <div key={item.label} className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center hover:border-white/20 transition-all">
                <Icon icon={item.icon} className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <p className="font-bold text-sm mb-2">{item.label}</p>
                <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="p-10 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Find Your Solution</h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">Our venue specialists will map SmartFlow&apos;s capabilities to your exact environment and scale requirements.</p>
            <Link href="/auth/register" className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl shadow-blue-600/20">
              Request a Tailored Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center"><Activity className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-sm">SmartFlow AI</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-white/40">
            {NAV_LINKS.map((l) => (<Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>))}
          </div>
          <p className="text-white/20 text-xs">© 2025 SmartFlow AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
