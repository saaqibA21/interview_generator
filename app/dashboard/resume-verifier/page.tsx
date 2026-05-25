"use client";

import { useState } from 'react';
import { 
  Search, 
  ShieldAlert, 
  Target, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Info,
  ArrowRight
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeVerifierPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!text.trim()) return;
    
    setIsVerifying(true);
    setError('');
    
    try {
      const response = await axios.post('/api/verify-claims', { text });
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError('Verification engine failed to initialize. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto pb-24">
        <DashboardHeader 
          title="Resume Verifier" 
          subtitle="Detect inflated, vague, or suspicious technical claims using cross-domain intelligence." 
        />
        
        <div className="p-10 max-w-6xl mx-auto space-y-12">
          <Card className="rounded-[3rem] border-slate-200/60 shadow-2xl shadow-slate-200/10 overflow-hidden bg-white">
            <CardHeader className="bg-slate-900 text-white p-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-10">
                 <ShieldCheck className="w-40 h-40" />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                       <Search className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-4xl font-black tracking-tight">Intelligence Scan</CardTitle>
                      <CardDescription className="text-slate-400 text-lg font-medium mt-1">Paste resume content or project bullet points for deep analysis.</CardDescription>
                    </div>
                 </div>
               </div>
            </CardHeader>
            <CardContent className="p-12 space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Input Dossier / Claims</label>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{text.length} characters</span>
                </div>
                <Textarea 
                  placeholder="e.g. 'Optimized PostgreSQL indexing for 10M+ daily active users, resulting in 40% reduction in query latency...'" 
                  className="h-72 rounded-[2rem] border-slate-200 bg-slate-50/50 p-8 text-lg font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all resize-none leading-relaxed"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-900 font-bold">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  {error}
                </div>
              )}

              <div className="flex justify-center">
                <Button 
                  variant="premium" 
                  size="lg" 
                  className="w-full h-20 rounded-[2rem] text-xl font-black shadow-2xl shadow-blue-500/20 group"
                  onClick={handleVerify}
                  disabled={isVerifying || !text.trim()}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-7 h-7 animate-spin mr-4" />
                      Scanning Technical Integrity...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-7 h-7 mr-4 group-hover:scale-110 transition-transform" />
                      Execute Verification Scan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence>
            {results && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10"
              >
                 <div className="lg:col-span-8 space-y-10">
                   <Card className="rounded-[3rem] border-amber-200/60 shadow-2xl shadow-amber-500/5 bg-white overflow-hidden">
                      <CardHeader className="p-10 pb-6 border-b border-amber-50">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                              <AlertTriangle className="w-6 h-6" />
                            </div>
                            Critical Risk Factors
                          </CardTitle>
                          <Badge className="bg-amber-100 text-amber-700 border-none font-black px-4 py-1.5 uppercase tracking-widest text-[10px]">
                            {results.suspiciousClaims?.length || 0} Alerts Found
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-10 space-y-8">
                        {results.suspiciousClaims?.map((item: any, i: number) => (
                          <ClaimResult 
                            key={i}
                            claim={item.claim}
                            reason={item.reason}
                            question={item.verificationQuestion}
                          />
                        ))}
                      </CardContent>
                   </Card>

                   <Card className="rounded-[3rem] border-emerald-200/60 shadow-2xl shadow-emerald-500/5 bg-white overflow-hidden">
                      <CardHeader className="p-10 pb-6 border-b border-emerald-50">
                        <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                          Verified Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-10 space-y-6">
                        {results.strongClaims?.map((item: any, i: number) => (
                          <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 group">
                             <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                             </div>
                             <div>
                                <p className="text-lg font-black text-slate-800 leading-tight mb-2">"{item.claim}"</p>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.reason}</p>
                             </div>
                          </div>
                        ))}
                      </CardContent>
                   </Card>
                 </div>

                 <div className="lg:col-span-4 space-y-10">
                   <Card className="rounded-[3.5rem] bg-slate-900 text-white p-10 shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                      <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
                      <div className="relative z-10">
                        <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.25em] mb-10">Integrity Coefficient</p>
                        <div className="flex flex-col items-center justify-center py-10">
                          <div className="relative">
                            <svg className="w-48 h-48 transform -rotate-90">
                              <circle className="text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="80" cx="96" cy="96" />
                              <motion.circle 
                                initial={{ strokeDashoffset: 502 }}
                                animate={{ strokeDashoffset: 502 - (502 * results.veracityScore / 100) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeWidth="8" 
                                strokeDasharray="502" 
                                strokeLinecap="round" 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="80" cx="96" cy="96" 
                                className="text-blue-500"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-6xl font-black tracking-tighter">{results.veracityScore}</span>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">out of 100</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm mt-6">
                           <div className="flex items-center gap-3 mb-3">
                             <Info className="w-4 h-4 text-blue-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Confidence Analysis</span>
                           </div>
                           <p className="text-xs text-slate-400 leading-relaxed font-medium">
                             Calculated based on technical internal consistency, role-seniority alignment, and industry-standard benchmark metrics.
                           </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                           <div className="p-5 bg-white/5 rounded-3xl border border-white/10 text-center">
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inconsistency</p>
                             <p className="text-xl font-black text-red-400 mt-1">12%</p>
                           </div>
                           <div className="p-5 bg-white/5 rounded-3xl border border-white/10 text-center">
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Vague Claims</p>
                             <p className="text-xl font-black text-amber-400 mt-1">1 detected</p>
                           </div>
                        </div>
                      </div>
                   </Card>

                   <Card className="rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 shadow-xl shadow-blue-500/20 group cursor-pointer hover:scale-[1.02] transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                          <Zap className="w-6 h-6 fill-white" />
                        </div>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </div>
                      <h4 className="text-xl font-black leading-tight mb-2">Deep-Dive Interview</h4>
                      <p className="text-blue-100 text-sm font-medium leading-relaxed">
                        Generate a specialized interview kit focusing specifically on these risk areas.
                      </p>
                   </Card>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className={className}><ShieldCheck /></motion.div>
}

function ClaimResult({ claim, reason, question }: { claim: string, reason: string, question: string }) {
  return (
    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 group hover:border-amber-400 hover:bg-white hover:shadow-xl transition-all duration-500">
      <h4 className="text-xl font-black text-slate-900 mb-6 italic leading-relaxed group-hover:text-blue-600 transition-colors">"{claim}"</h4>
      <div className="space-y-6">
        <div className="flex gap-4">
           <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
             <AlertTriangle className="w-4 h-4 text-amber-600" />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">AI Integrity Assessment</p>
             <p className="text-sm font-medium text-slate-600 leading-relaxed">{reason}</p>
           </div>
        </div>
        <div className="p-6 bg-white rounded-[1.5rem] border border-amber-200 shadow-sm relative group-hover:bg-amber-50/30 transition-colors">
           <div className="absolute -top-3 left-6 px-4 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
             Recommended Question
           </div>
           <p className="text-base font-black text-slate-800 leading-relaxed">{question}</p>
        </div>
      </div>
    </div>
  );
}
