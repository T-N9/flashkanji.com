import { fetchRandomKanji } from "@/api/kanjiRoute";
import { useQuery } from "react-query";

export const useRandomKanji = (random: number) => {
    return useQuery({
      queryKey: ["randomKanji", random],
      queryFn: () => fetchRandomKanji(random),
      staleTime: 5 * 60 * 1000, // 5 minutes before data is stale
      cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
    });
  };