"use client";
import { removeDots } from "@/util";
import { SpeakerHigh, Spinner } from "@phosphor-icons/react";
import { useState } from "react";

export default function TextSpeech({ japaneseText }: { japaneseText: string }) {

    const [isLoading, setIsLoading] = useState(false);
    const textInput = removeDots(japaneseText);
    const speak = async () => {
        if (!japaneseText) return alert("Please enter text");

        setIsLoading(true);
        try {
            const response = await fetch("/api/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ textInput }),
            });

            const data = await response.json();
            if (data.audioContent) {
                const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
                audio.play();
            } else {
                alert("Error: Unable to generate pronunciation.");
            }
        } catch (error) {
            alert("Error: Unable to fetch audio.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <span className=" flex gap-2">
            <span>{japaneseText}</span>
            <button onClick={speak} disabled={isLoading} className="">
                {
                    isLoading ?
                        <Spinner className="animate-spin" size={22} />
                        :
                        <SpeakerHigh size={22} />
                }

            </button>
        </span>
    );
}
