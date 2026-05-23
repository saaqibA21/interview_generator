"use client";

import { Bell, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'User';
  const userInitial = userName?.[0]?.toUpperCase() || 'U';

  return (
    <header className="h-20 border-b border-slate-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search reports or candidates..."
            className="pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-72 font-medium transition-all focus:bg-white focus:w-80"
          />
        </div>
        
        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="w-px h-8 bg-slate-200/60"></div>

        <button className="flex items-center gap-3 hover:bg-slate-50/50 pl-1 pr-3 py-1 rounded-2xl transition-all group">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-105 transition-transform">
            {userInitial}
          </div>
          <div className="text-left hidden md:block">
            <span className="block text-xs font-black text-slate-900 leading-none mb-1">{userName}</span>
            <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-tight">Standard Account</span>
          </div>
        </button>
      </div>
    </header>
  );
}
