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
  PlayCircle
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

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

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowPractice(true);
    }, 2500);
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
                             <Button variant="outline" size="sm" className="rounded-full">
                                Record Answer <Mic className="w-3.5 h-3.5 ml-2" />
                             </Button>
                          </div>
                       </CardContent>
                    </Card>
                  ))}
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="space-y-2">
       <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-2 text-slate-400">
          <Icon className="w-6 h-6" />
       </div>
       <h4 className="font-bold text-slate-900">{title}</h4>
       <p className="text-xs text-slate-500 font-medium">{desc}</p>
    </div>
  );
}
