import { NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Check file type
    if (file.type === 'application/pdf') {
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      return NextResponse.json({ text: data.text });
    } else if (file.type.startsWith('image/')) {
      // For images, we can use a mock for now or integrate with a vision API
      // Since this is a specialized task, we'll return a placeholder or use a mock OCR
      return NextResponse.json({ text: "Simulated OCR text for image resume. Experience in web development and data science." });
    } else {
      // Fallback for text files
      const text = buffer.toString('utf-8');
      return NextResponse.json({ text });
    }
  } catch (error) {
    console.error('Parsing Error:', error);
    return NextResponse.json({ error: 'Failed to parse file' }, { status: 500 });
  }
}
