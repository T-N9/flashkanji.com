import {
  fetchChapterProgress,
  saveEndSection,
  saveInitChapter,
} from "@/api/progressRoute";
import { useMutation, useQuery } from "react-query";

export const useSaveEndSection = () => {
  return useMutation({
    mutationFn: ({
      user_id,
      level,
      chapter,
      phase,
      stepIndex,
    }: {
      user_id: string;
      level: number;
      chapter: number;
      phase: number;
      stepIndex: number;
    }) => saveEndSection(user_id, level, chapter, phase, stepIndex),
  });
};

export const useSaveInitChapter =  () => {
  return useMutation({
    mutationFn: ({
      user_id,
      level,
      chapter,
    }: {
      user_id: string;
      level: number;
      chapter: number;
    }) => saveInitChapter(user_id, level, chapter),
  });
};

export const useFetchChapterProgress = (
  user_id: string,
  level: number,
  chapter: number
) => {
  return useQuery({
    queryKey: ["chapterProgress", user_id, level, chapter],
    queryFn: () => fetchChapterProgress(user_id, level, chapter),
    enabled: !!user_id && !!level && !!chapter,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
