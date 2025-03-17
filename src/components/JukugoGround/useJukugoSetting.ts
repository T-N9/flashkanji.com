
import useJukugoGroundState from "@/store/jukugoGroundState";
import { useGeneralStore } from "@/store/generalState";
import { useSearchParams, useRouter } from "next/navigation";

const useJukugoSetting = () => {

  const {
    jukugo,
    isLoading,
    isFlippedMode,
    isShuffledMode,
    selectedChapter,
    selectedLevel,
    noChapters,
    isShowMeaning,
    setSelectedChapter,
    setSelectedLevel,
    toggleIsFlippedMode,
    toggleShowMeaning,
    setJukugo,
    setNoChapters,
  } = useJukugoGroundState();

  const { isJukugoModalOpen, userInfo } = useGeneralStore();

  const n5NoChapters = Array.from({ length: 11 }, (_, index) => index + 1);
  const n4NoChapters = Array.from({ length: 20 }, (_, index) => index + 1);
  const n3NoChapters = Array.from({ length: 42 }, (_, index) => index + 1);

    const searchParams = useSearchParams();
    const router = useRouter();
    // Extracting queries
    const chapter = searchParams.get("chapter");
    const level = searchParams.get("level");
    const chapters = searchParams.get("chapters");

    const updateQueryParams = (key: string, value: string) => {
      const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    
      if (key === "chapters") {
        // Clear `chapter` parameter and set `chapters` parameter
        currentParams.delete("chapter");
        currentParams.set("chapters", value);
      } else if (key === "level" || key === "chapter") {
        // Update or set the parameter and reset incompatible values
        currentParams.set(key, value);
        currentParams.delete("chapters");
        if (key === "level") currentParams.set("chapter", "1"); // Reset chapter for level
      }
    
      // Push updated query string to the URL
      router.push(`?${currentParams.toString()}`);
    };

  return {
    jukugo,
    isLoading,
    isFlippedMode,
    isShuffledMode,
    selectedChapter,
    selectedLevel,
    noChapters,
    level,
    chapter,
    isShowMeaning,
    n5NoChapters,
    n4NoChapters,
    n3NoChapters,

    setJukugo,
    setSelectedChapter,
    setSelectedLevel,
    toggleIsFlippedMode,
    toggleShowMeaning,
    updateQueryParams,
    setNoChapters
  };
};

export default useJukugoSetting;
