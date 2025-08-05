"use client";
import React from "react";

import useKanjiGroundState from "@/store/kanjiGroundState";
import { useKanjiByChapterAndLevel } from "@/services/kanji";
import { KanjiRepetitionItem } from "./KanjiRepetitionItem";
import { Kanji } from "@/types/kanji";
import { Button } from "@heroui/react";
import { ArrowCounterClockwise, CheckCircle } from "@phosphor-icons/react";
import useRepetitionCore from "./useRepetitionCore";
import Image from "next/image";
import { useKanjiRepetitionData_ByDate, useSaveRepetitionData, useSaveRepetitionData_Review } from "@/services/repetition";
import { useUserStore } from "@/store/userState";
import useRepetitionReview from "./useRepetitionReview";
import { useRouter } from "next/navigation";
import { useGeneralStore } from "@/store/generalState";
import { useSaveEndSection, useSaveStreak } from "@/services/progress";
import { getConfidenceEmoji } from "@/util";
import CharacterImage from "../common/character";
import { hasSavedStreakToday, saveStreakToLocalStorage } from "@/util/streak";
import { toast } from "sonner";

const KanjiRepetitionNormalMode = () => {
    const { selectedChapter, level, part, isParted } = useKanjiGroundState();
    const { userId, xp_points, setXpPoints } = useUserStore();
    const { data } = useKanjiByChapterAndLevel(selectedChapter, level, isParted ? part : null);

    const {
        shuffledData,
        spacedRepetitionData,
        setSpacedRepetitionData,
        clickedRepetitionData,
        activeItem,
        satisfactionPoint,
        setSatisfactionPoint,
        handleClickLevel,
        handleRestart,
    } = useRepetitionCore<Kanji>(data || []);


    const { mutate: saveRepetition, isLoading } = useSaveRepetitionData();
    const { mutate: saveSection, isLoading: saveLoading } = useSaveEndSection();
    const { mutate: saveStreak } = useSaveStreak();
    const { isSaveRepetition, setIsSaveRepetition, mapItemData, setShouldRefetchChapter, } = useGeneralStore();

    const router = useRouter();

    const saveSectionIfNeeded = async () => {
        if (!mapItemData?.isCurrent) return;

        return new Promise<void>((resolve, reject) => {
            saveSection(
                {
                    user_id: userId,
                    chapter: mapItemData.chapter,
                    level: mapItemData.level,
                    phase: mapItemData.phase,
                    stepIndex: (mapItemData.stepIndex || 1) - 1,
                    xp_points: 5,
                    isToDecrease: false,
                },
                {
                    onSuccess: () => {
                        setXpPoints(xp_points + 5)
                        toast.success("5 XP points increased.")
                        console.log("Section saved successfully.");
                        setShouldRefetchChapter(true);
                        resolve();
                    },
                    onError: (err) => {
                        console.error("Failed to save section:", err);
                        reject(err);
                    },
                }
            );
        });
    };

    const saveStreakIfNeeded = async () => {
        return new Promise<void>((resolve, reject) => {
            saveStreak(
                { user_id: userId },
                {
                    onSuccess: () => {
                        console.log("Streak saved successfully.");
                        saveStreakToLocalStorage();
                        resolve();
                    },
                    onError: (err) => {
                        console.error("Failed to save streak:", err);
                        reject(err);
                    },
                }
            );
        });
    };

    const handleEnd = async () => {
        const isAlreadySaved = hasSavedStreakToday();
        if (!isSaveRepetition) {
            setIsSaveRepetition(true);
            if (!isAlreadySaved) {
                saveStreak(
                    { user_id: userId },
                    {
                        onSuccess: () => {
                            console.log("Streak saved successfully.");
                            saveStreakToLocalStorage();
                            router.push("/flashmap#resume");
                        },
                        onError: (error) => {
                            console.error("Failed to save streak:", error);
                            router.push("/flashmap#resume"); // Still redirect even if streak save fails
                        },
                    }
                );
            } else {
                router.push("/flashmap#resume");
            }
            return;
        }

        saveRepetition(
            {
                user_id: userId,
                repetitionData: spacedRepetitionData,
                type: 2,
                level: level,
            },
            {
                onSuccess: async () => {
                    console.log("Repetition data saved successfully.");
                    try {
                        await saveSectionIfNeeded();
                        !isAlreadySaved && await saveStreakIfNeeded(); // optional: conditionally add logic if needed
                        router.push("/flashmap#resume");
                    } catch (err) {
                        console.error("Error during save chain:", err);
                    }
                },
                onError: (err) => {
                    console.error("Failed to save repetition data:", err);
                },
            }
        );
    };
    console.log({ spacedRepetitionData })


    if (!data || data?.length === 0) {
        return (<div className="w-full h-80 flex justify-center items-center">
            <Image className="tilt-animation drop-shadow-lg scale-50" src={'/assets/ramen.png'} width={200} height={200} alt="Loading Session" />
        </div>);
    }

    if (clickedRepetitionData.length === 0) {
        return (
            <div className="flex flex-col gap-5 items-center  relative z-20">
                <p className="text-center">Flash Repetition Session Completed.</p>
                <CharacterImage src={getConfidenceEmoji(satisfactionPoint)} />
                <Button isIconOnly onClick={handleRestart} className="w-20 h-20 rounded-full">
                    <ArrowCounterClockwise size={52} />
                </Button>



                {
                    mapItemData?.isCurrent ?
                        <Button variant="bordered" color="primary" onClick={handleEnd}>{isLoading ? 'Saving Session...' : 'Mark as Done'} </Button>
                        :
                        <div className='flex gap-2 justify-center items-center mt-2'>
                            <CheckCircle className='text-green-500' size={32} />
                            <Button onClick={handleEnd} size="sm" variant='faded' color='default' className=''>
                                Flashmap
                            </Button>
                        </div>
                }

            </div>
        );
    }

    return (
        <>
            {shuffledData.map((kanji) => (
                activeItem === kanji.id && (
                    <div key={kanji.id}>
                        {/* <Avatar className="table mx-auto scale-75" emoji={getConfidenceEmoji(satisfactionPoint)} /> */}
                        <p className="text-gray-600 table mx-auto text-center p-2 rounded-full text-xs bg-gray-200 relative z-20">
                            {clickedRepetitionData.length}/{shuffledData.length} cards left
                        </p>
                        <KanjiRepetitionItem
                            sr_data={spacedRepetitionData.find((item) => item.card_id === kanji.id) || {
                                id: kanji.id,
                                interval: 1,
                                repetitions: 0,
                                easeFactor: 2.5,
                                nextReviewDate: new Date(),
                                previousClick: null,
                                level: level,
                                card_id: kanji.id
                            }}
                            handleClickLevel={handleClickLevel}
                            spacedRepetitionData={spacedRepetitionData}
                            setSpacedRepetitionData={setSpacedRepetitionData}
                            character={kanji.character}
                            onyomi={kanji.onyomi}
                            kunyomi={kanji.kunyomi}
                            meaning={kanji.meaning}
                            satisfaction={satisfactionPoint}
                            setSatisfaction={setSatisfactionPoint}
                        />
                    </div>
                )
            ))}
        </>
    );
}

