'use client'
import React, { useEffect, useState } from 'react'
import { KanjiSetting } from './KanjiSetting'
import { useKanjiSetting } from './useKanjiSetting';
import { useKanjiByChapterAndLevel, useKanjiByMultipleChapters } from '@/services/kanji';
import KanjiCard from '../cards/KanjiCard';
import { LoadingGround } from '../common/LoadingGround';
import { Kanji } from '@/types/kanji';
import { shuffleArray } from '@/util';
import { Button } from '@heroui/react';
import { useGeneralStore } from '@/store/generalState';
import { useSaveEndSection } from '@/services/progress';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userState';
import Link from 'next/link';
import { CheckCircle } from '@phosphor-icons/react';

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
        isParted,
        part
    } = useKanjiSetting();

    // Call both hooks unconditionally
    const multipleChaptersData = useKanjiByMultipleChapters(
        chapters?.toString() || '',
        level ? level : null
    );
    const singleChapterData = useKanjiByChapterAndLevel(
        chapter ? chapter : null,
        level ? level : null,
        isParted ? part : null
    );

    const { data, isLoading, error } =
        Array.isArray(selectedMultiChapters) && selectedMultiChapters.length > 0
            ? multipleChaptersData
            : singleChapterData;

    const { mapItemData, setShouldRefetchChapter } = useGeneralStore();

    // Update the number of chapters based on the selected level
    useEffect(() => {
        if (level) {
            handleLevelSelection(level);
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

    const { userId } = useUserStore();

    const { mutate: saveSection, isLoading: saveLoading } = useSaveEndSection();
    const router = useRouter();

    const handleFinishSection = () => {
        if (mapItemData?.isCurrent) {
            saveSection(
                {
                    user_id: userId,
                    chapter: mapItemData?.chapter,
                    level: mapItemData?.level,
                    phase: mapItemData?.phase,
                    stepIndex: mapItemData?.stepIndex - 1
                },
                {
                    onSuccess: () => {
                        console.log("Section saved successfully.");
                        setShouldRefetchChapter(true);
                        router.push("/flashmap");
                    },
                    onError: (error) => {
                        console.error("Failed to save section:", error);
                    },
                }
            );
        } else {
            router.push('/flashmap')
        }
    }


    return (
        <div>
            <KanjiSetting handleShuffle={handleShuffleKanjiData} />

            <div className='relative z-20 pt-4'>
                <div className="flex justify-center items-center gap-2">
                    <h1 className="text-2xl font-bold text-orange-500">Kanji Ground</h1>
                    <span className="text-sm text-gray-500">({kanjiData?.length === 0 ? '?' : kanjiData?.length} kanji)</span>
                </div>
                <p className="text-center lg:w-1/2 px-2 mx-auto text-sm text-gray-500">
                    Sit back and relax, and take your time to learn each kanji.
                    You may write them down on your physical book.
                    Click on the kanji to flip the card and see the readings.
                </p>

                {
                    mapItemData && mapItemData.isCurrent ?
                        <Button onClick={handleFinishSection} variant='bordered' color='primary' className='table mx-auto mt-2'>
                            {saveLoading ? 'Saving...' : 'Mark as Done'}
                        </Button> :

                        <div className='flex gap-2 justify-center items-center mt-2'>
                            <CheckCircle className='text-green-500' size={32} />
                            <Button as={Link} href="/flashmap" size="sm" variant='faded' color='default' className=''>
                                Flashmap
                            </Button>
                        </div>
                }

            </div>

            <div
                className={`relative transition-all main-container duration-200 ease-out container w-full flex flex-col items-center p-3 justify-center mt-10 mb-40`}
            >
                <div className="flex w-full justify-center gap-4">
                    {kanjiData?.length === 0 ? (
                        <LoadingGround mode={1} />

                    ) : (
                        <>

                            <div
                                className={`max-w-[1280px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full`}
                            >
                                {kanjiData?.map((item, index) => (
                                    <KanjiCard key={index} item={item} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    )
}

export default KanjiGround