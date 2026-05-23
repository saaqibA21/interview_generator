import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "InterviewForge AI | Unique Interview Intelligence",
  description: "Generate unique interview questions for every applicant based on the job, resume, and skill gaps.",
};

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        inter.variable, 
        outfit.variable,
        "font-sans antialiased bg-slate-50 text-slate-900"
      )}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
