"use client";

import RamenLoading from "@/components/common/RamenLoading";
import { useFetchChapterProgress } from "@/services/progress";
import { useGeneralStore } from "@/store/generalState";
import useJukugoGroundState from "@/store/jukugoGroundState";
import useKanjiGroundState from "@/store/kanjiGroundState";
import useQuizGroundStore from "@/store/quizGroundState";
import { useUserStore } from "@/store/userState";
import { Button, Select, SelectItem } from "@heroui/react";
import { ApproximateEquals, Brain, CompassRose, Lock, SealQuestion, Stack } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect } from "react";

const roadmapData = [
  {
    title: "Introduction",
    steps: [
      ["Learn New Kanji", "cards", "Take your time to learn the new kanji characters.", "kanji"],
      ["Spaced Repetition", "repetition", "Start repeating the kanji you just learnt.", "kanji"],
      ["Mini Quiz (Kun)", "quiz", "Test your understanding of Kunyomi readings.", "kanji"],
      ["Match Kanji", "match", "Test your understanding of Kunyomi readings.", "kanji"],
      ["Spaced Repetition Again", "repetition", "Reinforce your memory with another review round.", "kanji"],
      ["Mini Quiz (On)", "quiz", "Test your understanding of Onyomi readings.", "kanji"],
      ["Learn Jukugo", "cards", "Learn the compound words using recent kanji.", "jukugo"],
      ["Spaced Repetition of Jukugo", "repetition", "Reinforce your memory of the compound words.", "jukugo"],
      ["Build Jukugo", "quiz", "Test your reading of jukugo", "jukugo"],
    ],
  },
  {
    title: "Expanding Memory",
    steps: [
      ["Learn Another Kanji", "cards", "Learn another kanji characters.", "kanji"],
      ["Spaced Repetition of Kanji", "repetition", "Reinforce your memory of the new kanji.", "kanji"],
      ["Quiz (On-Focused)", "quiz", "Test your understanding of Onyomi readings.", "kanji"],
      ["Match Kanji", "match", "Test your understanding of Kunyomi readings.", "kanji"],
      ["Spaced Repetition", "repetition", "Reinforce your memory of all kanji.", "kanji"],
      ["Quiz (Kun-Focused)", "quiz", "Test your understanding of Kunyomi readings.", "kanji"],
      ["Learn Jukugo", "cards", "Learn the compound words using recent kanji.", "jukugo"],
      ["Spaced Repetition", "repetition", "Reinforce your memory of the compound words.", "jukugo"],
      ["Build Jukugo", "quiz", "Test your reading of jukugo", "jukugo"],
    ],
  },
  {
    title: "Compound Word Focus",
    steps: [
      ["Revise Jukugo", "cards", "Review all words of this Chapter", "jukugo"],
      ["Spaced Repetition", "repetition", "Reinforce your memory of all jukugo", "jukugo"],

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
    bg: "bg-orange-400",
    border: "border-gray-200",
    icon: <Stack size={32} color="#fff" />,
  },
  repetition: {
    bg: "bg-green-400",
    border: "border-gray-200",
    icon: <Brain size={32} color="#fff" />,
  },
  quiz: {
    bg: "bg-purple-400",
    border: "border-gray-200",
    icon: <SealQuestion size={32} color="#fff" />,
  },

  match: {
    bg: "bg-lime-400",
    border: "border-gray-200",
    icon: <ApproximateEquals size={32} color="#fff" />,
  },
};

function isStepUnlocked(
  progress: any,
  level: string,
  chapter: string,
  phase: string,
  stepIndex: number
): boolean {
  const PHASE_STRUCTURE = {
    "1": 9,
    "2": 9,
    "3": 2,
    "4": 4
  };

  const currentPhase = parseInt(phase);

  // ✅ Prevent access to this phase if earlier phases aren't fully complete
  for (let p = 1; p < currentPhase; p++) {
    //@ts-ignore
    const totalSteps = PHASE_STRUCTURE[p.toString()];
    const completedSteps = progress?.[level]?.[chapter]?.[p.toString()] || [];
    if (completedSteps.length < totalSteps) {
      return false; // Previous phase not finished
    }
  }

  // ✅ Now validate within this phase
  const steps = progress?.[level]?.[chapter]?.[phase] || [];

  if (stepIndex === 0) return true;

  for (let i = 0; i < stepIndex; i++) {
    if (!steps.includes(i)) {
      return false;
    }
  }

  return true;
}

const RoadmapItem = ({
  phase,
  label,
  type,
  description,
  route,
  japanese_level,
  japanese_chapter,
  step_i,
  progress,
  completed,
  isCurrent
}: {
  phase: number;
  label: string;
  type: "cards" | "repetition" | "quiz" | "match";
  description?: string;
  route?: string;
  japanese_level: number;
  japanese_chapter: number;
  step_i: number;
  progress: any;
  completed: boolean;
  isCurrent: boolean;
}) => {
  const { bg, border, icon } = typeStyles[type];

  const { setSelectedChapter, setSelectedLevel, setLevel, setPart, setIsParted, setIsReviewMode } = useKanjiGroundState();
  const { setSelectedChapter: setSelectedChapterJukugo, setSelectedLevel: setSelectedLevelJukugo, setLevel: setLevelJukugo, setPart: setPartJukugo, setIsParted: setIsPartedJukugo, setIsReviewMode: setIsReviewModeJukugo } = useJukugoGroundState();
  const { setSelectedChapter: setSelectedChapterQuiz, setSelectedLevel: setSelectedLevelQuiz, setQuizMode, setPart: setPartQuiz, setIsParted: setIsPartedQuiz, setLevel: setLevelQuiz } = useQuizGroundStore();
  const { setIsInGround, setIsSaveRepetition, setMapItemData, shouldRefetchChapter, setShouldRefetchChapter, setIsVictoryModalOpen, setVictoryModalType } = useGeneralStore();
  const { lives } = useUserStore()

  const levelStr = String(japanese_level);
  const chapterStr = String(japanese_chapter);
  const phaseStr = String(phase);
  const stepIndex = step_i - 1;

  const unlocked = isStepUnlocked(progress, levelStr, chapterStr, phaseStr, stepIndex);

  const handleClickRoadmapItem = () => {

    if(lives === 0){
      setVictoryModalType('loss'),
      setIsVictoryModalOpen(true)
      // alert('No lives left')
      return;
    }

    shouldRefetchChapter && setShouldRefetchChapter(false)

    setMapItemData({
      chapter: japanese_chapter,
      level: japanese_level,
      stepIndex: step_i,
      phase: phase,
      isCurrent: isCurrent
    })

    if (!unlocked) return;

    setIsInGround(true);
    if (route === 'kanji' || route === 'match') {
      // alert(`${step_i} match kanji`)
      setIsReviewMode(false);
      setSelectedChapter(japanese_chapter);
      setSelectedLevel("N" + japanese_level);
      setLevel(japanese_level);
      setIsParted(true);

      if (completed) {
        setIsSaveRepetition(false);
      }

      if (phase === 1) {
        setPart("0");
      } else if (phase === 2) {
        step_i > 4 ? setPart(null) : setPart("1");
        console.log("Setting part to 1 for phase 2, step", step_i);
      } else {
        setIsParted(false);
      }
    } else if (route === 'jukugo') {
      setIsReviewModeJukugo(false);
      setSelectedChapterJukugo(japanese_chapter);
      setSelectedLevelJukugo("N" + japanese_level);
      setLevelJukugo(japanese_level);
      setIsPartedJukugo(true);

      if (completed) {
        setIsSaveRepetition(false);
      }

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

    <div id={isCurrent ? 'resume111' : `${japanese_chapter + phase + stepIndex}`} className={`${isCurrent ? 'bg-white dark:bg-gray-800 relative' : 'bg-blue-50  dark:bg-dark_1'} ${border} border dark:border-dark gap-4 p-2 rounded-lg w-full flex items-center shadow ${!unlocked && 'select-none opacity-65 grayscale cursor-not-allowed pointer-events-none'}`}>
      {isCurrent && <div id="resume" className="h-3 w-3 bg-transparent absolute -top-20 z-30"></div>} 
      <div className={`${bg} relative inline-block p-2 rounded-full shadow-md opacity-${unlocked ? "100" : "50"}`}>
        <div className={`border-dashed ${isCurrent && 'animate-slow-spin'} border-white border-2 rounded-full p-2`}>
          <div className="opacity-0">{icon}</div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {icon}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-2">
        <div>
          <h3 className={`font-bold ${!unlocked ? "opacity-50" : ""}`}>{label}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">{description}</p>
        </div>

        {
          unlocked ? (
            <Button
              as={Link}
              onClick={handleClickRoadmapItem}
              href={`/study/${route}/${type}`}
              variant={completed ? 'bordered' : 'solid'}
              color={completed ? 'primary' : 'primary'}
            >
              {completed ? 'Completed' : 'Start'}
            </Button>
          ) : (
            <Button disabled variant="solid" color="default">
              <Lock size={23} />
            </Button>
          )
        }

      </div>
    </div>

  )
};

export default function ChapterRoadmap() {

  const { japanese_chapter, japanese_level, setUser, userId } = useUserStore()
  const { shouldRefetchChapter } = useGeneralStore();
  const chapters = Array.from({ length: levelChapterMap[japanese_level] }, (_, i) => (i + 1).toString());

  let foundCurrent = false;

  const { data: chapter_progress, isFetching, refetch: refetchProgress } = useFetchChapterProgress(userId, parseInt(japanese_level.split('')[1]), japanese_chapter);

  useEffect(() => {
    if (shouldRefetchChapter) {
      refetchProgress();
    }
  }, [shouldRefetchChapter]);


  return (
    <div className="space-y-12 max-w-screen-md mx-auto pb-10">
      <div className=" px-6 pt-8 space-y-5 lg:space-y-12">
        <div className="flex items-center gap-4">
          <CompassRose size={32} />
          <h1 className="text-lg lg:text-3xl font-bold text-dark dark:text-gray-100">Roadmap for Chapter <span className="text-orange-500">{japanese_chapter}</span>  – {japanese_level}</h1>
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
                {ch}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {
        isFetching ?
          <RamenLoading />
          :
          <>
            {roadmapData.map((phase, idx) => {
              const phaseIndex = idx + 1;
              const phaseStr = String(phaseIndex);
              const levelStr = String(parseInt(japanese_level.split('')[1]));
              const chapterStr = String(japanese_chapter);
              //@ts-ignore
              const completedSteps = chapter_progress?.[levelStr]?.[chapterStr]?.[phaseStr] || [];

              return (
                <div key={idx} className="space-y-4 bg-blue-50 dark:bg-zinc-800 border dark:border-dark rounded-none md:rounded-md overflow-hidden">
                  <div className="bg-slate-600 dark:bg-dark_1 p-5">
                    <h2 className="text-xl font-semibold text-white">{phase.title}</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 px-6 py-5 lg:p-5">
                    {phase.steps.map(([label, type, description, route], i) => {
                      const stepIndex = i;
                      const isUnlocked = isStepUnlocked(chapter_progress, levelStr, chapterStr, phaseStr, stepIndex);
                      const completed = completedSteps.includes(stepIndex);

                      let isCurrent = false;
                      if (isUnlocked && !completed && !foundCurrent) {
                        isCurrent = true;
                        foundCurrent = true;
                      }

                      return (
                        <RoadmapItem
                          key={i}
                          phase={phaseIndex}
                          step_i={i + 1}
                          label={label}
                          type={type as any}
                          description={description}
                          route={route}
                          japanese_chapter={japanese_chapter}
                          japanese_level={parseInt(japanese_level.split('')[1])}
                          progress={chapter_progress}
                          completed={completed}
                          isCurrent={isCurrent}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}


            <Button variant="bordered" className="fixed bottom-5 right-10 lg:bottom-14 lg:right-28" as={Link} href="#resume">Resume</Button>
          </>
      }

    </div>
  );
}
