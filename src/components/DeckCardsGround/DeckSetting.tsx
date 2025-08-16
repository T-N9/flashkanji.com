"use client";

import { Button, Tooltip } from "@heroui/react";

/* Hook */

import { ArrowsClockwise, Shuffle, Slideshow } from "@phosphor-icons/react";
import { useGeneralStore } from "@/store/generalState";
import { usePathname } from "next/navigation";
import { useDeckSetting } from "./useDeckSetting";

interface DeckSettingProps {
    handleShuffle: () => void; // Add this prop type
}

export const DeckSetting: React.FC<DeckSettingProps> = ({ handleShuffle }) => {
    const {
        toggleIsFlippedMode
    } = useDeckSetting();

    const { toggleDeckModal } =
        useGeneralStore();


    return (
        <section
            className={`container mt-5 bg-gray-100  z-10 border-2 border-orange-400  flex flex-col gap-3 justify-center items-center  rounded-md transform duration-300 
      w-[90%] shadow-lg lg:w-fit fixed bottom-10 left-1/2 -translate-x-1/2 mx-auto max-w-screen-xl px-4 py-4 lg:px-8 lg:py-4 mb-4`}
        >
            <div
                className={`w-full flex flex-col lg:flex-row justify-center gap-4 items-center transition-all duration-200 ease-in `}
            >
                <div className="flex gap-4 w-full md:w-fit justify-center items-center flex-wrap">


                    <Tooltip className="font-primary-san" content="Shuffle" color="primary" placement="bottom">
                        <Button
                            onClick={() => handleShuffle()}
                            variant="bordered"
                            className=" text-info rounded-full"
                            title="Shuffle"
                            isIconOnly
                        >
                            <Shuffle size={32} />
                        </Button>
                    </Tooltip>

                    <Tooltip className="font-primary-san" content="Slide View" color="primary" placement="bottom">
                        <Button
                            variant="bordered"
                            className="rounded-full text-info"
                            title="Slide View"
                            isIconOnly
                            onClick={() => {
                                toggleDeckModal();
                            }}
                        >
                            <Slideshow size={32} />
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
                </div>
            </div>
        </section>
    );
};
