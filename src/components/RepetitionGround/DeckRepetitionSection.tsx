"use client";
import React, { useEffect } from "react";
import { Button } from "@heroui/react";
import { ArrowCounterClockwise, CheckCircle } from "@phosphor-icons/react";
import Image from "next/image";
import { useUserStore } from "@/store/userState";
import useDeckGroundState from "@/store/deckGroundState";
import { useDeckCards, useDeckSrsSessionDetail, useSaveDeckRepetitionData, useSaveDeckRepetitionDataReview } from "@/services/deck";
import { DeckItem } from "@/types/deckItem";
import { DeckRepetitionItem } from "./DeckRepetitionItem";
import useDeckRepetitionCore from "./useDeckRepetitionCore";
import useDeckRepetitionReview from "./useDeckRepetitionReview";
import useKanjiGroundState from "@/store/kanjiGroundState";
import { useGeneralStore } from "@/store/generalState";
import CharacterImage from "../common/character";
import { getConfidenceEmoji } from "@/util";
import { hasSavedStreakToday, saveStreakToLocalStorage } from "@/util/streak";
import { useAddXpPoints, useRestoreOrBuyHeart, useSaveStreak } from "@/services/progress";
import { toast } from "sonner";
import { playSound } from "@/util/soundPlayer";
import { useRouter } from "@/i18n/navigation";
import DeckRepetitionSummary from "./DeckRepetitionSummary";

const DeckRepetitionNormalMode = () => {
    const { deckId, noOfCards } = useDeckGroundState();
    const { userId, xp_points, setXpPoints, lives, setLives, userRepetitionTrackData, clearUserRepetitionTrackData } = useUserStore();
    const { data } = useDeckCards(deckId || 1, userId, parseInt(noOfCards));

    useEffect(() => {
        clearUserRepetitionTrackData();
    }, []);

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
        // handleEnd,
    } = useDeckRepetitionCore<DeckItem>(data?.cards || []);

    const router = useRouter();
    const { mutate: saveRepetition, isLoading } = useSaveDeckRepetitionData();
    const { mutate: saveStreak } = useSaveStreak();
    const { mutate: restoreHeart } = useRestoreOrBuyHeart();
    const { isSaveRepetition, setIsSaveRepetition, setIsVictoryModalOpen, setVictoryModalType, setVictoryXp } = useGeneralStore();


    const handleRestoreHeart = () => {
        if (lives === 0) {
            setLives(lives + 1);
            restoreHeart({
                user_id: userId, mode: 'free'
            }, {
                onSuccess: () => {
                    playSound('session');
                    setVictoryModalType('restore');
                    setIsVictoryModalOpen(true);
                    toast.success("A life has restored.")
                },
                onError: (err) => {
                    setLives(0);
                    console.log(err, "Error restoring or buying life.")
                }
            })
        }
    }

    const handleEnd = () => {
        const alreadySaved = hasSavedStreakToday();

        if (isSaveRepetition) {
            saveRepetition(
                {
                    user_id: userId,
                    deck_id: deckId || 1,
                    repetitionData: spacedRepetitionData,
                    xp_points: satisfactionPoint, // need to customize
                },
                {
                    onSuccess: () => {
                        console.log("Repetition data saved successfully.");

                        setXpPoints(xp_points + satisfactionPoint)
                        // toast.success(`${Math.floor(satisfactionPoint)} XP points increased.`)
                        if (lives > 0) {
                            playSound('session');
                            setVictoryXp(satisfactionPoint)
                            setVictoryModalType('victory');
                            setIsVictoryModalOpen(true);
                        }

                        if (!alreadySaved) {
                            saveStreak(
                                { user_id: userId },
                                {
                                    onSuccess: () => {
                                        console.log("Streak saved successfully.");
                                        saveStreakToLocalStorage();
                                        handleRestoreHeart();
                                        // router.back()
                                        setTimeout(() => {
                                            router.back();
                                        }, 1500);
                                    },
                                    onError: (error) => {
                                        console.error("Failed to save streak:", error);
                                        router.push("/flashboard");
                                    },
                                }
                            );
                        } else {
                            handleRestoreHeart();
                            // router.back()
                            setTimeout(() => {
                                router.back();
                            }, 1500);
                        }
                    },
                    onError: (error) => {
                        console.error("Failed to save repetition data:", error);
                    },
                }
            );
        } else {
            alert('this is alert')
            setIsSaveRepetition(true);
            router.push("/flashboard");
        }
    };



    console.log({ userRepetitionTrackData })

    if (!data || data.cards.length === 0) {
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

                <DeckRepetitionSummary cardData={data?.cards} trackedData={userRepetitionTrackData} />
            </div>
        );
    }

    return (
        <>
            {shuffledData.map((card) => (
                activeItem === card.id && (
                    <div key={card.id}>
                        {/* <Avatar className="table mx-auto scale-75" emoji={getConfidenceEmoji(satisfactionPoint)} /> */}
                        <p className="text-gray-600 dark:text-gray-300 dark:bg-dark table mx-auto relative z-20 text-center p-2 rounded-full text-xs bg-gray-200">
                            {clickedRepetitionData.length}/{shuffledData.length} cards left
                        </p>
                        <DeckRepetitionItem
                            sr_data={spacedRepetitionData.find((item) => item.id === card.id) || {
                                id: card.id,
                                interval: 1,
                                repetitions: 0,
                                easeFactor: 2.5,
                                nextReviewDate: new Date(),
                                previousClick: null,
                                level: null
                            }}
                            handleClickLevel={handleClickLevel}
                            spacedRepetitionData={spacedRepetitionData}
                            setSpacedRepetitionData={setSpacedRepetitionData}
                            character={card.character}
                            meaning={card.meaning}
                            hiragana={card.hiragana}
                            satisfaction={satisfactionPoint}
                            setSatisfaction={setSatisfactionPoint}
                            isActive={activeItem === card.id}
                        />
                    </div>
                )
            ))}
        </>
    );
};

