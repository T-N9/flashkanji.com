import { format, isBefore, parseISO } from "date-fns";

export const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export type SR_KanjiCard = {
  id: number;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReviewDate: Date;
  previousClick: number | null;
  level: number | null;
  card_id?: number;
};

export type SR_DeckCard = {
  id: number /* card_id */;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReviewDate: Date;
  previousClick: number | null;
  level: number | null;
  card_id?: number;
};

export type Clicked_Item = {
  id: number;
  clickedLevel: number;
};

// export function calculateNextReview(
//   card: SR_KanjiCard,
//   quality: number, // 0 (again), 1 (hard), 2 (good), 3 (easy)
//   satisfaction: number,
//   stopSecond: number
// ): { updatedCard: SR_KanjiCard; satisfaction: number } {
//   if (quality < 0 || quality > 3) {
//     throw new Error("Quality must be between 0 and 3.");
//   }
//   console.log({ card });
//   const updatedCard = { ...card };
//   const currentDate = new Date(); // Use a fixed date for testing

//   // ✅ (1) Convert your 0–3 scale to SM-2’s 0–5 scale
//   // SM-2 expects quality 0–5: we'll map 0 → 2, 1 → 3, 2 → 4, 3 → 5
//   const sm2Quality = quality;

//   // ✅ (2) Repetition reset on failure (SM-2)

//   if (sm2Quality === 0) {
//     updatedCard.repetitions = 0;
//     updatedCard.interval = 0;
//     updatedCard.easeFactor = Math.max(updatedCard.easeFactor - 0.2, 1.3);
//     updatedCard.nextReviewDate = new Date(
//       currentDate.getDate() + updatedCard.interval
//     ); // +10 min
//   } else if (sm2Quality === 1) {
//     updatedCard.repetitions =
//       updatedCard.repetitions === 0 ? 0 : updatedCard.repetitions;
//     updatedCard.interval = 1;
//     updatedCard.easeFactor = Math.max(updatedCard.easeFactor - 0.1, 1.3);
//     updatedCard.nextReviewDate = new Date(
//       currentDate.getDate() + updatedCard.interval
//     ); // +24 hours
//   } else if (sm2Quality === 2) {
//     updatedCard.repetitions =
//       updatedCard.repetitions === 0 ? 0 : updatedCard.repetitions;
//     updatedCard.interval = 2;
//     updatedCard.easeFactor = Math.max(updatedCard.easeFactor - 0.05, 1.3);
//     updatedCard.nextReviewDate = new Date(
//       currentDate.getDate() + updatedCard.interval
//     ); // +2 days
//   } else {
//     // ✅ (3) Interval logic aligned with SM-2
//     if (updatedCard.repetitions === 0) {
//       updatedCard.interval = 1;
//       // } else if (updatedCard.repetitions === 1) {
//       //   updatedCard.interval = 3;
//       // } else {
//     } else {
//       updatedCard.interval = Math.round(
//         updatedCard.interval * updatedCard.easeFactor
//       );
//     }

//     // ✅ (4) Repetitions only increment on success (SM-2)
//     updatedCard.repetitions += 1;

//     // ✅ (5) SM-2 formula for updating easeFactor
//     const ef = updatedCard.easeFactor;
//     const newEF =
//       ef + (0.1 - (5 - sm2Quality) * (0.08 + (5 - sm2Quality) * 0.02));
//     updatedCard.easeFactor = Math.max(newEF, 1.3);

//     // ✅ Interval cap to avoid excessive scheduling delay
//     updatedCard.interval = Math.min(updatedCard.interval, 10);

//     // ✅ Set next review date based on interval
//     updatedCard.nextReviewDate = new Date();
//     updatedCard.nextReviewDate.setDate(
//       currentDate.getDate() + updatedCard.interval
//     );
//   }

//   // === Existing satisfaction logic ===
//   if (updatedCard.previousClick === null) {
//     satisfaction += quality;
//   } else {
//     const delta = quality - updatedCard.previousClick;
//     satisfaction += delta;

