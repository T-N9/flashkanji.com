import useQuizGroundStore from "@/store/quizGroundState";
import { useState, useEffect } from "react";

const useContainer = (rightAnswer: string) => {
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [markOfItem, setMarkOfItem] = useState<number>(0);

  const { currentMark, increaseMark, decreaseMark, increaseAnsweredCount } = useQuizGroundStore();

  useEffect(() => {
    if (currentAnswer === rightAnswer && markOfItem === 0) {
      increaseMark();
      setMarkOfItem((prev) => prev + 1);
    } else if (markOfItem === 1 && currentMark > 0 && currentAnswer !== rightAnswer) {
      decreaseMark();
      setMarkOfItem((prev) => prev - 1);
    }
  }, [currentAnswer, rightAnswer, markOfItem, currentMark, increaseMark, decreaseMark]);

  const handleIsAnswered = () => {
    if (!isAnswered) {
      increaseAnsweredCount();
    }
  };

  return {
    currentAnswer,
    isAnswered,

    /* actions */
    setCurrentAnswer,
    setIsAnswered,
    handleIsAnswered,
  };
};

export default useContainer;
