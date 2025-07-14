import { useQuery } from "react-query";
import { DeckCardsResponse, fetchDeckCards, fetchDeckDetail } from "@/api/deckRoute"; // adjust the path as neede

export const useDeckCards = (
  deck_id: number,
  user_id: string,
  count: number = 20
) => {
  return useQuery<DeckCardsResponse>({
    queryKey: ["deckCards", deck_id, user_id, count],
    queryFn: () => fetchDeckCards(deck_id, user_id, count),
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000,
    enabled: !!deck_id && !!user_id, 
  });
};

export const useDeckDetail = (deck_id: number, user_id: string) => {
  return useQuery({
    queryKey: ["deckDetail", deck_id, user_id],
    queryFn: () => fetchDeckDetail(deck_id, user_id),
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000,
    enabled: !!deck_id && !!user_id, 
  });
}