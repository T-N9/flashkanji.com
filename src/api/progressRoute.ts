import { apiClient } from "./client";

export const saveEndSection = async (
  user_id: string,
  level: number,
  chapter: number,
  phase: number,
  stepIndex: number,
  xp_points?: number,
  isToDecrease?: boolean
): Promise<void> => {
  await apiClient.post("/progress/", {
    user_id,
    level,
    chapter,
    phase,
    stepIndex,
    xp_points,
    isToDecrease,
  });
  console.log("POST request sent");
};

export const saveInitChapter = async (
  user_id: string,
  level: number,
  chapter: number
): Promise<void> => {
  await apiClient.post("/progress/init", {
    user_id,
    level,
    chapter,
  });
  console.log("POST request sent");
};

export const saveStreak = async (user_id: string, xp_points?: number): Promise<void> => {
  await apiClient.post("/progress/streak", {
    user_id,
    reviewed_today: true,
    xp_points
  });
  console.log("POST request sent");
};

export const removeHeart = async (
  user_id: string
): Promise<{
  lives: number;
  next_restore_time: string;
}> => {
  const response = await apiClient.post("/progress/remove-heart", {
    user_id,
  });
  console.log("POST request sent");

  return response.data;
};

export const restoreHeart = async (
  user_id: string
): Promise<{
  lives: number;
  next_restore_time: string;
  restored_lives: number;
}> => {
  const response = await apiClient.post("/progress/restore-heart", {
    user_id,
  });
  console.log("POST request sent");

  return response.data;
};

export const saveTimer = async (
  user_id: string,
  duration_minutes?: number
): Promise<void> => {
  await apiClient.post("/progress/time", {
    user_id,
    duration_minutes,
  });
  console.log("POST request sent");
};

export const applyExpiryPenalty = async (
  user_id: string,
  point: number
): Promise<{
  message: string;
  isApplied: boolean;
}> => {
  const response = await apiClient.post("/progress/update-xp", {
    user_id,
    point,
    isExpiryPenalty: true,
    isToDecrease: true,
  });
  console.log("Penalty applied.");
  return response.data;
};

export const addXpPoints = async (
  user_id: string,
  point: number
): Promise<{
  message: string;
}> => {
  const response = await apiClient.post("/progress/update-xp", {
    user_id,
    point,
    isToDecrease: false,
  });
  console.log("Point added");
  return response.data;
};

export const fetchChapterProgress = async (
  user_id: string,
  level: number,
  chapter: number
): Promise<any> => {
  const response = await apiClient.get(
    `/progress/${user_id}/${level}/${chapter}`,
    {
      params: { user_id, level, chapter },
    }
  );

  return response.data;
};
