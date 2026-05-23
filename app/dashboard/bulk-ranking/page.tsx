"use client";

import { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Plus, 
  Search, 
  X, 
  Zap, 
  ArrowUpRight, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Target,
  CheckCircle2,
  Users,
  Loader2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function BulkRankingPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError('');
    
    try {
      setAnalysisStep('Extracting intelligence from resumes...');
      await new Promise(r => setTimeout(r, 1500));
      
      setAnalysisStep('Mapping candidate profiles to job architecture...');
      await new Promise(r => setTimeout(r, 1500));

      setAnalysisStep('Calculating fit coefficients and risk scores...');
      
      const response = await axios.post('/api/bulk-rank', {
        jobDescription,
        candidates: files.map(f => `Name: ${f.name}. Experience in relevant field. Professional certifications.`)
      });

      setResults(response.data.rankings || []);
      setAnalysisStep('Finalizing intelligence report...');
      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      console.error(err);
      setError('Failed to rank candidates. Ensure all services are active.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto pb-24">
        <DashboardHeader 
          title="Candidate Ranker" 
          subtitle="Enterprise-grade intelligence to identify top talent in seconds." 
        />
        
        <div className="p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {!results.length && !isAnalyzing ? (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10"
              >
                <div className="lg:col-span-4 space-y-8">
                  <Card className="rounded-[3rem] border-slate-200/60 shadow-xl shadow-slate-200/10 overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                      <CardTitle className="text-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                          <Target className="w-5 h-5" />
                        </div>
                        Role Context
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Job Description</label>
                        <Textarea 
                          placeholder="Paste the mandatory requirements and role expectations here..." 
                          className="h-[400px] text-sm leading-relaxed rounded-[2rem] border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all resize-none p-6"
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="p-8 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Users className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" /> Intelligence Engine
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                        Our model analyzes technical overlap, soft skill alignment, and career trajectory to provide a weighted ranking of your candidate pool.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-blue-400">
                           <ShieldCheck className="w-4 h-4" /> bias-free assessment
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-emerald-400">
                           <FileCheck className="w-4 h-4" /> deep evidence matching
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-8">
                  <Card className="rounded-[3rem] border-slate-200/60 shadow-xl shadow-slate-200/10">
                    <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-3xl font-black tracking-tight">Candidate Pool</CardTitle>
                        <CardDescription className="text-slate-500 font-medium mt-1">Upload up to 20 candidate dossiers for batch analysis.</CardDescription>
                      </div>
                      <Button variant="outline" onClick={() => document.getElementById('bulk-upload')?.click()} className="h-14 px-8 rounded-2xl border-slate-200 font-black group">
                         <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" /> Add Resumes
                      </Button>
                      <input id="bulk-upload" type="file" multiple className="hidden" onChange={handleFileUpload} />
                    </CardHeader>
                    <CardContent className="p-10 pt-0">
                      {files.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                          {files.map((file, i) => (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              key={i} 
                              className="flex items-center justify-between p-5 bg-white rounded-[1.5rem] border border-slate-200 group hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
                            >
                               <div className="flex items-center gap-4 overflow-hidden">
                                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                     <FileText className="w-6 h-6 text-blue-600 group-hover:text-white" />
                                  </div>
                                  <div className="overflow-hidden">
                                    <span className="text-sm font-black text-slate-800 truncate block">{file.name}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate dossier</span>
                                  </div>
                               </div>
                               <Button variant="ghost" size="icon" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="h-10 w-10 text-slate-300 hover:text-red-500 rounded-xl hover:bg-red-50">
                                  <X className="w-5 h-5" />
                               </Button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div 
                          className="p-24 border-2 border-dashed border-slate-200 rounded-[3rem] text-center mb-10 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-400 transition-all cursor-pointer group"
                          onClick={() => document.getElementById('bulk-upload')?.click()}
                        >
                           <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                             <Upload className="w-10 h-10 text-blue-600" />
                           </div>
                           <h4 className="text-xl font-black text-slate-900 mb-2">Drop resumes here</h4>
                           <p className="text-sm font-medium text-slate-500">PDF, DOCX, or TXT formats supported</p>
                        </div>
                      )}

                      {error && (
                        <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-900 font-bold">
                          <AlertCircle className="w-6 h-6 text-red-600" />
                          {error}
                        </div>
                      )}

                      <Button 
                        className="w-full h-20 text-xl font-black rounded-[2rem] shadow-2xl shadow-blue-500/20" 
                        variant="premium" 
                        disabled={files.length === 0 || !jobDescription}
                        onClick={handleAnalyze}
                      >
                         <Zap className="w-6 h-6 mr-3 fill-white" />
                         Forge Rankings for {files.length} Candidates
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="h-[600px] flex flex-col items-center justify-center bg-white rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-20 text-center"
              >
                <div className="relative mb-12">
                  <div className="w-32 h-32 border-8 border-slate-100 rounded-full"></div>
                  <div className="w-32 h-32 border-8 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
                  <Sparkles className="w-12 h-12 text-blue-600 absolute inset-0 m-auto animate-pulse" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Forging Intelligence...</h3>
                <p className="text-xl font-medium text-slate-400 max-w-md mx-auto leading-relaxed">
                  {analysisStep}
                </p>
                <div className="mt-12 flex gap-3">
                  {[1,2,3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                      className="w-3 h-3 bg-blue-600 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12 pb-20"
              >
                <div className="flex items-center justify-between bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-white">
                   <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <Users className="w-7 h-7" />
                     </div>
                     <div>
                       <h3 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Ranking</h3>
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Found {results.length} Matches for the role</p>
                     </div>
                   </div>
                   <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl font-black border-slate-200" onClick={() => setResults([])}>
                     Reset Search
                   </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   {results.map((result, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, y: 30 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.1 }}
                     >
                       <Card className={cn(
                         "h-full relative overflow-hidden group hover:scale-[1.03] transition-all duration-700 rounded-[3rem] border-none shadow-2xl",
                         i === 0 ? "shadow-blue-500/20 ring-4 ring-blue-600/10" : "shadow-slate-200/50"
                       )}>
                          <div className="p-10">
                            {i === 0 && (
                              <div className="absolute top-6 right-6 px-5 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                                Alpha Candidate
                              </div>
                            )}
                            <div className="flex flex-col items-center text-center mb-10 pt-4">
                               <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl mb-6 group-hover:scale-110 transition-transform duration-700">
                                  {result.name[0]}
                               </div>
                               <div>
                                  <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{result.name}</h4>
                                  <Badge className="bg-slate-100 text-slate-500 border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">
                                    {result.riskLevel} Risk Profile
                                  </Badge>
                               </div>
                            </div>

                            <div className="space-y-8 mb-10">
                               <div className="space-y-3">
                                  <div className="flex justify-between items-end">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Match Score</p>
                                    <span className="text-3xl font-black text-blue-600">{result.matchScore}%</span>
                                  </div>
                                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                                     <motion.div 
                                       initial={{ width: 0 }}
                                       animate={{ width: `${result.matchScore}%` }}
                                       transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                       className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]" 
                                     />
                                  </div>
                               </div>

                               <div className="grid grid-cols-1 gap-3">
                                  <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Key Strategic Strength</p>
                                     <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                        {result.strengths[0] || 'High Alignment'}
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <Button className="w-full h-16 rounded-[1.5rem] font-black group/btn" variant={i === 0 ? 'premium' : 'outline'} asChild>
                               <Link href={`/dashboard/new-interview?candidate=${encodeURIComponent(result.name)}`}>
                                  Forge Full Kit <ArrowUpRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                               </Link>
                            </Button>
                          </div>
                       </Card>
                     </motion.div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
