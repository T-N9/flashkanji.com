import { KanjiQuizItem } from "@/types/quiz";
import { apiClient } from "./client";

export const fetchKanjiQuiz = async (
  chapter: number,
  level: number,
  mode : number,
): Promise<KanjiQuizItem[]> => {
  const response = await apiClient.get("/quiz", {
    params: { chapter, level, mode },
  });
  return response.data;
};