const DeckRepetitionReviewMode = () => {
    const { selectedReviewDate } = useKanjiGroundState()
    const { deckId, srsId, isReviewMode, isReviewByDate } = useDeckGroundState();
    const { userId, xp_points, setXpPoints, lives, setLives, userRepetitionTrackData, clearUserRepetitionTrackData } = useUserStore();
    const { data } = useDeckSrsSessionDetail(deckId || 1, userId, srsId || 1, isReviewMode, isReviewByDate ? selectedReviewDate : undefined);
    const { isSaveRepetition, setIsSaveRepetition, setIsVictoryModalOpen, setVictoryModalType, setVictoryXp, setShouldRefetchCalendar } = useGeneralStore();

    useEffect(() => {
        clearUserRepetitionTrackData();
    }, []);

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
        // handleEnd,
    } = useDeckRepetitionReview<DeckItem>(data?.cardData || [], data?.repetitionData);

    console.log({ fetchedData: data?.repetitionData })

    const { mutate: saveRepetition, isLoading } = useSaveDeckRepetitionDataReview();
    const { mutate: saveStreak } = useSaveStreak();
    const { mutate: restoreHeart } = useRestoreOrBuyHeart();
    const { mutate: addXpPoints, isLoading: isClaiming } = useAddXpPoints()
    const router = useRouter();

    const handleReviewPointAndEndSession = (point: number) => {
        setXpPoints(xp_points + point)
        if (lives > 0) {
            playSound('session');
            setVictoryXp(point)
            setVictoryModalType('victory');
            setIsVictoryModalOpen(true);
        }
    }

    const handleRestoreHeart = () => {
        if (lives === 0) {
            setLives(lives + 1);
            restoreHeart({
                user_id: userId, mode: 'free'
            }, {
                onSuccess: () => {
                    playSound('session');
                    setVictoryModalType('restore');
                    setIsVictoryModalOpen(true);
                    toast.success("A life has restored.")
                },
                onError: (err) => {
                    setLives(0);
                    console.log(err, "Error restoring or buying life.")
                }
            })
        }
    }

    const handleEnd = () => {
        const alreadySaved = hasSavedStreakToday();
        setShouldRefetchCalendar(true)

        if (isSaveRepetition) {
            saveRepetition(
                {
                    user_id: userId,
                    deck_id: deckId || 1,
                    repetitionData: spacedRepetitionData,
                    xp_points: satisfactionPoint, // need to customize
                },
                {
                    onSuccess: () => {
                        console.log("Repetition data saved successfully.");
                        handleReviewPointAndEndSession(satisfactionPoint)

                        handleRestoreHeart();

                        if (!alreadySaved) {
                            saveStreak(
                                { user_id: userId },
                                {
                                    onSuccess: () => {
                                        console.log("Streak saved successfully.");
                                        saveStreakToLocalStorage();
                                        setTimeout(() => {
                                            router.push("/flashboard");
                                        }, 1500);

                                    },
                                    onError: (error) => {
                                        console.error("Failed to save streak:", error);
                                        router.push("/flashboard");
                                    },
                                }
                            );
                        } else {
                            addXpPoints(
                                {
                                    user_id: userId, point: satisfactionPoint
                                },

                                {
                                    onSuccess: () => {
                                        handleReviewPointAndEndSession(satisfactionPoint);

                                        handleRestoreHeart();
                                    }
                                }
                            )
                            setTimeout(() => {
                                router.push("/flashboard");
                            }, 1500);

                        }
                    },
                    onError: (error) => {
                        console.error("Failed to save repetition data:", error);
                    },
                }
            );
        } else {

            if (!alreadySaved) {
                saveStreak(
                    { user_id: userId, xp_points: satisfactionPoint },
                    {
                        onSuccess: () => {
                            console.log("Streak saved successfully.");
                            saveStreakToLocalStorage();
                            handleReviewPointAndEndSession(satisfactionPoint);

                            handleRestoreHeart()
                            setIsSaveRepetition(true);
                            router.back();
                        },
                        onError: (error) => {
                            console.error("Failed to save streak:", error);

                            router.back();
                        },
                    }
                );
            } else {
                handleRestoreHeart()
                addXpPoints({ user_id: userId, point: 1 }, {
                    onSuccess: () => {

                        handleReviewPointAndEndSession(1)
                        setIsSaveRepetition(true);
                        setTimeout(() => {
                            router.back();
                        }, 1500);

                    }
                })


            }
        }
    };


    console.log({ cardData: data?.cardData, userRepetitionTrackData })

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

                {
                    isSaveRepetition ?
                        <Button variant="bordered" color="primary" onClick={handleEnd}>{isLoading ? 'Saving Session...' : 'Mark as Done'} </Button>
                        :
                        <div className='flex gap-2 justify-center items-center mt-2'>
                            <CheckCircle className='text-green-500' size={32} />
                            <Button onClick={handleEnd} size="sm" variant='faded' color='default' className=''>
                                {isClaiming ? 'Claiming' : 'Claim practice point'}
                            </Button>
                        </div>
                }

                <DeckRepetitionSummary cardData={data?.cardData} trackedData={userRepetitionTrackData} />
            </div>
        );
    }

    return (
        <>
            {shuffledData.map((card) => (
                activeItem === card.id && (
                    <div key={card.id}>
                        {/* <Avatar className="table mx-auto scale-75" emoji={getConfidenceEmoji(satisfactionPoint)} /> */}
                        <p className="text-gray-600 dark:text-gray-300 table mx-auto relative z-20 text-center p-2 rounded-full text-xs bg-gray-200 dark:bg-dark">
                            {clickedRepetitionData.length}/{shuffledData.length} cards left
                        </p>
                        <DeckRepetitionItem
                            sr_data={spacedRepetitionData.find((item) => item.card_id === card.id) || {
                                id: card.id,
                                interval: 1,
                                repetitions: 0,
                                easeFactor: 2.5,
                                nextReviewDate: new Date(),
                                previousClick: null,
                                level: null,
                            }}
                            handleClickLevel={handleClickLevel}
                            spacedRepetitionData={spacedRepetitionData}
                            setSpacedRepetitionData={setSpacedRepetitionData}
                            character={card.character}
                            meaning={card.meaning}
                            hiragana={card.hiragana}
                            satisfaction={satisfactionPoint}
                            setSatisfaction={setSatisfactionPoint}
                            isActive={activeItem === card.id}
                        />
                    </div>
                )
            ))}
        </>
    );
};

const DeckRepetitionSection = () => {
    const { isReviewMode } = useDeckGroundState();

    return (
        <>
            {isReviewMode ? <DeckRepetitionReviewMode /> : <DeckRepetitionNormalMode />}
        </>
    );
};

export default DeckRepetitionSection;
