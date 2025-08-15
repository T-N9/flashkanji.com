import { useEffect, useState } from "react";
import { calculateNextReview, SR_KanjiCard } from "@/util";
import { Button } from "@heroui/react";
import Avatar from "../common/avatar/Avatar";
import Image from "next/image";
import { ratingButtons } from "@/constants/static";
import CharacterImage from "../common/character";
import { playSound } from "@/util/soundPlayer";

export const KanjiRepetitionItem = ({
    sr_data,
    spacedRepetitionData,
    setSpacedRepetitionData,
    handleClickLevel,
    character,
    meaning,
    onyomi,
    kunyomi,
    satisfaction,
    setSatisfaction,
    isReview = false,
}: {
    sr_data: SR_KanjiCard;
    spacedRepetitionData: SR_KanjiCard[];
    setSpacedRepetitionData: React.Dispatch<React.SetStateAction<SR_KanjiCard[]>>;
    handleClickLevel: (id: number, level: number) => void;
    character: string;
    meaning: string;
    onyomi: string;
    kunyomi: string;
    satisfaction: number;
    setSatisfaction: React.Dispatch<React.SetStateAction<number>>;
    isReview?: boolean;
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnswerShown, setIsAnswerShown] = useState(false);

    const [seconds, setSeconds] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(true);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {

            if (event.key === "Enter") {
                 playSound('flip')
                setIsFlipped((isFlipped) => !isFlipped);
                setIsAnswerShown(true);
                setIsRunning(false);
            }
            // if (!isFlipped) {

            // } else {
            if (isAnswerShown && event.key >= "1" && event.key <= "4") {
                playSound('click')
                const index = Number(event.key) - 1;
                handleButtonClick(index);
                setIsFlipped(false);
            }
            // }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isFlipped]);

    const handleButtonClick = (index: number) => {
        playSound('click')
        const updatedCard = calculateNextReview(sr_data, index, satisfaction, seconds);
        const updatedStoredData = spacedRepetitionData.map((item) => {
            // console.log(item.id, updatedCard.updatedCard.card_id, item.card_id);
            if (isReview) {
                return item.card_id === updatedCard.updatedCard.card_id ? updatedCard.updatedCard : item
            } else {
                return item.id === updatedCard.updatedCard.card_id ? updatedCard.updatedCard : item
            }
        }

        );

        setSpacedRepetitionData(updatedStoredData);
        // localStorage.setItem(
        //     "spacedRepetitionData",
        //     JSON.stringify(updatedStoredData)
        // );
        updatedCard.updatedCard.card_id && handleClickLevel(updatedCard.updatedCard.card_id, index);
        setSatisfaction(updatedCard.satisfaction);
        console.log({ updatedCard, updatedStoredData, sr_data, spacedRepetitionData });
    };

    const handleShowAnswer = () => {
        playSound('flip')
        setIsFlipped(isFlipped => !isFlipped);
        setIsRunning(false);
        setIsAnswerShown(true);
    }

    return (
        <div className="px-4">
            {/* <p>{seconds}</p> */}
            <div className="lg:py-10 py-5">
                <div className="flex h-full flex-col justify-between items-center transition-all duration-200 ease-out">
                    <div className="relative w-full md:w-[300px] h-[300px]">
                        <div
                            onClick={() => handleShowAnswer()}
                            className={`bg-gradient-to-br from-gray-50 via-gray-200 to-gray-400 !h-full relative font-writing-1 z-20 text-slate-800 p-5 rounded-md card w-40 min-w-[150px] border-4 lg:min-w-[200px] card-shadow ${isFlipped && "flipped"
                                }`}
                        >
                            <svg
                                className="absolute w-full md:w-[300px] h-[300px] opacity-50 z-20 top-0 left-0 bottom-0 right-0"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <filter id="noise" x="0" y="0">
                                    <feTurbulence
                                        type="fractalNoise"
                                        baseFrequency="0.65"
                                        numOctaves="3"
                                        stitchTiles="stitch"
                                    />
                                    <feBlend mode="screen" />
                                </filter>
                                <rect
                                    className="w-full h-full"
                                    filter="url(#noise)"
                                    opacity="0.5"
                                />
                            </svg>
                            {/* Front Side */}
                            <p className="text-[8rem] z-20 front text-slate-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                {character}
                            </p>

                            {/* Back Side */}
                            <div className="back absolute text-white w-full top-[27%] left-0 space-y-3 z-20 bg-slate-900 px-2 py-4 p-2 text-2xl md:text-2xl">
                                <div>{kunyomi}</div>
                                <div>{onyomi}</div>
                                <div>{meaning}</div>
                            </div>
                        </div>
                    </div>

                    {/* Rating Buttons */}
                    {isAnswerShown ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 mt-2 gap-1 lg:gap-4">
                            {ratingButtons.map((rating, index) => (
                                <div key={index} className="gap-3 flex flex-col items-center">
                                    <Button

                                        className={`${rating.color} text-3xl text-gray-800 font-semibold w-28 h-28 bg-transparent rounded-full hover:bg-gray-300`}
                                        onClick={() => handleButtonClick(index)}
                                    >
                                        <CharacterImage src={rating.img} alt={rating.text} />
                                    </Button>
                                   <p className="text-xs -mt-7 relative z-20 bg-white border px-2 py-1 rounded-lg">{rating.text}</p>
                                    <span className="text-gray-400 text-sm text-center hidden lg:block">
                                        Press {index + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-3">
                            <Button
                                className="mt-10"
                                onClick={() => {
                                    handleShowAnswer();
                                }}
                            >
                                Show Answer
                            </Button>
                            <span className="text-gray-400 text-sm hidden lg:block">
                                Press Enter
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
