'use client'
import { KanjiGif } from "@/components/KanjiGif";
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
} from "@nextui-org/modal";

import { Button, Spinner } from "@nextui-org/react";


export function KanjiDetailModal() {
  const { isDetailModalOpen, toggleDetailModal, setCurrentDetail, currentDetail } = useGeneralStore((state) => state);

  const {data : charData, isLoading } = useKanjiDetail(currentDetail || "");
  const { data : jukugoData } = useRelatedJukugo(currentDetail || "");
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
                  <div className="  font-primary-san">
                    <div className="flex flex-col lg:flex-row gap-y-3 gap-x-5">
                      <div className="mb-4">
                        <div>
                          <strong className="text-info font-english">
                            Grade:
                          </strong>{" "}
                          <span className="text-dark font-bold">
                            {renderStars()}
                          </span>
                        </div>
                        <div>
                          <strong className="text-info font-english">
                            Unicode:
                          </strong>{" "}
                          <span className="text-dark font-bold font-english-text">
                            {charData?.unicode}
                          </span>
                        </div>
                      </div>
                      <div className="mb-4 flex flex-col gap-3">
                        <div>
                          <strong className="text-info font-english">
                            Stroke Count:
                          </strong>{" "}
                          <span className="text-dark font-bold font-english-text">
                            {charData?.stroke_count}
                          </span>
                        </div>
                        <KanjiGif kanji={currentDetail} />
                      </div>
                      <div className="mb-4">
                        <strong className="text-info font-english">
                          Meanings:
                        </strong>
                        <ul className="list-disc pl-4 text-dark font-english-text">
                          {charData?.meanings.map((meaning : string, index :number) => (
                            <li key={index}>{meaning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4 flex-wrap">
                      <div className="mb-4">
                        <strong className="text-info font-english">
                          On Readings:
                        </strong>
                        <ul className="list-disc pl-4   text-dark font-bold">
                          {charData?.on_readings.length > 0
                            ? charData?.on_readings.map((onReading : string, index : number) => (
                              <li key={index}>{onReading}</li>
                            ))
                            : "-"}
                        </ul>
                      </div>

                      <div className="mb-4">
                        <strong className="text-info font-english">
                          Kun Readings:
                        </strong>
                        <ul className="list-disc pl-4  text-dark font-bold">
                          {charData?.kun_readings.length > 0
                            ? charData?.kun_readings.map(
                              (kunReading : number, index : number) => (
                                <li key={index}>{kunReading}</li>
                              )
                            )
                            : "-"}
                        </ul>
                      </div>
                    </div>

                    {jukugoData && jukugoData?.length > 0 && (
                      <div className="mt-4">
                        <strong className="text-info font-english">
                          Related jukugo:
                        </strong>

                        <div className="flex gap-2 flex-wrap mt-3">
                          {jukugoData?.map((item, index) => {
                            return (
                              <div
                                className="bg-white p-2 rounded-md shadow-md"
                                key={index}
                              >
                                <p className="flex justify-between flex-col">
                                  <ruby className="text-dark text-2xl">
                                    {item.jukugo_char}{" "}
                                    <rt className="text-sm text-gray-400">
                                      {item.hiragana}
                                    </rt>
                                  </ruby>{" "}
                                  <span className="text-sm font-english-text text-dark">
                                    {item.english_meaning}
                                  </span>
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 hidden">
                      <strong className="text-info font-english">Notes:</strong>
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
