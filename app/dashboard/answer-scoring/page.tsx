"use client";

import { useState } from 'react';
import { CheckSquare, MessageSquare, Target, Zap, Sparkles, Send } from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnswerScoringPage() {
  const [isScoring, setIsScoring] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [question, setQuestion] = useState('');
  const [expected, setExpected] = useState('');
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleScore = async () => {
    if (!question || !answer) return;
    
    setIsScoring(true);
    setError('');
    
    try {
      const response = await axios.post('/api/score-answer', {
        question,
        expected,
        answer
      });
      setResult(response.data);
      setShowResult(true);
    } catch (err) {
      console.error('Scoring error:', err);
      setError('Failed to evaluate answer. Please try again.');
    } finally {
      setIsScoring(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <DashboardHeader title="AI Answer Scoring" subtitle="Paste candidate answers to receive instant technical and behavioral feedback." />
        
        <div className="p-8 max-w-5xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="animate-in fade-in slide-in-from-left-4 duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Interview Context
                  </CardTitle>
                  <CardDescription>Provide the question and expected answer guidelines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">The Question</label>
                    <Textarea 
                      placeholder="e.g. How do you handle race conditions in Node.js?" 
                      className="h-24 font-medium" 
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Evaluation Criteria (Optional)</label>
                    <Textarea 
                      placeholder="e.g. Must mention Mutex, Optimistic locking, or Redis." 
                      className="h-24 font-medium" 
                      value={expected}
                      onChange={(e) => setExpected(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-in fade-in slide-in-from-left-4 duration-500 delay-75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Candidate's Answer
                  </CardTitle>
                  <CardDescription>Paste the raw transcript or notes from the interview.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    placeholder="Paste the candidate's actual response here..." 
                    className="h-48 font-medium text-lg leading-relaxed" 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  {error && <p className="text-xs font-bold text-red-500 text-center">{error}</p>}
                  <Button 
                    className="w-full h-14 text-lg" 
                    variant="premium" 
                    onClick={handleScore}
                    disabled={isScoring}
                  >
                    {isScoring ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Analyzing Answer...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Score This Answer
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {!showResult ? (
                <div className="h-full border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-white/50">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8" />
                   </div>
                   <h3 className="font-bold text-slate-500 mb-2">Ready for Scoring</h3>
                   <p className="text-sm max-w-[240px]">Submit the answer on the left to see the AI evaluation.</p>
                </div>
              ) : (
                <Card className="animate-in fade-in slide-in-from-right-4 duration-500 border-blue-200 shadow-xl shadow-blue-100/50">
                  <CardHeader className="bg-blue-50/50 rounded-t-[40px] pb-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-blue-600 text-white border-none font-black text-[10px] uppercase px-3">Evaluation Complete</Badge>
                      <div className="text-4xl font-black text-blue-600">{result?.score || 0}<span className="text-slate-300 text-lg">/10</span></div>
                    </div>
                    <CardTitle className="text-blue-900">{result?.score >= 8 ? 'Strong Answer' : result?.score >= 5 ? 'Acceptable Answer' : 'Needs Improvement'}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8 space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">AI Intelligence Feedback</h4>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {result?.feedback || 'No feedback provided.'}
                      </p>
                    </div>

                    {result?.missedPoints?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Critical Misses</h4>
                        <ul className="space-y-2">
                          {result.missedPoints.map((p: string, i: number) => (
                            <li key={i} className="text-xs font-bold text-red-600 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Zap className="w-12 h-12" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-blue-400 mb-3">
                          <Send className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Strategic Follow-up</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed italic">"{result?.suggestedFollowUp || 'Explore more deeply into their implementation choices.'}"</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
