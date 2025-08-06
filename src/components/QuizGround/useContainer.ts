import { useKanjiQuiz } from "@/services/quiz";
import useQuizGroundStore from "@/store/quizGroundState";
import { KanjiQuizItem } from "@/types/quiz";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const useContainer = () => {
  const n5NoChapters = Array.from({ length: 11 }, (_, index) => index + 1);
  const n4NoChapters = Array.from({ length: 20 }, (_, index) => index + 1);
  const n3NoChapters = Array.from({ length: 42 }, (_, index) => index + 1);

  const [noChapters, setNoChapters] = useState(n5NoChapters);
  const [quizData, setQuizData] = useState<KanjiQuizItem[]>([]);
  const [isQuizReady, setIsQuizReady] = useState(false);
  const [isQuizSubmit, setIsQuizSubmit] = useState(false);

  const {
    selectedChapter: chapter,
    level,


    selectedMultiChapters,
    answeredCount,
    currentMark,
    selectedMode: mode,

    setLevel,
    setSelectedChapter,
    setSelectedLevel,

    setSelectedMultiChapters,
    resetQuizState,
    setQuizMode,
    part,
    setPart,
    setIsParted,
    isParted,
  } = useQuizGroundStore();

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

  const handleQuizStart = async () => {
    //   let currentData = await useKanjiQuiz(
    //     chapter,
    //     level,
    //     mode
    //   );

    //   setQuizData(currentData);

    setIsQuizReady(true);
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

    selectedMultiChapters,
    noChapters,
    quizData,
    isQuizReady,
    answeredCount,
    currentMark,
    isQuizSubmit,
    part,
    isParted,

    /* action */
    setSelectedChapter,
    setSelectedLevel,
    setLevel,
    setQuizData,

    setSelectedMultiChapters,
    handleChapterData,
    handleQuizStart,
    handleQuizQuit,
    setQuizMode,
    setPart,
    setIsParted,
    resetQuizState,
    setIsQuizSubmit
  };
};

export default useContainer;
