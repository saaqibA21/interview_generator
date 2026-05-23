"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const mockSession = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true' ? {
    user: {
      name: "Developer Admin",
      email: "dev@interviewforge.ai",
      image: "https://github.com/identicons/saaqib.png",
      id: "mock-user-123",
      role: "interviewer"
    },
    expires: new Date(Date.now() + 3600 * 1000).toISOString()
  } : undefined;

  return <SessionProvider session={mockSession as any}>{children}</SessionProvider>;
}
