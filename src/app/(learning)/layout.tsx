import HeartRestorer from '@/components/heart-restorer';
import TimerController from '@/components/pomodoro/TimerController';
import React from 'react'

const LearnLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <TimerController />
            <HeartRestorer/>
            {children}
        </>
    )
}

export default LearnLayout