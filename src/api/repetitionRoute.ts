import { apiClient } from "./client";
import { SR_KanjiCard } from "@/util";

export type KanjiRepetitionData = {
  cardData: any;
  repetitionData: SR_KanjiCard[];
};

export const fetchKanjiRepetitionData_ByDate = async (
  date: string,
  user_id: string,
  type: number,
  level?: string
): Promise<KanjiRepetitionData> => {
  const response = await apiClient.get("/repetition/fetch", {
    params: { date, level, user_id, type },
  });

  return {
    cardData: response.data.cardData,
    repetitionData: response.data.repetitionData.map((item: any) => ({
      id: item.id,
      interval: item.interval,
      repetitions: item.repetitions,
      easeFactor: item.ease_factor,
      nextReviewDate: new Date(item.next_review_date),
      previousClick: item.previous_click,
      level: item.level,
    })),
  };
};

export const fetchReviewCalendarData = async (
  user_id: string
): Promise<
  {
    date: string;
    kanji_count: number;
    jukugo_count: number;
    deck: { id: number; name: string; card_count: number, srs_id : number }[];
  }[]
> => {
  const response = await apiClient.get("/repetition/calendar", {
    params: { user_id },
  });
  return response.data;
};

export const saveRepetitionData = async (
  user_id: string,
  repetitionData: SR_KanjiCard[],
  type: number,
  level?: number
): Promise<void> => {
  // console.log("Attempting to send POST to /repetition/save", {
  //   user_id,
  //   repetitionData,
  //   level,
  // });
  await apiClient.post("/repetition/save", {
    user_id,
    repetitionData,
    level,
    type,
  });
  console.log("POST request sent");
};

export const saveRepetitionData_Review = async (
  user_id: string,
  repetitionData: SR_KanjiCard[],
  type: number
): Promise<void> => {
  await apiClient.post("/repetition/save_review", {
    user_id,
    repetitionData,
    type,
  });
  console.log("POST request sent");
};
