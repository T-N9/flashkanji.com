import { apiClient } from "./client";
import { Kanji } from "../types/kanji";

export const fetchRandomKanji = async (random: number): Promise<Kanji[]> => {
  const response = await apiClient.get("/kanji", { params: { random } });
  return response.data;
};
