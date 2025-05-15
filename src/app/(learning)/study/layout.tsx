import BackToMap from '@/components/Navigation/BackToMap';
import React from 'react'

const StudyLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <BackToMap />
            {children}
        </>
    )
}

export default StudyLayout