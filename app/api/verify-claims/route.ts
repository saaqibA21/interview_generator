import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/openai';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const VERIFY_CLAIMS_PROMPT = `
Analyze the following resume claims and identify suspicious, inflated, or vague statements. 
For each suspicious claim, provide a reason and a verification question.
Also identify strong, evidence-based claims.

Resume/Claims:
{{TEXT}}

Return JSON:
{
  "veracityScore": 0,
  "suspiciousClaims": [
    {
      "claim": "",
      "reason": "",
      "verificationQuestion": ""
    }
  ],
  "strongClaims": [
    {
      "claim": "",
      "reason": ""
    }
  ]
}
`;

export async function POST(req: Request) {
  try {
    let session = await getServerSession(authOptions);
    if (process.env.MOCK_AUTH === 'true' && (!session || !session.user)) {
      session = { user: { name: 'Dev Admin', email: 'dev@interviewforge.ai', id: 'mock-user-123' } } as any;
    }

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = VERIFY_CLAIMS_PROMPT.replace('{{TEXT}}', text);
    const verificationResults = await generateAIResponse(prompt, SYSTEM_PROMPT);

    return NextResponse.json(verificationResults);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to verify claims' }, { status: 500 });
  }
}
