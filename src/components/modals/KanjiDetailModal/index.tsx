'use client'
import { KanjiGif } from "@/components/KanjiGif";
import TextSpeech from "@/components/tts/TextSpeech";
import { useRelatedJukugo } from "@/services/jukugo";
import { useKanjiDetail } from "@/services/kanji";
import { useGeneralStore } from "@/store/generalState";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

import { Button, Spinner } from "@heroui/react";


export function KanjiDetailModal() {
  const { isDetailModalOpen, toggleDetailModal, setCurrentDetail, currentDetail } = useGeneralStore((state) => state);

  const { data: charData, isLoading } = useKanjiDetail(currentDetail || "");
  const { data: jukugoData } = useRelatedJukugo(currentDetail || "");
  // Function to generate stars based on the grade
  const renderStars = () => {
    const stars = Array.from({ length: charData?.grade }, (_, index) => (
      <span key={index} className="">
        ⭐
      </span>
    ));
    return stars;
  };

  const handleOpen = (character: string | null) => {
    toggleDetailModal();

    setCurrentDetail(character);
  };

  // console.log({ jukugoData });
  const { onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Modal
        className="font-writing-1"
        isOpen={isDetailModalOpen}
        backdrop="blur"
        size="4xl"
        onOpenChange={onOpenChange}
        onClose={() => {
          handleOpen(null);
          onClose();
        }}
        scrollBehavior="inside"
      >
        <ModalContent>

          {(onClose) => (
            <>
              <ModalHeader className="flex justify-between text-orange-500 font-english-text font-bold items-center shadow">
                <p>Kanji information</p>
              </ModalHeader>
              <ModalBody className=" min-h-40 bg-gradient-orange-card overflow-y-scroll">

                {!isLoading ? (
                  <div className=" flex gap-4 flex-col-reverse lg:flex-row font-primary-san">
                    <div className="flex-1">
                      <div className=" grid grid-cols-1 md:grid-cols-3 gap-3">

                        <div className="bg-white p-3 rounded-md">
                          <p className="text-info font-english text-xs">
                            Grade:
                          </p>{" "}
                          <span className="text-dark font-bold text-lg flex flex-wrap">
                            {renderStars()}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-info font-english text-xs">
                            Unicode:
                          </p>{" "}
                          <span className="text-dark font-bold text-xl font-english-text">
                            {charData?.unicode}
                          </span>

                        </div>

                        <div className="bg-white p-3 rounded-md">
                          <p className="text-info font-english text-xs">
                            Stroke Count:
                          </p>{" "}
                          <span className="text-dark font-bold text-xl font-english-text">
                            {charData?.stroke_count}
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-md col-span-3">
                          <p className="text-info font-english text-xs">
                            Meanings:
                          </p>
                          <ul className="list-disc pl-4 flex gap-x-7 gap-y-2 flex-wrap text-dark font-english-text">
                            {charData?.meanings.map((meaning: string, index: number) => (
                              <li key={index}>{meaning}</li>
                            ))}
                          </ul>
                        </div>


                      </div>

                      <div className="grid grid-cols-2  mt-4 gap-4 flex-wrap">
                        <div className="bg-white p-3 rounded-md">
                          <p className="text-info font-english text-xs">
                            Kun Readings:
                          </p>
                          <ul className="list-disc pl-4 gap-4 flex flex-col text-dark font-bold text-xl">
                            {charData?.kun_readings.length > 0
                              ? charData?.kun_readings.map(
                                (kunReading: string, index: number) => (
                                  // <li onClick={() =>speakJapaneseText(kunReading)} key={index}>{kunReading}</li>
                                  <li key={index}>
                                    <TextSpeech key={index} japaneseText={kunReading} />
                                  </li>
                                )
                              )
                              : "-"}
                          </ul>
                        </div>

                        <div className="bg-white p-3 rounded-md">
                          <p className="text-info font-english text-xs">
                            On Readings:
                          </p>
                          <ul className="list-disc pl-4  gap-4 flex flex-col text-dark font-bold text-xl">
                            {charData?.on_readings.length > 0
                              ? charData?.on_readings.map((onReading: string, index: number) => (
                                // <li onClick={() =>speakJapaneseText(onReading)} key={index}>{onReading}</li>
                                <li key={index}>
                                  <TextSpeech key={index} japaneseText={onReading} />
                                </li>
                              ))
                              : "-"}
                          </ul>
                        </div>


                      </div>

                      {jukugoData && jukugoData?.length > 0 && (
                        <div className="mt-4 bg-white p-3 rounded-md">
                          <p className="text-info font-english text-xs">
                            Related jukugo:
                          </p>

                          <ul className="flex gap-2 flex-wrap mt-3">
                            {jukugoData?.map((item, index) => {
                              return (
                                <li
                                  className="bg-white p-2 rounded-md shadow-md"
                                  key={index}
                                >
                                  <p className="flex justify-between flex-col">
              
                                    <ruby className="text-dark text-2xl -mb-7">
                                    
                                      <rt className="text-sm text-gray-400 tracking-tighter">
                                        {item.hiragana}
                                      </rt>
                                    </ruby>{" "}
                                    <span className="text-2xl">
                                      <TextSpeech japaneseText={item.character}/>{" "}
                                    </span>
                                    <span className="text-sm font-english-text text-dark">
                                      {item.meaning}
                                    </span>
                                  </p>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <KanjiGif kanji={currentDetail} />
                    </div>



                    <div className="mt-4 hidden">
                      <strong className="text-info font-english text-xs">Notes:</strong>
                      <p className="text-gray-700">
                        {charData?.notes.length > 0
                          ? charData?.notes
                          : "No notes available"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full min-h-40 h-full flex justify-center items-center">
                    <Spinner color="warning" />
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="flex font-english justify-center gap-2 md:justify-between items-center">
                <p className="text-xs">
                  Provided by{" "}
                  <a
                    className="text-orange-500 "
                    target="_blank"
                    href="http://www.kanjiapi.dev"
                  >
                    kanjiapi
                  </a>{" "}
                  ,{" "}
                  <a
                    className="text-orange-500 "
                    target="_blank"
                    href="https://kanjivg.tagaini.net/index.html"
                  >
                    KanjiVG
                  </a>{" "}
                  ,{" "}
                  <a
                    className="text-orange-500 "
                    target="_blank"
                    href="https://github.com/jcsirot/kanji.gif"
                  >
                    KanjiGIF
                  </a>{" "}
                </p>
                <Button onClick={() => handleOpen(null)}>
                  <span>Close</span>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
