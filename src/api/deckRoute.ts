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

export type DeckDetailResponse = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  totalCards: number;
  learnedCards: number;
  is_public: boolean;
  level: number;
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

export const fetchDeckDetail = async (
  deck_id: number,
  user_id: string,
): Promise<DeckDetailResponse> => {
  const response = await apiClient.get(`/deck/${deck_id}`, {
    params: {
      userId: user_id,
    },
  });
  return response.data;
};
