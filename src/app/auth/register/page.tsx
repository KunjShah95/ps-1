"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Mail, User, Building2, Loader2, CheckCircle2, Shield, Eye, EyeOff } from "lucide-react";
import { Icon } from "@iconify/react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const BENEFITS = [
  "Real-time crowd density dashboards",
  "AI-powered routing & recommendations",
  "Instant incident alerts",
  "Full analytics & reporting suite",
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Access Granted</h2>
          <p className="text-white/40 font-medium">Initializing your command center credentials…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.05),transparent_50%)]" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }} 
      />

      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — value prop */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block"
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold tracking-tight text-white leading-none">SmartFlow <span className="text-blue-500">AI</span></span>
              <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mt-1">Intelligence Platform</span>
            </div>
          </Link>

          <h2 className="text-5xl font-bold tracking-tight mb-6 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Secure Your 
            <br />
            Venue Perimeter
          </h2>
          <p className="text-white/40 font-medium leading-relaxed mb-12 max-w-md">
            Deploy real-time crowd intelligence in minutes. Our AI engine integrates with existing hardware to provide instant operational clarity.
          </p>

          <div className="space-y-6">
            {BENEFITS.map((b, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                key={b} 
                className="flex items-center gap-4 text-sm font-semibold text-white/70 bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl w-fit"
              >
                <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                {b}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Request Access</h1>
              <p className="text-white/40 text-sm font-medium">Register for an operator license</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-2xl flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Legal Name</label>
                  <div className="relative group/input">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium placeholder:text-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Venue / Org</label>
                  <div className="relative group/input">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Apex Arena"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium placeholder:text-white/10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Secure Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@company.com"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium placeholder:text-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Create Password</label>
                <div className="relative group/input">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 pr-12 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium placeholder:text-white/10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 shadow-xl shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.98] duration-200"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>Generate Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Rapid Authorization</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <button
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full bg-white/[0.03] border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/[0.06] hover:border-white/20 transition-all active:scale-[0.98] duration-200"
            >
              <Icon icon="mdi:google" className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-bold tracking-tight">Continue with Google</span>
            </button>

            <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 leading-relaxed">
              Already have an license?{" "}
              <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 transition-colors">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}