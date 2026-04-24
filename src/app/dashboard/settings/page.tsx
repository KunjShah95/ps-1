"use client";

import { useState } from "react";
import { Settings, Bell, Shield, Globe, Database, Save, Key, CheckCircle2, Zap, Link, Wifi } from "lucide-react";
import { motion } from "framer-motion";

const TABS = [
  { id: "general", label: "General", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "zones", label: "Zones", icon: Globe },
  { id: "integrations", label: "Integrations", icon: Database },
];

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${enabled ? "bg-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.4)]" : "bg-white/10"}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${enabled ? "translate-x-7" : "translate-x-1"}`} />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-sm">
      <h3 className="font-bold text-lg tracking-tight mb-6">{title}</h3>
      {children}
    </div>
  );
}

function FieldRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-bold text-white/80">{label}</p>
        {description && <p className="text-xs text-white/30 font-medium mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [toggles, setToggles] = useState({
    criticalAlerts: true,
    highAlerts: true,
    warningAlerts: false,
    emailNotifs: true,
    smsNotifs: false,
    twoFactor: false,
    autoRefresh: true,
    darkMode: true,
    liveMode: true,
  });

  const toggle = (key: keyof typeof toggles) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 lg:p-12">
      <header className="mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">System Configuration</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Settings</h1>
          <p className="text-white/40 text-sm font-medium">Configure system preferences, alerts, and integrations.</p>
        </motion.div>
      </header>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Sidebar tabs */}
        <nav className="xl:w-56 flex xl:flex-col gap-1 overflow-x-auto xl:overflow-x-visible pb-2 xl:pb-0 shrink-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all text-left whitespace-nowrap group relative ${isActive ? "bg-white/5 text-white border border-white/10" : "text-white/30 hover:bg-white/[0.03] hover:text-white/60"}`}>
                {isActive && <motion.div layoutId="settings-indicator" className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full" />}
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : ""}`} />
                <span className="text-sm font-bold tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "general" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Section title="Venue Information">
                {[
                  { label: "Venue Name", defaultValue: "SmartFlow Stadium" },
                  { label: "Venue Address", defaultValue: "123 Stadium Way, Sports City, SC1 0AB" },
                  { label: "Venue Capacity", defaultValue: "82,000" },
                ].map((f) => (
                  <div key={f.label} className="py-4 border-b border-white/5 last:border-0">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{f.label}</label>
                    <input type="text" defaultValue={f.defaultValue}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-sm outline-none focus:border-blue-500/50 transition-all font-medium placeholder:text-white/10" />
                  </div>
                ))}
              </Section>
              <Section title="Display Preferences">
                <FieldRow label="Auto-refresh interval" description="How often the dashboard updates live data">
                  <select className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/50 font-medium">
                    <option>5 seconds</option><option>10 seconds</option><option>30 seconds</option>
                  </select>
                </FieldRow>
                <FieldRow label="Auto-refresh" description="Automatically update zone data"><ToggleSwitch enabled={toggles.autoRefresh} onChange={() => toggle("autoRefresh")} /></FieldRow>
                <FieldRow label="Live simulation mode" description="Enable real-time crowd simulation engine"><ToggleSwitch enabled={toggles.liveMode} onChange={() => toggle("liveMode")} /></FieldRow>
              </Section>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Section title="Alert Thresholds">
                <FieldRow label="Critical alerts" description="Zones above 95% capacity"><ToggleSwitch enabled={toggles.criticalAlerts} onChange={() => toggle("criticalAlerts")} /></FieldRow>
                <FieldRow label="High priority alerts" description="Zones above 80% capacity"><ToggleSwitch enabled={toggles.highAlerts} onChange={() => toggle("highAlerts")} /></FieldRow>
                <FieldRow label="Warning alerts" description="Zones above 65% capacity"><ToggleSwitch enabled={toggles.warningAlerts} onChange={() => toggle("warningAlerts")} /></FieldRow>
              </Section>
              <Section title="Delivery Channels">
                <FieldRow label="Email notifications" description="Send alerts to registered email"><ToggleSwitch enabled={toggles.emailNotifs} onChange={() => toggle("emailNotifs")} /></FieldRow>
                <FieldRow label="SMS notifications" description="Send alerts to registered phone"><ToggleSwitch enabled={toggles.smsNotifs} onChange={() => toggle("smsNotifs")} /></FieldRow>
              </Section>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Section title="Authentication">
                <FieldRow label="Auth method" description="Current authentication protocol">
                  <span className="text-sm text-white/40 font-medium">JWT + Firebase Auth</span>
                </FieldRow>
                <FieldRow label="Session duration" description="Auto-logout after inactivity">
                  <select className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/50 font-medium">
                    <option>24 hours</option><option>8 hours</option><option>1 hour</option>
                  </select>
                </FieldRow>
                <FieldRow label="Two-factor authentication" description="Require 2FA on login"><ToggleSwitch enabled={toggles.twoFactor} onChange={() => toggle("twoFactor")} /></FieldRow>
              </Section>
              <Section title="API Access">
                <p className="text-white/40 text-sm font-medium mb-6">Manage API keys for external system integrations.</p>
                <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl mb-4">
                  <div className="flex-1 font-mono text-xs text-white/30">sf_live_••••••••••••••••••••••••••••••••</div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-xl border border-emerald-500/20">Active</span>
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl text-sm font-bold transition-all">
                  <Key className="w-4 h-4 text-white/40" />Generate New API Key
                </button>
              </Section>
            </motion.div>
          )}

          {activeTab === "zones" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Section title="Zone Configuration">
                <p className="text-white/40 text-sm font-medium mb-6">Configure capacity thresholds and monitoring zones.</p>
                {["Gate A", "Gate B", "Main Concourse", "North Stand", "South Stand"].map((zone) => (
                  <FieldRow key={zone} label={zone} description="Capacity override (blank = default)">
                    <input type="number" placeholder="Default" className="w-28 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500/50 font-medium text-center" />
                  </FieldRow>
                ))}
              </Section>
            </motion.div>
          )}

          {activeTab === "integrations" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Section title="Connected Services">
                {[
                  { name: "Firebase", desc: "Authentication & Realtime Database", status: "connected", icon: <Zap className="w-4 h-4" /> },
                  { name: "Twilio SMS", desc: "Emergency alert messaging", status: "disconnected", icon: <Wifi className="w-4 h-4" /> },
                  { name: "SendGrid", desc: "Email notification delivery", status: "disconnected", icon: <Link className="w-4 h-4" /> },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0">
                    <div className={`p-3 rounded-xl border ${s.status === "connected" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-white/30"}`}>
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{s.name}</p>
                      <p className="text-xs text-white/30 font-medium mt-0.5">{s.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${s.status === "connected" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-white/30 border-white/10"}`}>
                        {s.status === "connected" && <CheckCircle2 className="w-3 h-3" />}
                        {s.status}
                      </span>
                      <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">
                        {s.status === "connected" ? "Configure" : "Connect"}
                      </button>
                    </div>
                  </div>
                ))}
              </Section>
            </motion.div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button onClick={handleSave}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg ${saved ? "bg-emerald-600 text-white shadow-emerald-600/20" : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:shadow-blue-600/30"}`}>
              {saved ? <><CheckCircle2 className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}