import { relatedJukugoItem } from "@/types/jukugo";
import { apiClient } from "./client";

export const fetchRelatedJukugo = async (
  kanjis: string
): Promise<relatedJukugoItem[]> => {
  const response = await apiClient.get("/jukugo", { params: { kanjis } });
  return response.data;
};

export const fetchJukugoByChapterAndLevel = async (
  chapter: number,
  level: number,
  part ?: "0" | "1" | null
): Promise<relatedJukugoItem[]> => {
  const response = await apiClient.get("/jukugo", {
    params: { chapter, level, part },
  });
  return response.data;
};