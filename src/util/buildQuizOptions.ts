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

  // Start with correct moras
  const optionsSet = new Set<string>(correctMoras);

  // Collect mistaken moras from other items + variants
  for (const other of allItems) {
    if (other.character === item.character) continue;

    const otherMoras = splitIntoMora(other.hiragana);
    for (const mora of otherMoras) {
      if (optionsSet.size >= maxOptions) break;
      optionsSet.add(mora);
    }

    // Add mistaken variants using generateHiraganaVariants
    const variants = generateHiraganaVariants(other.hiragana);
    for (const variant of variants) {
      const variantMoras = splitIntoMora(variant);
      for (const v of variantMoras) {
        if (optionsSet.size >= maxOptions) break;
        optionsSet.add(v);
      }
    }

    if (optionsSet.size >= maxOptions) break;
  }

  // Convert to shuffled array
  const allOptions = Array.from(optionsSet);
  const shuffled = allOptions.sort(() => Math.random() - 0.5);

  return {
    character: item.character,
    meaning: item.meaning,
    hiragana: item.hiragana,
    correctMoras,
    options: shuffled,
  };
}
