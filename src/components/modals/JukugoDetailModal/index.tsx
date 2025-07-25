'use client'
import CharacterImage from "@/components/common/character";
import { KanjiGif } from "@/components/KanjiGif";
import TextSpeech from "@/components/tts/TextSpeech";
import { hiragana_katakana } from "@/constants/static";
import { useGeneralStore } from "@/store/generalState";
import useJukugoGroundState from "@/store/jukugoGroundState";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/react";
import { Envelope } from "@phosphor-icons/react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { env } from "process";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export const GeminiResponse = ({ content }: { content: string }) => {
    return (
        <div className="prose prose-sm md:prose-base max-w-none prose-orange">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};

export const JukugoDetailModal = () => {

    const { isJukugoDetailModalOpen, jukugoDetail, toggleJukugoDetailModal, setJukugoDetail } = useGeneralStore();
    const { level } = useJukugoGroundState();

    const searchParams = useSearchParams();
    // console.log("level", level);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [currentStrokeWord, setCurrentStrokeWord] = useState<string>("");

    const [geminiResponse, setGeminiResponse] = useState<string>("");
    const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);

    const askGemini = async () => {
        setIsGeminiLoading(true);
        if (!jukugoDetail?.character) return;

        const prompt = `Hello Sensei, I am a Japanese language learner, give me N${level} level 5 real-world usage of this word "${jukugoDetail.character}". Also give me hiragana and English translation version of each sentence.`;

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

    const handleOpen = (character: string | null) => {
        toggleJukugoDetailModal();
        setGeminiResponse("");
        setJukugoDetail(null);
    };

    useEffect(() => {
        if (jukugoDetail?.character?.split("")[0] === "～") {
            setCurrentStrokeWord(jukugoDetail?.character?.split("")[1]);
        } else {
            // @ts-ignore
            setCurrentStrokeWord(jukugoDetail?.character?.split("")[0]);
        }
    }, [jukugoDetail]);

    return (
        <>
            <Modal
                className="font-writing-1"
                isOpen={isJukugoDetailModalOpen}
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
                    <ModalHeader className="flex justify-between font-english-text text-orange-500 items-center shadow">
                        <p>Jukugo information</p>
                    </ModalHeader>
                    <ModalBody className="bg-gray-100 overflow-y-auto">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <h1 className="text-4xl text-dark">{jukugoDetail?.character}</h1>
                                {
                                    jukugoDetail?.hiragana &&
                                    <TextSpeech japaneseText={jukugoDetail?.hiragana} />
                                }
                                <hr />
                                <p>{jukugoDetail?.meaning}</p>

                                <div>
                                    <p className="mt-5 font-english-text text-info">Stroke Information</p>
                                    <div className="flex gap-2 text-dark">
                                        {jukugoDetail?.character?.split("").map((item: string, index: number) => {
                                            return (
                                                <div key={index}>
                                                    {item !== "～" && (
                                                        <div className="flex gap-3 items-center">
                                                            {
                                                                hiragana_katakana.includes(item) ?
                                                                    <h3
                                                                        className={`${currentStrokeWord === item && 'text-orange-500 '} p-2 text-2xl text-deep-orange-700 `}

                                                                    >
                                                                        {item}
                                                                    </h3>
                                                                    :
                                                                    <h3
                                                                        className={`${currentStrokeWord === item && 'text-orange-500 border-orange-300'} p-2 border-2 text-2xl text-deep-orange-700 cursor-pointer`}
                                                                        onClick={() => setCurrentStrokeWord(item)}
                                                                    >
                                                                        {item}
                                                                    </h3>
                                                            }

                                                            {jukugoDetail?.character?.split("").length - 1 !== index && "+"}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <KanjiGif kanji={currentStrokeWord} />
                            </div>
                        </div>
                        <hr className="my-4" />
                        <div>
                            {/* AI Component */}
                            <p className="text-center">Ask Samurai Sensei how <span className="text-orange-500">{jukugoDetail?.character}</span> is used. </p>
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
                                                <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
                                                    <GeminiResponse content={geminiResponse} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter className="flex justify-center md:justify-between items-center">
                        <p className="text-xs font-english">
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
                        <Button
                            className="font-english"
                            onClick={() => handleOpen(null)}
                        >
                            <span>Close</span>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
