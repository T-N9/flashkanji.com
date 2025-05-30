import { apiClient } from "./client";
import { Kanji } from "../types/kanji";
import axios from "axios";

export const fetchRandomKanji = async (random: number): Promise<Kanji[]> => {
  const response = await apiClient.get("/kanji", { params: { random } });
  return response.data;
};

export const fetchKanjiByChapterAndLevel = async (
  chapter: number,
  level: number,
  part ?: "0" | "1" | null 
): Promise<Kanji[]> => {
  const response = await apiClient.get("/kanji", {
    params: { chapter, level, part },
  });
  return response.data;
};

export const fetchKanjiByMultipleChapters = async (
  chapters: string,
  level: number
): Promise<Kanji[]> => {
  const response = await apiClient.get("/kanji", {
    params: { chapters, level },
  });
  return response.data;
}

/* From KanjiAPI backend */
export const fetchKanjiDetail = async (char: string) => {
  if (!char) throw new Error("Kanji character is required");
  const response = await axios.get(`https://kanjiapi.dev/v1/kanji/${char}`);
  return response.data;
};