//     if (quality === updatedCard.previousClick && quality === 3)
//       satisfaction += 3;
//     else if (quality === 2) satisfaction -= 1;
//     else if (quality === 1) satisfaction -= 2;
//   }

//   updatedCard.previousClick = quality;
//   satisfaction -= stopSecond > 10 ? 10 * 0.1 : stopSecond * 0.1;
//   console.log({ updatedCard, satisfaction });
//   return { updatedCard, satisfaction };
// }

// Helper: safe add-days

export function calculateNextReview(
  card: SR_KanjiCard,
  quality: number, // 0 (again), 1 (hard), 2 (good), 3 (easy)
  satisfaction: number,
  stopSecond: number
): { updatedCard: SR_KanjiCard; satisfaction: number } {
  if (quality < 0 || quality > 3) {
    throw new Error("Quality must be between 0 and 3.");
  }

  const updatedCard = { ...card };
  const currentDate = new Date();
  // const currentDate = new Date("2025-08-16T06:47:29.824Z");

  const sm2Quality = quality;

  // === SM-2 interval & repetition logic ===
  if (quality === 0) {
    // Fail: reset reps, schedule tomorrow
    updatedCard.repetitions = 0;
    updatedCard.interval = 1;
    updatedCard.easeFactor = Math.max(updatedCard.easeFactor - 0.2, 1.3);
  } else {
    if (updatedCard.repetitions === 0) {
      // First time success → tomorrow
      updatedCard.interval = 1;
    } else if (updatedCard.repetitions === 1) {
      // Second review → 2 days
      updatedCard.interval = 2;
    } else {
      // Later → multiply by EF
      updatedCard.interval = Math.round(
        updatedCard.interval * updatedCard.easeFactor
      );
    }

    if (sm2Quality === 3) {
      updatedCard.repetitions += 1;
    }

    // Ease factor update formula
    const ef = updatedCard.easeFactor;
    const newEF =
      ef + (0.1 - (5 - sm2Quality) * (0.08 + (5 - sm2Quality) * 0.02));
    updatedCard.easeFactor = Math.max(newEF, 1.3);
  }

  // Cap the interval to 10 days
  updatedCard.interval = Math.min(updatedCard.interval, 10);

  // Correct date calculation
  const next = new Date(currentDate);
  next.setDate(currentDate.getDate() + updatedCard.interval);
  updatedCard.nextReviewDate = next;

  // === Your existing satisfaction logic ===
  if (updatedCard.previousClick === null) {
    satisfaction += quality;
  } else {
    const delta = quality - updatedCard.previousClick;
    satisfaction += delta;

    if (quality === updatedCard.previousClick && quality === 3) {
      satisfaction += 3;
    } else if (quality === 2) {
      satisfaction -= 1;
    } else if (quality === 1) {
      satisfaction -= 2;
    }
  }

  updatedCard.previousClick = quality;
  satisfaction -= stopSecond > 10 ? 10 * 0.1 : stopSecond * 0.1;

  return { updatedCard, satisfaction };
}

