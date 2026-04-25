'use client';

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Loader2, Shield } from "lucide-react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Icon } from "@iconify/react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Google sign-in error:", err);
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grain opacity-5 pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold tracking-tight">SmartFlow AI</span>
              <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Command Center</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Access Control</h1>
          <p className="text-white/40 font-medium">Identify yourself to enter the network</p>
        </div>

        <div className="glass rounded-[2rem] p-10 border border-white/10 shadow-2xl">
          {/* Google Sign-In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white/[0.03] border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-[0.98] duration-200 mb-8 disabled:opacity-50"
          >
            <Icon icon="mdi:google" className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-bold tracking-tight">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Or use credentials</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold p-4 rounded-xl animate-pulse-subtle flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Terminal ID (Email)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20 text-sm"
                placeholder="admin@smartflow.io"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Access Key (Password)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Initialize Session
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest text-center">
              Emergency Access: <span className="text-white/40">admin@smartflow.io / demo123</span>
            </p>
            <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              No license?{" "}
              <Link href="/auth/register" className="text-blue-500 hover:text-blue-400 transition-colors">
                Request Access
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-white/40 text-xs font-bold">
          <Link href="/" className="hover:text-white transition-colors flex items-center justify-center gap-2 uppercase tracking-widest">
            <span>Cancel Authorization</span>
          </Link>
        </p>
      </div>
    </div>
  );
}