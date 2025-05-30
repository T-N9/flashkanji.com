"use client";
import React from "react";
import useJukugoGroundState from "@/store/jukugoGroundState";
import { useJukugoByChapterAndLevel } from "@/services/jukugo";
import { JukugoRepetitionItem } from "./JukugoRepetitionItem";
import { relatedJukugoItem } from "@/types/jukugo";
import Avatar from "../common/avatar/Avatar";
import { Button } from "@nextui-org/react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import useRepetitionCore from "./useRepetitionCore";
import Image from "next/image";

const JukugoRepetitionSection = () => {
    const { selectedChapter, level, part } = useJukugoGroundState();
    const { data } = useJukugoByChapterAndLevel(selectedChapter, level,  part);

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
        handleEnd,
        getConfidenceEmoji
    } = useRepetitionCore<relatedJukugoItem>(data || []);



    if (!data || data.length === 0) {
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
                        <p className="text-gray-600 table mx-auto text-center p-2 rounded-full text-xs bg-gray-200">
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
                            }}
                            handleClickLevel={handleClickLevel}
                            spacedRepetitionData={spacedRepetitionData}
                            setSpacedRepetitionData={setSpacedRepetitionData}
                            character={jukugo.jukugo_char}
                            meaning={jukugo.english_meaning}
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

export default JukugoRepetitionSection;