export function calculateDeckNextReview(
  card: SR_DeckCard,
  quality: number, // 0 (again), 1 (hard), 2 (good), 3 (easy)
  satisfaction: number,
  stopSecond: number
): { updatedCard: SR_DeckCard; satisfaction: number } {
  if (quality < 0 || quality > 3) {
    throw new Error("Quality must be between 0 and 3.");
  }

  const updatedCard = { ...card };
  const currentDate = new Date();
  // const currentDate = new Date("2025-08-16T06:47:29.824Z");

  const sm2Quality = quality;

  // === SM-2 interval & repetition logic ===
  if (quality === 0) {
    // Fail: reset reps, schedule tomorrow
    updatedCard.repetitions = 0;
    updatedCard.interval = 1;
    updatedCard.easeFactor = Math.max(updatedCard.easeFactor - 0.2, 1.3);
  } else {
    if (updatedCard.repetitions === 0) {
      // First time success → tomorrow
      updatedCard.interval = 1;
    } else if (updatedCard.repetitions === 1) {
      // Second review → 2 days
      updatedCard.interval = 2;
    } else {
      // Later → multiply by EF
      updatedCard.interval = Math.round(
        updatedCard.interval * updatedCard.easeFactor
      );
    }

    if (sm2Quality === 3) {
      updatedCard.repetitions += 1;
    }

    // Ease factor update formula
    const ef = updatedCard.easeFactor;
    const newEF =
      ef + (0.1 - (5 - sm2Quality) * (0.08 + (5 - sm2Quality) * 0.02));
    updatedCard.easeFactor = Math.max(newEF, 1.3);
  }

  // Cap the interval to 10 days
  updatedCard.interval = Math.min(updatedCard.interval, 10);

  // Correct date calculation
  const next = new Date(currentDate);
  next.setDate(currentDate.getDate() + updatedCard.interval);
  updatedCard.nextReviewDate = next;

  // === Your existing satisfaction logic ===
  if (updatedCard.previousClick === null) {
    satisfaction += quality;
  } else {
    const delta = quality - updatedCard.previousClick;
    satisfaction += delta;

    if (quality === updatedCard.previousClick && quality === 3) {
      satisfaction += 3;
    } else if (quality === 2) {
      satisfaction -= 1;
    } else if (quality === 1) {
      satisfaction -= 2;
    }
  }

  updatedCard.previousClick = quality;
  satisfaction -= stopSecond > 10 ? 10 * 0.1 : stopSecond * 0.1;

  return { updatedCard, satisfaction };
}

// export function calculateDeckNextReview(
//   card: SR_DeckCard,
//   quality: number, // 0 (again), 1 (hard), 2 (good), 3 (easy)
//   satisfaction: number,
//   stopSecond: number
// ): { updatedCard: SR_DeckCard; satisfaction: number } {
//   if (quality < 0 || quality > 3) {
//     throw new Error("Quality must be between 0 and 3.");
//   }

//   console.log({ card });

//   const updatedCard = { ...card };
//   const currentDate = new Date(); // Use a fixed date for testing

//   // ✅ (1) Convert your 0–3 scale to SM-2’s 0–5 scale
//   // SM-2 expects quality 0–5: we'll map 0 → 2, 1 → 3, 2 → 4, 3 → 5
//   const sm2Quality = quality;

//   // ✅ (2) Repetition reset on failure (SM-2)

//   if (sm2Quality === 0) {
//     updatedCard.repetitions = 0;
//     updatedCard.interval = 0;
//     updatedCard.easeFactor = Math.max(updatedCard.easeFactor - 0.2, 1.3);
//     updatedCard.nextReviewDate = new Date(
//       currentDate.getDate() + updatedCard.interval
//     ); // +10 min
//   } else if (sm2Quality === 1) {
//     updatedCard.repetitions =
//       updatedCard.repetitions === 0 ? 0 : updatedCard.repetitions;
//     updatedCard.interval = 1;
//     updatedCard.easeFactor = Math.max(updatedCard.easeFactor - 0.1, 1.3);
//     updatedCard.nextReviewDate = new Date(
//       currentDate.getDate() + updatedCard.interval
//     ); // +24 hours
//   } else if (sm2Quality === 2) {
//     updatedCard.repetitions =
//       updatedCard.repetitions === 0 ? 0 : updatedCard.repetitions;
//     updatedCard.interval = 2;
//     updatedCard.easeFactor = Math.max(updatedCard.easeFactor - 0.05, 1.3);
//     updatedCard.nextReviewDate = new Date(
//       currentDate.getDate() + updatedCard.interval
//     ); // +2 days
//   } else {
//     // ✅ (3) Interval logic aligned with SM-2
//     if (updatedCard.repetitions === 0) {
//       updatedCard.interval = 1;
//       // } else if (updatedCard.repetitions === 1) {
//       //   updatedCard.interval = 3;
//       // } else {
//     } else {
//       updatedCard.interval = Math.round(
//         updatedCard.interval * updatedCard.easeFactor
//       );
//     }

