import { NextRequest, NextResponse } from 'next/server';

// For App Router (app/api/kanji/mnemonic/route.ts)
export async function POST(request: NextRequest) {
  try {
    const { kanji } = await request.json();

    if (!kanji) {
      return NextResponse.json(
        { error: 'Kanji character is required' },
        { status: 400 }
      );
    }

    const prompt = `Hello Sensei, I am a Japanese language learner, help me remember this kanji character "${kanji}" by telling me a memorable mnemonic story in simple English, short, engaging and make sense. You may break down the radicals to tell the story. (this is one time request, do not ask me to ask again or anything like that)`;

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

    return NextResponse.json({ mnemonic: text });

  } catch (error) {
    console.error('Error in kanji mnemonic API:', error);
    return NextResponse.json(
      { error: 'Failed to generate mnemonic' },
      { status: 500 }
    );
  }
}