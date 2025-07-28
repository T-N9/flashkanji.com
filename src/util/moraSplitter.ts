// 🧠 Mora splitter (handles youon, ん, long vowels)
export function splitIntoMora(hiragana: string) {
  const smallKana = ["ゃ", "ゅ", "ょ", "ャ", "ュ", "ョ"];
  const result = [];
  let i = 0;

  while (i < hiragana.length) {
    let char = hiragana[i];
    const next = hiragana[i + 1];
    const nextNext = hiragana[i + 2];

    // Combine with small kana
    if (smallKana.includes(next)) {
      char += next;
      i++;
      // Handle long vowel う
      if (nextNext === "う") {
        char += nextNext;
        i++;
      }
    } else if (next === "う") {
      char += next;
      i++;
    }

    // Handle 'ん'
    if (hiragana[i + 1] === "ん") {
      char += "ん";
      i++;
    }

    result.push(char);
    i++;
  }

  return result;
}
