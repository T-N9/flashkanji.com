import { KanjiQuizItem } from "@/types/quiz";
import { apiClient } from "./client";

export const fetchKanjiQuiz = async (
  chapter: number,
  level: number,
  mode: number,
  part?: "0" | "1" | null
): Promise<KanjiQuizItem[]> => {
  const response = await apiClient.get("/quiz", {
    params: { chapter, level, mode, part },
  });
  return response.data;
};
