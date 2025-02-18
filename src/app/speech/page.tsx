"use client"
import React, { useState } from 'react'

const SpeechTest = () => {
    const [text, setText] = useState("直接");

    const speak = () => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "ja-JP"; // Japanese language
            speechSynthesis.speak(utterance);
        } else {
            alert("Your browser does not support speech synthesis.");
        }
    };

    return (
        <div>SpeechTest
            <button onClick={speak} >Speak</button>
        </div>
    )
}

export default SpeechTest