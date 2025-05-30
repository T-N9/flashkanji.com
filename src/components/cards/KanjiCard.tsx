import { useGeneralStore } from "@/store/generalState";
import { Kanji } from "@/types/kanji";
import { Button } from "@nextui-org/react";
import { Info } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useKanjiSetting } from "../KanjiPage/useKanjiSetting";

interface KanjiCardProps {
  item: Kanji;
  isSwiped?: boolean;
  isInfoShow?: boolean;
}

const KanjiCard: React.FC<KanjiCardProps> = ({ item, isSwiped = false, isInfoShow = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const {  toggleDetailModal, setCurrentDetail } = useGeneralStore((state) => state);

  const {isFlippedMode} = useKanjiSetting();

  const handleOpen = (character: string) => {
    toggleDetailModal()
    setCurrentDetail(character);
  };

  useEffect(() => {
    setIsFlipped(false);
  }, [item]);

  useEffect(() => {
    setIsFlipped(isFlippedMode);
  }, [isFlippedMode]);

  return (
      <div className={`relative mx-auto ${isSwiped ? 'w-full h-[300px] lg:w-[500px] lg:h-[500px]' : 'w-[300px] h-[300px]'}`}>


        <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className={`${isSwiped
                ? "bg-gradient-to-br from-black via-slate-800 to-orange-700"
                : "bg-gradient-to-br from-black via-slate-800 to-orange-700"
            } relative card-shadow mx-auto !h-full font-writing-1 text-white p-5 rounded-md card  border-4 ${isFlipped && "flipped"
            }`}
        >
          <svg className='absolute h-full w-full opacity-50 top-0 left-0' xmlns="http://www.w3.org/2000/svg">
            <filter id="noise" x="0" y="0">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
              <feBlend mode="screen"/>
            </filter>
            <rect className='w-full h-full' filter="url(#noise)" opacity="0.5"/>
          </svg>
          {/* Front Side */}
          {/* {!isSwiped && <span className="front text-gray-100">{item.id}</span>} */}
          <p
              className={`${isSwiped ? "text-[9rem] md:text-[18rem]" : "text-9xl"
              } front text-white absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
          >
            {item.kanji_character}
          </p>

          {/* Back Side */}
          <div
              className={`back absolute w-full top-[25%] -left-[0%] -translate-x-1/2 -translate-y-1/2 flex flex-col  bg-slate-900  px-2 py-6 p-2 ${isSwiped ? "text-xl md:text-[2rem] space-y-0 lg:space-y-0" : " space-y-4 text-lg md:text-xl"
              }`}
          >
            {/* Kunyomi */}
            <p className="text-white flex flex-wrap justify-center">
              {item.kunyomi?.split(",").map((i, index) => (
                  <React.Fragment key={index}>
                    <span>{i}</span>
                    {index !== item.kunyomi.split(",").length - 1 && ", "}
                  </React.Fragment>
              ))}
            </p>

            {/* Onyomi */}
            <p className="text-white flex flex-wrap justify-center">
              {item.onyomi?.split(",").map((i, index) => (
                  <React.Fragment key={index}>
                    <span>{i}</span>
                    {index !== item.onyomi.split(",").length - 1 && ", "}
                  </React.Fragment>
              ))}
            </p>

            {/* Meaning */}
            <p className="text-gray-200">{item.meaning}</p>
          </div>
        </div>

        {isInfoShow && (
            <div className="absolute -right-2 top-0">
              <Button
                  onClick={() => handleOpen(item.kanji_character)}
                  isIconOnly
                  className="mt-2 mx-auto shadow-md text-xs flex justify-center items-center rounded-full bg-[#FA8245]"
                  size="sm"
              >
                <Info size={38} color="#fff" weight="fill"/>
              </Button>
            </div>
        )}
      </div>
  );
};

export default KanjiCard;
