'use client'
import { useJukugoByChapterAndLevel } from '@/services/jukugo';
import useJukugoGroundState from '@/store/jukugoGroundState'
import React from 'react'

const JukugoBuilder = () => {

    const {
        level, part, selectedChapter: chapter, isParted
    } = useJukugoGroundState()

    //   const { data, isLoading, error } = useJukugoByChapterAndLevel(chapter ? chapter : null,
    //     level ? level : null, isParted ? part : null);

    const { data, isLoading, error } = useJukugoByChapterAndLevel(1,
        3, "0");

    if (isLoading) return <div>Loading...</div>;
    return (
        <div>JukugoBuilder</div>
    )
}

export default JukugoBuilder