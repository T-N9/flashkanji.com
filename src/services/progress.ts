import {
  addXpPoints,
  applyExpiryPenalty,
  fetchChapterProgress,
  removeHeart,
  restoreHeart,
  restoreOrBuyHeart,
  saveEndSection,
  saveInitChapter,
  saveStreak,
  saveTimer,
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
      xp_points,
      isToDecrease,
    }: {
      user_id: string;
      level: number;
      chapter: number;
      phase: number;
      stepIndex: number;
      xp_points?: number;
      isToDecrease?: boolean;
    }) =>
      saveEndSection(
        user_id,
        level,
        chapter,
        phase,
        stepIndex,
        xp_points,
        isToDecrease
      ),
  });
};

export const useSaveInitChapter = () => {
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

export const useSaveStreak = () => {
  return useMutation({
    mutationFn: ({
      user_id,
      xp_points,
    }: {
      user_id: string;
      xp_points?: number;
    }) => saveStreak(user_id, xp_points),
  });
};

export const useApplyExpiryPenalty = () => {
  return useMutation({
    mutationFn: ({ user_id, point }: { user_id: string; point: number }) =>
      applyExpiryPenalty(user_id, point),
  });
};

export const useRemoveHeart = () => {
  return useMutation({
    mutationFn: ({ user_id }: { user_id: string }) => removeHeart(user_id),
  });
};

export const useRestoreHeart = () => {
  return useMutation({
    mutationFn: ({ user_id }: { user_id: string }) => restoreHeart(user_id),
  });
};

export const useRestoreOrBuyHeart = () => {
  return useMutation({
    mutationFn: ({
      user_id,
      mode,
    }: {
      user_id: string;
      mode: "free" | "buy";
    }) => restoreOrBuyHeart(user_id, mode),
  });
};

export const useAddXpPoints = () => {
  return useMutation({
    mutationFn: ({ user_id, point }: { user_id: string; point: number }) =>
      addXpPoints(user_id, point),
  });
};

export const useSaveTimer = () => {
  return useMutation({
    mutationFn: ({
      user_id,
      duration_minutes,
    }: {
      user_id: string;
      duration_minutes?: number;
    }) => saveTimer(user_id, duration_minutes || 25),
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
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!user_id && !!level && !!chapter,
  });
};
