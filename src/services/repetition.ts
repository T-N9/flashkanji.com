import {
  fetchKanjiRepetitionData_ByDate,
  fetchReviewCalendarData,
  saveRepetitionData,
  saveRepetitionData_Review,
} from "@/api/repetitionRoute";
import { SR_KanjiCard } from "@/util";
import { useMutation, useQuery } from "react-query";

export const useKanjiRepetitionData_ByDate = (
  date: string,
  user_id: string,
  type: number,
  level?: string
) => {
  return useQuery({
    queryKey: ["kanjiRepetitionData_byDate", date, user_id, type],
    queryFn: () =>
      fetchKanjiRepetitionData_ByDate(
        date!,
        user_id!,
        type!,
        level && level.toLowerCase()
      ),
    enabled: !!date && !!user_id && !!type,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    placeholderData: {
      cardData: [],
      repetitionData: [],
    },
  });
};

export const useSaveRepetitionData = () => {
  return useMutation({
    mutationFn: ({
      user_id,
      repetitionData,
      type,
      level,
    }: {
      user_id: string;
      repetitionData: SR_KanjiCard[];
      type: number;
      level?: number;
    }) => saveRepetitionData(user_id, repetitionData, type, level),
  });
};

export const useFetchReviewCalendarData = (user_id: string) => {
  return useQuery({
    queryKey: ["reviewCalendarData", user_id],
    queryFn: () => fetchReviewCalendarData(user_id),
    enabled: !!user_id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    placeholderData: [],
  });
};

export const useSaveRepetitionData_Review = () => {
  return useMutation({
    mutationFn: ({
      user_id,
      repetitionData,
      type,
    }: {
      user_id: string;
      repetitionData: SR_KanjiCard[];
      type: number;
    }) => saveRepetitionData_Review(user_id, repetitionData, type),
  });
};
