import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react";

/* Icons */


/* Hook */
import { useGeneralStore } from "@/store/generalState";
import { BookOpenText, Gear, Slideshow } from "@phosphor-icons/react";

export function SpeedDialMenu({ mode = 1 }: { mode: number }) {
    const { toggleFlashModal, toggleSetting, toggleJukugoModal } =
        useGeneralStore();

    return (
        <>
            <div className="fixed bottom-20 right-10 z-50">
                <Dropdown placement="top">
                    <DropdownTrigger>
                        <Button
                            isIconOnly
                            variant="solid"
                            color="primary"
                            className="bg-gradient-radial rounded-full w-[50px] h-[50px]"
                        >
                          <BookOpenText size={22} />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="slider">
                            <div
                                className="flex justify-between"
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
                                <span>Open slide</span>
                                <Slideshow size={22} />
                            </div>
                        </DropdownItem>
                        {/* {mode === 1 ? (
                            <DropdownItem key="copy">
                                <div
                                    className="flex justify-between"
                                    onClick={() => toggleSetting()}
                                >
                                    <span>Toggle setting</span>
                                    <Gear size={22} />
                                </div>
                            </DropdownItem>
                        ) : <DropdownItem key="copy"></DropdownItem>} */}

                    </DropdownMenu>
                </Dropdown>
            </div>
        </>
    );
}


