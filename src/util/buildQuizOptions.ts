import { generateHiraganaVariants } from "./hiraganaVariants";
import { splitIntoMora } from "./moraSplitter";

export type QuizItem = {
  character: string;
  meaning: string;
  hiragana: string;
};

export type OptionSet = {
  character: string;
  meaning: string;
  hiragana: string;
  correctMoras: string[];
  options: string[];
};

export function buildQuizOptions(
  item: QuizItem,
  allItems: QuizItem[],
  maxOptions = 10
): OptionSet {
  const hiragana = item?.hiragana ?? "";

  if (!hiragana) {
    console.warn("Missing hiragana for item:", item);
    return {
      character: "",
      meaning: "",
      hiragana: "",
      correctMoras: [""],
      options: [""],
    };
  }

  const correctMoras = splitIntoMora(item.hiragana);

  // ---------------------------------
  // Generate mistaken variants from the correct moras themselves
  // ---------------------------------
  const variantDistractorsSet = new Set<string>();
  for (const mora of correctMoras) {
    const chouonVariants = handleChouon(mora);
    for (const v of chouonVariants) {
      if (!correctMoras.includes(v)) {
        variantDistractorsSet.add(v);
      }
    }

    const moraVariants = generateHiraganaVariants(mora);
    for (const variant of moraVariants) {
      const splitVariants = splitIntoMora(variant);
      for (const v of splitVariants) {
        // Only add if not in correct moras
        if (!correctMoras.includes(v)) {
          variantDistractorsSet.add(v);
        }
      }
    }
  }

  // ---------------------------------
  // Collect normal distractors from other items
  // ---------------------------------
  const normalDistractorsSet = new Set<string>();
  for (const other of allItems) {
    if (other.character === item.character) continue;
    for (const mora of splitIntoMora(other.hiragana)) {
      if (!correctMoras.includes(mora)) {
        normalDistractorsSet.add(mora);
      }
    }
  }

  // ---------------------------------
  // Prioritize variants from correct moras
  // ---------------------------------
  const needed = maxOptions - correctMoras.length;
  const distractors: string[] = [];

  // Track moras already included (allow duplicates only from correctMoras)
  const included = new Set<string>(correctMoras);

  // Helper to safely add distractors without duplication
  const addUnique = (arr: string[], source: string[]) => {
    for (const m of source) {
      if (distractors.length >= needed) break;
      if (!included.has(m)) {
        distractors.push(m);
        included.add(m);
      }
    }
  };

  // Add variants first
  const shuffledVariants = [...variantDistractorsSet].sort(
    () => Math.random() - 0.5
  );
  addUnique(distractors, shuffledVariants);

  // Fill with normal distractors if needed
  if (distractors.length < needed) {
    const shuffledNormals = [...normalDistractorsSet].sort(
      () => Math.random() - 0.5
    );
    addUnique(distractors, shuffledNormals);
  }

  // ---------------------------------
  // Final options list: all correct moras (with duplicates) + unique distractors
  // ---------------------------------
  const allOptions = [...correctMoras, ...distractors].sort(
    () => Math.random() - 0.5
  );

  return {
    character: item.character,
    meaning: item.meaning,
    hiragana: item.hiragana,
    correctMoras,
    options: allOptions,
  };
}

export function handleChouon(mora: string): string[] {
  const smallKana = new Set(["ゃ", "ゅ", "ょ"]);

  // Ends with small kana: add long vowel form
  if (smallKana.has(mora.slice(-1))) {
    return [mora + "う", mora];
  }

  // Ends with 'う': return original + shortened form
  if (mora.endsWith("う")) {
    return [mora, mora.slice(0, -1)];
  }

  // Otherwise, just return original
  return [mora];
}
