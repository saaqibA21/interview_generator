"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  FileText, 
  CheckSquare, 
  Search, 
  Settings, 
  CreditCard,
  Target,
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: ['interviewer', 'applicant'] },
  { icon: PlusCircle, label: 'New Interview', href: '/dashboard/new-interview', roles: ['interviewer'] },
  { icon: Users, label: 'Bulk Ranking', href: '/dashboard/bulk-ranking', roles: ['interviewer'] },
  { icon: FileText, label: 'Reports', href: '/dashboard/reports', roles: ['interviewer', 'applicant'] },
  { icon: Target, label: 'Practice Mode', href: '/dashboard/candidate-practice', roles: ['applicant'] },
  { icon: CheckSquare, label: 'Answer Scoring', href: '/dashboard/answer-scoring', roles: ['interviewer', 'applicant'] },
  { icon: Search, label: 'Resume Verifier', href: '/dashboard/resume-verifier', roles: ['interviewer'] },
  { icon: CreditCard, label: 'Pricing', href: '/pricing', roles: ['interviewer', 'applicant'] },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings', roles: ['interviewer', 'applicant'] },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<'interviewer' | 'applicant'>('interviewer');

  useEffect(() => {
    const role = Cookies.get('user-role') as 'interviewer' | 'applicant';
    if (role) {
      setUserRole(role);
    } else if (session?.user) {
      const serverRole = (session.user as any).role || 'interviewer';
      setUserRole(serverRole);
    }
  }, [session]);

  return (
    <div className="w-64 h-screen bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800/50 sticky top-0 z-50">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-xl font-black text-white tracking-tight">InterviewForge</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.filter(item => {
          return item.roles.includes(userRole);
        }).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 shadow-sm" 
                  : "hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                )} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {isActive && <motion.div layoutId="active-nav" className="w-1 h-4 bg-blue-600 rounded-full" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800/50 space-y-4">
        {session?.user && (
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-900/50 rounded-2xl border border-slate-800/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-inner">
              {session.user.name?.[0] || session.user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate">{session.user.name || 'User'}</p>
              <p className="text-[10px] font-medium text-slate-500 truncate">{session.user.email}</p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 rounded-[2rem] p-6 border border-slate-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Free Plan</span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 mb-4">3/5 reports used this month</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-blue-600 h-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
            />
          </div>
          <Link 
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
          >
            Upgrade <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 transition-all text-slate-500 hover:text-red-400 group font-bold text-sm"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
