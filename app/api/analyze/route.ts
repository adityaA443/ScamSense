import { NextRequest, NextResponse } from 'next/server';
import { analyzeText } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: 'Text too long (max 5000 characters)' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Groq API key not configured. Add GROQ_API_KEY to .env.local' }, { status: 500 });
    }

    const result = await analyzeText(text.trim());
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Analysis error:', error);

    const msg = error instanceof Error ? error.message : String(error);

    if (msg.includes('429') || msg.includes('rate_limit') || msg.includes('Too Many Requests')) {
      return NextResponse.json(
        { error: 'Rate limit hit. Please wait a moment and try again.' },
        { status: 429 }
      );
    }
    if (msg.includes('401') || msg.includes('invalid_api_key') || msg.includes('Authentication')) {
      return NextResponse.json(
        { error: 'Invalid Groq API key. Get a key from console.groq.com' },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
