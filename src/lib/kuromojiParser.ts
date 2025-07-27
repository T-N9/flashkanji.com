import kuromoji from "kuromoji";
import path from "path";

export type TokenInfo = {
  surface_form: string;
  reading: string;
  pronunciation: string;
  pos: string;
};

export function tokenizeDetailed(input: string): Promise<{ tokens: TokenInfo[]; hiragana: string }> {
  return new Promise((resolve, reject) => {
    const builder = kuromoji.builder({
      dicPath: path.resolve("./node_modules/kuromoji/dict"),
    });

    builder.build((err, tokenizer) => {
      if (err) return reject(err);

      const tokens = tokenizer.tokenize(input);

      const resultTokens: TokenInfo[] = tokens.map((t) => ({
        surface_form: t.surface_form,
        reading: kataToHira(t.reading || t.surface_form),
        pronunciation: kataToHira(t.pronunciation || t.surface_form),
        pos: t.pos,
      }));

      const fullHiragana = resultTokens.map((t) => t.reading).join(" ");

      resolve({ tokens: resultTokens, hiragana: fullHiragana });
    });
  });
}

function kataToHira(katakana: string): string {
  return katakana.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}
