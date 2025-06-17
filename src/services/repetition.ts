import {
  fetchKanjiRepetitionData_ByDate,
  saveKanjiRepetitionData,
  saveKanjiRepetitionData_Review,
} from "@/api/repetitionRoute";
import { SR_KanjiCard } from "@/util";
import { useMutation, useQuery } from "react-query";

export const useKanjiRepetitionData_ByDate = (
  date: string,
  user_id: string,
  level?: string
) => {
  return useQuery({
    queryKey: ["kanjiRepetitionData_byDate", date, user_id],
    queryFn: () =>
      fetchKanjiRepetitionData_ByDate(
        date!,
        user_id!,
        level && level.toLowerCase()
      ),
    enabled: !!date && !!user_id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    placeholderData: {
      kanjiData: [],
      repetitionData: [],
    },
  });
};

export const useSaveKanjiRepetitionData = () => {
  return useMutation({
    mutationFn: ({
      user_id,
      repetitionData,
      level,
    }: {
      user_id: string;
      repetitionData: SR_KanjiCard[];
      level?: number;
    }) => saveKanjiRepetitionData(user_id, repetitionData, level),
  });
};

export const useSaveKanjiRepetitionData_Review = () => {
  return useMutation({
    mutationFn: ({
      user_id,
      repetitionData,
    }: {
      user_id: string;
      repetitionData: SR_KanjiCard[];
    }) => saveKanjiRepetitionData_Review(user_id, repetitionData),
  });
};
