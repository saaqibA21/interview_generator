"use client";

import { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<'interviewer' | 'applicant' | null>(null);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    // Store role in session/cookie or pass to API
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">InterviewForge</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Create your account.</h1>
          <p className="text-slate-500 font-medium">Join 500+ teams forging better interviews.</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/50">
          {!role ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg font-black text-slate-900 text-center mb-2">How will you use InterviewForge?</h2>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setRole('interviewer')}
                  className="p-6 border-2 border-slate-100 rounded-3xl text-left hover:border-blue-600 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-black text-slate-900">I'm an Interviewer</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">I want to generate interview kits and analyze candidates.</p>
                </button>

                <button 
                  onClick={() => setRole('applicant')}
                  className="p-6 border-2 border-slate-100 rounded-3xl text-left hover:border-blue-600 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-black text-slate-900">I'm an Applicant</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">I want to practice interviews and improve my performance.</p>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setRole(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600">← Back to roles</button>
                <Badge variant="info" className="uppercase text-[10px]">{role}</Badge>
              </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                 <input 
                   type="text" 
                   placeholder="John"
                   className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                   required
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                 <input 
                   type="text" 
                   placeholder="Doe"
                   className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                   required
                 />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                required
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-blue-900 leading-relaxed uppercase tracking-wider">
                By signing up, you agree to our Terms of Service and Privacy Policy. You'll start on the <span className="text-blue-600 underline">Free Plan</span>.
              </p>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
            >
              Create Account
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </form>
        )}
        </div>

        <p className="mt-8 text-center text-sm font-bold text-slate-500">
          Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-700">Sign in instead</Link>
        </p>
      </div>
    </div>
  );
}
