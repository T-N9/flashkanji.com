import { apiClient } from "./client";

export const saveEndSection = async (
  user_id: string,
  level: number,
  chapter: number,
  phase: number,
  stepIndex: number
): Promise<void> => {
  await apiClient.post("/progress/", {
    user_id,
    level,
    chapter,
    phase,
    stepIndex,
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

export const saveStreak = async (user_id: string): Promise<void> => {
  await apiClient.post("/progress/streak", {
    user_id,
  });
  console.log("POST request sent");
};

export const saveTimer = async (
  user_id: string,
  duration_minutes ?: number
): Promise<void> => {
  await apiClient.post("/progress/time", {
    user_id,
    duration_minutes,
  });
  console.log("POST request sent");
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
