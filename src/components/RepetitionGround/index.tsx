"use client";
import { useKanjiByChapterAndLevel } from "@/services/kanji";
import { Clicked_Item, SR_KanjiCard } from "@/util";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useRepetitionGround from "./useRepetitionGround";
import { KanjiRepetitionItem } from "./KanjiRepetitionItem";
import { usePathname } from "next/navigation";
import { useJukugoByChapterAndLevel } from "@/services/jukugo";
import { Kanji } from "@/types/kanji";
import { relatedJukugoItem } from "@/types/jukugo";
import { JukugoRepetitionItem } from "./JukugoRepetitionItem";

type RepetitionType = Kanji[] | relatedJukugoItem[];

const SpacedRepetition = () => {
    const pathname = usePathname();

    const { chapter, level } = useRepetitionGround()
    const rawData = (pathname === "/study/kanji/repetition"
        ? useKanjiByChapterAndLevel(chapter ? parseInt(chapter) : null, level ? parseInt(level) : null)
        : useJukugoByChapterAndLevel(chapter ? parseInt(chapter) : null, level ? parseInt(level) : null)
    )?.data as RepetitionType;
    const data = useMemo(() => rawData, [rawData]); // Memoize data
    const [spacedRepetitionData, setSpacedRepetitionData] = useState<SR_KanjiCard[]>([]);
    const [clickedRepetitionData, setClickedRepetitionData] = useState<Clicked_Item[]>([]);
    const isInitialized = useRef(false); // Track initialization
    const storedData = typeof window !== "undefined" && localStorage?.getItem('spacedRepetitionData');

    const [activeItem, setActiveItem] = useState<number | null>(null);

    useEffect(() => {
        console.log("data mounted")
        if (data && data?.length > 0 && !isInitialized.current) {
            setActiveItem(data[0].id);
            isInitialized.current = true; // Mark as initialized

            const initialLevelClickData = data.map((item) => ({
                id: item.id,
                clickedLevel: 0
            }))
            setClickedRepetitionData(initialLevelClickData);
            if (storedData && storedData?.length > 0) {
                setSpacedRepetitionData(JSON.parse(storedData));

            } else {
                const initialData = data.map((item) => ({
                    id: item.id,
                    interval: 1,
                    repetitions: 0,
                    easeFactor: 2.5,
                    nextReviewDate: new Date(),
                }));



                setSpacedRepetitionData(initialData);

                console.log({ initialData, rawData })
                localStorage.setItem('spacedRepetitionData', JSON.stringify(initialData));
            }
        }
    }, [data]);

    console.log({ spacedRepetitionData })

    const handleClickLevel = (id: number, level: number) => {
        console.log({ clickedRepetitionData, id, level })
        // Find index of the item with the given id
        const temp_array = clickedRepetitionData;
        const index = clickedRepetitionData.findIndex(item => item.id === id);
        if (index === -1) return; // If item not found, exit

        if (level === 3) {
            // Remove item if level is 3
            temp_array.splice(index, 1);
            setClickedRepetitionData(temp_array)
        } else {
            // Calculate new index based on the level
            let newIndex = index + (level === 0 ? 2 : 4);
            newIndex = Math.max(newIndex, 0); // Ensure index doesn't go below 0

            // Remove and reinsert item at the new index
            const [item] = temp_array.splice(index, 1);
            temp_array.splice(newIndex, 0, item);

            setClickedRepetitionData(temp_array)
        }

        // Set active item as the first item's ID
        if (clickedRepetitionData.length > 0) {
            setActiveItem(clickedRepetitionData[0].id);
        }


    };

    console.log({ activeItem })

    return (
        <div>
            {data?.length === 0 ? (
                <div>Loading...</div>
            ) : (
                <div className="mt-10">

                    {
                        pathname === "/study/kanji/repetition" ?
                            clickedRepetitionData.length !== 0 ? data?.map((kanji, index) => (

                                <React.Fragment key={index}>
                                    {
                                        activeItem === kanji.id &&
                                        <div key={index}>
                                            <p className="font-bold text-red-600 text-xl text-center">{index + 1}</p>
                                            <KanjiRepetitionItem
                                                sr_data={spacedRepetitionData.find(item => item.id === kanji.id) || {
                                                    id: kanji.id,
                                                    interval: 1,
                                                    repetitions: 0,
                                                    easeFactor: 2.5,
                                                    nextReviewDate: new Date(),
                                                }}
                                                handleClickLevel={handleClickLevel}
                                                spacedRepetitionData={spacedRepetitionData}
                                                setSpacedRepetitionData={setSpacedRepetitionData}
                                                character={(kanji as Kanji).kanji_character}
                                                onyomi={(kanji as Kanji).onyomi}
                                                kunyomi={(kanji as Kanji).kunyomi}
                                                meaning={(kanji as Kanji).meaning}
                                            />

                                            {/* if it is not kanji route (jukugo route) this will conditionally render <JukugoRepetitionItem/> */}
                                        </div>
                                    }

                                </React.Fragment>

                            )

                            )
                                :
                                <>
                                    <p className="text-center">Flash Repetition Session Completed.</p>
                                </>
                            :

                            clickedRepetitionData.length !== 0 ? data?.map((jukugo, index) => (

                                <React.Fragment key={index}>
                                    {
                                        activeItem === jukugo.id &&
                                        <div key={index}>
                                            <p className="font-bold text-red-600 text-xl text-center">{index + 1}</p>
                                            <JukugoRepetitionItem
                                                sr_data={spacedRepetitionData.find(item => item.id === jukugo.id) || {
                                                    id: jukugo.id,
                                                    interval: 1,
                                                    repetitions: 0,
                                                    easeFactor: 2.5,
                                                    nextReviewDate: new Date(),
                                                }}
                                                handleClickLevel={handleClickLevel}
                                                spacedRepetitionData={spacedRepetitionData}
                                                setSpacedRepetitionData={setSpacedRepetitionData}
                                                character={(jukugo as relatedJukugoItem).jukugo_char}
                                                meaning={(jukugo as relatedJukugoItem).english_meaning}
                                                hiragana={(jukugo as relatedJukugoItem).hiragana}

                                            />

                                            {/* if it is not kanji route (jukugo route) this will conditionally render <JukugoRepetitionItem/> */}
                                        </div>
                                    }

                                </React.Fragment>

                            )

                            )
                                :
                                <>
                                    <p className="text-center">Flash Repetition Session Completed.</p>
                                </>


                    }

                </div>
            )}
        </div>
    );
};

export default SpacedRepetition;
