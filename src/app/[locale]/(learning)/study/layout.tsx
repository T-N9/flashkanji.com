'use client'

import BackToMap from '@/components/Navigation/BackToMap';
import { useRouter } from '@/i18n/navigation';
import { useGeneralStore } from '@/store/generalState';

import React, { useEffect } from 'react'

const StudyLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { isInGround } = useGeneralStore();
    const router = useRouter();
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!isInGround) {
            router.push('/flashboard')
        }
    }, []);

    return (
        <>
            {
                isInGround ?
                    <>
                        <BackToMap />
                        {/* <div className='mb-14'></div> */}
                        {children}
                    </>
                    :
                    <p className='text-center my-10'>Invalid session or Please select a session.</p>
            }

        </>
    )
}

export default StudyLayout