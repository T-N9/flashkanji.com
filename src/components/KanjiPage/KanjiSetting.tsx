"use client";

import { Select, SelectItem } from "@nextui-org/react";

/* Hook */
import { useKanjiSetting } from "./useKanjiSetting";
import { useEffect } from "react";
import { useKanjiByChapterAndLevel } from "@/services/kanji";

export const KanjiSetting = () => {
  const {
    noChapters,
    setSelectedMultiChapters,
    level,
    chapter,
    updateQueryParams,
  } = useKanjiSetting();

  return (
    <section
      className={`container mt-5 bg-gray-50 z-10 border-2 border-gray-100 relative flex flex-col gap-3 justify-center items-center  rounded-md shadow-md transform duration-300 
      w-full mx-auto max-w-screen-xl px-4 py-4 lg:px-8 lg:py-4 mb-4`}
    >
      <div
        className={`w-full flex flex-col lg:flex-row justify-between gap-4 items-center transition-all duration-200 ease-in `}
      >
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
              selectedKeys={[chapter.toString()]}
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
      </div>
    </section>
  );
};
