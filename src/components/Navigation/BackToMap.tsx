'use client'
import { Button } from '@nextui-org/react'
import { ArrowBendUpLeft } from '@phosphor-icons/react'
import Link from 'next/link'
import React from 'react'

const BackToMap = () => {
    return (
        <div className='max-w-screen-xl mx-auto'>
            <div className=" bg-white p-2">
                <Button as={Link} href="/flashmap" isIconOnly className="text-gray-500 hover:underline">
                    <ArrowBendUpLeft size={32} />
                </Button>
            </div>
        </div>
    )
}

export default BackToMap