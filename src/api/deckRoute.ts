import { SR_DeckCard } from "@/util";
import { apiClient } from "./client";

export type DeckCard = {
  id: number;
  created_at: string;
  hiragana: string;
  meaning: string;
  character: string;
  deck_id: number;
  card_id ?: number;
};

export type DeckCardsResponse = {
  cards: DeckCard[];
};

export type DeckSrsSession = {
  id: number;
  created_at: string;
  deck_id: number;
  user_id: string;
  card_count: number;
};

export type DeckSrsSessionResponse = {
  sessions: DeckSrsSession[];
};

export type DeckSrsSessionDetailResponse = {
  cardData: DeckCard[];
  repetitionData: SR_DeckCard[];
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
  user_id: string
): Promise<DeckDetailResponse> => {
  const response = await apiClient.get(`/deck/${deck_id}`, {
    params: {
      userId: user_id,
    },
  });
  return response.data;
};

export const saveDeckRepetitionData = async (
  user_id: string,
  deck_id: number,
  repetitionData: SR_DeckCard[]
): Promise<void> => {
  await apiClient.post(`/deck/srs`, {
    userId: user_id,
    deckId: deck_id,
    srsData: repetitionData,
  });
  console.log("POST request sent");
};

export const saveDeckRepetitionData_Review = async (
  user_id: string,
  deck_id: number,
  repetitionData: SR_DeckCard[]
): Promise<void> => {
  await apiClient.post(`/deck/srs_review`, {
    userId: user_id,
    deckId: deck_id,
    srsData: repetitionData,
  });
  console.log("POST request sent");
};

export const fetchDeckSrsSessions = async (
  deck_id: number,
  user_id: string
): Promise<DeckSrsSessionResponse> => {
  const response = await apiClient.get(`/deck/${deck_id}/srs/sessions`, {
    params: {
      userId: user_id,
    },
  });
  return response.data;
};

export const fetchDeckSrsSessionDetail = async (
  deck_id: number,
  user_id: string,
  srs_id: number,
  isReview: boolean,
  date?: string
): Promise<DeckSrsSessionDetailResponse> => {
  const response = await apiClient.get(
    `/deck/${deck_id}/srs/sessions/${srs_id}?isReview=${isReview}`,
    {
      params: {
        userId: user_id,
        date: date,
      },
    }
  );
  return response.data;
};
