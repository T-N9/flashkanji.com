import { fetchKanjiQuiz } from "@/api/quizRoute";
import { useQuery } from "react-query";

export const useKanjiQuiz = (chapter: number | null, level: number | null, mode : number | null) => {
  return useQuery({
    queryKey: ["kanjiQuiz", chapter, level, mode],
    queryFn: () => fetchKanjiQuiz(chapter!, level!, mode!),
    enabled: !!chapter && !!level && !!mode, 
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000, 
    placeholderData: [],
  });
};