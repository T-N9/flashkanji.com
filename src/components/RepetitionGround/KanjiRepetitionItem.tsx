import { useEffect, useState } from "react";
import { calculateNextReview, SR_KanjiCard } from "@/util";
import { Button } from "@nextui-org/react";

export const KanjiRepetitionItem = ({
    sr_data,
    spacedRepetitionData,
    setSpacedRepetitionData,
    handleClickLevel,
    character,
    meaning,
    onyomi,
    kunyomi,
}: {
    sr_data: SR_KanjiCard;
    spacedRepetitionData: SR_KanjiCard[];
    setSpacedRepetitionData: React.Dispatch<React.SetStateAction<SR_KanjiCard[]>>;
    handleClickLevel: (id: number, level: number) => void;
    character: string;
    meaning: string;
    onyomi: string;
    kunyomi: string;
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const ratingButtons = [
        { reaction: "🤯", text: "ဟာ သွားပါပြီ" },
        { reaction: "🤔", text: "ခက်တယ်ဟ" },
        { reaction: "😎", text: "ရပါတယ်" },
        { reaction: "😴", text: "အေးဆေးပဲ" }
    ];

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (!isFlipped) {
                if (event.key === "Enter") {
                    setIsFlipped(true);
                }
            } else {
                if (event.key >= "1" && event.key <= "4") {
                    const index = Number(event.key) - 1;
                    handleButtonClick(index);
                    setIsFlipped(false);
                }
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isFlipped]);

    const handleButtonClick = (index: number) => {
        const updatedCard = calculateNextReview(sr_data, index);
        const updatedStoredData = spacedRepetitionData.map(item =>
            item.id === updatedCard.id ? updatedCard : item
        );

        setSpacedRepetitionData(updatedStoredData);
        localStorage.setItem("spacedRepetitionData", JSON.stringify(updatedStoredData));
        handleClickLevel(updatedCard.id, index);
    };

    return (
        <div className="px-4">
            <div className="py-10">
                <div className="flex h-full flex-col justify-between items-center transition-all duration-200 ease-out">
                    <div className="relative w-full md:w-[300px] h-[300px]">

                        <div className={`bg-gradient-to-br from-black via-slate-800 to-orange-700 !h-full relative font-writing-1 z-20 text-white p-5 rounded-md card w-40 min-w-[150px] border-4 lg:min-w-[200px] card-shadow ${isFlipped && "flipped"}`}>
                            <svg className='absolute w-full md:w-[300px] h-[300px] opacity-50 z-20 top-0 left-0 bottom-0 right-0' xmlns="http://www.w3.org/2000/svg">
                                <filter id="noise" x="0" y="0">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                                    <feBlend mode="screen" />
                                </filter>
                                <rect className='w-full h-full' filter="url(#noise)" opacity="0.5" />
                            </svg>
                            {/* Front Side */}
                            <p className="text-8xl z-20 front text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                {character}
                            </p>

                            {/* Back Side */}
                            <div className="back absolute w-full top-[27%] left-0 space-y-3 z-20 bg-slate-900 px-2 py-4 p-2 text-2xl md:text-2xl">
                                <div>{kunyomi}</div>
                                <div>{onyomi}</div>
                                <div>{meaning}</div>
                            </div>
                        </div>
                    </div>

                    {/* Rating Buttons */}
                    {isFlipped ? (
                        <div className="flex justify-around mt-10 gap-4 flex-wrap">
                            {ratingButtons.map((rating, index) => (
                                <div key={index} className="gap-3 flex flex-col items-center">
                                    <Button
                                        className="bg-gray-200 text-2xl text-gray-800 font-semibold py-1 px-3 rounded-lg hover:bg-gray-300"
                                        onClick={() => handleButtonClick(index)}
                                    >
                                        {rating.reaction}
                                    </Button>
                                    <p className="text-sm mt-2 hidden">{rating.text}</p>
                                    <span className="text-gray-400 text-sm text-center hidden lg:block">Press {index + 1}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-3">
                            <Button className="mt-10" onClick={() => setIsFlipped(true)}>
                                Show Answer
                            </Button>
                            <span className="text-gray-400 text-sm hidden lg:block">Press Enter</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
