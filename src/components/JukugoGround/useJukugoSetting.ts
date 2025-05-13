
import useJukugoGroundState from "@/store/jukugoGroundState";
import { useGeneralStore } from "@/store/generalState";
import { useSearchParams, useRouter } from "next/navigation";

const useJukugoSetting = () => {

  const {
    selectedChapter : chapter,
    level,
    jukugo,
    
    isFlippedMode,
    isLoading,
    isShuffledMode,
    isShowMeaning,
    noChapters,
    selectedLevel,
    toggleIsFlippedMode,
    setJukugo,
    setLevel,
    setSelectedLevel,
    setSelectedChapter,
    toggleShowMeaning,
    setNoChapters,
    isParted,
    part,
  } = useJukugoGroundState();

  const { isJukugoModalOpen, userInfo } = useGeneralStore();

  const n5NoChapters = Array.from({ length: 11 }, (_, index) => index + 1);
  const n4NoChapters = Array.from({ length: 20 }, (_, index) => index + 1);
  const n3NoChapters = Array.from({ length: 42 }, (_, index) => index + 1);

//     const updateQueryParams = (key: string, value: string) => {

    
// if (key === "level" || key === "chapter") {
//         // Update or set the parameter and reset incompatible values
//         currentParams.set(key, value);
//         currentParams.delete("chapters");
//         if (key === "level") currentParams.set("chapter", "1"); // Reset chapter for level
//       }
    
//       // Push updated query string to the URL

//     };

  return {
    jukugo,
    isLoading,
    isFlippedMode,
    isShuffledMode,
    chapter,
    selectedLevel,
    noChapters,
    level,
    isShowMeaning,
    n5NoChapters,
    n4NoChapters,
    n3NoChapters,

    setJukugo,
    setSelectedChapter,
    setSelectedLevel,
    toggleIsFlippedMode,
    toggleShowMeaning,
    // updateQueryParams,
    setNoChapters,
    part,
    isParted,
  };
};

export default useJukugoSetting;
