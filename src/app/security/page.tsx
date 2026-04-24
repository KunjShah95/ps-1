"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Lock,
  Eye,
  Server,
  KeyRound,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";
import { Icon } from "@iconify/react";

const NAV_LINKS = [
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/security", label: "Security" },
];

const CERTIFICATIONS = [
  { icon: "mdi:certificate-outline", name: "SOC 2 Type II", issuer: "AICPA", color: "text-blue-400 bg-blue-600/10 border-blue-600/20" },
  { icon: "mdi:shield-account", name: "ISO 27001", issuer: "Certified", color: "text-emerald-400 bg-emerald-600/10 border-emerald-600/20" },
  { icon: "mdi:lock-check", name: "GDPR Compliant", issuer: "EU Data Protection", color: "text-purple-400 bg-purple-600/10 border-purple-600/20" },
  { icon: "mdi:hospital-building", name: "HIPAA Ready", issuer: "US HHS Framework", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
];

const SECURITY_PILLARS = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Your Data is Protected",
    desc: "All data is encrypted when moving and when stored. We use the strongest standards available.",
    details: [
      "Encrypted in transit (TLS 1.3)",
      "Encrypted at rest (AES-256)",
      "Your own encryption keys available",
      "Secure WebSocket connections",
    ],
  },
  {
    icon: <KeyRound className="w-6 h-6" />,
    title: "Controlled Access",
    desc: "Only people who should see data can see it. Role-based permissions keep things secure.",
    details: [
      "Login with email or Google",
      "Single sign-on for enterprises",
      "Custom roles for your team",
      "Secure token management",
    ],
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Full Audit Trail",
    desc: "Every action is logged. Know who did what and when — for security and compliance.",
    details: [
      "90-day log retention",
      "Ready for SIEM integration",
      "Reports on demand",
      "Change tracking",
    ],
  },
  {
    icon: <Server className="w-6 h-6" />,
    title: "Secure Infrastructure",
    desc: "Built on Google Cloud with protection against attacks and downtime.",
    details: [
      "Multi-region redundancy",
      "DDoS protection",
      "Private network isolation",
      "Auto vulnerability scanning",
    ],
  },
];

const FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /zones/{zoneId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'operator';
    }
  }
}`;

const RESPONSIBILITIES = [
  {
    area: "SmartFlow Responsibilities",
    items: [
      "Platform security and uptime",
      "Data encryption and key management",
      "Infrastructure hardening",
      "Penetration testing (bi-annual)",
      "Security incident response",
      "SOC 2 compliance maintenance",
    ],
  },
  {
    area: "Customer Responsibilities",
    items: [
      "User account management",
      "MFA policy enforcement",
      "Network access to SmartFlow endpoints",
      "Data accuracy and validation",
      "Regulatory compliance for local laws",
      "Integration security in customer systems",
    ],
  },
];

export default function SecurityPage() {
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
                className={`px-4 py-2 text-sm rounded-lg transition-all ${l.href === "/security" ? "text-white bg-white/5" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
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
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-emerald-600/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-emerald-600/10 border border-emerald-600/20 text-emerald-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Security & Compliance
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none mb-6">
              Your Data
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                Stays Protected
              </span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Security is built in from the start, not added later. Your crowd data is protected at every step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest font-bold text-white/30 mb-8">Certifications & Compliance Frameworks</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.name} className={`p-5 border rounded-2xl flex flex-col items-center gap-3 text-center ${cert.color}`}>
                <Icon icon={cert.icon} className={`w-8 h-8 ${cert.color.split(" ")[0]}`} />
                <div>
                  <p className="font-bold text-sm text-white">{cert.name}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY PILLARS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Defense in Depth</h2>
            <p className="text-white/40 max-w-xl mx-auto">Four independent security layers protect crowd data from ingestion to display — with no single point of failure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SECURITY_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all"
              >
                <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{pillar.desc}</p>
                <ul className="space-y-2">
                  {pillar.details.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-sm text-white/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FIRESTORE RULES */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              <FileCheck2 className="w-3 h-3" /> Data Access Control
            </div>
            <h2 className="text-3xl font-bold mb-3">Firestore Security Rules</h2>
            <p className="text-white/40 max-w-md mx-auto text-sm">Our data layer enforces authentication and role-based access at the database level — so even a compromised API token can&apos;t exceed its permissions.</p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10">
            <div className="bg-white/5 border-b border-white/10 px-5 py-3 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-white/30 text-xs font-mono">firestore.rules</span>
            </div>
            <pre className="bg-black/60 p-6 text-sm text-emerald-300/80 font-mono leading-relaxed overflow-x-auto">
              <code>{FIRESTORE_RULES}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* SHARED RESPONSIBILITY */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Shared Responsibility Model</h2>
            <p className="text-white/40 max-w-md mx-auto text-sm">Security is a partnership. Here's a clear breakdown of what SmartFlow handles and what you control.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RESPONSIBILITIES.map((r, i) => (
              <div key={r.area} className={`p-7 border rounded-2xl ${i === 0 ? "bg-emerald-600/5 border-emerald-600/20" : "bg-white/5 border-white/10"}`}>
                <h3 className="font-bold text-lg mb-5 flex items-center gap-3">
                  <ShieldCheck className={`w-5 h-5 ${i === 0 ? "text-emerald-400" : "text-white/40"}`} />
                  {r.area}
                </h3>
                <ul className="space-y-3">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? "bg-emerald-400" : "bg-white/20"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="p-10 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-emerald-500/20 rounded-3xl text-center">
            <Icon icon="mdi:shield-check" className="w-12 h-12 text-emerald-400/40 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Request a Security Review</h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">Our security team is available to walk through our full trust documentation, penetration test reports, and compliance evidence packages.</p>
            <Link href="/auth/register" className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl shadow-blue-600/20">
              Contact Security Team <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
