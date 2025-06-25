import HeadingBar from '@/components/Navigation/Header';
import React from 'react'

const PomoLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <HeadingBar />
            {children}
        </>
    )
}

export default PomoLayout