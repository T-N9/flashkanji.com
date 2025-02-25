import React from "react";

/* Components */
import { Checkbox, Card, CardBody, cn } from "@nextui-org/react";

/* Hook */
import useContainer from "./useContainer";
import { KanjiQuizItem } from "@/types/quiz";

type QuizItemProps = {
  quizItem: KanjiQuizItem;
  number: number;
  isSubmitted: boolean;
};

export const QuizItem: React.FC<QuizItemProps> = ({ quizItem, number, isSubmitted }) => {
  const {
    currentAnswer,
    isAnswered,

    /* actions */
    setCurrentAnswer,
    setIsAnswered,
    handleIsAnswered,
  } = useContainer(quizItem.answer);

  return (
    <Card>
      <CardBody>
        <div className="flex gap-4 flex-col lg:flex-row">
          <span className="absolute top-1 left-1 w-5 h-5 text-primary font-bold flex justify-center items-center  rounded-full">
            {number + 1}
          </span>
          <div className="flex-1 flex-col gap-5 flex justify-center items-center">
            <p className="text-sm text-gray-700">{quizItem?.question}</p>
            <h1 className="text-9xl text-dark">{quizItem?.kanji}</h1>
          </div>

          <div className="grid grid-cols-1 gap-10 flex-1 w-full option-item p-4">
            {quizItem?.options.map((option, index) => {
              const optionItem = option.split(",").map((i, idx) => (
                <div className="" key={idx}>
                  <span>{i}</span>
                  {idx !== option?.split(",").length - 1 && ","}
                </div>
              ));
              return (
                <div key={index}>
                  <Checkbox
                    onClick={() => {
                      handleIsAnswered();
                      setCurrentAnswer(option);
                      setIsAnswered(true);
                    }}
                    aria-label={optionItem.toString()}
                    classNames={{
                      base: cn(
                        "inline-flex w-full max-w-md bg-content1 border-default shadow border-2 border-gray-200",
                        "hover:bg-content2 items-center justify-start",
                        "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                        ` ${currentAnswer === option && "border-primary"} ${isSubmitted &&
                        currentAnswer === option &&
                        option === quizItem?.answer &&
                        "border-green-400"
                        } ${isSubmitted &&
                        currentAnswer === option &&
                        option !== quizItem?.answer &&
                        "border-red-300"
                        }
                                          
                                          ${isSubmitted &&
                        option ===
                        quizItem?.answer &&
                        "border-green-400"
                        }
                            
                                          ${isSubmitted &&
                        "pointer-events-none cursor-not-allowed"
                        } ${isSubmitted && currentAnswer !== option && "opacity-60"
                        } border-2 border-solid bg-white p-2 shadow text-2xl cursor-pointer`
                      ),
                      label: "w-full",
                    }}
                    isSelected={currentAnswer === option}
                    color="default"
                  >
                    <div className="w-full flex justify-between gap-2">
                      <div className="flex flex-wrap items-end gap-1">
                        {optionItem}
                      </div>
                    </div>
                  </Checkbox>
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
