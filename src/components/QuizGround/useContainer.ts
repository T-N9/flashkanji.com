import { useKanjiQuiz } from "@/services/quiz";
import useQuizGroundStore from "@/store/quizGroundState";
import { KanjiQuizItem } from "@/types/quiz";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const useContainer = () => {
  const n5NoChapters = Array.from({ length: 11 }, (_, index) => index + 1);
  const n4NoChapters = Array.from({ length: 20 }, (_, index) => index + 1);

  const [noChapters, setNoChapters] = useState(n5NoChapters);
  const [quizData, setQuizData] = useState<KanjiQuizItem[]>([]);
  const [isQuizReady, setIsQuizReady] = useState(false);
  const [isQuizSubmit, setIsQuizSubmit] = useState(false);

  const {
    selectedChapter,
    selectedLevel,

    selectedMultiChapters,
    answeredCount,
    currentMark,
    selectedMode,

    setLevel,
    setSelectedChapter,
    setSelectedLevel,

    setSelectedMultiChapters,
    resetQuizState,
    setQuizMode,
  } = useQuizGroundStore();

  const router = useRouter();
  const searchParams = useSearchParams();

  // Extracting queries
  const chapter = searchParams.get("chapter");
  const level = searchParams.get("level");
  const mode = searchParams.get("mode");

  const handleChapterData = (level: number) => {
    switch (level) {
      case 5:
        setNoChapters(n5NoChapters);
        setLevel(5);
        break;
      case 4:
        setNoChapters(n4NoChapters);
        setLevel(4);
        break;
      default:
        break;
    }
  };

  const updateQueryParams = (key: string, value: string) => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    // Update or set the parameter and reset incompatible values
    currentParams.set(key, value);
    if (key === "level") {
      currentParams.set("chapter", "1");
      currentParams.set("mode", "2");
    } // Reset chapter for level

    // Push updated query string to the URL
    router.push(`?${currentParams.toString()}`);
  };

  const handleQuizStart = async () => {
    //   let currentData = await useKanjiQuiz(
    //     chapter,
    //     level,
    //     mode
    //   );

    //   setQuizData(currentData);

    setIsQuizReady(true);
  };

  const handleQuizSubmit = () => {
    if (answeredCount === quizData.length) {
      setIsQuizSubmit(true);
    }
  };

  const handleQuizQuit = () => {
    setIsQuizSubmit(false);
    setIsQuizReady(false);
    resetQuizState();
  };

  return {
    level,
    chapter,
    mode,
    selectedChapter,
    selectedLevel,

    selectedMultiChapters,
    noChapters,
    quizData,
    isQuizReady,
    answeredCount,
    currentMark,
    isQuizSubmit,
    selectedMode,

    /* action */
    setSelectedChapter,
    setSelectedLevel,
    updateQueryParams,
    setLevel,
    setQuizData,

    setSelectedMultiChapters,
    handleChapterData,
    handleQuizStart,
    handleQuizSubmit,
    handleQuizQuit,
    setQuizMode,
  };
};

export default useContainer;
