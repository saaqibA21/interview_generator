"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CreditCard as CardIcon, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';

const plansMap: Record<string, { name: string, price: string, desc: string, features: string[] }> = {
  starter: {
    name: "Starter Plan",
    price: "₹999",
    desc: "For small teams and early-stage startups.",
    features: ["25 candidate reports", "Resume-based questions", "Scorecards", "PDF export", "Priority support"]
  },
  pro: {
    name: "Professional Plan",
    price: "₹2,999",
    desc: "Our most popular plan for scaling companies.",
    features: [
      "100 reports",
      "Bulk resume ranking",
      "Resume claim verifier",
      "Candidate comparison",
      "AI scoring",
      "Custom interview kits"
    ]
  },
  business: {
    name: "Business Plan",
    price: "₹9,999",
    desc: "For large HR teams and recruitment agencies.",
    features: [
      "500 reports",
      "Team dashboard",
      "Company knowledge mode",
      "Advanced analytics",
      "API access",
      "Dedicated account manager"
    ]
  }
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = searchParams.get('plan') || 'pro';
  const selectedPlan = plansMap[planKey] || plansMap.pro;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Card input states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate 3D Secure / UPI Authorization Delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsProcessing(false);
    setPaymentSuccess(true);
    
    // Store user tier in cookie to dynamically unlock features
    Cookies.set('user-tier', planKey, { expires: 30 });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/pricing" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to Pricing Plans
        </Link>

        <AnimatePresence mode="wait">
          {!paymentSuccess ? (
            <motion.div 
              key="checkout-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Order Summary Panel */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-100 bg-white/90 backdrop-blur-sm p-8">
                  <CardHeader className="px-0 pt-0">
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest block">Checkout Summary</span>
                    <CardTitle className="text-2xl font-black text-slate-900 mt-1">Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 space-y-6">
                    <div className="p-6 bg-slate-900 text-white rounded-[2rem] relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Badge className="bg-blue-600 text-white border-none font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">Active Plan</Badge>
                          <h4 className="text-xl font-black">{selectedPlan.name}</h4>
                        </div>
                        <span className="text-2xl font-black">{selectedPlan.price}</span>
                      </div>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">{selectedPlan.desc}</p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Plan Highlights</p>
                      <div className="space-y-2.5">
                        {selectedPlan.features.map((feature, i) => (
                          <div key={i} className="flex gap-2.5 items-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-xs text-slate-600 font-bold">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Total to Pay</p>
                        <p className="text-[10px] text-slate-400 font-medium">Includes simulated platform taxes</p>
                      </div>
                      <span className="text-3xl font-black text-slate-950">{selectedPlan.price}</span>
                    </div>

                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/60 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                      <span className="text-[10px] text-blue-700 font-black uppercase tracking-wider">Secure Payment Gateway Shield Enabled</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Gateway Panel */}
              <div className="lg:col-span-7">
                <Card className="rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-100 bg-white/90 backdrop-blur-sm p-8">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
                      <Lock className="w-6 h-6 text-slate-800" />
                      Payment Methods
                    </CardTitle>
                    <CardDescription>Select credit card or UPI to securely authorize your order.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 space-y-8">
                    {/* Method Selector Tabs */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={cn(
                          "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all",
                          paymentMethod === 'card' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                        )}
                      >
                        <CardIcon className="w-4 h-4" /> Credit / Debit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={cn(
                          "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all",
                          paymentMethod === 'upi' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                        )}
                      >
                        <QrCode className="w-4 h-4" /> UPI / QR Scan
                      </button>
                    </div>

                    <form onSubmit={handlePay} className="space-y-6">
                      <AnimatePresence mode="wait">
                        {paymentMethod === 'card' ? (
                          <motion.div
                            key="card-pane"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                          >
                            {/* Premium 3D Credit Card Simulation */}
                            <div className="flex justify-center py-4">
                              <div 
                                className="w-80 h-48 rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative overflow-hidden shadow-2xl transition-all duration-500 transform-style-3d cursor-pointer"
                                style={{
                                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                }}
                                onClick={() => setIsFlipped(!isFlipped)}
                              >
                                {!isFlipped ? (
                                  // Card Front
                                  <div className="h-full flex flex-col justify-between relative z-10 backface-hidden">
                                    <div className="flex justify-between items-center">
                                      <div className="w-12 h-8 bg-amber-500/25 rounded-md border border-amber-400/30 flex items-center justify-center shadow-inner">
                                        <div className="w-8 h-5 bg-yellow-400/40 rounded-sm" />
                                      </div>
                                      <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">Secure Pay</span>
                                    </div>
                                    <div className="text-xl font-mono tracking-[0.25em] text-slate-200 py-2">
                                      {cardNumber || "•••• •••• •••• ••••"}
                                    </div>
                                    <div className="flex justify-between items-end">
                                      <div>
                                        <p className="text-[7px] text-slate-400 uppercase tracking-widest font-black">Card Holder</p>
                                        <p className="text-xs font-bold font-mono tracking-wide uppercase text-slate-100">
                                          {cardName || "YOUR FULL NAME"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-[7px] text-slate-400 uppercase tracking-widest font-black">Expires</p>
                                        <p className="text-xs font-bold font-mono tracking-wide text-slate-100">
                                          {cardExpiry || "MM/YY"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  // Card Back
                                  <div 
                                    className="h-full flex flex-col justify-between relative z-10 backface-hidden"
                                    style={{ transform: 'rotateY(180deg)' }}
                                  >
                                    <div className="w-full h-8 bg-slate-950 absolute left-0 right-0 top-6" />
                                    <div className="pt-16 flex justify-end">
                                      <div className="bg-slate-800 text-slate-300 font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700">
                                        CVV: {cardCvv || "•••"}
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[7px] text-slate-500 font-black uppercase tracking-widest pt-4">
                                      <span>Authorized Signature Required</span>
                                      <span>ID: 942-88-X</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                                  <Input 
                                    required
                                    placeholder="e.g. Saaqib Analyst" 
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    onFocus={() => setIsFlipped(false)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                                  <Input 
                                    required
                                    maxLength={19}
                                    placeholder="4111 2222 3333 4444" 
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                    onFocus={() => setIsFlipped(false)}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiration Date</label>
                                  <Input 
                                    required
                                    maxLength={5}
                                    placeholder="MM/YY" 
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    onFocus={() => setIsFlipped(false)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV / CVN</label>
                                  <Input 
                                    required
                                    maxLength={3}
                                    placeholder="123" 
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value)}
                                    onFocus={() => setIsFlipped(true)}
                                    onBlur={() => setIsFlipped(false)}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="upi-pane"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6 text-center"
                          >
                            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200/60 rounded-[2rem] max-w-sm mx-auto shadow-inner">
                              <div className="w-48 h-48 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden group mb-4">
                                <QrCode className="w-40 h-40 text-slate-800" />
                                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs font-black uppercase text-slate-950 tracking-wider">
                                  Click to Scan
                                </div>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Scan dynamic UPI QR Code</span>
                              <Badge variant="warning" className="animate-pulse">Waiting for scan...</Badge>
                            </div>
                            <div className="space-y-2 max-w-md mx-auto">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-left">Enter UPI ID directly</label>
                              <Input placeholder="saaqib@ybl" className="text-center font-bold" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Button 
                        type="submit" 
                        disabled={isProcessing}
                        className="w-full h-16 rounded-[1.5rem] font-black text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/20 transition-all"
                      >
                        {isProcessing ? (
                          <span className="flex items-center gap-3 justify-center">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Authorizing simulated gateway...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 justify-center">
                            Pay {selectedPlan.price} & Forge Account <ArrowRight className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            // Success Screen
            <motion.div 
              key="success-card"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              <Card className="rounded-[3rem] border border-emerald-200 bg-white p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-2 bg-emerald-500" />
                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] block mb-2">Simulated Payment Captured</span>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">You are officially Pro!</h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm mx-auto mb-8">
                  Welcome to **InterviewForge AI** Premium tier. Your portal access has been fully upgraded.
                </p>

                <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-6 space-y-4 text-left font-mono text-xs leading-relaxed text-slate-600 mb-8">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-200 pb-2 mb-2">
                    <span>Invoice Details</span>
                    <span>Order: IF-942-PAY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subscriber Profile:</span>
                    <span className="font-bold text-slate-900">Saaqib Analyst</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan Tier Active:</span>
                    <span className="font-bold text-slate-900">{selectedPlan.name.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Gateway:</span>
                    <span className="font-bold text-slate-900">{paymentMethod.toUpperCase()} SIMULATOR</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3 text-slate-950 font-bold text-sm">
                    <span>Amount Billed:</span>
                    <span>{selectedPlan.price}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => router.push('/pricing')}
                    variant="outline" 
                    className="rounded-xl border-slate-200 text-slate-600 bg-transparent"
                  >
                    View Pricing
                  </Button>
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black shadow-xl shadow-slate-200"
                  >
                    Enter Workspace Dashboard
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-[#f8fafc] items-center justify-center">
        <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
