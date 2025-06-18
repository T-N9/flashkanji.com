"use client";

import useJukugoGroundState from "@/store/jukugoGroundState";
import useKanjiGroundState from "@/store/kanjiGroundState";
import useQuizGroundStore from "@/store/quizGroundState";
import { useUserStore } from "@/store/userState";
import { Checkbox, Select, SelectItem } from "@heroui/react";
import { Brain, CompassRose, SealQuestion, Stack } from "@phosphor-icons/react";
import Link from "next/link";

 const roadmapData = [
  {
    title: "Introduction",
    steps: [
      ["Learn New Kanji Characters", "cards", "Take your time to learn the new kanji characters.", "kanji"],
      ["Spaced Repetition of newly learnt Kanji", "repetition", "Start repeating the kanji you just learnt.", "kanji"],
      ["Mini Quiz (Kunyomi)", "quiz", "Test your understanding of Kunyomi readings.", "kanji"],
      ["Spaced Repetition Again", "repetition", "Reinforce your memory with another review round.", "kanji"],
      ["Mini Quiz (Onyomi)", "quiz", "Test your understanding of Onyomi readings.", "kanji"],
      ["Learn Jukugo", "cards", "Learn the compound words using recent kanji.", "jukugo"],
      ["Spaced Repetition of Jukugo", "repetition", "Reinforce your memory of the compound words.", "jukugo"],
      // ["Mini Quiz for Jukugo meaning", "quiz", "Test your understanding of the meanings of the compound words.", "jukugo"],
    ],
  },
  {
    title: "Expanding Memory",
    steps: [
      ["Learn Another Kanji", "cards", "Learn another kanji characters.", "kanji"],
      ["Spaced Repetition of Kanji", "repetition", "Reinforce your memory of the new kanji.", "kanji"],
      ["Quiz (Onyomi Focused) for Kanji", "quiz", "Test your understanding of Onyomi readings.", "kanji"],
      ["Spaced Repetition of All Kanji", "repetition", "Reinforce your memory of all kanji.", "kanji"],
      ["Quiz (Kunyomi Focused) for All Kanji", "quiz", "Test your understanding of Kunyomi readings.", "kanji"],
      ["Learn Jukugo Using Kanji", "cards", "Learn the compound words using recent kanji.", "jukugo"],
      ["Spaced Repetition of Jukugo from A5 Kanji", "repetition", "Reinforce your memory of the compound words.", "jukugo"],
      // ["Meaning Quiz for Jukugo", "quiz", "Test your understanding of the meanings of the compound words.", "jukugo"],
    ],
  },
  {
    title: "Compound Word Focus",
    steps: [
      ["Revise Jukugo", "cards", "Review all words of this Chapter", "jukugo"],
      ["Spaced Repetition of all jukugo", "repetition", "Reinforce your memory of all jukugo", "jukugo"],
      // ["Kanji to Hiragana matching quiz", "quiz"],
      // ["Hiragana to Kanji matching quiz", "quiz"],
    ],
  },
  {
    title: "Deep Reinforcement",
    steps: [
      ["Review Kanji Characters", "cards", "Review all kanji characters for this chapter.", "kanji"],
      ["Final Spaced Repetition", 'repetition', "All Kanji for this Chapter", "kanji"],
      ["Review Jukugo Words", "cards", "Review all compound words for this chapter.", "jukugo"],
      ["Final Spaced Repetition", 'repetition', "All Jukugo for this Chapter", "jukugo"],
      // ["Final Challenge: Kunyomi + Onyomi + Meaning Quiz", "quiz"],
    ],
  },
];
const levelChapterMap = {
  N5: 11,
  N4: 20,
  N3: 42,
};

const typeStyles = {
  cards: {
    bg: "bg-gray-600",
    border: "border-orange-400",
    icon: <Stack size={32} color="#fff" />,
  },
  repetition: {
    bg: "bg-gray-600",
    border: "border-green-400",
    icon: <Brain size={32} color="#fff" />,
  },
  quiz: {
    bg: "bg-gray-600",
    border: "border-purple-400",
    icon: <SealQuestion size={32} color="#fff" />,
  },
};

