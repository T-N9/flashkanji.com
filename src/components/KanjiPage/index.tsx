'use client'
import React, { useEffect, useState } from 'react'
import { KanjiSetting } from './KanjiSetting'
import { useKanjiSetting } from './useKanjiSetting';
import { useKanjiByChapterAndLevel, useKanjiByMultipleChapters } from '@/services/kanji';
import KanjiCard from '../cards/KanjiCard';
import { LoadingGround } from '../common/LoadingGround';
import { Kanji } from '@/types/kanji';
import { shuffleArray } from '@/util';
import { SpeedDialMenu } from '../common/SpeedDailMenu';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

const KanjiGround = () => {

    const [kanjiData, setKanjiData] = useState<Kanji[] | null>(null)

    const {
        chapters,
        level,
        chapter,
        selectedMultiChapters,
        setNoChapters,
        n5NoChapters,
        n4NoChapters,
        n3NoChapters,
        setKanji,
    } = useKanjiSetting();

    // Call both hooks unconditionally
    const multipleChaptersData = useKanjiByMultipleChapters(
        chapters?.toString() || '',
        level ? parseInt(level) : null
    );
    const singleChapterData = useKanjiByChapterAndLevel(
        chapter ? parseInt(chapter) : null,
        level ? parseInt(level) : null
    );

    const { data, isLoading, error } =
        Array.isArray(selectedMultiChapters) && selectedMultiChapters.length > 0
            ? multipleChaptersData
            : singleChapterData;

    // Update the number of chapters based on the selected level
    useEffect(() => {
        if (level) {
            handleLevelSelection(parseInt(level));
        }
    }, [level]);

    const handleLevelSelection = (selectedLevel: number) => {
        switch (selectedLevel) {
            case 5:
                setNoChapters(n5NoChapters);
                break;
            case 4:
                setNoChapters(n4NoChapters);
                break;
            case 3:
                setNoChapters(n3NoChapters);
                break;
            default:
                break;
        }
    };

    const handleShuffleKanjiData = () => {
        if (kanjiData) {
            const shuffledKanjiData = shuffleArray(kanjiData)
            setKanjiData(shuffledKanjiData);
            setKanji(shuffledKanjiData);
        }
    }

    useEffect(() => {
        if (data && JSON.stringify(data) !== JSON.stringify(kanjiData)) {
            console.log({ data });
            setKanji(data)
            // @ts-ignore
            setKanjiData(data);
        }
    }, [data]);


    return (
        <div>
            <KanjiSetting handleShuffle={handleShuffleKanjiData} />

            <div
                className={`relative transition-all main-container duration-200 ease-out container w-full flex flex-col items-center p-3`}
            >
                <div className="flex w-full justify-center gap-4">
                    {/* <div className="w-[300px] hidden lg:block">
            <AdsComponent isDisplay={true} slotId={"7647610361"} />
          </div> */}
                    {kanjiData?.length === 0 ? (
                        <LoadingGround mode={1} />

                    ) : (
                        <>

                            <div
                                className={`max-w-[1280px] grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4`}
                            >
                                {kanjiData?.map((item, index) => (
                                    <KanjiCard key={index} item={item} />
                                ))}
                            </div>

                        </>
                    )}
                    {/* <div className="w-[300px] hidden lg:block">
            <AdsComponent isDisplay={true} slotId={"7647610361"} />
          </div> */}
                    <SpeedDialMenu mode={1} />
                </div>
            </div>

            <Link href={`/study/kanji/repetition?chapter=${chapter}&level=${level}`}>
                <Button variant='bordered' className='table mx-auto mt-10'>
                    Enter Flash Repetition
                </Button>
            </Link>
        </div>
    )
}

export default KanjiGround