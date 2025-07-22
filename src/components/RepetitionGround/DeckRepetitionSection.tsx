"use client";
import React from "react";
import Avatar from "../common/avatar/Avatar";
import { Button } from "@heroui/react";
import { ArrowCounterClockwise, CheckCircle } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

const DeckRepetitionNormalMode = () => {
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
    } = useDeckRepetitionCore<DeckItem>(data?.cards || []);

    const router = useRouter();
    const { mutate: saveRepetition, isLoading } = useSaveDeckRepetitionData();
    const { isSaveRepetition, setIsSaveRepetition } = useGeneralStore();


    const handleEnd = () => {
        if (isSaveRepetition) {
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
        } else {
            setIsSaveRepetition(true)
            router.push('/flashmap')
        }

    };


    console.log({ spacedRepetitionData })

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
    const { selectedReviewDate } = useKanjiGroundState()
    const { deckId, srsId, isReviewMode, isReviewByDate } = useDeckGroundState();
    const { userId } = useUserStore();
    const { data } = useDeckSrsSessionDetail(deckId || 1, userId, srsId || 1, isReviewMode, isReviewByDate ? selectedReviewDate : undefined);
    const { isSaveRepetition, setIsSaveRepetition } = useGeneralStore();

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
    const router = useRouter();

    const handleEnd = () => {
        if (isSaveRepetition) {
            saveRepetition(
                {
                    user_id: userId,
                    deck_id: deckId || 1,
                    repetitionData: spacedRepetitionData,
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
        } else {
            setIsSaveRepetition(true)
            router.push("/flashboard")
        }

    };

    console.log({ spacedRepetitionData })

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
                                Flashboard
                            </Button>
                        </div>
                }


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
