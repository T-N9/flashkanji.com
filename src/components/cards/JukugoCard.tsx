import { useGeneralStore } from "@/store/generalState";
import { Kanji } from "@/types/kanji";
import { Button } from "@heroui/react";
import { Info } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useKanjiSetting } from "../KanjiPage/useKanjiSetting";
import { relatedJukugoItem } from "@/types/jukugo";
import useJukugoSetting from "../JukugoGround/useJukugoSetting";

interface JukugoCardProps {
  item: relatedJukugoItem;
  isSwiped?: boolean;
  isInfoShow?: boolean;
  isShowMeanings?: boolean;
}

const JukugoCard: React.FC<JukugoCardProps> = ({ item, isSwiped = false, isInfoShow = true, isShowMeanings = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { setJukugoDetail, toggleJukugoDetailModal } = useGeneralStore((state) => state);

  const { isFlippedMode } = useJukugoSetting();

  const handleOpen = (character: string, hiragana: string, meaning : string) => {
    toggleJukugoDetailModal()
    setJukugoDetail({ character, hiragana, meaning });
  };


  useEffect(() => {
    setIsFlipped(false);
  }, [item]);

  useEffect(() => {
    setIsFlipped(isFlippedMode);
  }, [isFlippedMode]);

  return (
    <div className="relative">
      <div
        onClick={() => setIsFlipped((prev) => !prev)}
        className={`bg-gradient-to-br from-black via-slate-800 to-orange-700 relative font-writing-1 text-white p-5 rounded-md card jukugo_card min-w-[150px] border-4 lg:min-w-[200px] card-shadow ${isFlipped && "flipped" 
          } ${isSwiped && "!h-[200px] lg:!h-[300px]"}`}
      >
        <svg className='absolute h-full w-full opacity-50 top-0 left-0' xmlns="http://www.w3.org/2000/svg">
          <filter id="noise" x="0" y="0">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feBlend mode="screen" />
          </filter>
          <rect className='w-full h-full' filter="url(#noise)" opacity="0.5" />
        </svg>
        {/* Front Side */}
        <p
          className={`${isSwiped ? "text-3xl md:text-[3rem]" : "text-3xl"
            } front text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        >
          {item.character}
        </p>

        {/* Back Side */}
        <div
          className={`back bg-gray-800 absolute w-full  -left-[0%] flex flex-col gap-2 px-2 py-6  ${isSwiped ? "top-[25%] lg:top-[30%] text-base md:text-[2rem] lg:!leading-8 !leading-6" : "top-[20%] text-xl !leading-8"
            }`}
        >
          {/* Hiragana */}
          <p className="text-gray-200">{item.hiragana}</p>


          {/* Meaning */}
          {
            isShowMeanings &&
            <p className="text-gray-200">{item.meaning}</p>
          }

        </div>
      </div>

      {isInfoShow && (
        <div className="absolute -right-2 top-0">
          <Button
            onClick={() => handleOpen(item.character, item.hiragana, item.meaning)}
            isIconOnly
            className="mt-2 mx-auto shadow-md text-xs flex justify-center items-center rounded-full bg-[#FA8245]"
            size="sm"
          >
            <Info size={38} color="#fff" weight="fill" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default JukugoCard;
