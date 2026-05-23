"use client";

import { useState } from 'react';
import { 
  User, 
  Building, 
  CreditCard, 
  Shield, 
  Bell, 
  Globe, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto pb-20">
        <DashboardHeader title="Settings" subtitle="Manage your profile, team, and billing preferences." />
        
        <div className="p-8 max-w-4xl mx-auto space-y-8">
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and how others see you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                 <div className="w-20 h-20 bg-slate-100 rounded-[32px] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 group hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer">
                    <User className="w-8 h-8" />
                 </div>
                 <Button variant="outline">Change Avatar</Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <Input defaultValue="Saaqib Analyst" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <Input defaultValue="saaqib@interviewforge.ai" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="premium">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>Manage your billing and team usage.</CardDescription>
              </div>
              <Badge variant="info" className="h-6">Pro Plan</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                     </div>
                     <div>
                        <p className="font-bold text-slate-900">Professional Yearly</p>
                        <p className="text-xs text-slate-500 font-medium">$490 / year • Renews May 2027</p>
                     </div>
                  </div>
                  <Button variant="outline" size="sm">Manage Billing</Button>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-end mb-1">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interview Kits Generated</p>
                     <p className="text-xs font-black text-slate-900">42 / 100</p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600 rounded-full" style={{ width: '42%' }} />
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Secure your account with 2FA and session management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                     <Shield className="w-5 h-5 text-slate-400" />
                     <span className="text-sm font-bold text-slate-700">Two-Factor Authentication</span>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
               </div>
               <div className="flex justify-end">
                  <Button variant="outline">Update Password</Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
