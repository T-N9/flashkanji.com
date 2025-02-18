export const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/// SM-2 Algorithm with 4 Difficulty Levels
export type SR_Flashcard = {
  id: number;
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  easeFactor: number; // Ease factor (default: 2.5)
  nextReviewDate: Date; // Calculated next review date
};

export type Clicked_Item = {
  id: number;
  clickedLevel: number;
};

// // Function to calculate the next interval
// export function calculateNextReview(
//   card: SR_Flashcard,
//   quality: number // User rating (0-3)
// ): SR_Flashcard {

//   console.log({card})
//   if (quality < 0 || quality > 3) {
//     throw new Error("Quality must be between 0 and 3.");
//   }

//   const updatedCard = { ...card };

//   if (quality === 0) { // Insane (reset progress)
//     updatedCard.repetitions = 0;
//     updatedCard.interval = 1;
//   } else {
//     updatedCard.repetitions += 1;

//     if (updatedCard.repetitions === 1) {
//       updatedCard.interval = 1; // First review
//     } else if (updatedCard.repetitions === 2) {
//       updatedCard.interval = 5; // Second review
//     } else {
//       // Adjust interval based on ease factor
//       updatedCard.interval = Math.round(updatedCard.interval * updatedCard.easeFactor);
//     }

//     // Adjust Ease Factor
//     const easeAdjustments = [
//       -0.2, // Hard
//       -0.1, // Medium
//       0.1  // Easy
//     ];

//     updatedCard.easeFactor += easeAdjustments[quality - 1] || 0;
//     updatedCard.easeFactor = Math.max(updatedCard.easeFactor, 1.3); // Minimum ease factor
//   }

//   // Calculate the next review date
//   const currentDate = new Date();
//   updatedCard.nextReviewDate = new Date(
//     currentDate.setDate(currentDate.getDate() + updatedCard.interval)
//   );

//   console.log({ updatedCard });
//   return updatedCard;
// }

export function calculateNextReview(
  card: SR_Flashcard,
  quality: number // User rating (0-3)
): SR_Flashcard {
  console.log({ card });

  if (quality < 0 || quality > 3) {
    throw new Error("Quality must be between 0 and 3.");
  }

  const updatedCard = { ...card };
  const currentDate = new Date();

  // **INSANE (Reset Progress)**
  if (quality === 0) {
    updatedCard.repetitions = 0;
    updatedCard.interval = 1; // Immediate re-review
    updatedCard.easeFactor = Math.max(updatedCard.easeFactor - 0.2, 1.3); // Reduce EF
    updatedCard.nextReviewDate = new Date(
      currentDate.getTime() + 10 * 60 * 1000
    ); // +10 min
    return updatedCard;
  }
  if (quality === 3 && updatedCard.repetitions === 0) {
    updatedCard.interval = 2;
  }
  // Increase repetition count
  updatedCard.repetitions += 1;

  // **Calculate interval for review**
  // if (updatedCard.repetitions === 1) {
  //   updatedCard.interval = 1; // First review → 1 day
  // } else {

  const easeMultiplier = [1.3, 1.8, 2.5]; // Hard, Medium, Easy multipliers
  const multiplier = easeMultiplier[quality - 1] || 1.3; // Default to "Hard" multiplier
  updatedCard.interval = Math.round(updatedCard.interval * multiplier);
  // }

  // **Adjust Ease Factor (EF)**
  const easeAdjustments = [-0.2, -0.1, 0.1]; // Hard, Medium, Easy
  updatedCard.easeFactor += easeAdjustments[quality - 1] || 0;
  updatedCard.easeFactor = Math.max(updatedCard.easeFactor, 1.3); // Min EF

  // **Set next review date**
  updatedCard.nextReviewDate = new Date();
  updatedCard.nextReviewDate.setDate(
    currentDate.getDate() + updatedCard.interval
  );

  console.log({ updatedCard });
  return updatedCard;
}

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

export function removeDots(str : string) {
  return str.replace(/\./g, ""); // Replace all dots with an empty string
}
