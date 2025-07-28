type SwapMap = {
  [key: string]: string | string[];
};

const swapMap: SwapMap = {
  か: "が",
  が: "か",
  き: "ぎ",
  ぎ: "き",
  く: "ぐ",
  ぐ: "く",
  け: "げ",
  げ: "け",
  こ: "ご",
  ご: "こ",
  さ: "ざ",
  ざ: "さ",
  し: "じ",
  じ: "し",
  す: "ず",
  ず: "す",
  せ: "ぜ",
  ぜ: "せ",
  そ: "ぞ",
  ぞ: "そ",
  た: "だ",
  だ: "た",
  ち: "ぢ",
  ぢ: "ち",
  つ: "づ",
  づ: "つ",
  て: "で",
  で: "て",
  と: "ど",
  ど: "と",
  は: ["ば", "ぱ"],
  ば: "は",
  ぱ: "は",
  ひ: ["び", "ぴ"],
  び: "ひ",
  ぴ: "ひ",
  ふ: ["ぶ", "ぷ"],
  ぶ: "ふ",
  ぷ: "ふ",
  へ: ["べ", "ぺ"],
  べ: "へ",
  ぺ: "へ",
  ほ: ["ぼ", "ぽ"],
  ぼ: "ほ",
  ぽ: "ほ",
  カ: "ガ",
  ガ: "カ",
  キ: "ギ",
  ギ: "キ",
  ク: "グ",
  グ: "ク",
  ケ: "ゲ",
  ゲ: "ケ",
  コ: "ゴ",
  ゴ: "コ",
  サ: "ザ",
  ザ: "サ",
  シ: "ジ",
  ジ: "シ",
  ス: "ズ",
  ズ: "ス",
  セ: "ゼ",
  ゼ: "セ",
  ソ: "ゾ",
  ゾ: "ソ",
  タ: "ダ",
  ダ: "タ",
  チ: "ヂ",
  ヂ: "チ",
  ツ: "ヅ",
  ヅ: "ツ",
  テ: "デ",
  デ: "テ",
  ト: "ド",
  ド: "ト",
  ハ: ["バ", "パ"],
  バ: "ハ",
  パ: "ハ",
  ヒ: ["ビ", "ピ"],
  ビ: "ヒ",
  ピ: "ヒ",
  フ: ["ブ", "プ"],
  ブ: "フ",
  プ: "フ",
  ヘ: ["ベ", "ペ"],
  ベ: "ヘ",
  ペ: "ヘ",
  ホ: ["ボ", "ポ"],
  ボ: "ホ",
  ポ: "ホ",
};

export function generateHiraganaVariants(input: string): string[] {
  const results: Set<string> = new Set();
  const chars = input.split("");
  let stopIndex = Math.min(
    ...[chars.indexOf("一"), chars.indexOf(".")].filter((i) => i !== -1)
  );
  if (stopIndex === Infinity) stopIndex = chars.length; // If neither "一" nor "." is found, process the entire input

  function swapAndGenerate(chars: string[], index: number): void {
    if (index >= stopIndex) {
      const variant = chars.join("");
      if (variant !== input) {
        results.add(variant);
      }
      return;
    }

    const char = chars[index];
    swapAndGenerate(chars, index + 1);

    if (swapMap[char]) {
      const swaps = Array.isArray(swapMap[char])
        ? swapMap[char]
        : [swapMap[char]];
      swaps.forEach((swap) => {
        const newChars = [...chars];
        newChars[index] = swap;
        swapAndGenerate(newChars, index + 1);
      });
    }
  }

  swapAndGenerate(chars, 0);
  return Array.from(results).sort(() => Math.random() - 0.5);
}
