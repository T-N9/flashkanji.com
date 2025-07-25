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
            {children}
        </>
    )
}

export default LearnLayout