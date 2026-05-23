"use client";

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportsListPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/api/generate-interview');
        setReports(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter(r => 
    r.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <DashboardHeader 
          title="Intelligence Vault" 
          subtitle="Access and manage your forged interview strategies." 
        />
        
        <div className="p-10 max-w-7xl mx-auto space-y-8">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div className="relative flex-1 max-w-xl group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                  placeholder="Search by candidate, role, or company..."
                  className="pl-14 h-14 bg-white/80 border-slate-200 rounded-2xl shadow-sm focus:bg-white transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-4">
                <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-200 bg-white/80 hover:bg-white font-bold">
                   <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
                <Link href="/dashboard/new-interview">
                  <Button className="h-14 px-8 rounded-2xl font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20">
                     <PlusCircle className="w-5 h-5 mr-2" /> New Kit
                  </Button>
                </Link>
             </div>
          </div>

          {/* Main Content Area */}
          {loading ? (
            <div className="h-[500px] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-200/60 border-dashed">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Accessing Vault...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center bg-red-50 rounded-[3rem] border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-black text-red-900 mb-2">Vault Access Denied</h3>
              <p className="text-red-700 mb-8 max-w-md mx-auto font-medium">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                Try Again
              </Button>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/20">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                <FileText className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">No kits forged yet</h3>
              <p className="text-slate-500 mb-10 max-w-xs mx-auto font-medium leading-relaxed">
                Start by generating your first AI-powered interview strategy for a candidate.
              </p>
              <Link href="/dashboard/new-interview">
                <Button size="lg" className="h-16 px-10 rounded-2xl font-black shadow-xl shadow-blue-500/20">
                  Forge Your First Kit
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] border border-slate-200/60 shadow-2xl shadow-slate-200/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                      <th className="px-10 py-6">Candidate Intelligence</th>
                      <th className="px-10 py-6">Role & Target</th>
                      <th className="px-10 py-6">Forging Score</th>
                      <th className="px-10 py-6">Risk Profile</th>
                      <th className="px-10 py-6 text-right">Vault Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60">
                    {filteredReports.map((report, idx) => (
                      <motion.tr 
                        key={report._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-blue-50/30 transition-all group"
                      >
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                                {report.candidateName?.[0] || 'C'}
                             </div>
                             <div>
                               <div className="font-black text-slate-900 tracking-tight">{report.candidateName || 'Unnamed Candidate'}</div>
                               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                 <Clock className="w-3 h-3" />
                                 {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                               </div>
                             </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="text-sm font-black text-slate-800 tracking-tight">{report.jobTitle}</div>
                           <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Generated Insight</div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                              <span className="text-lg font-black text-slate-900">{report.matchScore || 0}%</span>
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${report.matchScore || 0}%` }}
                                   transition={{ duration: 1, delay: idx * 0.1 }}
                                   className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                                 ></motion.div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <Badge className={cn(
                              "rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-none",
                              report.riskLevel === 'Low' ? "bg-emerald-100 text-emerald-700" :
                              report.riskLevel === 'High' ? "bg-red-100 text-red-700" :
                              "bg-amber-100 text-amber-700"
                            )}>
                              {report.riskLevel || 'Stable'}
                           </Badge>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex justify-end gap-3">
                             <Link href={`/dashboard/reports/${report._id}`}>
                               <Button variant="outline" className="h-10 px-5 rounded-xl border-slate-200 font-bold text-xs hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                                 View Analysis <ExternalLink className="w-3.5 h-3.5 ml-2" />
                               </Button>
                             </Link>
                             <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-slate-100">
                                <MoreVertical className="w-4 h-4 text-slate-400" />
                             </Button>
                           </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-10 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                  Showing {filteredReports.length} intelligence reports in vault
                </p>
                <div className="flex items-center gap-3">
                   <Button variant="outline" disabled className="h-10 px-5 rounded-xl text-xs font-bold disabled:opacity-30">Previous</Button>
                   <Button variant="outline" className="h-10 px-5 rounded-xl text-xs font-bold bg-white border-slate-200">Next Page</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
