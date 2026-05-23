"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

import { 
  FileText, 
  Users, 
  Target, 
  Zap, 
  PlusCircle, 
  ArrowUpRight,
  Clock,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

// Mock data for dashboard
const recentReports = [
  { id: '1', name: 'Alex Rivera', role: 'Senior Backend Developer', score: 88, risk: 'Low', date: '2 hours ago' },
  { id: '2', name: 'Sarah Chen', role: 'Product Manager', score: 72, risk: 'Medium', date: '5 hours ago' },
  { id: '3', name: 'Michael Scott', role: 'Regional Manager', score: 45, risk: 'High', date: 'Yesterday' },
  { id: '4', name: 'Emily Blunt', role: 'Frontend Architect', score: 91, risk: 'Low', date: 'Yesterday' },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || 'there';
  const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchReports = async () => {
        try {
          const response = await axios.get('/api/generate-interview');
          setReports(response.data.slice(0, 5));
        } catch (error) {
          console.error('Failed to fetch reports:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchReports();
    }, []);

    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto pb-24">
          <DashboardHeader 
            title="Dashboard" 
            subtitle={`Welcome back, ${userName}. Here's what's happening with your hiring.`} 
          />
          
          <div className="p-10 max-w-7xl mx-auto space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <StatCard title="Total Reports" value={isLoading ? "..." : reports.length.toString()} icon={FileText} trend={{ value: '12%', isUp: true }} color="blue" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <StatCard title="Resumes Analyzed" value="842" icon={Users} trend={{ value: '5%', isUp: true }} color="violet" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <StatCard title="Avg. Match Score" value="68%" icon={Target} trend={{ value: '2%', isUp: false }} color="amber" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <StatCard title="Credits Left" value="18" icon={Zap} color="green" />
              </motion.div>
            </div>
  
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Recent Reports */}
              <Card className="lg:col-span-2 overflow-hidden border-slate-200/60 shadow-2xl shadow-slate-200/5 bg-white/90 backdrop-blur-md rounded-[3rem]">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30 p-10">
                  <div>
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Recent Intelligence</CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-500 mt-1">Direct from the InterviewForge vault.</CardDescription>
                  </div>
                  <Button variant="outline" asChild className="rounded-2xl h-12 px-6 border-slate-200 font-black">
                    <Link href="/dashboard/reports">
                      View All <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardHeader>
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="p-20 text-center space-y-4">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Decrypting Vault...</p>
                    </div>
                  ) : reports.length === 0 ? (
                    <div className="p-20 text-center space-y-6">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto">
                         <FileText className="w-10 h-10 text-slate-300" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">No reports found</h4>
                        <p className="text-slate-500 font-medium">Generate your first interview kit to see results here.</p>
                      </div>
                      <Button variant="premium" className="h-12 px-8 rounded-2xl" asChild>
                        <Link href="/dashboard/new-interview">Create New Kit</Link>
                      </Button>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/30 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100/50">
                          <th className="px-10 py-6">Candidate</th>
                          <th className="px-10 py-6">Target Role</th>
                          <th className="px-10 py-6">Intelligence Score</th>
                          <th className="px-10 py-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reports.map((report) => (
                          <tr key={report._id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-10 py-8">
                              <div className="font-black text-slate-900 group-hover:text-blue-600 transition-colors text-base">{report.candidateName}</div>
                              <div className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest mt-1">
                                <Clock className="w-3 h-3" /> {new Date(report.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-10 py-8">
                               <div className="text-sm font-bold text-slate-700">{report.jobTitle}</div>
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{report.companyName}</div>
                            </td>
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-4">
                                <span className={cn(
                                  "text-lg font-black",
                                  report.matchScore > 80 ? "text-emerald-600" : report.matchScore > 60 ? "text-amber-600" : "text-red-600"
                                )}>{report.matchScore}%</span>
                                <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${report.matchScore}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className={cn(
                                      "h-full rounded-full",
                                      report.matchScore > 80 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : 
                                      report.matchScore > 60 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : 
                                      "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                                    )} 
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-8 text-right">
                              <Button variant="ghost" size="icon" asChild className="rounded-2xl w-12 h-12 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100">
                                <Link href={`/dashboard/reports/${report._id}`}>
                                  <ExternalLink className="w-5 h-5" />
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800 text-white relative overflow-hidden group shadow-xl shadow-slate-200">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl font-bold tracking-tight">Generate Kit</CardTitle>
                  <CardDescription className="text-slate-400 font-medium">Forging a personalized interview strategy takes seconds.</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Button variant="premium" className="w-full h-12 shadow-blue-500/10 font-bold" asChild>
                    <Link href="/dashboard/new-interview">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      New Interview Kit
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm">
                <CardHeader className="pb-4 border-b border-slate-50">
                  <CardTitle className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Quick Shortcuts</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <QuickAction href="/dashboard/bulk-ranking" label="Bulk Rank" icon={Users} />
                    <QuickAction href="/dashboard/candidate-practice" label="Practice" icon={Target} />
                    <QuickAction href="/dashboard/answer-scoring" label="Scoring" icon={CheckSquare} />
                    <QuickAction href="/dashboard/reports" label="All Reports" icon={FileText} />
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[2rem] p-8 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <div className="p-1.5 bg-blue-600 rounded-lg">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Hiring Intel</span>
                </div>
                <p className="text-blue-900 text-sm font-medium leading-relaxed">
                  Candidates with a Match Score above <span className="font-bold text-blue-600">85%</span> are 4x more likely to clear technical rounds. Focus on their "Resume Verification" questions.
                </p>
                <Button variant="link" className="text-blue-600 p-0 h-auto mt-4 font-bold text-xs">
                  Learn more about scoring <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full justify-start text-slate-400 hover:text-red-600 hover:bg-red-50/50 transition-all font-bold group"
              >
                <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickAction({ href, label, icon: Icon }: { href: string, label: string, icon: any }) {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all gap-3 group"
    >
      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:border-blue-100 group-hover:text-blue-600 transition-colors">
        <Icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
      </div>
      <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 uppercase tracking-tight">{label}</span>
    </Link>
  );
}

function CheckSquare({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