const KanjiRepetitionReviewMode = () => {
    const { level, selectedReviewDate } = useKanjiGroundState();
    const { userId, xp_points, setXpPoints } = useUserStore();
    const { data } = useKanjiRepetitionData_ByDate(selectedReviewDate, userId, 1);
    const { isSaveRepetition, setIsSaveRepetition, mapItemData } = useGeneralStore();

    console.log({ fetchedData: data?.repetitionData })

    const {
        shuffledData,
        spacedRepetitionData,
        setSpacedRepetitionData,
        clickedRepetitionData,
        activeItem,
        satisfactionPoint,
        setSatisfactionPoint,
        handleClickLevel,
        handleRestart,
    } = useRepetitionReview<Kanji>(data?.cardData || [], data?.repetitionData);

    const { mutate: saveRepetition, isLoading } = useSaveRepetitionData_Review();
    const { mutate: saveStreak } = useSaveStreak();
    const router = useRouter();

    console.log({ spacedRepetitionData, shuffledData })

    const handleEnd = () => {
        const alreadySaved = hasSavedStreakToday();

        if (isSaveRepetition) {
            saveRepetition(
                {
                    user_id: userId,
                    repetitionData: spacedRepetitionData,
                    type: 1,
                    xp_points: satisfactionPoint, // need to customize
                },
                {
                    onSuccess: () => {
                        console.log("Repetition data saved successfully.");
                        setXpPoints(xp_points + satisfactionPoint)
                        toast.success(`${Math.floor(satisfactionPoint)} XP points increased.`)

                        if (!alreadySaved) {
                            saveStreak(
                                { user_id: userId },
                                {
                                    onSuccess: () => {
                                        console.log("Streak saved successfully.");
                                        saveStreakToLocalStorage();
                                        router.push("/flashboard");
                                    },
                                    onError: (error) => {
                                        console.error("Failed to save streak:", error);
                                        router.push("/flashboard"); // Still redirect even if streak save fails
                                    },
                                }
                            );
                        } else {
                            router.push("/flashboard");
                        }
                    },
                    onError: (error) => {
                        console.error("Failed to save repetition data:", error);
                    },
                }
            );
        } else {
            setIsSaveRepetition(true);
            router.push("/flashboard");
        }
    };



    if (!data || data?.cardData?.length === 0) {
        return (<div className="w-full h-80 flex justify-center items-center">
            <Image className="tilt-animation drop-shadow-lg scale-50" src={'/assets/ramen.png'} width={200} height={200} alt="Loading Session" />
        </div>);
    }



    if (clickedRepetitionData.length === 0) {
        return (
            <div className="flex flex-col gap-5 items-center relative z-20">
                <p className="text-center">Flash Repetition Session Completed.</p>
                <CharacterImage src={getConfidenceEmoji(satisfactionPoint)} />
                <Button isIconOnly onClick={handleRestart} className="w-20 h-20 rounded-full">
                    <ArrowCounterClockwise size={52} />
                </Button>

                <Button variant="bordered" color="primary" onClick={handleEnd}>{isLoading ? 'Saving Session...' : 'Mark as Done'} </Button>




            </div>
        );
    }

    return (
        <>
            {shuffledData.map((kanji) => (
                activeItem === kanji.id && (
                    <div key={kanji.id}>
                        {/* <Avatar className="table mx-auto scale-75" emoji={getConfidenceEmoji(satisfactionPoint)} /> */}
                        <p className="text-gray-600 table mx-auto text-center p-2 rounded-full text-xs bg-gray-200 relative z-20">
                            {clickedRepetitionData.length}/{shuffledData.length} cards left
                        </p>
                        <KanjiRepetitionItem
                            sr_data={spacedRepetitionData.find((item) => item.card_id === kanji.id) || {
                                id: kanji.id,
                                interval: 1,
                                repetitions: 0,
                                easeFactor: 2.5,
                                nextReviewDate: new Date(),
                                previousClick: null,
                                level: level,
                            }}
                            handleClickLevel={handleClickLevel}
                            spacedRepetitionData={spacedRepetitionData}
                            setSpacedRepetitionData={setSpacedRepetitionData}
                            character={kanji.character}
                            onyomi={kanji.onyomi}
                            kunyomi={kanji.kunyomi}
                            meaning={kanji.meaning}
                            satisfaction={satisfactionPoint}
                            setSatisfaction={setSatisfactionPoint}
                            isReview={true}
                        />
                    </div>
                )
            ))}
        </>
    );
}

const KanjiRepetitionSection = () => {

    const { isReviewMode } = useKanjiGroundState();

    return (
        <>
            {
                isReviewMode ? <KanjiRepetitionReviewMode /> : <KanjiRepetitionNormalMode />
            }
        </>
    );
};

export default KanjiRepetitionSection;
