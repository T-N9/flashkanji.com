'use client'

import { JukugoSetting } from "./JukugoSetting";
import { LoadingGround } from "../common/LoadingGround";
import { useJukugoByChapterAndLevel } from "@/services/jukugo";
import useJukugoSetting from "./useJukugoSetting";
import { SpeedDialMenu } from "../common/SpeedDailMenu";
import JukugoCard from "../cards/JukugoCard";
import { useEffect, useState } from "react";
import { relatedJukugoItem } from "@/types/jukugo";
import { shuffleArray } from "@/util";

export const JukugoGround = () => {

  const [jukugoData, setJukugoData] = useState<relatedJukugoItem[] | null>(null)

  const { jukugo, level, chapter, isShowMeaning, setJukugo, setNoChapters, n5NoChapters, n4NoChapters, n3NoChapters, part, isParted } = useJukugoSetting()

  const { data, isLoading, error } = useJukugoByChapterAndLevel(chapter ? chapter : null,
    level ? level : null, isParted ? part : null);

  const handleShuffleJukugoData = () => {
    if (jukugoData) {
      const shuffledJukugoData = shuffleArray(jukugoData);
      setJukugoData(shuffledJukugoData);
      setJukugo(shuffledJukugoData);
    }
  }

  useEffect(() => {
    if (data && JSON.stringify(data) !== JSON.stringify(jukugoData)) {
      console.log({ data });
      setJukugo(data)
      // @ts-ignore
      setJukugoData(data);
    }
  }, [data]);

  useEffect(() => {
    if (level) {
      handleLevelSelection(level);
    }
  }, [level]);

  const handleLevelSelection = (selectedLevel: number) => {
    switch (selectedLevel) {
      case 5:
        setNoChapters(n5NoChapters);
        break;
      case 4:
        setNoChapters(n4NoChapters);
        break;
      case 3:
        setNoChapters(n3NoChapters);
        break;
      default:
        break;
    }
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center">
      <JukugoSetting handleShuffle={handleShuffleJukugoData} />

      <div className=''>
        <div className="flex justify-center items-center gap-2">
          <h1 className="text-2xl font-bold text-orange-500">Jukugo Ground</h1>
          <span className="text-sm text-gray-500">({jukugoData?.length === 0 ? '?' : jukugoData?.length} jukugo)</span>
        </div>
        <p className="text-center lg:w-1/2 px-2 mx-auto text-sm text-gray-500">
          Sit back and relax, and take your time to learn each jukugo.
          You may write them down on your physical book.
          Click on the jukugo to flip the card and see its meaning.
        </p>
      </div>
      <div className="flex w-full justify-center px-4 lg:px-0 gap-4 mt-20 mb-40">
        {jukugoData?.length === 0 ? (
          <LoadingGround mode={2} />
        ) : (
          <div
            className={`grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1280px]`}
          >
            {jukugoData?.map((item, index) => {
              return <JukugoCard key={index} item={item} isShowMeanings={isShowMeaning} />;
            })}
          </div>
        )}
      </div>
      {/* <div className="my-10 p-4">
        <h1 className="font-bold text-orange-500">Jukugo Data :</h1>
        <div className="flex gap-2 my-5 flex-wrap">
          {jukugoData?.map((item, index) => {
            return <p key={index}>{item?.jukugo_char}</p>;
          })}
        </div>
      </div> */}
      {/* <SpeedDialMenu mode={2} /> */}
    </section>
  );
};
