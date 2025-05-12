// components/ChapterRoadmap.tsx

"use client";

import { Checkbox } from "@nextui-org/react";
import { Brain, CompassRose, SealQuestion, Stack } from "@phosphor-icons/react";
// import { BookOpen, Flashcard, RefreshCw, FileQuestion } from "lucide-react";

const roadmapData = [
  {
    title: "Introduction",
    steps: [
      ["Learn New Kanji Characters", "Flashcard", "Take your time to learn the new kanji characters."],
      ["Spaced Repetition of newly learnt Kanji", "SRS", "Start repeating the kanji you just learnt."],
      ["Mini Quiz (Kunyomi)", "Quiz", "Test your understanding of Kunyomi readings."],
      ["Spaced Repetition Again", "SRS", "Reinforce your memory with another review round."],
      ["Mini Quiz (Onyomi)", "Quiz" , "Test your understanding of Onyomi readings."],
      ["Learn Jukugo", "Flashcard", "Learn the compound words using recent kanji."],
      ["Spaced Repetition of Jukugo", "SRS" , "Reinforce your memory of the compound words."],
      ["Mini Quiz for Jukugo meaning", "Quiz", "Test your understanding of the meanings of the compound words."],
    ],
  },
  {
    title: "Expanding Memory",
    steps: [
      ["Learn Another 5 (A5) Kanji", "Flashcard"],
      ["Spaced Repetition of A5 Kanji", "SRS"],
      ["Quiz (Onyomi Focused) for F5+A5 10 Kanji", "Quiz"],
      ["Spaced Repetition of All F5+A5 10 Kanji", "SRS"],
      ["Quiz (Kunyomi Focused) for F5+A5 10 Kanji", "Quiz"],
      ["Learn Jukugo Using A5 Kanji", "Flashcard"],
      ["Spaced Repetition of Jukugo from A5 Kanji", "SRS"],
      ["Meaning Quiz for Jukugo", "Quiz"],
    ],
  },
  {
    title: "Compound Word Focus",
    steps: [
      ["Revise All Jukugo of this chapter", "Flashcard"],
      ["Spaced Repetition of all jukugo", "SRS"],
      ["Kanji to Hiragana matching quiz", "Quiz"],
      ["Hiragana to Kanji matching quiz", "Quiz"],
    ],
  },
  {
    title: "Deep Reinforcement",
    steps: [
      ["Spaced Repetition of All 10 Kanji", "SRS"],
      ["Spaced Repetition of all jukugo", "SRS"],
      ["Final Challenge: Kunyomi + Onyomi + Meaning Quiz", "Quiz"],
    ],
  },
];

const iconMap = {
  Flashcard: <Stack size={32} color="#fff" />,
  SRS: <Brain size={32} color="#fff" />,
  Quiz: <SealQuestion size={32} color="#fff" />,
};

const typeStyles = {
  Flashcard: {
    bg: "bg-orange-600",
    border: "border-orange-600",
    icon:  <Stack size={32} color="#fff" />,
  },
  SRS: {
    bg: "bg-green-600",
    border: "border-green-600",
    icon: <Brain size={32} color="#fff" />,
  },
  Quiz: {
    bg: "bg-purple-600",
    border: "border-purple-600",
    icon: <SealQuestion size={32} color="#fff" />,
  },
};

const RoadmapItem = ({
  label,
  type,
  description,
}: {
  label: string;
  type: "Flashcard" | "SRS" | "Quiz";
  description?: string;
}) => {
  const { bg, border, icon } = typeStyles[type];
  return(
    <div className={`bg-slate-50 ${border} border-2 gap-4 p-2 rounded-full w-full flex items-center shadow-xl`}>
    <div className={`${bg} relative inline-block p-2 rounded-full shadow-md`}>
      <div className="border-dashed animate-slow-spin border-white border-2 rounded-full p-2">
        <div className="opacity-0">{icon}</div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {icon}
      </div>
    </div>

    <div className="flex justify-between items-center w-full gap-1">
      <div>
        <h3 className="font-bold">{label}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
      <Checkbox size="lg" color="primary" />
    </div>
  </div>
)};

export default function ChapterRoadmap() {
  return (
    <div className="space-y-12 max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4">
        <CompassRose size={32} />
        <h1 className="text-3xl font-bold text-dark"> Chapter 1 Roadmap</h1>
      </div>

      {roadmapData.map((phase, idx) => (
        <div key={idx} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-400">{phase.title}</h2>
          <div className="space-y-3">
            {phase.steps.map(([label, type, description], i) => (

              <>
                <RoadmapItem key={i} label={label} type={type as any} description={description}/>
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
