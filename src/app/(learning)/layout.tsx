import Footer from '@/components/footer/Footer';
import HeadingBar from '@/components/Navigation/Header';
import React from 'react'

const LearnLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <HeadingBar />
            {children}
            <Footer />
        </>
    )
}

export default LearnLayout