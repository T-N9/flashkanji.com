import useFlashGroundState from "@/store/kanjiGroundState";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useKanjiSetting = () => {
  const n5NoChapters = Array.from({ length: 11 }, (_, index) => index + 1);
  const n4NoChapters = Array.from({ length: 20 }, (_, index) => index + 1);
  const n3NoChapters = Array.from({ length: 42 }, (_, index) => index + 1);

  const {
    noChapters,
    setNoChapters,
    setSelectedMultiChapters,
    selectedMultiChapters,
  } = useFlashGroundState();

  const searchParams = useSearchParams();
  const router = useRouter();
  // Extracting queries
  const chapter = searchParams.get("chapter");
  const level = searchParams.get("level");
  const chapters = searchParams.get("chapters");

  useEffect(() => {
    if(chapters){
      const chapterArray = chapters?.split(",").map(Number);
      setSelectedMultiChapters(chapterArray);
    }
  },[chapters])

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
  

  const handleIncludedChapterClick = (item: number) => {
    const isSelected = selectedMultiChapters.includes(item);
    console.log({item, isSelected})
    setSelectedMultiChapters(
      isSelected
        ? selectedMultiChapters.filter((selectedItem) => selectedItem !== item)
        : [...selectedMultiChapters, item]
    );
  };

  console.log({selectedMultiChapters})

  return {
    noChapters,
    chapters,
    selectedMultiChapters,
    setSelectedMultiChapters,
    level,
    chapter,
    updateQueryParams,
    setNoChapters,
    n5NoChapters,
    n4NoChapters,
    n3NoChapters,
    handleIncludedChapterClick,
  };
};
