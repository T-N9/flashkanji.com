import {
  fetchKanjiByChapterAndLevel,
  fetchKanjiDetail,
  fetchRandomKanji,
} from "@/api/kanjiRoute";
import { useQuery } from "react-query";

export const useRandomKanji = (random: number) => {
  return useQuery({
    queryKey: ["randomKanji", random],
    queryFn: () => fetchRandomKanji(random),
    staleTime: 5 * 60 * 1000, // 5 minutes before data is stale
    cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};

export const useKanjiDetail = (kanji: string) => {
  return useQuery({
    queryKey: ["kanjiDetail", kanji],
    queryFn: () => (kanji ? fetchKanjiDetail(kanji) : Promise.resolve(null)),
    enabled: !!kanji,
  });
};

export const useKanjiByChapterAndLevel = (chapter: number | null, level: number | null) => {
  return useQuery({
    queryKey: ["kanjiByChapterAndLevel", chapter, level],
    queryFn: () => fetchKanjiByChapterAndLevel(chapter!, level!),
    enabled: !!chapter && !!level, // Only run the query if both chapter and level are provided
    staleTime: 5 * 60 * 1000, // 5 minutes before data is stale
    cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
    placeholderData: [], // Optional: provide initial data
  });
};
