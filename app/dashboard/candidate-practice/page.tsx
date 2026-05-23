"use client";

import { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  ShieldAlert, 
  MessageSquare, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Mic,
  Plus,
  PlayCircle,
  X,
  Volume2,
  Info,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const mockWeaknesses = [
  { skill: 'Distributed Systems', impact: 'High', reason: 'Your resume mentions Node.js but lacks evidence of managing state across multiple nodes.' },
  { skill: 'Go (Golang)', impact: 'Medium', reason: 'The target job requires Go, but your profile is exclusively TypeScript/Node focused.' },
  { skill: 'System Design', impact: 'Medium', reason: 'Project descriptions focus on features rather than architectural trade-offs.' },
];

const mockQuestions = [
  { 
    type: "Resume Deep-Dive", 
    question: "You mentioned optimizing a React app's performance by 50%. What specific profiling tools did you use and what were the main bottlenecks?",
    difficulty: "Medium",
    strategy: "Mention Chrome DevTools (Performance tab), React Profiler, and bundle analysis. Focus on re-renders and heavy asset optimization."
  },
  { 
    type: "Job-Fit Technical", 
    question: "This role requires Go. How would you explain the concept of Goroutines to a developer who only knows Node's Event Loop?",
    difficulty: "Hard",
    strategy: "Highlight preemptive scheduling vs cooperative scheduling. Mention stack size differences and the 'share by communicating' philosophy."
  },
  { 
    type: "Behavioral", 
    question: "Tell me about a time you had a technical disagreement with a peer. How did you resolve it?",
    difficulty: "Medium",
    strategy: "Use the STAR method. Focus on data-driven decision making and maintaining professional relationships."
  }
];

export default function CandidatePracticePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzingAnswer, setIsAnalyzingAnswer] = useState(false);
  const [practiceResult, setPracticeResult] = useState<any>(null);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowPractice(true);
    }, 2500);
  };

  const startRecording = () => {
    setTranscript('');
    setPracticeResult(null);
    setIsRecording(true);
    
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };
        
        recognition.onerror = (err: any) => {
          console.error("Speech recognition error", err);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
        };
        
        recognition.start();
        (window as any).activeRecognition = recognition;
      } else {
        // Fallback simulation representing high-end mock STT
        let index = 0;
        const simulationText = [
          "Well, to handle race conditions in our React and Node application,",
          " we implemented a Redis-based distributed lock system, specifically using Redlock.",
          " When an order comes in, we lock the specific resource ID in Redis.",
          " We also used database-level optimistic concurrency control with a version column",
          " so that if two updates happen at the exact same millisecond, the second update fails gracefully",
          " and is retried. This completely resolved the duplicate transactions we were seeing."
        ];
        
        const timer = setInterval(() => {
          if (index < simulationText.length) {
            setTranscript(prev => prev + simulationText[index]);
            index++;
          } else {
            clearInterval(timer);
            setIsRecording(false);
          }
        }, 1500);
        
        (window as any).activeRecognitionTimer = timer;
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (typeof window !== 'undefined') {
      if ((window as any).activeRecognition) {
        (window as any).activeRecognition.stop();
        (window as any).activeRecognition = null;
      }
      if ((window as any).activeRecognitionTimer) {
        clearInterval((window as any).activeRecognitionTimer);
        (window as any).activeRecognitionTimer = null;
      }
    }
  };

  const analyzeAnswer = async () => {
    if (!transcript) return;
    setIsAnalyzingAnswer(true);
    try {
      const response = await axios.post('/api/score-answer', {
        question: activeQuestion.question,
        expected: activeQuestion.strategy,
        answer: transcript
      });
      
      const words = transcript.split(/\s+/).filter(Boolean).length;
      const fillerWords = (transcript.match(/\b(um|uh|like|so|basically|actually)\b/gi) || []).length;
      const speechRate = Math.round(words / 0.5); // assumed 30 seconds
      
      setPracticeResult({
        ...response.data,
        analytics: {
          wpm: speechRate > 0 ? speechRate : 132,
          fillerWords,
          deliveryScore: Math.max(10 - fillerWords, 4)
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingAnswer(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto pb-20">
        <DashboardHeader title="Candidate Practice Mode" subtitle="Prepare for your specific interview with AI-generated questions and feedback." />
        
        <div className="p-8 max-w-7xl mx-auto">
          {!showPractice ? (
            <Card className="rounded-[40px] border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
               <CardHeader className="bg-slate-900 text-white p-12 text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
                     <Target className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-4xl font-black mb-4">Ready to level up?</CardTitle>
                  <CardDescription className="text-slate-400 text-lg max-w-xl mx-auto">
                    We'll analyze your resume against your target job and generate a custom practice plan.
                  </CardDescription>
               </CardHeader>
               <CardContent className="p-12 text-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                     <FeatureItem icon={BookOpen} title="Personalized" desc="Questions based on YOUR projects." />
                     <FeatureItem icon={Activity} title="Gap Detection" desc="Know what they'll likely grill you on." />
                     <FeatureItem icon={Sparkles} title="AI Feedback" desc="Get winning answer frameworks." />
                  </div>
                  <Button 
                    variant="premium" 
                    size="lg" 
                    className="min-w-[300px] h-16 text-lg"
                    onClick={handleStartAnalysis}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Analyzing Profile...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-5 h-5 mr-3" />
                        Start Practice Plan
                      </>
                    )}
                  </Button>
               </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
               {/* Skill Gap Analysis */}
               <div className="lg:col-span-1 space-y-6">
                  <Card className="border-t-4 border-t-amber-500">
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-amber-600" />
                          Resume Weakness Report
                       </CardTitle>
                       <CardDescription>What the recruiter will notice.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       {mockWeaknesses.map((w, i) => (
                          <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-slate-900">{w.skill}</h4>
                                <Badge variant="warning">{w.impact}</Badge>
                             </div>
                             <p className="text-xs text-slate-500 leading-relaxed font-medium">{w.reason}</p>
                          </div>
                       ))}
                       <div className="p-6 bg-blue-600 rounded-[32px] text-white relative overflow-hidden group">
                          <Sparkles className="absolute top-4 right-4 w-5 h-5 text-blue-300 opacity-20 group-hover:scale-150 transition-transform" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">AI Pro Tip</p>
                          <p className="text-xs font-bold leading-relaxed">
                            Focus your practice on the "Distributed Systems" gap. This is where 40% of the interview weight lies.
                          </p>
                       </div>
                    </CardContent>
                  </Card>
               </div>

               {/* Practice Questions */}
               <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                        Your Practice Kit
                     </h3>
                     <Badge variant="info">3 Recommended</Badge>
                  </div>

                  {mockQuestions.map((q, i) => (
                    <Card key={i} className="group hover:border-blue-400 transition-all duration-300">
                       <CardHeader className="flex flex-row items-start justify-between">
                          <div className="space-y-2">
                             <div className="flex gap-2">
                                <Badge variant="secondary">{q.type}</Badge>
                                <Badge variant="outline">Difficulty: {q.difficulty}</Badge>
                             </div>
                             <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{q.question}</CardTitle>
                          </div>
                       </CardHeader>
                       <CardContent className="space-y-6">
                          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                             <div className="flex items-center gap-2 text-blue-900 font-black text-[10px] uppercase tracking-widest mb-3">
                                <Activity className="w-3.5 h-3.5" />
                                Strategic Answer Framework
                             </div>
                             <p className="text-sm text-blue-800 leading-relaxed font-medium">{q.strategy}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence Score: --</p>
                             <Button 
                               variant="outline" 
                               size="sm" 
                               className="rounded-full"
                               onClick={() => setActiveQuestion(q)}
                             >
                                Practice Answer <Mic className="w-3.5 h-3.5 ml-2" />
                             </Button>
                          </div>
                       </CardContent>
                    </Card>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Practice Sandbox STT Modal */}
        <AnimatePresence>
          {activeQuestion && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 text-slate-100"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-3xl bg-slate-900 rounded-[3rem] border border-slate-800 p-10 overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
              >
                {/* Close Button */}
                <button 
                  onClick={() => {
                    stopRecording();
                    setActiveQuestion(null);
                    setPracticeResult(null);
                    setTranscript('');
                  }}
                  className="absolute top-8 right-8 w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Question Info */}
                <div className="mb-8 pr-12">
                  <Badge variant="secondary" className="mb-3">AI Audio Simulator</Badge>
                  <h3 className="text-2xl font-black tracking-tight leading-snug">{activeQuestion.question}</h3>
                  <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-400">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span>Focus on: {activeQuestion.strategy.slice(0, 70)}...</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-8 space-y-8">
                  {/* Waveform and Transcript Recording */}
                  {!practiceResult && (
                    <div className="space-y-6">
                      <div className="border border-slate-800 bg-slate-950/40 rounded-[2rem] p-8 text-center relative overflow-hidden">
                        {/* Audio Waveform */}
                        <div className="flex justify-center items-center gap-1.5 h-16 mb-6">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
                            <motion.div
                              key={bar}
                              animate={isRecording ? {
                                height: [12, Math.random() * 40 + 16, 12]
                              } : { height: 12 }}
                              transition={{
                                duration: 0.5 + Math.random() * 0.4,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className={cn(
                                "w-1 rounded-full",
                                isRecording ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-slate-700"
                              )}
                            />
                          ))}
                        </div>

                        {/* Speech buttons */}
                        <div className="flex justify-center mb-6">
                          {!isRecording ? (
                            <Button 
                              onClick={startRecording}
                              className="h-16 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/20"
                            >
                              <Mic className="w-5 h-5 mr-3 animate-pulse" /> Start Speaking
                            </Button>
                          ) : (
                            <Button 
                              onClick={stopRecording}
                              className="h-16 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black shadow-lg shadow-red-500/20"
                            >
                              <RefreshCw className="w-5 h-5 mr-3 animate-spin" /> Stop & Finalize
                            </Button>
                          )}
                        </div>

                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                          {isRecording ? "Live transcription active... speak now" : "Click button to trigger Speech-to-Text"}
                        </p>
                      </div>

                      {/* Live Text Area */}
                      {transcript && (
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Spoken Answer Draft</label>
                          <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 text-slate-200 text-base leading-relaxed font-medium min-h-[120px]">
                            {transcript}
                          </div>
                          
                          <div className="flex justify-end pt-2">
                            <Button 
                              onClick={analyzeAnswer}
                              disabled={isAnalyzingAnswer || isRecording}
                              className="h-14 px-8 rounded-xl font-black bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              {isAnalyzingAnswer ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Answer...
                                </>
                              ) : (
                                <>
                                  Analyze Answer <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Evaluation Report Scorecard */}
                  {practiceResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* Rating Banner */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/50 border border-slate-800 rounded-[2rem] p-8">
                        {/* Grade gauge */}
                        <div className="flex flex-col items-center justify-center border-r border-slate-800/60 pr-6">
                          <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="absolute w-full h-full transform -rotate-90">
                              <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                              <circle cx="48" cy="48" r="40" stroke="#2563eb" strokeWidth="8" fill="transparent"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * (practiceResult.score * 10)) / 100}
                              />
                            </svg>
                            <span className="text-3xl font-black text-blue-500">{practiceResult.score}<span className="text-slate-500 text-xs">/10</span></span>
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400 mt-3">Overall Grade</span>
                        </div>

                        {/* Delivery Grade */}
                        <div className="flex flex-col items-center justify-center border-r border-slate-800/60 px-6 text-center">
                          <Volume2 className="w-8 h-8 text-emerald-400 mb-2" />
                          <span className="text-2xl font-black text-emerald-400">{practiceResult.analytics.deliveryScore}/10</span>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">Delivery & Clarity</span>
                        </div>

                        {/* Pace Advice */}
                        <div className="flex flex-col items-center justify-center px-6 text-center">
                          <Activity className="w-8 h-8 text-amber-400 mb-2" />
                          <span className="text-2xl font-black text-amber-400">{practiceResult.analytics.wpm} <span className="text-xs text-slate-400">WPM</span></span>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mt-2 border",
                            practiceResult.analytics.wpm > 150 ? "bg-red-500/20 text-red-400 border-red-500/30" : 
                            practiceResult.analytics.wpm < 100 ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                            "bg-green-500/20 text-green-400 border-green-500/30"
                          )}>
                            {practiceResult.analytics.wpm > 150 ? "Too Fast" : practiceResult.analytics.wpm < 100 ? "Too Slow" : "Perfect Pace"}
                          </span>
                        </div>
                      </div>

                      {/* Keyword counter details */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Delivery Analytics</h4>
                        <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-6 rounded-2xl border border-slate-800">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Filler Words</p>
                              <p className="font-bold text-slate-200">{practiceResult.analytics.fillerWords} detected</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Technical Vocabulary</p>
                              <p className="font-bold text-slate-200">High Density</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Structural Feedback */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Strategic Feedback</h4>
                        <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 text-sm text-slate-300 leading-relaxed font-medium">
                          {practiceResult.feedback}
                        </div>
                      </div>

                      {/* Missed Concepts */}
                      {practiceResult.missedPoints?.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-red-400">Missed Key Concepts</h4>
                          <div className="bg-red-950/10 border border-red-900/20 rounded-3xl p-6 space-y-2.5">
                            {practiceResult.missedPoints.map((item: string, index: number) => (
                              <div key={index} className="flex gap-2 text-xs font-bold text-red-400">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                                <p>{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dynamic follow up */}
                      <div className="p-6 bg-blue-600/10 border border-blue-900/30 rounded-3xl relative overflow-hidden group">
                        <div className="flex items-center gap-2 text-blue-400 mb-2 font-black text-[10px] uppercase tracking-widest">
                          <Sparkles className="w-4 h-4 animate-pulse" /> AI Follow-Up Probe
                        </div>
                        <p className="text-sm font-medium leading-relaxed italic text-blue-200">
                          {practiceResult.suggestedFollowUp}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            setPracticeResult(null);
                            setTranscript('');
                          }}
                          className="font-bold text-slate-400 hover:text-slate-200"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                        </Button>
                        <Button 
                          onClick={() => {
                            stopRecording();
                            setActiveQuestion(null);
                            setPracticeResult(null);
                            setTranscript('');
                          }}
                          className="h-12 px-6 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white"
                        >
                          Done
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="space-y-2">
       <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2 text-slate-400">
          <Icon className="w-6 h-6" />
       </div>
       <h4 className="font-bold text-slate-900">{title}</h4>
       <p className="text-xs text-slate-500 font-medium">{desc}</p>
    </div>
  );
}
