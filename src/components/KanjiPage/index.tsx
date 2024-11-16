'use client'
import React, { useEffect } from 'react'
import { KanjiSetting } from './KanjiSetting'
import { useKanjiSetting } from './useKanjiSetting';
import { useKanjiByChapterAndLevel, useKanjiByMultipleChapters } from '@/services/kanji';
import KanjiCard from '../cards/KanjiCard';
import { LoadingGround } from '../common/LoadingGround';

const KanjiGround = () => {

    const {
        chapters,
        level,
        chapter,
        setNoChapters,
        n5NoChapters,
        n4NoChapters,
        n3NoChapters
    } = useKanjiSetting();

    const { data, isLoading, error } = chapters?.length ? useKanjiByMultipleChapters(chapters.toString(), level ? parseInt(level) : null) : useKanjiByChapterAndLevel(
        chapter ? parseInt(chapter) : null,
        level ? parseInt(level) : null
    );

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

    return (
        <div>
            <KanjiSetting />

            <div
                className={`relative transition-all main-container duration-200 ease-out container w-full flex flex-col items-center p-3`}
            >
                <div className="flex w-full justify-center gap-4">
                    {/* <div className="w-[300px] hidden lg:block">
            <AdsComponent isDisplay={true} slotId={"7647610361"} />
          </div> */}
                    {data?.length === 0 ? (
                        <LoadingGround mode={1} />
                      
                    ) : (
                        <>

                            <div
                                className={`max-w-[1280px] grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4`}
                            >
                                {data?.map((item, index) => (
                                    <KanjiCard key={index} item={item} />
                                ))}
                            </div>

                        </>
                    )}
                    {/* <div className="w-[300px] hidden lg:block">
            <AdsComponent isDisplay={true} slotId={"7647610361"} />
          </div> */}
                </div>
            </div>
        </div>
    )
}

export default KanjiGround