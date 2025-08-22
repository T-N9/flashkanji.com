import BackToMap from '@/components/Navigation/BackToMap';
import React from 'react'

const DeckDetailLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            {/* <BackToMap /> */}
            {children}
        </>
    )
}

export default DeckDetailLayout