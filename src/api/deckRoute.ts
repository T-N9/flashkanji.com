import { apiClient } from "./client";

export type DeckCard = {
  id: number;
  created_at: string;
  hiragana: string;
  meaning: string;
  character: string;
  deck_id: number;
};

export type DeckCardsResponse = {
  cards: DeckCard[];
};

export const fetchDeckCards = async (
  deck_id: number,
  user_id: string,
  count: number = 20
): Promise<DeckCardsResponse> => {
  const response = await apiClient.get(`/deck/${deck_id}/cards`, {
    params: {
      count,
      userId: user_id,
    },
  });
  return response.data;
};
