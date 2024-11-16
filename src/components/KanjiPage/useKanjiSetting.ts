import useFlashGroundState from "@/store/kanjiGroundState";
import { useRouter, useSearchParams } from "next/navigation";

export const useKanjiSetting = () => {
  const n5NoChapters = Array.from({ length: 11 }, (_, index) => index + 1);
  const n4NoChapters = Array.from({ length: 20 }, (_, index) => index + 1);
  const n3NoChapters = Array.from({ length: 42 }, (_, index) => index + 1);

  const { noChapters, setNoChapters, setSelectedMultiChapters } =
    useFlashGroundState();

  const searchParams = useSearchParams();
  const router = useRouter();
  // Extracting queries
  const chapter = searchParams.get("chapter");
  const level = searchParams.get("level");

  const updateQueryParams = (key: string, value: string) => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    currentParams.set(key, value);

    if (key === "level") {
      currentParams.set("chapter", "1");
    }
    router.push(`?${currentParams.toString()}`);
  };

  return {
    noChapters,
    setSelectedMultiChapters,
    level,
    chapter,
    updateQueryParams,
    setNoChapters,
    n5NoChapters,
    n4NoChapters,
    n3NoChapters,
  };
};
