import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import InterviewReport from '@/lib/models/InterviewReport';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let session = await getServerSession(authOptions);
    if (process.env.MOCK_AUTH === 'true' && (!session || !session.user)) {
      session = { user: { name: 'Dev Admin', email: 'dev@interviewforge.ai', id: 'mock-user-123' } } as any;
    }

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const report = await InterviewReport.findOne({
      _id: id,
      userId: (session.user as any).id
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}
