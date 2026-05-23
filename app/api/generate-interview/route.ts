import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/openai';
import { GENERATE_INTERVIEW_PROMPT, SYSTEM_PROMPT } from '@/lib/ai/prompts';
import dbConnect from '@/lib/db/connect';
import InterviewReport from '@/lib/models/InterviewReport';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    let session = await getServerSession(authOptions);
    if (process.env.MOCK_AUTH === 'true' && (!session || !session.user)) {
      session = { user: { name: 'Dev Admin', email: 'dev@interviewforge.ai', id: 'mock-user-123' } } as any;
    }
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobTitle, companyName, jobDescription, resumeText, interviewType, difficulty, candidateName } = await req.json();

    if (!jobDescription || !resumeText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = GENERATE_INTERVIEW_PROMPT
      .replace('{{JOB_DESCRIPTION}}', jobDescription)
      .replace('{{RESUME_TEXT}}', resumeText)
      .replace('{{INTERVIEW_TYPE}}', interviewType || 'Technical')
      .replace('{{DIFFICULTY}}', difficulty || 'Senior');

    const reportData = await generateAIResponse(prompt, SYSTEM_PROMPT);

    await dbConnect();
    
    // Create a new report in the database
    // For now, using random ObjectIds for Job and Candidate if not provided
    // In a full implementation, these would be linked to existing records
    const newReport = await InterviewReport.create({
      userId: (session.user as any).id || new mongoose.Types.ObjectId(),
      jobId: new mongoose.Types.ObjectId(), // Placeholder
      candidateId: new mongoose.Types.ObjectId(), // Placeholder
      candidateName: candidateName || 'Alex Rivera',
      jobTitle: jobTitle || 'Software Engineer',
      ...reportData
    });

    return NextResponse.json(newReport);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to generate interview' }, { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    let session = await getServerSession(authOptions);
    if (process.env.MOCK_AUTH === 'true' && (!session || !session.user)) {
      session = { user: { name: 'Dev Admin', email: 'dev@interviewforge.ai', id: 'mock-user-123' } } as any;
    }

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = (session.user as any).id;
    
    const reports = await InterviewReport.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(reports);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
