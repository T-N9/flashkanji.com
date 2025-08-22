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
import { useState } from "react";
import { GeminiResponse } from "../DeckDetailModal";
import CharacterImage from "@/components/common/character";


export function KanjiDetailModal() {
  const { isDetailModalOpen, toggleDetailModal, setCurrentDetail, currentDetail } = useGeneralStore((state) => state);

  const { data: charData, isLoading } = useKanjiDetail(currentDetail || "");
  const { data: jukugoData } = useRelatedJukugo(currentDetail || "");
  const { onOpenChange, onClose } = useDisclosure();
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);
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
    setGeminiResponse("");
    setCurrentDetail(character);
  };

  const askGemini = async () => {
    setIsGeminiLoading(true);
    if (!currentDetail) return;

    const prompt = `Hello Sensei, I am a Japanese language learner, help me remember this kanji character "${currentDetail}" by telling me a memorable mnemonic story in simple English, short, engaging and make sense. You may break down the radicals to tell the story. (this is one time request, do not ask me to ask again or anything like that)`;

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      });

      const data = await res.json();

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
      setGeminiResponse(text);
      setIsGeminiLoading(false);
    } catch (error) {
      setIsGeminiLoading(false);
      console.error("Error calling Gemini API:", error);
      setGeminiResponse("An error occurred while contacting the AI.");
    }
  };

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
              <ModalBody className=" min-h-40 bg-gray-200 dark:bg-backdrop overflow-y-scroll">

                {!isLoading ? (
                  <div className=" flex gap-4 flex-col-reverse lg:flex-row font-primary-san">
                    <div className="flex-1">
                      <div>
                        {/* AI Component */}
                        <p className="text-center text-sm">Ask Samurai Sensei how to remember this <span className="text-orange-500">{currentDetail}</span> character.</p>
                        {
                          isGeminiLoading ?
                            <CharacterImage src="thinking.png" alt="ask samurai sensei" />
                            :
                            <CharacterImage src="kiss.png" alt="ask samurai sensei" />
                        }



                        {geminiResponse === "" && <Button className={`${isGeminiLoading && 'opacity-40 select-none pointer-events-none'} table mx-auto my-4`} onClick={askGemini} color="warning">Ask</Button>}
                        <div>
                          {/* This will be result got back from Gemini API */}
                          {isGeminiLoading ? (
                            <p className="text-center animate-pulse">Sensei is thinking...</p>
                          ) : (
                            <div>
                              {geminiResponse && (
                                <div className="mt-4">
                                  <h2 className="text-lg font-bold text-center">Sensei Response:</h2>
                                  <div className="mt-4 mb-5 p-4 bg-white dark:bg-dark text-sm rounded-lg shadow-md">
                                    <GeminiResponse content={geminiResponse} />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className=" grid grid-cols-1 md:grid-cols-3 gap-3">

                        <div className="bg-white dark:bg-dark_1 p-3 rounded-md">
                          <p className="text-gray-400 font-english text-xs">
                            Grade:
                          </p>{" "}
                          <span className="text-dark dark:text-gray-100 font-bold text-lg flex flex-wrap">
                            {renderStars()}
                          </span>
                        </div>
                        <div className="bg-white dark:bg-dark_1 p-3 rounded-md">
                          <p className="text-gray-400 font-english text-xs">
                            Unicode:
                          </p>{" "}
                          <span className="text-dark dark:text-gray-100 font-bold text-xl font-english-text">
                            {charData?.unicode}
                          </span>

                        </div>

                        <div className="bg-white dark:bg-dark_1 p-3 rounded-md">
                          <p className="text-gray-400 font-english text-xs">
                            Stroke Count:
                          </p>{" "}
                          <span className="text-dark dark:text-gray-100 font-bold text-xl font-english-text">
                            {charData?.stroke_count}
                          </span>
                        </div>

                        <div className="bg-white dark:bg-dark_1 p-3 rounded-md col-span-3">
                          <p className="text-gray-400 font-english text-xs">
                            Meanings:
                          </p>
                          <ul className="list-disc pl-4 flex gap-x-7 gap-y-2 flex-wrap text-dark dark:text-gray-100 font-english-text">
                            {charData?.meanings.map((meaning: string, index: number) => (
                              <li key={index}>{meaning}</li>
                            ))}
                          </ul>
                        </div>


                      </div>

                      <div className="grid grid-cols-2  mt-4 gap-4 flex-wrap">
                        <div className="bg-white dark:bg-dark_1 p-3 rounded-md">
                          <p className="text-gray-400 font-english text-xs">
                            Kun Readings:
                          </p>
                          <ul className="list-disc pl-4 gap-4 flex flex-col text-dark dark:text-gray-100 font-bold text-xl">
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

                        <div className="bg-white dark:bg-dark_1 p-3 rounded-md">
                          <p className="text-gray-400 font-english text-xs">
                            On Readings:
                          </p>
                          <ul className="list-disc pl-4  gap-4 flex flex-col text-dark dark:text-gray-100 font-bold text-xl">
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
                        <div className="mt-4 bg-white dark:bg-dark_1 p-3 rounded-md">
                          <p className="text-gray-400 font-english text-xs">
                            Related jukugo:
                          </p>

                          <ul className="flex gap-2 flex-wrap mt-3">
                            {jukugoData?.map((item, index) => {
                              return (
                                <li
                                  className="p-2 dark:border-gray-700 border-2 rounded-md"
                                  key={index}
                                >
                                  <p className="flex justify-between flex-col">

                                    <ruby className="text-dark dark:text-gray-100 text-2xl -mb-7">

                                      <rt className="text-sm text-gray-400 tracking-tighter">
                                        {item.hiragana}
                                      </rt>
                                    </ruby>{" "}
                                    <span className="text-2xl">
                                      <TextSpeech japaneseText={item.character} />{" "}
                                    </span>
                                    <span className="text-sm font-english-text text-dark dark:text-gray-100">
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
                      <strong className="text-gray-400 font-english text-xs">Notes:</strong>
                      <p className="text-gray-700 dark:text-gray-300">
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
