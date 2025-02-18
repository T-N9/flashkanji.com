import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // console.log("Received request body:", body); // 🔍 Log request

    if (!body.textInput) {
      console.error("❌ Missing text in request");
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      console.error("❌ Google TTS API key is missing!");
      return NextResponse.json({ error: "Google TTS API key is missing" }, { status: 500 });
    }

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: body.textInput },
        voice: { languageCode: "ja-JP", name: "ja-JP-Wavenet-D" },
        audioConfig: { audioEncoding: "MP3" },
      }),
    });


//     ja-JP-Wavenet-D
// ja-JP-Neural2-B

    const data = await response.json();
    // console.log("🔍 Google TTS Response:", data);

    if (!data.audioContent) {
      // console.error("❌ Failed to generate audio:", data);
      return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
    }

    return NextResponse.json({ audioContent: data.audioContent });
  } catch (error) {
    // console.error("❌ Server Error:", error);
    return NextResponse.json({ error: "Error generating speech" }, { status: 500 });
  }
}
