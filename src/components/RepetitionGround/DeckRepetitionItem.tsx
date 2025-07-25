import { calculateDeckNextReview, calculateNextReview, SR_DeckCard } from "@/util";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import Avatar from "../common/avatar/Avatar";
import Image from "next/image";
import { ratingButtons } from "@/constants/static";
import CharacterImage from "../common/character";

export const DeckRepetitionItem = ({
    sr_data,
    spacedRepetitionData,
    setSpacedRepetitionData,
    handleClickLevel,
    character,
    meaning,
    hiragana,
    satisfaction,
    setSatisfaction,
}: {
    sr_data: SR_DeckCard;
    spacedRepetitionData: SR_DeckCard[];
    setSpacedRepetitionData: React.Dispatch<React.SetStateAction<SR_DeckCard[]>>;
    handleClickLevel: (id: number, level: number) => void;
    character: string;
    meaning: string;
    hiragana: string;
    satisfaction: number;
    setSatisfaction: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnswerShown, setIsAnswerShown] = useState(false);

    const [seconds, setSeconds] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(true);

    // console.log({sr_data})

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
                setIsFlipped((isFlipped) => !isFlipped);
                setIsAnswerShown(true);
                setIsRunning(false);
            }
            // if (!isFlipped) {

            // } else {
            if (isAnswerShown && event.key >= "1" && event.key <= "4") {
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
        console.log({sr_data})
        const updatedCard = calculateDeckNextReview(sr_data, index, satisfaction, seconds);
        const updatedStoredData = spacedRepetitionData.map((item) => {
            // console.log(item.id, updatedCard.updatedCard.id, item.card_id);
            return item.id === updatedCard.updatedCard.id ? updatedCard.updatedCard : item
        }

        );

        setSpacedRepetitionData(updatedStoredData);
        updatedCard.updatedCard.card_id ? handleClickLevel(updatedCard.updatedCard.card_id, index) :
            handleClickLevel(updatedCard.updatedCard.id, index);
        setSatisfaction(updatedCard.satisfaction);
        console.log({ satisfaction: updatedStoredData });
    };

    const handleShowAnswer = () => {
        setIsFlipped(isFlipped => !isFlipped);
        setIsRunning(false);
        setIsAnswerShown(true);
    }
    return (
        <div className="px-4">

            <div className=" py-10">
                <div
                    className={`flex h-full flex-col justify-between items-center transition-all duration-200 ease-out`}
                >
                    <div className="relative w-full md:w-[400px] h-[270px]">
                        <div
                            onClick={() => handleShowAnswer()}
                            className={`bg-gradient-to-br !h-full from-gray-50 via-gray-200 to-gray-400 relative font-writing-1 text-white p-5 rounded-md card w-40 min-w-[150px] border-4 lg:min-w-[200px] card-shadow ${isFlipped && "flipped"
                                }`}
                        >
                            <svg className='absolute w-full md:w-[400px] h-[270px] opacity-50 top-0 left-0' xmlns="http://www.w3.org/2000/svg">
                                <filter id="noise" x="0" y="0">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                                    <feBlend mode="screen" />
                                </filter>
                                <rect className='w-full h-full' filter="url(#noise)" opacity="0.5" />
                            </svg>
                            {/* Front Side */}

                            <p
                                className={`text-4xl front text-slate-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                            >
                                {character}
                            </p>

                            {/* Back Side */}
                            <div
                                className={`back absolute w-full top-[32%] -left-[0%] space-y-3 bg-gray-800  px-2 py-4 p-2 text-2xl md:text-2xl text-white
               `}
                            >
                                <div className="">
                                    {hiragana}
                                </div>
                                <div className="text-base">{meaning}</div>

                            </div>
                        </div>


                    </div>

                    {/* Easy 😴
         Medium😎
         Hard 🤔
         Difficult 🤯 */}
                    {
                        isAnswerShown ?
                            <div className="grid grid-cols-2 lg:grid-cols-4 mt-2 gap-1 lg:gap-4">
                                {ratingButtons.map((rating, index) => (
                                    /* [I, H, M , E] */
                                    <div key={index} className="gap-3 flex flex-col items-center">
                                        <Button

                                            className={`${rating.color} text-3xl text-gray-800 font-semibold w-28 h-28 bg-transparent rounded-full hover:bg-gray-300`}
                                            onClick={() => handleButtonClick(index)}
                                        >
                                            <CharacterImage src={rating.img} alt={rating.text} />

                                        </Button>
                                        <p className="text-sm mt-2 hidden">{rating.text}</p>
                                        <span className="text-gray-400 text-sm text-center hidden lg:block">
                                            Press {index + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            :
                            <div className="flex flex-col justify-center items-center gap-3">
                                <Button className="mt-10" onClick={() => handleShowAnswer()}>
                                    Show Answer
                                </Button>
                                <span className="text-gray-400 text-sm hidden lg:block">Press Enter</span>
                            </div>
                    }


                </div>
            </div>
        </div>
    );
};