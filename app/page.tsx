import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, Zap, Target, ShieldCheck, Users, Briefcase, ChevronRight, PlayCircle, BarChart3, FileSearch, MessageSquareCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-24">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">InterviewForge</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            {['Product', 'Features', 'Pricing', 'Enterprise'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors px-4">Log in</Link>
            <Button variant="default" className="rounded-xl shadow-slate-200" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-8 animate-fade-in">
            <Sparkles className="w-3 h-3" />
            <span>AI-POWERED INTERVIEW INTELLIGENCE</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
            No two candidates get the <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">same interview.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            The first AI hiring analyst that generates unique, candidate-specific interview kits by analyzing resume evidence, skill gaps, and project claims.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button size="lg" variant="premium" className="w-full sm:w-auto h-16 px-12 text-xl" asChild>
              <Link href="/signup"> Forge Your First Kit <ArrowRight className="w-6 h-6 ml-2" /> </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-12 text-xl" asChild>
              <Link href="/demo"> <PlayCircle className="w-6 h-6 mr-2" /> Watch Demo </Link>
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 md:p-8 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-violet-50/50 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative aspect-video rounded-2xl border border-slate-100 bg-slate-50 shadow-inner flex items-center justify-center overflow-hidden">
                 <div className="flex flex-col items-center gap-4 text-slate-400">
                    <BarChart3 className="w-16 h-16 stroke-[1.5]" />
                    <span className="font-medium">Interactive Report Preview</span>
                 </div>
                 {/* Visual decoration */}
                 <div className="absolute top-10 left-10 w-64 h-40 bg-white rounded-xl shadow-lg border border-slate-100 p-4 animate-float">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                      <div className="w-6 h-6 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
                    </div>
                    <div className="h-4 w-32 bg-slate-100 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-slate-50 rounded"></div>
                 </div>
                 <div className="absolute bottom-10 right-10 w-72 h-48 bg-white rounded-xl shadow-lg border border-slate-100 p-6 animate-float-delayed">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">88</div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Match Score</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-slate-100 rounded"></div>
                      <div className="h-2 w-[80%] bg-slate-100 rounded"></div>
                      <div className="h-2 w-[90%] bg-slate-100 rounded"></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Principle Section */}
      <section id="features" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">"No two candidates get the same interview."</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Stop asking generic questions. InterviewForge creates a unique technical and behavioral strategy for every single applicant based on their actual resume and role fit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Users}
              title="Candidate-Specific Questions"
              description="AI analyzes project claims and experience to generate questions that only THIS candidate can answer."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Resume Claim Verification"
              description="Detect inflated or weak claims automatically and generate specific technical deep-dives to verify skills."
            />
            <FeatureCard 
              icon={FileSearch}
              title="Skill Gap Analysis"
              description="Identifies the exact gap between the job requirements and candidate profile to prioritize evaluation."
            />
            <FeatureCard 
              icon={CheckCircle2}
              title="Interview Scorecards"
              description="Structured scoring systems for technical depth, problem solving, and role fit."
            />
            <FeatureCard 
              icon={Zap}
              title="Bulk Resume Ranking"
              description="Upload hundreds of resumes and rank them instantly against your job description."
            />
            <FeatureCard 
              icon={MessageSquareCode}
              title="AI Mock Interview"
              description="Let candidates practice with questions generated specifically for their profile and target role."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-blue-600">
        <div className="max-w-5xl mx-auto bg-white rounded-[40px] p-12 md:p-20 text-center shadow-2xl overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
           <div className="relative z-10">
             <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">Ready to forge better interviews?</h2>
             <p className="text-slate-600 text-lg mb-12 max-w-xl mx-auto">
               Join 500+ recruiters and founders who are making hiring more predictable and evidence-based.
             </p>
             <Link 
              href="/signup" 
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
            >
              Start for Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">InterviewForge AI</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 InterviewForge AI. Built for world-class hiring teams.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-blue-500/50 transition-all group">
      <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
