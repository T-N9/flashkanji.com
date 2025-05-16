"use client";
import React from "react";

import useKanjiGroundState from "@/store/kanjiGroundState";
import { useKanjiByChapterAndLevel } from "@/services/kanji";
import { KanjiRepetitionItem } from "./KanjiRepetitionItem";
import Avatar from "../common/avatar/Avatar";
import { Kanji } from "@/types/kanji";
import { Button } from "@nextui-org/react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import useRepetitionCore from "./useRepetitionCore";

const KanjiRepetitionSection = () => {

    const { selectedChapter, level, part } = useKanjiGroundState();
    const { data } = useKanjiByChapterAndLevel(selectedChapter, level, part);

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
    } = useRepetitionCore<Kanji>(data || []);


    if (!data || data.length === 0) {
        return <div className="w-full h-80 flex justify-center items-center"><p>Preparing Session...</p></div>;
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
            {shuffledData.map((kanji) => (
                activeItem === kanji.id && (
                    <div key={kanji.id}>
                        <Avatar className="table mx-auto" emoji={getConfidenceEmoji(satisfactionPoint)} />
                        <p className="text-gray-600 table mx-auto text-base text-center">
                            {clickedRepetitionData.length} cards left
                        </p>
                        <KanjiRepetitionItem
                            sr_data={spacedRepetitionData.find((item) => item.id === kanji.id) || {
                                id: kanji.id,
                                interval: 1,
                                repetitions: 0,
                                easeFactor: 2.5,
                                nextReviewDate: new Date(),
                                previousClick: null,
                            }}
                            handleClickLevel={(level) => handleClickLevel(kanji.id, level)}
                            spacedRepetitionData={spacedRepetitionData}
                            setSpacedRepetitionData={setSpacedRepetitionData}
                            character={kanji.kanji_character}
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
};

export default KanjiRepetitionSection;
