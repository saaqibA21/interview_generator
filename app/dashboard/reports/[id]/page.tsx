"use client";

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Copy, 
  Share2, 
  Zap, 
  Target, 
  AlertTriangle, 
  CheckCircle2,
  Trophy,
  Activity,
  MessageSquare,
  ShieldAlert,
  Lightbulb,
  AlertCircle,
  Clock,
  Loader2,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { generateInterviewWordReport } from '@/lib/utils/export-utils';

export default function ReportPage() {
  const params = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [exporting, setExporting] = useState(false);

  const [showCopilot, setShowCopilot] = useState(false);
  const [selectedCopilotQuestion, setSelectedCopilotQuestion] = useState<any>(null);
  const [interviewerNotes, setInterviewerNotes] = useState('');
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const [aiFollowUpQuestion, setAiFollowUpQuestion] = useState('');
  const [liveGrades, setLiveGrades] = useState<Record<number, number>>({});
  const [copilotTimer, setCopilotTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setCopilotTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const generateFollowUp = async () => {
    if (!interviewerNotes || !selectedCopilotQuestion) return;
    setIsGeneratingFollowUp(true);
    setAiFollowUpQuestion('');
    try {
      const response = await axios.post('/api/score-answer', {
        question: selectedCopilotQuestion.text,
        expected: selectedCopilotQuestion.idealAnswer,
        answer: interviewerNotes
      });
      setAiFollowUpQuestion(response.data.suggestedFollowUp || "How would you handle this under extreme peak production loads?");
    } catch (err) {
      console.error(err);
      setAiFollowUpQuestion("Can you describe a specific trade-off or challenge of this implementation?");
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  const handleExport = async () => {
    if (!report) return;
    setExporting(true);
    try {
      await generateInterviewWordReport(report);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/api/reports/${params.id}`);
        setReport(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Intelligence report not found or access denied.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchReport();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Decrypting Vault...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-xl border border-slate-200 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-500 mb-8 font-medium">{error || 'Report unavailable'}</p>
            <Button asChild className="h-14 w-full rounded-2xl font-black">
              <Link href="/dashboard/reports">Back to Vault</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="h-24 border-b border-slate-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" asChild className="rounded-2xl w-12 h-12 hover:bg-slate-100 transition-all">
              <Link href="/dashboard/reports">
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{report.candidateName}</h1>
                <Badge className="bg-blue-600/10 text-blue-600 border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                  ID: #{report._id.slice(-4).toUpperCase()}
                </Badge>
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
                {report.jobTitle} • Analysis Generated on {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={() => {
                setShowCopilot(!showCopilot);
                if (!isTimerRunning) setIsTimerRunning(true);
              }}
              className={cn(
                "h-12 rounded-2xl font-black px-6 transition-all border",
                showCopilot 
                  ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20" 
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              )}
            >
              <Zap className="w-4 h-4 mr-2" /> {showCopilot ? `Copilot: ${formatTime(copilotTimer)}` : 'Live Copilot Mode'}
            </Button>
            <Button variant="outline" className="hidden sm:flex h-12 rounded-2xl border-slate-200 font-bold px-6">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button 
              className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 px-8 font-black disabled:opacity-50"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                  Forging Word...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" /> 
                  Export Intelligence
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Main Content Column */}
          <div className={cn("transition-all duration-500 p-10 flex-1", showCopilot ? "max-w-4xl" : "max-w-7xl mx-auto")}>
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <Card className="flex items-center p-8 gap-6 bg-white border-slate-200/60 shadow-xl shadow-slate-200/10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 263.89 }}
                    animate={{ strokeDashoffset: 263.89 * (1 - (report.matchScore / 100)) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray="263.89" 
                    className="text-emerald-500 shadow-lg" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-900">{report.matchScore}%</div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Match Score</p>
                <Badge className={cn(
                  "border-none font-black text-[10px] uppercase px-3",
                  report.matchScore >= 80 ? "bg-emerald-100 text-emerald-700" :
                  report.matchScore >= 50 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {report.matchScore >= 80 ? 'Elite Candidate' : report.matchScore >= 50 ? 'Viable Talent' : 'High Risk'}
                </Badge>
              </div>
            </Card>

            <Card className="flex items-center p-8 gap-6 border-slate-200/60 shadow-xl shadow-slate-200/10 rounded-[2.5rem]">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Risk Level</p>
                <p className={cn(
                  "text-2xl font-black",
                  report.riskLevel === 'Low' ? "text-emerald-600" :
                  report.riskLevel === 'High' ? "text-red-600" :
                  "text-amber-600"
                )}>
                  {report.riskLevel || 'Unknown'}
                </p>
              </div>
            </Card>

            <Card className="flex items-center p-8 gap-6 border-slate-200/60 shadow-xl shadow-slate-200/10 rounded-[2.5rem]">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Strategy Kit</p>
                <p className="text-2xl font-black text-slate-900">{report.questions?.length || 0} Points</p>
              </div>
            </Card>

            <Card className="flex items-center p-8 gap-6 border-slate-200/60 shadow-xl shadow-slate-200/10 rounded-[2.5rem]">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Primary Gap</p>
                <p className="text-lg font-black text-slate-900 leading-tight">
                  {report.gaps?.[0] || 'None Detected'}
                </p>
              </div>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 p-2 bg-slate-100 rounded-[2rem] mb-12 w-fit">
            {['Overview', 'Questions', 'Scorecard', 'Risks'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "px-8 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-[1.5rem]",
                  activeTab === tab.toLowerCase() 
                    ? "bg-white text-blue-600 shadow-lg" 
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {activeTab === 'overview' && (
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-10">
                    <Card className="rounded-[3rem] border-slate-200/60 shadow-xl shadow-slate-200/10 overflow-hidden">
                      <div className="p-10 space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Activity className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">Executive Summary</h3>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed font-medium italic border-l-4 border-blue-600 pl-6">
                          "{report.candidateSummary || "Analysis pending detailed review."}"
                        </p>
                        <div className="space-y-6 pt-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Strengths</p>
                          <div className="grid grid-cols-1 gap-3">
                            {(report.strengths || ["Technical depth", "Leadership", "Scalability"]).map((s: string, i: number) => (
                              <div key={i} className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 group hover:scale-[1.02] transition-all">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="font-bold text-slate-800">{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-10">
                    <Card className="rounded-[3rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl border-none p-10">
                      <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Zap className="w-32 h-32" />
                      </div>
                      <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Lightbulb className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-black text-white tracking-tight">Interview Strategy</h3>
                        </div>
                        <p className="text-slate-300 text-lg leading-relaxed font-medium">
                          {report.interviewStrategy || "Deep-dive technical exploration requested."}
                        </p>
                        <div className="pt-6 border-t border-white/10">
                           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">Evaluation Pillars</p>
                           <div className="space-y-5">
                              <WeightBar label="Technical Depth" value={report.scorecard?.technicalDepth || 0} />
                              <WeightBar label="Project Ownership" value={report.scorecard?.projectOwnership || 0} />
                              <WeightBar label="Production Readiness" value={report.scorecard?.productionReadiness || 0} />
                           </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Advanced Data Modules */}
                  <div className="grid md:grid-cols-2 gap-10 mt-10">
                    <PsychometricsRadar data={report.psychometrics || [
                      { subject: 'Critical Thinking', value: 80 },
                      { subject: 'Stress Tolerance', value: 70 },
                      { subject: 'Collaboration', value: 85 },
                      { subject: 'Growth Mindset', value: 80 },
                      { subject: 'Leadership', value: 75 }
                    ]} />
                    <SalaryBenchmarkCurve benchmark={report.salaryBenchmark || { low: 100000, median: 130000, high: 160000 }} />
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="grid grid-cols-1 gap-8">
                  {(report.questions || []).map((q: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="rounded-[2.5rem] border-slate-200/60 shadow-xl shadow-slate-200/10 hover:border-blue-400 transition-all duration-500 overflow-hidden group">
                        <div className="p-10">
                          <div className="flex items-start justify-between mb-6">
                            <Badge className="bg-slate-100 text-slate-600 border-none font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl">
                              {q.category || 'General'}
                            </Badge>
                            <div className="flex gap-1.5">
                               {[1,2,3,4,5].map(dot => (
                                 <div key={dot} className={cn("w-2 h-2 rounded-full", dot <= (q.weight || 3) ? "bg-blue-600" : "bg-slate-100")} />
                               ))}
                            </div>
                          </div>
                          <h4 className="text-2xl font-black text-slate-900 leading-tight mb-8 group-hover:text-blue-600 transition-colors">
                            {q.text}
                          </h4>
                          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 relative group-hover:bg-blue-50/50 transition-all">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Master Answer Blueprint</p>
                             <p className="text-slate-700 font-medium leading-relaxed italic">
                               "{q.idealAnswer}"
                             </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'risks' && (
                <div className="grid md:grid-cols-2 gap-10">
                  <Card className="rounded-[3rem] border-red-100 bg-red-50/30 p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-red-900 tracking-tight">Integrity & Red Flags</h3>
                    </div>
                    <div className="space-y-4">
                      {(report.redFlags || ["No significant red flags detected"]).map((flag: string, i: number) => (
                        <div key={i} className="flex gap-4 p-5 bg-white rounded-[1.5rem] border border-red-100 text-red-900 font-bold text-sm">
                           <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                           {flag}
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="rounded-[3rem] border-amber-100 bg-amber-50/30 p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-amber-900 tracking-tight">Verification Needed</h3>
                    </div>
                    <div className="space-y-4">
                      {(report.resumeClaimsToVerify || ["Standard claim verification required"]).map((claim: string, i: number) => (
                        <div key={i} className="flex gap-4 p-5 bg-white rounded-[1.5rem] border border-amber-100 text-amber-900 font-bold text-sm">
                           <Target className="w-5 h-5 shrink-0 mt-0.5" />
                           {claim}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </div>
          
          {/* AI Live Interviewer Copilot Panel */}
          <AnimatePresence>
            {showCopilot && (
              <motion.div
                initial={{ opacity: 0, x: 100, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 384 }}
                exit={{ opacity: 0, x: 100, width: 0 }}
                className="w-96 bg-slate-900 border-l border-slate-800 p-8 h-[calc(100vh-6rem)] sticky top-24 overflow-y-auto flex flex-col justify-between shrink-0 text-white"
              >
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Zap className="w-5 h-5 fill-blue-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Interviewer Copilot</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-black bg-white/5 px-3 py-1 rounded-xl">{formatTime(copilotTimer)}</span>
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border border-white/10 hover:bg-white/5",
                          isTimerRunning ? "text-red-400" : "text-green-400"
                        )}
                      >
                        {isTimerRunning ? '⏸' : '▶'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Question Focus</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-bold text-slate-200 text-sm outline-none focus:border-blue-500 transition-all"
                      onChange={(e) => {
                        const index = Number(e.target.value);
                        setSelectedCopilotQuestion(report.questions[index]);
                        setInterviewerNotes('');
                        setAiFollowUpQuestion('');
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Question to Probe...</option>
                      {report.questions.map((q: any, idx: number) => (
                        <option key={idx} value={idx}>Q{idx + 1}: {q.text.slice(0, 40)}...</option>
                      ))}
                    </select>
                  </div>

                  {selectedCopilotQuestion && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="p-5 bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Ideal Framework</p>
                        <p className="text-xs text-slate-400 leading-relaxed italic">"{selectedCopilotQuestion.idealAnswer.slice(0, 150)}..."</p>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Shorthand Notes</label>
                        <textarea
                          placeholder="Type what candidate answers... (e.g. 'mentions optimistic locking and version columns')"
                          value={interviewerNotes}
                          onChange={(e) => setInterviewerNotes(e.target.value)}
                          className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-medium text-sm text-slate-200 outline-none focus:border-blue-500 transition-all resize-none"
                        />
                      </div>

                      <Button
                        onClick={generateFollowUp}
                        disabled={isGeneratingFollowUp || !interviewerNotes.trim()}
                        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs"
                      >
                        {isGeneratingFollowUp ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Probe...
                          </>
                        ) : (
                          <>
                            ⚡ Ask AI for Dynamic Follow-up
                          </>
                        )}
                      </Button>

                      {aiFollowUpQuestion && (
                        <div className="p-6 bg-blue-600/10 border border-blue-900/30 rounded-3xl animate-in slide-in-from-bottom-2 duration-300">
                          <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-2">Instant Dynamic Follow-up</p>
                          <p className="text-xs font-bold leading-relaxed italic text-blue-200">"{aiFollowUpQuestion}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/5 pt-6 space-y-4 mt-8">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Assessment Score</p>
                  <div className="flex gap-2 justify-between">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          if (selectedCopilotQuestion) {
                            setLiveGrades({ ...liveGrades, [selectedCopilotQuestion.text]: num });
                          }
                        }}
                        className={cn(
                          "w-7 h-7 rounded-lg text-xs font-black transition-all border",
                          selectedCopilotQuestion && liveGrades[selectedCopilotQuestion.text] === num
                            ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function WeightBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
        <span>{label}</span>
        <span className="text-blue-400">{value}%</span>
      </div>
      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-blue-600 h-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
        />
      </div>
    </div>
  );
}

function PsychometricsRadar({ data }: { data: Array<{ subject: string, value: number }> }) {
  const size = 260;
  const center = size / 2;
  const radius = size * 0.32;
  const angleStep = (Math.PI * 2) / data.length;

  const levels = [0.25, 0.5, 0.75, 1];
  const gridPolygons = levels.map((lvl) => {
    return data.map((_, i) => {
      const x = center + Math.cos(angleStep * i - Math.PI / 2) * radius * lvl;
      const y = center + Math.sin(angleStep * i - Math.PI / 2) * radius * lvl;
      return `${x},${y}`;
    }).join(' ');
  });

  const candidatePoints = data.map((d, i) => {
    const x = center + Math.cos(angleStep * i - Math.PI / 2) * radius * (d.value / 100);
    const y = center + Math.sin(angleStep * i - Math.PI / 2) * radius * (d.value / 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group shadow-xl">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Activity className="w-12 h-12" />
      </div>
      
      <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] mb-4">Psychometric Radar Matrix</p>
      
      <svg width={size} height={size} className="overflow-visible select-none">
        {gridPolygons.map((points, idx) => (
          <polygon
            key={idx}
            points={points}
            fill="transparent"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        {data.map((_, i) => {
          const x = center + Math.cos(angleStep * i - Math.PI / 2) * radius;
          const y = center + Math.sin(angleStep * i - Math.PI / 2) * radius;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={candidatePoints}
          fill="rgba(59, 130, 246, 0.25)"
          stroke="#3b82f6"
          strokeWidth="2.5"
          className="transition-all duration-500"
        />

        {data.map((d, i) => {
          const x = center + Math.cos(angleStep * i - Math.PI / 2) * radius * (d.value / 100);
          const y = center + Math.sin(angleStep * i - Math.PI / 2) * radius * (d.value / 100);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              className="fill-blue-500 stroke-slate-900 stroke-2"
            />
          );
        })}

        {data.map((d, i) => {
          const factor = 1.3;
          const x = center + Math.cos(angleStep * i - Math.PI / 2) * radius * factor;
          const y = center + Math.sin(angleStep * i - Math.PI / 2) * radius * factor;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="fill-slate-400 font-bold text-[8px] uppercase tracking-widest"
            >
              {d.subject.split(' ')[0]} ({d.value})
            </text>
          );
        })}
      </svg>
    </div>
  );
}

interface SalaryProps {
  low: number;
  median: number;
  high: number;
}

function SalaryBenchmarkCurve({ benchmark }: { benchmark: SalaryProps }) {
  const lowStr = `$${(benchmark.low / 1000).toFixed(0)}k`;
  const medianStr = `$${(benchmark.median / 1000).toFixed(0)}k`;
  const highStr = `$${(benchmark.high / 1000).toFixed(0)}k`;

  return (
    <div className="p-8 bg-white border border-slate-200/60 rounded-[2.5rem] shadow-xl shadow-slate-200/10 relative overflow-hidden group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">AI Salary Benchmark Curve</p>
      
      <div className="relative h-24 flex items-end">
        <svg className="w-full h-16 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
          <defs>
            <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path
            d="M 0 30 Q 20 30 35 15 T 50 2 Q 65 30 100 30 Z"
            fill="url(#curveGrad)"
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <line x1="50" y1="0" x2="50" y2="30" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="2,2" />
        </svg>

        <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
          <div className="flex flex-col items-center">
            <span>Low (25th)</span>
            <span className="text-slate-900 font-black text-sm mt-1">{lowStr}</span>
          </div>
          <div className="flex flex-col items-center -translate-y-4 bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg shadow-blue-500/20 border border-blue-400/20">
            <span className="text-[7px] tracking-widest uppercase">Median Market</span>
            <span className="font-black text-xs mt-0.5">{medianStr}</span>
          </div>
          <div className="flex flex-col items-center">
            <span>High (90th)</span>
            <span className="text-slate-900 font-black text-sm mt-1">{highStr}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 mt-8">
        <Info className="w-4 h-4 text-blue-500 shrink-0" />
        <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
          Based on current geographic, experience and stack parameters.
        </p>
      </div>
    </div>
  );
}
