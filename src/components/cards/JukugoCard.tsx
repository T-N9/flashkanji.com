import { useGeneralStore } from "@/store/generalState";
import { Kanji } from "@/types/kanji";
import { Button } from "@nextui-org/react";
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
  const { setJukugoDetail , toggleJukugoDetailModal} = useGeneralStore((state) => state);

  const { isFlippedMode } = useJukugoSetting();

  const handleOpen = (character: string, hiragana : string) => {
    toggleJukugoDetailModal()
    setJukugoDetail({character, hiragana});
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
        className={`bg-gradient-to-br from-orange-400  to-orange-700 relative font-writing-1 text-white p-5 rounded-md card min-w-[150px] border-4 lg:min-w-[200px] shadow-md ${isFlipped && "flipped"
          } }`}
      >
        {/* Front Side */}
        <p
          className={`${isSwiped ? "text-4xl md:text-[5rem]" : "text-3xl"
            } front text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        >
          {item.jukugo_char}
        </p>

        {/* Back Side */}
        <div
          className={`back bg-gray-800 absolute w-full top-[30%] -left-[0%] -translate-x-1/2 -translate-y-1/2 flex flex-col gap-5 px-2 py-6 ${isSwiped ? "text-2xl md:text-[3rem]" : "text-xl"
            }`}
        >
          {/* Hiragana */}
          <p className="text-gray-200">{item.hiragana}</p>


          {/* Meaning */}
          {
            isShowMeanings &&
            <p className="text-gray-200">{item.english_meaning}</p>
          }

        </div>
      </div>

      {isInfoShow && (
        <div className="absolute -right-2 top-0">
          <Button
            onClick={() => handleOpen(item.jukugo_char, item.hiragana)}
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
