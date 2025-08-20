import {
  fetchKanjiByChapterAndLevel,
  fetchKanjiByMultipleChapters,
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

export const useKanjiByChapterAndLevel = (
  chapter: number | null,
  level: number | null,
  part?: "0" | "1" | null
) => {
  return useQuery({
    queryKey: ["kanjiByChapterAndLevel", chapter, level, part],
    queryFn: () => fetchKanjiByChapterAndLevel(chapter!, level!, part!),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!chapter && !!level,
    placeholderData: [],
  });
};

export const useKanjiByMultipleChapters = (
  chapters: string | null,
  level: number | null
) => {
  return useQuery({
    queryKey: ["kanjiByMultipleChapters", chapters, level],
    queryFn: () => fetchKanjiByMultipleChapters(chapters!, level!),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!chapters && !!level,
    placeholderData: [],
  });
};
