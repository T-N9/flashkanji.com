import Image from 'next/image'
import React from 'react'

const Avatar = ({ emoji, className }: { emoji: string, className ?: string }) => {
    return (
        <div className={`relative ${className}`}>
            <Image className="m-auto scale-[2] absolute" width={120} height={120} src={'/assets/samurai-helmet-1.svg'} alt="avatar" />
            <p className="text-center text-4xl mt-3">{emoji}</p>
        </div>
    )
}

export default Avatar