const RoadmapItem = ({
  phase,
  label,
  type,
  description,
  route,
  japanese_level,
  japanese_chapter,
  step_i,
}: {
  phase: number;
  label: string;
  type: "cards" | "repetition" | "quiz";
  description?: string;
  route?: string;
  japanese_level: number;
  japanese_chapter: number;
  step_i: number;
}) => {
  const { bg, border, icon } = typeStyles[type];

  const { setSelectedChapter, setSelectedLevel, setLevel, setPart, setIsParted } = useKanjiGroundState();
  const { setSelectedChapter: setSelectedChapterJukugo, setSelectedLevel: setSelectedLevelJukugo, setLevel: setLevelJukugo, setPart: setPartJukugo, setIsParted: setIsPartedJukugo } = useJukugoGroundState();
  const { setSelectedChapter: setSelectedChapterQuiz, setSelectedLevel: setSelectedLevelQuiz, setQuizMode, setPart: setPartQuiz, setIsParted: setIsPartedQuiz, setLevel: setLevelQuiz } = useQuizGroundStore();

  const handleClickRoadmapItem = () => {

    if (route === 'kanji') {
      setSelectedChapter(japanese_chapter);
      setSelectedLevel("N" + japanese_level);
      setLevel(japanese_level);
      setIsParted(true);
      if (phase === 1) {
        setPart("0");
      } else if (phase === 2) {
        step_i > 3 ? setPart(null) : setPart("1");
        console.log("Setting part to 1 for phase 2, step", step_i);
      } else {
        setIsParted(false);
      }
    } else if (route === 'jukugo') {
      setSelectedChapterJukugo(japanese_chapter);
      setSelectedLevelJukugo("N" + japanese_level);
      setLevelJukugo(japanese_level);
      setIsPartedJukugo(true);
      if (phase === 1) {
        setPartJukugo("0");
      } else if (phase === 2) {
        setPartJukugo("1");
      } else {
        setIsPartedJukugo(false);
        setPartJukugo(null)
      }
    }

    if (type === 'quiz') {
      setSelectedChapterQuiz(japanese_chapter);
      setSelectedLevelQuiz("N" + japanese_level);
      setQuizMode(1); // Assuming 1 is the default mode
      setIsPartedQuiz(true);
      setLevelQuiz(japanese_level);
      if (phase === 1) {
        if (step_i === 3) {
          setQuizMode(2)
        } else if (step_i === 5) {
          setQuizMode(1)
        }
        setPartQuiz("0");
      } else if (phase === 2) {
        if (step_i === 3) {
          setQuizMode(2)
        } else if (step_i === 5) {
          setQuizMode(1)
        }
        setPartQuiz("1");
      } else {
        setIsPartedQuiz(false);
        setPartQuiz(null)
      }
    }
  }

  return (
    <Link className={`block`} onClick={handleClickRoadmapItem} href={`/study/${route}/${type}`}>
      <div className={`bg-slate-50 ${border} border-4 gap-4 p-2 rounded-full w-full flex items-center shadow-xl`}>
        <div className={`${bg} relative inline-block p-2 rounded-full shadow-md`}>
          <div className="border-dashed animate-slow-spin border-white border-2 rounded-full p-2">
            <div className="opacity-0">{icon}</div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {icon}
          </div>
        </div>

        <div className="hidden justify-between items-center w-full gap-1">
          <div>
            <h3 className="font-bold">{label}</h3>
            <p className="text-xs text-gray-600">{description}</p>
          </div>
          <Checkbox size="lg" color="primary" />
        </div>
      </div>
    </Link>
  )
};

export default function ChapterRoadmap() {

  const { japanese_chapter, japanese_level, setUser } = useUserStore()
  const chapters = Array.from({ length: levelChapterMap[japanese_level] }, (_, i) => i + 1);

  return (
    <div className="space-y-12 max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4">
        <CompassRose size={32} />
        <h1 className="text-3xl font-bold text-dark"> Chapter {japanese_chapter} Roadmap – {japanese_level}</h1>
      </div>

      <div className="flex gap-4">
        <Select label="Select Level" selectedKeys={[japanese_level]} onChange={(e) => setUser({
          // @ts-ignore
          japanese_level: e.target.value, japanese_chapter: 1
        })}>
          {["N5", "N4", "N3"].map((lvl) => (
            <SelectItem key={lvl}>
              {lvl}
            </SelectItem>
          ))}
        </Select>

        <Select label="Select Chapter" selectedKeys={[String(japanese_chapter)]} onChange={(e) => setUser({ japanese_chapter: parseInt(e.target.value) })}>
          {chapters.map((ch) => (
            <SelectItem key={ch}>
              Chapter {ch}
            </SelectItem>
          ))}
        </Select>
      </div>

      {roadmapData.map((phase, idx) => (
        <div key={idx} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-400 text-center">{phase.title}</h2>
          <div className="flex gap-2 flex-wrap justify-center">
            {phase.steps.map(([label, type, description, route], i) => (
              <RoadmapItem phase={idx + 1} step_i={i + 1} key={i} label={label} route={route} type={type as any} description={description} japanese_chapter={japanese_chapter} japanese_level={parseInt(japanese_level.split('')[1])} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
