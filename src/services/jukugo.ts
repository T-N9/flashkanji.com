import { fetchRelatedJukugo } from "@/api/jukugoRoute";
import { useQuery } from "react-query";

export const useRelatedJukugo = (kanjis : string) => {
    return useQuery({
        queryKey: ["relatedJukugo", kanjis],
        queryFn: () => fetchRelatedJukugo(kanjis),
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000, 
      });
}