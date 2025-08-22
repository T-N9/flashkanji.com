import HeadingBar from '@/components/Navigation/Header';
import React from 'react'

const DecksLayout = ({
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

export default DecksLayout