//     // ✅ (4) Repetitions only increment on success (SM-2)
//     updatedCard.repetitions += 1;

//     // ✅ (5) SM-2 formula for updating easeFactor
//     const ef = updatedCard.easeFactor;
//     const newEF =
//       ef + (0.1 - (5 - sm2Quality) * (0.08 + (5 - sm2Quality) * 0.02));
//     updatedCard.easeFactor = Math.max(newEF, 1.3);

//     // ✅ Interval cap to avoid excessive scheduling delay
//     updatedCard.interval = Math.min(updatedCard.interval, 10);

//     // ✅ Set next review date based on interval
//     updatedCard.nextReviewDate = new Date();
//     updatedCard.nextReviewDate.setDate(
//       currentDate.getDate() + updatedCard.interval
//     );
//   }

//   // === Existing satisfaction logic ===
//   if (updatedCard.previousClick === null) {
//     satisfaction += quality;
//   } else {
//     const delta = quality - updatedCard.previousClick;
//     satisfaction += delta;

//     if (quality === updatedCard.previousClick && quality === 3)
//       satisfaction += 3;
//     else if (quality === 2) satisfaction -= 1;
//     else if (quality === 1) satisfaction -= 2;
//   }

//   updatedCard.previousClick = quality;
//   satisfaction -= stopSecond > 10 ? 10 * 0.1 : stopSecond * 0.1;
//   console.log({ updatedCard, satisfaction });
//   return { updatedCard, satisfaction };
// }

/* Speech Function (Browswer api) */
export const speakJapaneseText = (text: string) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    speechSynthesis.speak(utterance);
  } else {
    alert("Your browser does not support speech synthesis.");
  }
};

export function removeDots(str: string) {
  return str.replace(/\./g, ""); // Replace all dots with an empty string
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

type ReviewData = {
  kanji_count: number;
  jukugo_count: number;
  deck?: { card_count?: number }[];
};

/**
 * Returns the total number of reviews (kanji + jukugo) scheduled for today.
 */
export function getTodayReviewCount(reviewMap: Map<string, ReviewData>): {
  today_count: number;
  expired_count: number;
} {
  const today = format(new Date(), "yyyy-MM-dd");
  let todayCount = 0;
  let expiredCount = 0;

  console.log({ reviewMap });

  for (const [date, data] of reviewMap.entries()) {
    if (date === today) {
      const kanjiCount = data.kanji_count || 0;
      const jukugoCount = data.jukugo_count || 0;
      const deckCount =
        data.deck?.reduce((sum, deck) => sum + (deck.card_count || 0), 0) || 0;
      todayCount = kanjiCount + jukugoCount + deckCount;
    } else if (isBefore(parseISO(date), parseISO(today))) {
      const deckCount =
        data.deck?.reduce((sum, deck) => sum + (deck.card_count || 0), 0) || 0;
      expiredCount += deckCount;
    }
  }
  console.log({ todayCount, expiredCount });
  return { today_count: todayCount, expired_count: expiredCount };
}

export const getConfidenceEmoji = (confidence: number) => {
  if (confidence <= -10) return "dizzy.png";
  if (confidence < 0) return "crying.png";
  if (confidence === 0) return "annoyed.png";
  if (confidence <= 4) return "notbad.png";
  if (confidence <= 9) return "good.png";
  if (confidence <= 14) return "grin.png";
  if (confidence <= 19) return "happy.png";
  if (confidence <= 24) return "cheerful.png";
  return "star.png";
};

export const getBackgroundImage = (index: number) => {
  return `/assets/bg/bg-${(index % 3) + 1}.png`;
};
