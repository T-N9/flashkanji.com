'use client'
import { Button } from '@heroui/react'
import { ArrowBendUpLeft } from '@phosphor-icons/react'
import React from 'react'
import { useRouter } from 'next/navigation'

const BackToMap = () => {
    const router = useRouter()

    return (
        <div className='max-w-screen-sm mx-auto'>
            <div className="bg-white p-2">
                <Button
                    isIconOnly
                    onClick={() => router.back()}
                    className="text-gray-500 hover:underline"
                >
                    <ArrowBendUpLeft size={32} />
                </Button>
            </div>
        </div>
    )
}

export default BackToMap
