import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/openai';
import { JOB_ANALYSIS_PROMPT, SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    let session = await getServerSession(authOptions);
    if (process.env.MOCK_AUTH === 'true' && (!session || !session.user)) {
      session = { user: { name: 'Dev Admin', email: 'dev@interviewforge.ai', id: 'mock-user-123' } } as any;
    }

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobDescription } = await req.json();
    const prompt = JOB_ANALYSIS_PROMPT.replace('{{JOB_DESCRIPTION}}', jobDescription);
    const analysis = await generateAIResponse(prompt, SYSTEM_PROMPT);
    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze job' }, { status: 500 });
  }
}
