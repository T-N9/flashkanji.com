"use client";
import React from "react";
import useJukugoGroundState from "@/store/jukugoGroundState";
import { JukugoRepetitionItem } from "./JukugoRepetitionItem";
import { relatedJukugoItem } from "@/types/jukugo";
import Avatar from "../common/avatar/Avatar";
import { Button } from "@heroui/react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useKanjiRepetitionData_ByDate, useSaveRepetitionData, useSaveRepetitionData_Review } from "@/services/repetition";
import { useUserStore } from "@/store/userState";
import useRepetitionReview from "./useRepetitionReview";
import useKanjiGroundState from "@/store/kanjiGroundState";
import useDeckGroundState from "@/store/deckGroundState";
import { useDeckCards, useSaveDeckRepetitionData } from "@/services/deck";
import { DeckItem } from "@/types/deckItem";
import { DeckRepetitionItem } from "./DeckRepetitionItem";
import useDeckRepetitionCore from "./useDeckRepetitionCore";

const DeckRepetitionNormalMode = () => {
    const { selectedChapter, level, part } = useJukugoGroundState();
    const { deckId } = useDeckGroundState();
    const { userId } = useUserStore();
    const { data } = useDeckCards(deckId || 1, userId);

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
        getConfidenceEmoji
    } = useDeckRepetitionCore<DeckItem>(data?.cards || []);

    const router = useRouter();
    const { mutate: saveRepetition, isLoading } = useSaveDeckRepetitionData();


    const handleEnd = () => {
        saveRepetition(
            {
                user_id: userId,
                deck_id: deckId || 1,
                repetitionData: spacedRepetitionData,
            },
            {
                onSuccess: () => {
                    console.log("Repetition data saved successfully.");
                    router.push("/flashmap");
                },
                onError: (error) => {
                    console.error("Failed to save repetition data:", error);
                },
            }
        );
    };


    console.log({ spacedRepetitionData })

    if (!data || data.cards.length === 0) {
        return (<div className="w-full h-80 flex justify-center items-center">
            <Image className="tilt-animation drop-shadow-lg scale-50" src={'/assets/ramen.png'} width={200} height={200} alt="Loading Session" />
        </div>);
    }

    if (clickedRepetitionData.length === 0) {
        return (
            <div className="flex flex-col gap-5 items-center">
                <p className="text-center">Flash Repetition Session Completed.</p>
                <Avatar className="table mx-auto" emoji={getConfidenceEmoji(satisfactionPoint)} />
                <Button isIconOnly onClick={handleRestart} className="w-20 h-20 rounded-full">
                    <ArrowCounterClockwise size={52} />
                </Button>
                <Button variant="solid" onClick={handleEnd}>End Session</Button>
            </div>
        );
    }

    return (
        <>
            {shuffledData.map((card) => (
                activeItem === card.id && (
                    <div key={card.id}>
                        {/* <Avatar className="table mx-auto scale-75" emoji={getConfidenceEmoji(satisfactionPoint)} /> */}
                        <p className="text-gray-600 table mx-auto relative z-20 text-center p-2 rounded-full text-xs bg-gray-200">
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
                        />
                    </div>
                )
            ))}
        </>
    );
};

const DeckRepetitionReviewMode = () => {
    const { selectedChapter, level, part } = useJukugoGroundState();
    const { selectedReviewDate } = useKanjiGroundState();
    const { userId } = useUserStore();
    const { data } = useKanjiRepetitionData_ByDate(selectedReviewDate, userId, 2);

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
        getConfidenceEmoji
    } = useRepetitionReview<relatedJukugoItem>(data?.cardData || [], data?.repetitionData);

    console.log({ fetchedData: data?.repetitionData })

    const { mutate: saveRepetition, isLoading } = useSaveRepetitionData_Review();
    const router = useRouter();

    const handleEnd = () => {
        saveRepetition(
            {
                user_id: userId,
                repetitionData: spacedRepetitionData,
                type: 2,
            },
            {
                onSuccess: () => {
                    console.log("Repetition data saved successfully.");
                    router.push("/flashboard");
                },
                onError: (error) => {
                    console.error("Failed to save repetition data:", error);
                },
            }
        );
    };

    console.log({ spacedRepetitionData })

    if (!data || data?.cardData?.length === 0) {
        return (<div className="w-full h-80 flex justify-center items-center">
            <Image className="tilt-animation drop-shadow-lg scale-50" src={'/assets/ramen.png'} width={200} height={200} alt="Loading Session" />
        </div>);
    }

    if (clickedRepetitionData.length === 0) {
        return (
            <div className="flex flex-col gap-5 items-center">
                <p className="text-center">Flash Repetition Session Completed.</p>
                <Avatar className="table mx-auto" emoji={getConfidenceEmoji(satisfactionPoint)} />
                <Button isIconOnly onClick={handleRestart} className="w-20 h-20 rounded-full">
                    <ArrowCounterClockwise size={52} />
                </Button>
                <Button variant="solid" onClick={handleEnd}>End Session</Button>
            </div>
        );
    }

    return (
        <>
            {shuffledData.map((jukugo) => (
                activeItem === jukugo.id && (
                    <div key={jukugo.id}>
                        {/* <Avatar className="table mx-auto scale-75" emoji={getConfidenceEmoji(satisfactionPoint)} /> */}
                        <p className="text-gray-600 table mx-auto relative z-20 text-center p-2 rounded-full text-xs bg-gray-200">
                            {clickedRepetitionData.length}/{shuffledData.length} cards left
                        </p>
                        <JukugoRepetitionItem
                            sr_data={spacedRepetitionData.find((item) => item.id === jukugo.id) || {
                                id: jukugo.id,
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
                            character={jukugo.character}
                            meaning={jukugo.meaning}
                            hiragana={jukugo.hiragana}
                            satisfaction={satisfactionPoint}
                            setSatisfaction={setSatisfactionPoint}
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
