"use client";

import { CheckCircle2, Sparkles, Zap, Users, Building, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "For individuals exploring the platform.",
    features: ["3 reports/month", "Basic question generation", "Basic match score", "Community support"],
    cta: "Start for Free",
    highlight: false,
    icon: Zap
  },
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "For small teams and early-stage startups.",
    features: ["25 candidate reports", "Resume-based questions", "Scorecards", "PDF export", "Priority support"],
    cta: "Get Started",
    highlight: false,
    icon: Users
  },
  {
    name: "Pro",
    price: "₹2,999",
    period: "/month",
    description: "Our most popular plan for scaling companies.",
    features: [
      "100 reports",
      "Bulk resume ranking",
      "Resume claim verifier",
      "Candidate comparison",
      "AI scoring",
      "Custom interview kits"
    ],
    cta: "Go Pro",
    highlight: true,
    icon: Sparkles
  },
  {
    name: "Business",
    price: "₹9,999",
    period: "/month",
    description: "For large HR teams and recruitment agencies.",
    features: [
      "500 reports",
      "Team dashboard",
      "Company knowledge mode",
      "Advanced analytics",
      "API access placeholder",
      "Dedicated account manager"
    ],
    cta: "Scale Now",
    highlight: false,
    icon: Building
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Choose your power.</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Unlock the full potential of AI-powered hiring. From solo recruiters to large enterprises, we have a plan that fits your scale.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={cn(
              "relative p-8 rounded-[40px] border transition-all hover:scale-[1.02] duration-300",
              plan.highlight 
                ? "bg-slate-900 text-white border-slate-900 shadow-2xl shadow-blue-200" 
                : "bg-white text-slate-900 border-slate-200 shadow-sm"
            )}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
                plan.highlight ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
              )}>
                <plan.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <p className={cn(
                "text-sm mb-6",
                plan.highlight ? "text-slate-400" : "text-slate-500"
              )}>{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className={cn(
                  "text-sm font-bold",
                  plan.highlight ? "text-slate-500" : "text-slate-400"
                )}>{plan.period}</span>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className={cn(
                    "w-5 h-5 shrink-0 mt-0.5",
                    plan.highlight ? "text-blue-400" : "text-blue-600"
                  )} />
                  <span className="text-sm font-semibold">{feature}</span>
                </div>
              ))}
            </div>

            <Link 
              href={plan.name === 'Free' ? '/dashboard' : '/signup'}
              className={cn(
                "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
                plan.highlight 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20" 
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
              )}
            >
              {plan.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-24 bg-white p-12 rounded-[40px] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-2 text-blue-600 mb-2">
             <ShieldCheck className="w-6 h-6" />
             <span className="font-black uppercase tracking-widest text-sm">Enterprise</span>
           </div>
           <h3 className="text-3xl font-black text-slate-900 mb-2">Custom solutions for scale.</h3>
           <p className="text-slate-500 max-w-md">ATS integrations, college placement dashboards, and dedicated support for large organizations.</p>
        </div>
        <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 shrink-0">
          Contact Sales
        </button>
      </div>
    </div>
  );
}
