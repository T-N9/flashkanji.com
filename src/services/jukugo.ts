import { fetchJukugoByChapterAndLevel, fetchRelatedJukugo } from "@/api/jukugoRoute";
import { useQuery } from "react-query";

export const useRelatedJukugo = (kanjis: string) => {
  return useQuery({
    queryKey: ["relatedJukugo", kanjis],
    queryFn: () => fetchRelatedJukugo(kanjis),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export const useJukugoByChapterAndLevel = (chapter: number | null, level: number | null) => {
  return useQuery({
    queryKey: ["jukugoByChapterAndLevel", chapter, level],
    queryFn: () => fetchJukugoByChapterAndLevel(chapter!, level!),
    enabled: !!chapter && !!level, 
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000, 
    placeholderData: [],
  });
};
