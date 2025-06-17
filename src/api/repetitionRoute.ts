import { Kanji } from "@/types/kanji";
import { apiClient } from "./client";
import { SR_KanjiCard } from "@/util";

export type KanjiRepetitionData = {
  kanjiData: Kanji[];
  repetitionData: SR_KanjiCard[];
};

export const fetchKanjiRepetitionData_ByDate = async (
  date: string,
  user_id: string,
  level?: string
): Promise<KanjiRepetitionData> => {
  const response = await apiClient.get("/repetition/fetch", {
    params: { date, level, user_id },
  });

  return {
    kanjiData: response.data.kanjiData,
    repetitionData: response.data.repetitionData.map((item: any) => ({
      id: item.id,
      interval: item.interval,
      repetitions: item.repetitions,
      easeFactor: item.ease_factor,
      nextReviewDate: new Date(item.next_review_date),
      previousClick: item.previous_click,
      level: item.level                                                          
    })),
  };
};

export const saveKanjiRepetitionData = async (
  user_id: string,
  repetitionData: SR_KanjiCard[],
  level?: number
): Promise<void> => {
  console.log("Attempting to send POST to /repetition/save", {
    user_id,
    repetitionData,
    level,
  });
  await apiClient.post("/repetition/save", {
    user_id,
    repetitionData,
    level,
  });
  console.log("POST request sent");
};

export const saveKanjiRepetitionData_Review = async (
  user_id: string,
  repetitionData: SR_KanjiCard[]
): Promise<void> => {
  await apiClient.post("/repetition/save_review", {
    user_id,
    repetitionData
  });
  console.log("POST request sent");
}
