'use client'
import { Button } from '@heroui/react'
import { ArrowBendUpLeft, Clover, Fire, HeartStraight } from '@phosphor-icons/react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userState'

const BackToMap = () => {
    const router = useRouter()
    const { currentStreak, lives, xp_points } = useUserStore();

    return (
        <div className='fixed border-4 border-orange-200 dark:border-gray-800 border-t-0 shadow w-full px-3 rounded-b-md bg-white dark:bg-dark_1 top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto'>
            <div className="bg-white dark:bg-dark_1 p-2 flex justify-between items-center">
                <Button
                    isIconOnly
                    onClick={() => router.back()}
                    className="text-gray-500 dark:text-white dark:border dark:border-dark hover:underline"
                >
                    <ArrowBendUpLeft size={32} />
                </Button>

                <div className="gap-3 flex">
                    <div className="flex justify-center items-center gap-0">
                        <p className="text-yellow-500 font-bold">{currentStreak === 0 ? 0 : currentStreak - 1}</p>
                        <img src="/assets/icons/streak.png" width={35} height={35} />
                    </div>
                    <div className="flex justify-center items-center gap-0">
                        <p className="text-red-500 font-bold">{lives}</p>
                        <img src="/assets/icons/heart.png" width={38} height={38} />
                    </div>
                    <div className="flex justify-center items-center gap-0">
                        <p className="text-green-500 font-bold">{Math.floor(xp_points)}</p>
                        <img src="/assets/icons/clover.png" width={35} height={35} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BackToMap
