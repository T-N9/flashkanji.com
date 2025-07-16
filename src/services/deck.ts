import { useMutation, useQuery } from "react-query";
import {
  DeckCardsResponse,
  DeckSrsSessionResponse,
  fetchDeckCards,
  fetchDeckDetail,
  fetchDeckSrsSessionDetail,
  fetchDeckSrsSessions,
  saveDeckRepetitionData,
  saveDeckRepetitionData_Review,
} from "@/api/deckRoute"; // adjust the path as neede
import { SR_DeckCard } from "@/util";

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

export const useDeckSrsSessions = (deck_id: number, user_id: string) => {
  return useQuery<DeckSrsSessionResponse>({
    queryKey: ["deckSrsSession", deck_id, user_id],
    queryFn: () => fetchDeckSrsSessions(deck_id, user_id),
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
};

export const useDeckSrsSessionDetail = (
  deck_id: number,
  user_id: string,
  srs_id: number,
  is_Review: boolean,
  date ?: string
) => {
  return useQuery({
    queryKey: ["deckSrsSessionDetail", deck_id, user_id, srs_id, is_Review, date],
    queryFn: () =>
      fetchDeckSrsSessionDetail(deck_id, user_id, srs_id, is_Review, date),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!deck_id && !!user_id && !!srs_id,
  });
};

export const useSaveDeckRepetitionData = () => {
  return useMutation({
    mutationFn: ({
      user_id,
      deck_id,
      repetitionData,
    }: {
      user_id: string;
      deck_id: number;
      repetitionData: SR_DeckCard[];
    }) => saveDeckRepetitionData(user_id, deck_id, repetitionData),
  });
};

export const useSaveDeckRepetitionDataReview = () => {
  return useMutation({
    mutationFn: ({
      user_id,
      deck_id,
      repetitionData,
    }: {
      user_id: string;
      deck_id: number;
      repetitionData: SR_DeckCard[];
    }) => saveDeckRepetitionData_Review(user_id, deck_id, repetitionData),
  });
};
