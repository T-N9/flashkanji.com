"use client";
import { useKanjiByChapterAndLevel } from "@/services/kanji";
import { calculateNextReview, Clicked_Item, SR_Flashcard } from "@/util";
import { Button } from "@nextui-org/react";
import React, { useEffect, useMemo, useRef, useState } from "react";

const Flash_Kanji_Item = ({
  sr_data,
  spacedRepetitionData,
  setSpacedRepetitionData,
  handleClickLevel,
  character,
  meaning,
  onyomi,
  kunyomi,
}: {
  sr_data: SR_Flashcard;
  spacedRepetitionData: SR_Flashcard[];
  setSpacedRepetitionData: React.Dispatch<React.SetStateAction<SR_Flashcard[]>>;
  handleClickLevel: (id: number, level: number) => void;
  character: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="h-[500px] py-10">
      <div
        className={`flex h-full flex-col justify-between items-center cursor-pointer transition-all duration-200 ease-out`}
      >
        <div className="text-center">
          <div className="text-9xl font-bold">{character}</div>

          {
            isFlipped && <div className="mt-5 text-4xl">
              <div className="">{meaning}</div>
              <div className=" font-semibold text-gray-600">
                Onyomi: {onyomi}
              </div>
              <div className=" font-semibold text-gray-600">
                Kunyomi: {kunyomi}
              </div>
            </div>
          }
        </div>

        {/* Easy 😴
        Medium😎
        Hard 🤔
        Difficult 🤯 */}
        {
          isFlipped ?
            <div className="flex justify-around mt-4 gap-4">
              {["🤯", "🤔", "😎", "😴"].map((rating, index) => (
                /* [I, H, M , E] */
                <Button
                  key={rating}
                  className="bg-gray-200 text-2xl text-gray-800 font-semibold py-1 px-3 rounded-lg hover:bg-gray-300"
                  onClick={() => {
                    const updatedCard = calculateNextReview(sr_data, index);
                    console.log({ index })
                    const updatedStoredData = spacedRepetitionData.map(item =>
                      item.id === updatedCard.id ? updatedCard : item
                    );

                    setSpacedRepetitionData(updatedStoredData)

                    localStorage.setItem('spacedRepetitionData', JSON.stringify(updatedStoredData));

                    handleClickLevel(updatedCard.id, index);
                  }

                  }
                >
                  {rating}
                </Button>
              ))}
            </div>
            :
            <Button onClick={() => setIsFlipped(true)}>
              Show Answer
            </Button>
        }


      </div>
    </div>
  );
};

const SpacedRepetition = () => {
  const { data: rawData, isLoading, isError } = useKanjiByChapterAndLevel(2, 5);
  const data = useMemo(() => rawData, [rawData]); // Memoize data
  const [spacedRepetitionData, setSpacedRepetitionData] = useState<SR_Flashcard[]>([]);
  const [clickedRepetitionData, setClickedRepetitionData] = useState<Clicked_Item[]>([]);
  const isInitialized = useRef(false); // Track initialization
  const storedData = localStorage?.getItem('spacedRepetitionData');

  const [activeItem, setActiveItem] = useState<number | null>(null);

  useEffect(() => {
    console.log("data mounted")
    if (data && data?.length > 0 && !isInitialized.current) {
      setActiveItem(data[0].id);
      isInitialized.current = true; // Mark as initialized

      const initialLevelClickData = data.map((kanji) => ({
        id: kanji.id,
        clickedLevel: 0
      }))
      setClickedRepetitionData(initialLevelClickData);
      if (storedData && storedData?.length > 0) {
        setSpacedRepetitionData(JSON.parse(storedData));

      } else {
        const initialData = data.map((kanji) => ({
          id: kanji.id,
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReviewDate: new Date(),
        }));



        setSpacedRepetitionData(initialData);

        console.log({ initialData, rawData })
        localStorage.setItem('spacedRepetitionData', JSON.stringify(initialData));
      }
    }
  }, [data]);

  console.log({ spacedRepetitionData })

  const handleClickLevel = (id: number, level: number) => {
    console.log({ clickedRepetitionData, id, level })
    // Find index of the item with the given id
    let temp_array = clickedRepetitionData;
    const index = clickedRepetitionData.findIndex(item => item.id === id);
    if (index === -1) return; // If item not found, exit

    if (level === 3) {
      // Remove item if level is 3
      temp_array.splice(index, 1);
      setClickedRepetitionData(temp_array)
    } else {
      // Calculate new index based on the level
      let newIndex = index + (level === 0 ? 2 : 4);
      newIndex = Math.max(newIndex, 0); // Ensure index doesn't go below 0

      // Remove and reinsert item at the new index
      const [item] = temp_array.splice(index, 1);
      temp_array.splice(newIndex, 0, item);

      setClickedRepetitionData(temp_array)
    }

    // Set active item as the first item's ID
    if (clickedRepetitionData.length > 0) {
      setActiveItem(clickedRepetitionData[0].id);
    }


  };

  console.log({ activeItem })

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {data?.map((kanji, index) => (
            <React.Fragment key={index}>
              {
                activeItem === kanji.id &&
                <div key={index}>
                  <p className="font-bold text-red-600 text-xl text-center">{index + 1}</p>
                  <Flash_Kanji_Item
                    sr_data={spacedRepetitionData.find(item => item.id === kanji.id) || {
                      id: kanji.id,
                      interval: 1,
                      repetitions: 0,
                      easeFactor: 2.5,
                      nextReviewDate: new Date(),
                    }}
                    handleClickLevel={handleClickLevel}
                    spacedRepetitionData={spacedRepetitionData}
                    setSpacedRepetitionData={setSpacedRepetitionData}
                    character={kanji.kanji_character}
                    onyomi={kanji.onyomi}
                    kunyomi={kanji.kunyomi}
                    meaning={kanji.meaning}
                  />
                </div>
              }

            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpacedRepetition;
