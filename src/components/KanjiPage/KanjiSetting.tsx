"use client";

import { Button, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Tooltip } from "@nextui-org/react";

/* Hook */
import { useKanjiSetting } from "./useKanjiSetting";
import { ArrowsClockwise, Brain, DiamondsFour, Shuffle } from "@phosphor-icons/react";
import Link from "next/link";

interface KanjiSettingProps {
  handleShuffle: () => void; // Add this prop type
}

export const KanjiSetting: React.FC<KanjiSettingProps> = ({ handleShuffle }) => {
  const {
    noChapters,
    selectedMultiChapters,
    setSelectedMultiChapters,
    level,
    chapter,
    updateQueryParams,
    handleIncludedChapterClick,
    toggleIsFlippedMode
  } = useKanjiSetting();

  return (
    <section
      className={`container mt-5 bg-gray-50 z-10 border-2 border-gray-100 relative flex flex-col gap-3 justify-center items-center  rounded-md shadow-md transform duration-300 
      w-full mx-auto max-w-screen-xl px-4 py-4 lg:px-8 lg:py-4 mb-4`}
    >
      <div
        className={`w-full flex flex-col lg:flex-row justify-center gap-4 items-center transition-all duration-200 ease-in `}
      >
        <div className="flex gap-4 w-full md:w-fit justify-center items-center flex-wrap">
          <div className="flex gap-4 w-full md:w-fit">
            <div className="flex w-full md:w-36 min-w-36 select-box flex-col gap-6">
              <Select
                // @ts-ignore
                items={[5, 4, 3, 2, 1]}
                color="default"
                size="sm"
                className="drop-shadow"
                label="Select Level"
                defaultSelectedKeys={level?.toString()}
                onSelectionChange={() => {
                  setSelectedMultiChapters([]);
                }}
              >
                {[5, 4, 3, 2, 1].map((item) => (
                  <SelectItem
                    key={item}
                    onClick={() => {
                      updateQueryParams('level', item.toString())
                    }}
                    value={"N" + item.toString()}
                    isDisabled={item <= 2} // Assuming that levels 3 and above are disabled
                    isSelected={"N" + item === level}
                  >
                    {"N" + item.toString()}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex w-full md:w-36 min-w-36 select-box flex-col gap-6">
              <Select
                // @ts-ignore
                items={noChapters}
                color="default"
                size="sm"
                className="drop-shadow"
                label="Select Chapter"
                defaultSelectedKeys={[
                  // @ts-ignore
                  noChapters[chapter - 1]?.toString(),
                ]}
                onSelectionChange={() => {
                  setSelectedMultiChapters([]);
                }}
                // @ts-ignore
                selectedKeys={[chapter?.toString() || '']}
              >
                {noChapters.map((item) => (
                  <SelectItem
                    key={item}
                    onClick={() => {
                      updateQueryParams('chapter', item.toString())
                    }}
                    value={item.toString()}
                    isSelected={item.toString() === chapter}
                    textValue={item.toString()}
                  >
                    {item}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <Popover backdrop="opaque" placement="bottom" showArrow={true}>
            <PopoverTrigger>

              <Button
                isIconOnly
                title="Select Multiple Chapters"
                className=" flex justify-center items-center text-white rounded-md text-xs"
                color="primary"
                variant="solid"
              >
                <DiamondsFour size={32} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4">
              <div className="grid grid-cols-5 gap-3 max-w-[300px]">
                {noChapters?.map((item) => {
                  const isSelected = selectedMultiChapters?.includes(item);
                  return (
                    <button
                      onClick={() => handleIncludedChapterClick(item)}
                      key={item}
                      value={item.toString()}
                      className={`${isSelected
                        ? "bg-gradient-radial text-white"
                        : "bg-gray-300 text-gray-800"
                        } rounded-full p-0 w-12 h-12 text-lg shadow-none`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              {
                level &&
                <Button
                  onClick={() =>
                    updateQueryParams('chapters', selectedMultiChapters.toString())
                  }
                  className="mt-3 mx-auto bg-orange-500 text-white tracking-tight table"
                >
                  Confirm
                </Button>
              }

            </PopoverContent>
          </Popover>

          <Tooltip className="font-primary-san" content="Shuffle" color="primary" placement="bottom">
            <Button
              onClick={() => handleShuffle()}
              variant="bordered"
              className=" text-info rounded-full"
              title="Shuffle"
            >
              <Shuffle size={32} />
            </Button>
          </Tooltip>

          <Tooltip className="font-primary-san" content="Flip All" color="primary" placement="bottom">
            <Button
              onClick={() => {
                toggleIsFlippedMode();
              }}
              isIconOnly
              // variant="gradient"
              className="bg-dark rounded-full"
              title="Flip All"
            >
              <ArrowsClockwise size={32} color="#fff" />
            </Button>
          </Tooltip>

          <Tooltip className="font-primary-san" content="Spaced Repetition" color="primary" placement="bottom">
            <Link href={`/study/kanji/repetition?chapter=${chapter}&level=${level}`}>
              <Button

                isIconOnly
                // variant="gradient"
                className="bg-primary rounded-full"
                title="Spaced Repetition"
              >
                <Brain size={32} color="#fff" />
              </Button>
            </Link>
          </Tooltip>
        </div>
      </div>
    </section>
  );
};
