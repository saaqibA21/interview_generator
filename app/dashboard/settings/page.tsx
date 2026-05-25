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
  Plus,
  RefreshCw
} from 'lucide-react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [atsProvider, setAtsProvider] = useState('lever');
  const [webhookUrl, setWebhookUrl] = useState('https://api.vercel-splicer.interviewforge.ai/v1/webhook');
  const [autoSync, setAutoSync] = useState(true);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean | null>(null);

  const runTestSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(null);
    setSyncLogs([]);
    
    const logs = [
      "🔄 Initializing Lever outbound API connection...",
      "📂 Loading structural resume highlights for candidate 'Sarah Chen'...",
      "📊 Compiling SVG radar coordinates & credibility report...",
      "🚀 Dispatching HTTPS POST payload (4.8 KB)...",
      "📥 Waiting for Lever response gateway..."
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 650));
      setSyncLogs(prev => [...prev, logs[i]]);
    }

    await new Promise(resolve => setTimeout(resolve, 750));
    setSyncLogs(prev => [...prev, "✅ Success! HTTP 200 OK received from Lever API.", "🎉 Candidate synced successfully in Greenhouse/Lever pipeline!"]);
    setIsSyncing(false);
    setSyncSuccess(true);
  };

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

          {/* ATS Splicer Integration Card */}
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 border-2 border-dashed border-blue-200 bg-white hover:border-blue-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  ATS Integrations (Splicer Endpoint)
                </CardTitle>
                <CardDescription>Automatically synchronize candidate profiles, evaluations, and SVG charts into Lever, Greenhouse, or Workday.</CardDescription>
              </div>
              <Badge variant={webhookUrl ? "success" : "secondary"}>
                {webhookUrl ? "Connected" : "Inactive"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select ATS Provider</label>
                  <select 
                    value={atsProvider}
                    onChange={(e) => setAtsProvider(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="lever">Lever ATS</option>
                    <option value="greenhouse">Greenhouse ATS</option>
                    <option value="workday">Workday Recruiting</option>
                    <option value="smartrecruiters">SmartRecruiters</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Webhook Endpoint</label>
                  <Input 
                    value={webhookUrl} 
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://api.ats-provider.com/v1/webhook"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">Auto-Sync Evaluation Reports</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Automatically sync candidate reports once an interview is fully scored.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSync(!autoSync)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    autoSync ? "bg-blue-600" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                    autoSync ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              {/* Status Simulator Console Log */}
              {syncLogs.length > 0 && (
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[11px] leading-relaxed text-emerald-400 space-y-2 shadow-inner max-h-48 overflow-y-auto animate-in fade-in">
                  <div className="flex justify-between items-center text-[9px] text-slate-500 border-b border-slate-900 pb-2 mb-2">
                    <span>ATS INTEGRATION LOG CONSOLE</span>
                    <span>ACTIVE PROVIDER: {atsProvider.toUpperCase()}</span>
                  </div>
                  {syncLogs.map((log, idx) => (
                    <div key={idx} className="animate-in slide-in-from-left-2 duration-300">
                      {log}
                    </div>
                  ))}
                  {isSyncing && (
                    <div className="flex items-center gap-2 text-slate-500 italic animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Connecting to gateway...
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={runTestSync}
                  disabled={isSyncing}
                  className="font-bold flex items-center gap-2"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Test Integration & Sync
                    </>
                  )}
                </Button>
                <Button variant="premium">Save Webhook</Button>
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
