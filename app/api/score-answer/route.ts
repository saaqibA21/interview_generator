import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/openai';
import { SCORE_ANSWER_PROMPT, SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    // Auth bypass check for development
    if (process.env.MOCK_AUTH !== 'true') {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { question, expected, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Missing question or answer' }, { status: 400 });
    }

    const prompt = SCORE_ANSWER_PROMPT
      .replace('{{QUESTION}}', question)
      .replace('{{EXPECTED}}', expected || 'General technical accuracy and clarity.')
      .replace('{{ANSWER}}', answer);

    const evaluation = await generateAIResponse(prompt, SYSTEM_PROMPT);

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Scoring Error:', error);
    return NextResponse.json({ error: 'Failed to score answer' }, { status: 500 });
  }
}
