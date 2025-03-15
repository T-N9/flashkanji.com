"use client";
import { useKanjiByChapterAndLevel } from "@/services/kanji";
import { Clicked_Item, SR_KanjiCard } from "@/util";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useRepetitionGround from "./useRepetitionGround";
import { KanjiRepetitionItem } from "./KanjiRepetitionItem";
import { usePathname } from "next/navigation";
import { useJukugoByChapterAndLevel } from "@/services/jukugo";
import { Kanji } from "@/types/kanji";
import { relatedJukugoItem } from "@/types/jukugo";
import { JukugoRepetitionItem } from "./JukugoRepetitionItem";
import { Button } from "@nextui-org/react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

type RepetitionType = Kanji[] | relatedJukugoItem[];

const SpacedRepetition = () => {
  const pathname = usePathname();

  const { chapter, level } = useRepetitionGround();
  const kanjiData = useKanjiByChapterAndLevel(
    chapter ? parseInt(chapter) : null,
    level ? parseInt(level) : null
  )?.data;

  const jukugoData = useJukugoByChapterAndLevel(
    chapter ? parseInt(chapter) : null,
    level ? parseInt(level) : null
  )?.data;

  const rawData =
    pathname === "/study/kanji/repetition" ? kanjiData : jukugoData;

  const data = useMemo(() => rawData, [rawData]); // Memoize data
  const [spacedRepetitionData, setSpacedRepetitionData] = useState<
    SR_KanjiCard[]
  >([]);
  const [clickedRepetitionData, setClickedRepetitionData] = useState<
    Clicked_Item[]
  >([]);
  const isInitialized = useRef(false); // Track initialization
  const storedData =
    typeof window !== "undefined" &&
    localStorage?.getItem("spacedRepetitionData");

  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [ satisfactionPoint, setSatisfactionPoint ] = useState<number>(0);

  const handleShuffleRepetitionData = (
    array: Kanji[] | relatedJukugoItem[]
  ) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handlePrepareRepetitionData = () => {
    console.log("Restarting");

    if (data && data?.length > 0 && !isInitialized.current) {
      const shuffledData = handleShuffleRepetitionData(data);

      setActiveItem(data[0].id);
      isInitialized.current = true; // Mark as initialized

      const initialLevelClickData = shuffledData.map((item) => ({
        id: item.id,
        clickedLevel: 0,
      }));
      setClickedRepetitionData(initialLevelClickData);
      if (storedData && storedData?.length > 0) {
        const parsedData = JSON.parse(storedData)
        setSpacedRepetitionData(parsedData);
      } else {
        const initialData = shuffledData.map((item) => ({
          id: item.id,
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReviewDate: new Date(),
          previousClick : null,
        }));

        setSpacedRepetitionData(initialData);

        console.log({ initialData, rawData });
        localStorage.setItem(
          "spacedRepetitionData",
          JSON.stringify(initialData)
        );
      }
    }
  };

  useEffect(() => {
    console.log("data mounted");
    handlePrepareRepetitionData();
  }, [data]);

  console.log({ spacedRepetitionData });

  const handleRestartRepetitionSession = () => {
    isInitialized.current = false;
    handlePrepareRepetitionData();
  };

  const handleClickLevel = (id: number, level: number) => {
    console.log({ clickedRepetitionData, id, level });
    // Find index of the item with the given id
    const temp_array = clickedRepetitionData;
    const index = clickedRepetitionData.findIndex((item) => item.id === id);
    if (index === -1) return; // If item not found, exit

    if (level === 3) {
      // Remove item if level is 3
      temp_array.splice(index, 1);
      setClickedRepetitionData(temp_array);
    } else {
      // Calculate new index based on the level
      let newIndex = index + (level === 0 ? 2 : 4);
      newIndex = Math.max(newIndex, 0); // Ensure index doesn't go below 0

      // Remove and reinsert item at the new index
      const [item] = temp_array.splice(index, 1);
      temp_array.splice(newIndex, 0, item);

      setClickedRepetitionData(temp_array);
    }

    // Set active item as the first item's ID
    if (clickedRepetitionData.length > 0) {
      setActiveItem(clickedRepetitionData[0].id);
    }
  };

  console.log({ activeItem });

  function getConfidenceEmoji(confidence: number): string {
    if (confidence <= -10) return "😵"; // Extremely lost
    if (confidence < 0) return "😖"; // Struggling
    if (confidence === 0) return "😕"; // Uncertain
    if (confidence <= 4) return "😐"; // Neutral
    if (confidence <= 9) return "🙂"; // Slightly confident
    if (confidence <= 14) return "😊"; // Feeling good
    if (confidence <= 19) return "😁"; // Quite confident
    if (confidence <= 24) return "😃"; // Very confident
    return "🤩"; // Mastered (25 - 30+)
  }

  return (
    <div className="h-screen">
      {data?.length === 0 ? (
        <div className="w-full h-80 flex justify-center items-center">
          <p>Preparing Session...</p>
        </div>
      ) : (
        <div className="mt-5">
          {pathname === "/study/kanji/repetition" ? (
            clickedRepetitionData.length !== 0 ? (
              data?.map((kanji, index) => (
                <React.Fragment key={index}>
                  {activeItem === kanji.id && (
                    <div key={index}>
                      <p className="text-center text-4xl">{getConfidenceEmoji(satisfactionPoint)}</p>
                      <p className=" text-gray-600 table mx-auto text-base text-center">
                        {clickedRepetitionData.length} cards left
                      </p>
                      
                      <KanjiRepetitionItem
                        sr_data={
                          spacedRepetitionData.find(
                            (item) => item.id === kanji.id
                          ) || {
                            id: kanji.id,
                            interval: 1,
                            repetitions: 0,
                            easeFactor: 2.5,
                            nextReviewDate: new Date(),
                            previousClick : null,
                          }
                        }
                        handleClickLevel={handleClickLevel}
                        spacedRepetitionData={spacedRepetitionData}
                        setSpacedRepetitionData={setSpacedRepetitionData}
                        character={(kanji as Kanji).kanji_character}
                        onyomi={(kanji as Kanji).onyomi}
                        kunyomi={(kanji as Kanji).kunyomi}
                        meaning={(kanji as Kanji).meaning}
                        satisfaction={satisfactionPoint}
                        setSatisfaction={setSatisfactionPoint}
                      />

                      {/* if it is not kanji route (jukugo route) this will conditionally render <JukugoRepetitionItem/> */}
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="flex flex-col gap-5 items-center">
                <p className="text-center">
                  Flash Repetition Session Completed.
                </p>
                <p className="text-center text-xl">You are feeling {getConfidenceEmoji(satisfactionPoint)}.</p>
                <Button
                  isIconOnly
                  onClick={() => handleRestartRepetitionSession()}
                  className="w-20 h-20 rounded-full"
                >
                  <ArrowCounterClockwise size={52} />
                </Button>
              </div>
            )
          ) : clickedRepetitionData.length !== 0 ? (
            data?.map((jukugo, index) => (
              <React.Fragment key={index}>
                {activeItem === jukugo.id && (
                  <div key={index}>
                    <p className="font-bold text-orange-600 table mx-auto text-xl text-center">
                      {index + 1}
                    </p>
                    <JukugoRepetitionItem
                      sr_data={
                        spacedRepetitionData.find(
                          (item) => item.id === jukugo.id
                        ) || {
                          id: jukugo.id,
                          interval: 1,
                          repetitions: 0,
                          easeFactor: 2.5,
                          nextReviewDate: new Date(),
                          previousClick : null,
                        }
                      }
                      handleClickLevel={handleClickLevel}
                      spacedRepetitionData={spacedRepetitionData}
                      setSpacedRepetitionData={setSpacedRepetitionData}
                      character={(jukugo as relatedJukugoItem).jukugo_char}
                      meaning={(jukugo as relatedJukugoItem).english_meaning}
                      hiragana={(jukugo as relatedJukugoItem).hiragana}
                    />

                    {/* if it is not kanji route (jukugo route) this will conditionally render <JukugoRepetitionItem/> */}
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="flex flex-col gap-5 items-center">
              <p className="text-center">Flash Repetition Session Completed.</p>
              <p className="text-center">You are feeling {getConfidenceEmoji(satisfactionPoint)}.</p>
              <Button
                isIconOnly
                onClick={() => handleRestartRepetitionSession()}
                className="w-20 h-20 rounded-full"
              >
                <ArrowCounterClockwise size={52} />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpacedRepetition;
