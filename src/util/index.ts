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
  level : number | null
};

export type Clicked_Item = {
  id: number;
  clickedLevel: number;
};

export function calculateNextReview(
  card: SR_KanjiCard,
  quality: number, // User rating (0-3)
  satisfaction: number,
  stopSecond : number,
): { updatedCard: SR_KanjiCard; satisfaction: number } {
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

 
    if(updatedCard.previousClick !== null) {
      if (updatedCard.previousClick !== quality) {
        const changePoint = quality - updatedCard.previousClick;
        satisfaction = satisfaction + changePoint;
      } else {
        satisfaction = satisfaction - 3;
      }      
    }
   
    updatedCard.previousClick = quality;

    satisfaction = satisfaction - (stopSecond > 10 ? 10 * 0.1 :  stopSecond * 0.1);

    return { updatedCard, satisfaction };
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

  if (updatedCard.previousClick === null) {
    satisfaction = satisfaction + quality;
    console.log("Satisfaction is directly added:" + quality);
  } else {
    const changePoint = quality - updatedCard.previousClick;
    if (updatedCard.previousClick !== quality) {
      satisfaction = satisfaction + changePoint;
      console.log("Comparing to prev " + quality, changePoint, satisfaction);
    }

    if(updatedCard.previousClick === quality && quality === 3) {
      satisfaction = satisfaction + 3;
    } else{
      if(updatedCard.previousClick === quality && quality === 2) {
        satisfaction = satisfaction - 1;
      }

      if(updatedCard.previousClick === quality && quality === 1) {
        satisfaction = satisfaction - 2;
      }
    }
  }

  updatedCard.previousClick = quality;
  satisfaction = satisfaction - (stopSecond > 10 ? 10 * 0.1 :  stopSecond * 0.1);
  console.log({ updatedCard });
  return { updatedCard, satisfaction };
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

export function removeDots(str: string) {
  return str.replace(/\./g, ""); // Replace all dots with an empty string
}
