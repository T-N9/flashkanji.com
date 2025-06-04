import Image from 'next/image'
import React from 'react'

const RamenLoading = () => {
    return (
        <div className="w-full h-80 flex justify-center items-center">
            <Image className="tilt-animation drop-shadow-lg scale-50" src={'/assets/ramen.png'} width={200} height={200} alt="Loading Session" />
        </div>
  )
}

export default RamenLoading