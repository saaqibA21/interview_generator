import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/openai';
import { BULK_RANK_PROMPT, SYSTEM_PROMPT } from '@/lib/ai/prompts';
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

    const { jobDescription, candidates } = await req.json();

    if (!jobDescription || !candidates || !Array.isArray(candidates)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const candidatesData = candidates.map((c, i) => `Candidate ${i+1}: ${c}`).join('\n\n---\n\n');

    const prompt = BULK_RANK_PROMPT
      .replace('{{JOB_DESCRIPTION}}', jobDescription)
      .replace('{{CANDIDATES_DATA}}', candidatesData);

    const rankingResults = await generateAIResponse(prompt, SYSTEM_PROMPT);

    return NextResponse.json(rankingResults);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to rank candidates' }, { status: 500 });
  }
}
