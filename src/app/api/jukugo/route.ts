import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { jukugo, level } = await request.json();

    if (!jukugo) {
      return NextResponse.json(
        { error: 'Jukugo character is required' },
        { status: 400 }
      );
    }

    if (!level || level < 1 || level > 5) {
      return NextResponse.json(
        { error: 'Valid JLPT level (1-5) is required' },
        { status: 400 }
      );
    }

    const prompt = `Hello Sensei, I am a Japanese language learner, give me N${level} level 5 real-world usage of this word "${jukugo}". Also give me hiragana and English translation version of each sentence.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";

    return NextResponse.json({ usage: text });

  } catch (error) {
    console.error('Error in jukugo usage API:', error);
    return NextResponse.json(
      { error: 'Failed to generate usage examples' },
      { status: 500 }
    );
  }
}