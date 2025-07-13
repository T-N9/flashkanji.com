import { apiClient } from "./client";

export type Deck = {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  description: string;
  level: number;
  is_public: boolean;
  categories: string[];
};

export type DecksResponse = {
  page: number;
  limit: number;
  total: number;
  decks: Deck[];
};

export const fetchDecks = async (
  params: {
    category?: string;
    level?: number;
    search?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<DecksResponse> => {
  const response = await apiClient.get("/decks", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 6,
      ...params,
    },
  });

  return response.data;
};
