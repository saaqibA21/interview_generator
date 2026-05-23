"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  PlusCircle, 
  Upload, 
  Sparkles, 
  ChevronRight, 
  Briefcase,
  Users,
  AlertCircle,
  FileText,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function NewInterviewContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    resumeText: searchParams.get('candidate') ? `Simulated extraction for ${searchParams.get('candidate')}.` : '',
    interviewType: 'Technical',
    difficulty: 'Medium'
  });

  const [uploadedFile, setUploadedFile] = useState<File | { name: string, size: number } | null>(() => {
    const candidateName = searchParams.get('candidate');
    if (candidateName) {
      return { name: `${candidateName}.pdf`, size: 124000 };
    }
    return null;
  });

  const [step, setStep] = useState(() => {
    return searchParams.get('candidate') ? 3 : 1;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.ClipboardEvent | File) => {
    let file: File | null = null;
    
    if (e instanceof File) {
      file = e;
    } else if ('target' in e && (e.target as HTMLInputElement).files) {
      file = (e.target as HTMLInputElement).files![0];
    } else if ('clipboardData' in e) {
      const items = (e as React.ClipboardEvent).clipboardData.items;
      for (const item of Array.from(items)) {
        if (item.type.indexOf('image') !== -1) {
          file = item.getAsFile();
          break;
        }
      }
    }

    if (file) {
      setUploadedFile(file);
      setLoadingStatus('Intelligence Forge is parsing your document...');
      
      try {
        const formDataPayload = new FormData();
        formDataPayload.append('file', file);
        
        const response = await axios.post('/api/parse-resume', formDataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setFormData({ ...formData, resumeText: response.data.text });
        setLoadingStatus('');
      } catch (err) {
        console.error('Parsing error:', err);
        setLoadingStatus('Error parsing file. Please paste text manually.');
        setTimeout(() => setLoadingStatus(''), 3000);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoadingStatus('Forging your interview intelligence...');
    
    try {
      const response = await axios.post('/api/generate-interview', {
        ...formData,
        candidateName: uploadedFile?.name.split('.')[0] || 'Candidate'
      });
      
      setLoadingStatus('Saving report to vault...');
      setTimeout(() => {
        router.push(`/dashboard/reports/${response.data._id || 'sample'}`);
      }, 1500);
    } catch (error) {
      console.error('Submission error:', error);
      setLoadingStatus('Error: Failed to generate kit.');
      setTimeout(() => setIsSubmitting(false), 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <DashboardHeader title="New Interview Kit" subtitle="Generate a personalized interview strategy and question set." />
        
        <div className="p-8 max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12 px-4">
            <StepItem number={1} label="Job Details" active={step >= 1} current={step === 1} />
            <div className={cn("flex-1 h-0.5 mx-4 rounded-full transition-all duration-700", step >= 2 ? "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "bg-slate-200")} />
            <StepItem number={2} label="Resume" active={step >= 2} current={step === 2} />
            <div className={cn("flex-1 h-0.5 mx-4 rounded-full transition-all duration-700", step >= 3 ? "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "bg-slate-200")} />
            <StepItem number={3} label="Forging" active={step >= 3} current={step === 3} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-10 space-y-8">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Role Information</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tell us about the position</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Job Title</label>
                          <Input 
                            placeholder="e.g. Senior Backend Engineer"
                            className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-bold"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Company Name</label>
                          <Input 
                            placeholder="e.g. Acme Corp"
                            className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-bold"
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Job Description</label>
                        <Textarea 
                          placeholder="Paste the job description here..."
                          className="min-h-[250px] text-lg rounded-3xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-medium p-6"
                          value={formData.jobDescription}
                          onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                          required
                        />
                      </div>
                      <div className="pt-4 flex justify-end">
                        <Button 
                          type="button" 
                          size="lg"
                          className="h-14 px-8 rounded-2xl font-black shadow-xl shadow-blue-500/10"
                          onClick={() => setStep(2)}
                          disabled={!formData.jobTitle || !formData.jobDescription}
                        >
                          Next Step <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-10 space-y-8">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Profile</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Upload or paste the resume</p>
                        </div>
                      </div>
                      
                      {!uploadedFile ? (
                        <div 
                          className="border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group relative overflow-hidden"
                          onClick={() => document.getElementById('resume-upload')?.click()}
                          onPaste={handleFileUpload}
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleFileUpload(e.dataTransfer.files[0]);
                            }
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:to-indigo-500/5 transition-all"></div>
                          <input 
                            id="resume-upload"
                            type="file" 
                            className="hidden" 
                            accept=".pdf,.docx,.txt,image/*" 
                            onChange={handleFileUpload} 
                          />
                          <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:scale-110 transition-all duration-500 shadow-inner">
                            <Upload className="w-10 h-10" />
                          </div>
                          <h4 className="text-xl font-black text-slate-900 mb-2">Drop, Paste or Select Resume</h4>
                          <p className="text-slate-500 text-xs mb-8 max-w-xs mx-auto font-bold uppercase tracking-tight">PDF, Image or TXT • Max 5MB</p>
                          <div className="flex justify-center gap-2">
                             <Badge variant="outline" className="bg-white">PDF</Badge>
                             <Badge variant="outline" className="bg-white">Image (OCR)</Badge>
                             <Badge variant="outline" className="bg-white">Paste (Ctrl+V)</Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {/* Scanned Resume Preview */}
                          <div className="md:col-span-2 border border-slate-200 rounded-[2.5rem] bg-white p-8 relative overflow-hidden shadow-md min-h-[480px] flex flex-col justify-between">
                            {/* Document Header */}
                            <div className="flex justify-between items-start mb-6">
                              <div className="space-y-1">
                                <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
                                <div className="w-36 h-3 bg-slate-100 rounded animate-pulse" />
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setUploadedFile(null);
                                  setFormData({ ...formData, resumeText: '' });
                                }}
                                className="rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                              >
                                <X className="w-5 h-5" />
                              </Button>
                            </div>

                            {/* Resume content overlays */}
                            <div className="flex-1 space-y-6 relative border border-slate-100 rounded-2xl p-6 bg-slate-50/50">
                              {/* Scanned Highlights */}
                              <div className="relative group/highlight">
                                <motion.div 
                                  whileHover={{ scale: 1.01 }}
                                  className="absolute -inset-2 bg-blue-500/10 border border-blue-500/30 rounded-xl pointer-events-none group-hover/highlight:bg-blue-500/20 transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                />
                                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1 select-none">AI Extracted Skill Segment</p>
                                <p className="text-sm font-bold text-slate-800">
                                  Expertise: React.js, TypeScript, Next.js, Node.js, RESTful APIs, AWS Cloud Services.
                                </p>
                              </div>

                              <div className="relative group/highlight">
                                <motion.div 
                                  whileHover={{ scale: 1.01 }}
                                  className="absolute -inset-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl pointer-events-none group-hover/highlight:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                />
                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1 select-none">AI Extracted Experience Segment</p>
                                <p className="text-sm font-bold text-slate-800">
                                  Senior Frontend Architect at Tech Solutions Corp: Reduced build times by 40% and pioneered state-management migrations.
                                </p>
                              </div>

                              <div className="relative group/highlight">
                                <motion.div 
                                  whileHover={{ scale: 1.01 }}
                                  className="absolute -inset-2 bg-purple-500/10 border border-purple-500/30 rounded-xl pointer-events-none group-hover/highlight:bg-purple-500/20 transition-all shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                                />
                                <p className="text-xs font-black text-purple-600 uppercase tracking-widest mb-1 select-none">AI Extracted Projects Segment</p>
                                <p className="text-sm font-bold text-slate-800">
                                  Pioneered FoodForge App, implementing real-time order tracking and highly concurrent database pipelines.
                                </p>
                              </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                              <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <span className="text-xs font-black text-slate-900 tracking-tight">{uploadedFile.name}</span>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                            </div>
                          </div>

                          {/* Structural Highlights Sidebar */}
                          <div className="md:col-span-1 space-y-6 flex flex-col justify-between">
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl flex-1 flex flex-col justify-between">
                              <div className="absolute right-0 top-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
                              
                              <div>
                                <div className="flex items-center gap-2 text-blue-400 mb-4">
                                  <Sparkles className="w-4 h-4 animate-pulse" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">OCR Sandbox Structural Data</span>
                                </div>
                                <h4 className="text-lg font-black tracking-tight mb-4">Parsed Highlights</h4>
                                
                                <div className="space-y-4">
                                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extracted Name</p>
                                    <p className="font-bold text-white text-sm mt-0.5">{uploadedFile.name.split('.')[0] || 'Candidate'}</p>
                                  </div>
                                  
                                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Strengths</p>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      <Badge className="bg-blue-600 text-white text-[9px]">React.js</Badge>
                                      <Badge className="bg-emerald-600 text-white text-[9px]">AWS Cloud</Badge>
                                      <Badge className="bg-purple-600 text-white text-[9px]">Next.js</Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <div className="text-[10px] font-black text-green-400 uppercase tracking-widest">Ready to Forge</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-8 flex justify-between items-center">
                        <Button 
                          variant="ghost" 
                          onClick={() => setStep(1)}
                          className="font-bold text-slate-400 hover:text-slate-900"
                        >
                          Back to Role
                        </Button>
                        <Button 
                          size="lg"
                          className="h-14 px-8 rounded-2xl font-black"
                          onClick={() => setStep(3)}
                          disabled={!uploadedFile}
                        >
                          Continue <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-10 space-y-8">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Interview Preferences</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Customize the AI focus</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Focus Mode</label>
                          <div className="grid grid-cols-1 gap-3">
                            {['Technical Deep-Dive', 'HR & Culture Fit', 'System Architecture', 'Leadership & Strategy', 'Entry Level / Fresher'].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setFormData({...formData, interviewType: type})}
                                className={cn(
                                  "px-6 py-4 rounded-2xl border text-left text-sm font-bold transition-all relative group overflow-hidden",
                                  formData.interviewType === type 
                                    ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-400/20" 
                                    : "bg-slate-50/50 border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-white"
                                )}
                              >
                                {type}
                                {formData.interviewType === type && (
                                  <motion.div 
                                    layoutId="type-active"
                                    className="absolute right-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" 
                                  />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div className="space-y-4">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Seniority / Difficulty</label>
                            <div className="flex gap-3">
                              {['Junior', 'Mid-Level', 'Senior'].map((diff) => (
                                <button
                                  key={diff}
                                  type="button"
                                  onClick={() => setFormData({...formData, difficulty: diff})}
                                  className={cn(
                                    "flex-1 py-4 rounded-2xl border text-center text-sm font-black transition-all",
                                    formData.difficulty === diff 
                                      ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20" 
                                      : "bg-slate-50/50 border-slate-200 text-slate-500 hover:border-blue-400"
                                  )}
                                >
                                  {diff}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-xl">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                            <div className="flex gap-4">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md">
                                <AlertCircle className="w-6 h-6 text-amber-400" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2">AI Strategy</p>
                                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                  {formData.difficulty === 'Senior' 
                                    ? "Focusing on architectural depth, technical leadership, and strategic decision making."
                                    : formData.difficulty === 'Mid-Level'
                                    ? "Probing into implementation patterns, problem-solving, and team collaboration."
                                    : "Evaluating core fundamentals, learning agility, and foundational coding skills."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 flex justify-between items-center border-t border-slate-100">
                        <Button 
                          variant="ghost" 
                          onClick={() => setStep(2)}
                          className="font-bold text-slate-400 hover:text-slate-900"
                        >
                          Back to Resume
                        </Button>
                        <Button 
                          type="submit" 
                          className="h-16 px-10 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 transition-all min-w-[240px]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-6 h-6 animate-spin mr-3" />
                              Forging...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6 mr-3" />
                              Forge Interview Kit
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-32 h-32 relative mb-8">
                <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-4">InterviewForge AI</h2>
              <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-sm animate-pulse">{loadingStatus}</p>
              <div className="mt-12 max-w-sm w-full bg-slate-900 rounded-2xl p-6 border border-white/5">
                <p className="text-slate-400 text-sm font-medium italic">"Analyzing resumes against 50,000+ data points to find the perfect questions..."</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function NewInterviewPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-[#f8fafc] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    }>
      <NewInterviewContent />
    </Suspense>
  );
}

function StepItem({ number, label, active, current }: { number: number, label: string, active: boolean, current: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div className={cn(
        "w-12 h-12 rounded-[1.25rem] flex items-center justify-center font-black text-sm transition-all duration-500",
        current 
          ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-110" 
          : active 
            ? "bg-indigo-100 text-indigo-600" 
            : "bg-slate-100 text-slate-400"
      )}>
        {number}
      </div>
      <span className={cn(
        "text-sm font-black hidden lg:block tracking-tight",
        current ? "text-slate-900" : active ? "text-slate-600" : "text-slate-400"
      )}>{label}</span>
    </div>
  );
}

