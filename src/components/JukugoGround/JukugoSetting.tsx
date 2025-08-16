

/* Compoents */
// import { Select, Option, Button, Switch } from "@material-tailwind/react";

import { Button, Select, SelectItem, Switch, Tooltip } from "@heroui/react";
import { Button as NextButton } from "@heroui/react";
import useJukugoSetting from "./useJukugoSetting";
import { ArrowsClockwise, Brain, Shuffle, Slideshow } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGeneralStore } from "@/store/generalState";

interface JukugoSettingProps {
  handleShuffle: () => void; // Add this prop type
}
export const JukugoSetting: React.FC<JukugoSettingProps> = ({ handleShuffle }) => {
  const {
    jukugo,
    isLoading,
    isFlippedMode,
    isShuffledMode,
    selectedLevel,
    noChapters,

    level,
    isShowMeaning,

    setSelectedChapter,
    setSelectedLevel,
    toggleIsFlippedMode,
    toggleShowMeaning,
  } = useJukugoSetting();

    const { toggleFlashModal, toggleSetting, toggleJukugoModal } =
      useGeneralStore();

    const pathname = usePathname()
  
    const mode = pathname.includes('kanji') ? 1 : 2

  return (
    <section
      className={`container mt-5 bg-gray-50 border-orange-400 z-10 border-2  flex flex-col gap-3 justify-center items-center  rounded-md shadow-md transform duration-300 
     lg:w-fit w-[90%] fixed bottom-10 left-1/2 -translate-x-1/2 mx-auto max-w-screen-xl px-4 py-4 lg:px-8 lg:py-4 mb-4 ${isLoading && 'select-none pointer-events-none'}`}
    >
      <div
        className={`flex w-full lg:w-auto mx-auto flex-col lg:flex-row justify-center gap-4 items-center transition-all duration-200 ease-in `}
      >
        {/* <div className="flex gap-4 w-full md:w-fit">
          <div className="flex w-full md:w-36 min-w-36 select-box flex-col gap-6">
            <Select
              // @ts-ignore
              items={[5, 4, 3, 2, 1]}
              color="default"
              size="sm"
              className="drop-shadow"
              label="Select Level"
              defaultSelectedKeys={level?.toString()}
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
        </div> */}
        <div className="flex-1 flex justify-center items-center gap-2">

        </div>
        <div className="flex-1 flex justify-center items-center gap-2">
          <Tooltip className="font-primary-san" content="Shuffle" color="primary" placement="bottom">
            <NextButton
              onClick={() => handleShuffle()}
              variant="bordered"
              className=" text-info rounded-full"
              title="Shuffle"
              isIconOnly
            >
              <Shuffle size={32} />
            </NextButton>
          </Tooltip>
          <div className="flex flex-col gap-1 justify-center items-center w-24">
            <p className="text-xs dark:text-dark">Hide Meaning</p>

            <Switch
              color="primary"
              onChange={() => {
                toggleShowMeaning();
              }}
              checked={isShowMeaning}
            />
          </div>

          <Tooltip
            className="font-primary-san"
            content="Flip All"
            color="primary"
            placement="bottom"
          >
            <NextButton
              onClick={() => {
                toggleIsFlippedMode();
              }}
              // variant="gradient"
              isIconOnly
              className="bg-dark rounded-full"
              title="Flip All"
            >
              <ArrowsClockwise size={32} color="#fff" />
            </NextButton>
          </Tooltip>

          <Tooltip className="font-primary-san" content="Slide View" color="primary" placement="bottom">
            <Button
              variant="bordered"
              className="rounded-full text-info"
              title="Slide View"
              isIconOnly
              onClick={() => {
                switch (mode) {
                  case 1:
                    toggleFlashModal();
                    break;
                  case 2:
                    toggleJukugoModal();
                    break;
                  default:
                    break;
                }
              }}
            >
              <Slideshow size={32} />
            </Button>
          </Tooltip>

          {/* <Tooltip className="font-primary-san" content="Spaced Repetition" color="primary" placement="bottom">
            <Link href={`/study/jukugo/repetition?chapter=${chapter}&level=${level}`}>
              <Button

                isIconOnly
                // variant="gradient"
                className="bg-primary rounded-full"
                title="Spaced Repetition"
              >
                <Brain size={32} color="#fff" />
              </Button>
            </Link>
          </Tooltip> */}
        </div>
      </div>
    </section>
  );
};
