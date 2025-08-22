import HeartRestorer from '@/components/heart-restorer';
import TimerController from '@/components/pomodoro/TimerController';
import { VictoryModal } from '@/components/victory-loss-modal';
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

            <VictoryModal/>
        </>
    )
}

export default LearnLayout