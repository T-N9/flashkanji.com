'use client'
import React, { useEffect, useState } from 'react'
import { LoadingGround } from '../common/LoadingGround';
import { shuffleArray } from '@/util';
import { DeckSetting } from './DeckSetting';
import { useDeckSetting } from './useDeckSetting';
import { useDeckSrsSessionDetail } from '@/services/deck';
import { useUserStore } from '@/store/userState';
import { DeckItem } from '@/types/deckItem';
import DeckCard from '../cards/DeckCard';
import useDeckGroundState from '@/store/deckGroundState';
import { LoadingDeckGround } from '../common/LoadingDeckGround';

const DeckGround = () => {

    const [fetchedDeckData, setFetchedDeckData] = useState<DeckItem[] | null>(null)
    const {
        setDeckData,
    } = useDeckSetting();

    const { deckId, srsId, isReviewMode } = useDeckGroundState();
    const { userId } = useUserStore()
    const { data, isLoading, error } = useDeckSrsSessionDetail(deckId || 1, userId, srsId || 1, isReviewMode);

    const handleShufflefetchedDeckData = () => {
        if (fetchedDeckData) {
            const shuffledfetchedDeckData = shuffleArray(fetchedDeckData)
            setFetchedDeckData(shuffledfetchedDeckData);
            setDeckData(shuffledfetchedDeckData);
        }
    }

    useEffect(() => {
        if (data && JSON.stringify(data) !== JSON.stringify(fetchedDeckData)) {
            console.log({ data });
            setDeckData(data.cardData)
            // @ts-ignore
            setFetchedDeckData(data.cardData);
        }
    }, [data]);


    return (
        <div>
            <DeckSetting handleShuffle={handleShufflefetchedDeckData} />

            <div className='relative z-20 pt-4'>
                <div className="flex justify-center items-center gap-2">
                    <h1 className="text-2xl font-bold text-orange-500">Deck Ground</h1>
                    <span className="text-sm text-gray-500">({fetchedDeckData?.length === 0 ? '?' : fetchedDeckData?.length} charaters)</span>
                </div>
                <p className="text-center lg:w-1/2 px-2 mx-auto text-sm text-gray-500">
                    Sit back and relax, and take your time to learn each character.
                    You may write them down on your physical book.
                    Click on the character to flip the card and see the readings.
                </p>
            </div>
            <div
                className={`relative transition-all main-container duration-200 ease-out container w-full flex flex-col items-center p-3 justify-center mt-20 mb-40`}
            >
                <div className="flex w-full justify-center gap-4">

                    {isLoading ? (
                        <LoadingDeckGround />

                    ) : (
                        <>

                            <div
                                className={`max-w-[1280px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full`}
                            >
                                {fetchedDeckData?.map((item, index) => (
                                    <DeckCard key={index} item={item} />
                                ))}
                            </div>

                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DeckGround