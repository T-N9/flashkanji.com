import { fetchKanjiQuiz } from "@/api/quizRoute";
import { useQuery } from "react-query";

export const useKanjiQuiz = (
  chapter: number | null,
  level: number | null,
  mode: number | null,
  part?: "0" | "1" | null
) => {
  return useQuery({
    queryKey: ["kanjiQuiz", chapter, level, mode, part],
    queryFn: () => fetchKanjiQuiz(chapter!, level!, mode!, part!),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!chapter && !!level && !!mode,
    placeholderData: [],
  });
};
