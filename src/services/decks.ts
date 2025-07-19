import { useQuery } from "react-query";
import { fetchDecks, DecksResponse } from "@/api/decksRoute";

type UseDecksParams = {
  search?: string;
  category?: string;
  level?: number;
  page?: number;
  limit?: number;
};

export const useDecks = ({
  search,
  category,
  level,
  page = 1,
  limit = 6,
}: UseDecksParams) => {
  const enabled = Boolean(search || category || level || page === 1); // always true on first load

  return useQuery<DecksResponse>({
    queryKey: ["decks", { search, category, level, page, limit }],
    queryFn: () =>
      fetchDecks({
        search: search || undefined,
        category: category || undefined,
        level,
        page,
        limit,
      }),
    enabled,
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000,
  });
};
