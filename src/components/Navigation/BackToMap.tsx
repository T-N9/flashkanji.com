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
        <div className='fixed border-4 border-orange-200 dark:border-gray-800 border-t-0 shadow w-full px-3 rounded-b-md bg-white dark:bg-slate-900 top-0 left-0 right-0 z-50 max-w-screen-sm mx-auto'>
            <div className="bg-white dark:bg-slate-900 p-2 flex justify-between items-center">
                <Button
                    isIconOnly
                    onClick={() => router.back()}
                    className="text-gray-500 dark:text-white hover:underline"
                >
                    <ArrowBendUpLeft size={32} />
                </Button>

                <div className="gap-3 flex">
                    <div className="flex justify-center items-center gap-1">
                        <p>{currentStreak === 0 ? 0 : currentStreak - 1}</p>
                        <Fire weight="fill" size={32} color="orange" />
                    </div>
                    <div className="flex justify-center items-center gap-1">
                        <p>{lives}</p>
                        <HeartStraight weight="fill" size={32} color="red" />
                    </div>
                    <div className="flex justify-center items-center gap-1">
                        <p>{Math.floor(xp_points)}</p>
                        <Clover weight="fill" size={32} color="green" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BackToMap
