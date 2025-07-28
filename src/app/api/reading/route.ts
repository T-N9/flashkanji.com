import { NextRequest, NextResponse } from "next/server";
import kuromoji from "kuromoji";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "";

  //@ts-ignore
  const tokenizer = await new Promise<kuromoji.Tokenizer>((resolve, reject) => {
    const builder = kuromoji.builder({
      dicPath: path.join(process.cwd(), "node_modules/kuromoji/dict"),
    });

    builder.build((err, tokenizer) => {
      if (err) reject(err);
      else resolve(tokenizer);
    });
  });

  const tokens = tokenizer.tokenize(text);

  //@ts-ignore
  const tokenData = tokens.map((t) => ({
    surface_form: t.surface_form,
    reading: t.reading ? katakanaToHiragana(t.reading) : t.surface_form,
    pronunciation: t.pronunciation
      ? katakanaToHiragana(t.pronunciation)
      : t.surface_form,
    pos: t.pos,
  }));

  //@ts-ignore
  const readingText = tokenData.map((t) => t.reading).join(" ");

  return NextResponse.json({
    input: text,
    tokens: tokenData,
    reading: readingText,
  });
}

// Utility function to convert Katakana to Hiragana
function katakanaToHiragana(katakana: string): string {
  return katakana.replace(/[\u30A1-\u30F6]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  );
}
