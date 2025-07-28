"use client";
import { useKanjiByChapterAndLevel } from "@/services/kanji";
import useKanjiGroundState from "@/store/kanjiGroundState";
import { Kanji } from "@/types/kanji";
import { shuffleArray } from "@/util";
import { Button, cn } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import CharacterImage from "../common/character";
import RamenLoading from "../common/RamenLoading";
import { hasSavedStreakToday, saveStreakToLocalStorage } from "@/util/streak";
import { useUserStore } from "@/store/userState";
import { useSaveEndSection, useSaveStreak } from "@/services/progress";
import { useRouter } from "next/navigation";
import { useGeneralStore } from "@/store/generalState";

type selectItem = {
  id: number;
  kanji: Kanji;
};

type MatchMode = "meaning" | "kunyomi" | "onyomi";

const modes: MatchMode[] = ["meaning", "kunyomi", "onyomi"];

const MatchKanji = () => {
  const {
    level,
    part,
    selectedChapter: chapter,
    isParted,
  } = useKanjiGroundState();
  const [currentMode, setCurrentMode] = useState<MatchMode>("meaning");

  const [pickColumnData, setPickColumnData] = useState<Kanji[]>([]);
  const [matchColumnData, setMatchColumnData] = useState<Kanji[]>([]);

  const [selectedPickItem, setSelectedPickItem] = useState<selectItem | null>(
    null
  );
  const [matchedPairs, setMatchedPairs] = useState<
    { pickId: number; matchId: number }[]
  >([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Simulated API fetch
  const { data, isFetching, error } = useKanjiByChapterAndLevel(
    chapter ?? null,
    level ?? null,
    isParted ? part : null
  );

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Shuffle only once and set
    const shuffled = shuffleArray(data);

    setPickColumnData(shuffled);
    setMatchColumnData(shuffleArray(shuffled));
  }, [data]);

  const handlePick = (id: number, item: Kanji) => {
    setSelectedPickItem({ id, kanji: item });
  };

  const handleMatch = (matchItem: Kanji) => {
    if (!selectedPickItem) return;

    const pickValue = selectedPickItem.kanji[currentMode];
    const matchValue = matchItem[currentMode];

    const isCorrect =
      (pickValue === "-" && matchValue === "-") ||
      (pickValue !== "-" && matchValue === pickValue);

    if (isCorrect) {
      setMatchedPairs((prev) => [
        ...prev,
        { pickId: selectedPickItem.kanji.id, matchId: matchItem.id },
      ]);
      setSelectedPickItem(null);
    } else {
      toast.error("Wrong Match. Try again!");
    }
  };

  const isPickMatched = (id: number) =>
    matchedPairs.some((pair) => pair.pickId === id);

  const isMatchMatched = (id: number) =>
    matchedPairs.some((pair) => pair.matchId === id);

  const handleClickContinue = () => {
    if (matchedPairs.length === data?.length) {
      setMatchedPairs([]);
      setSelectedPickItem(null);
      setPickColumnData(shuffleArray(pickColumnData));
      setMatchColumnData(shuffleArray(matchColumnData));
      if (currentMode === "meaning") {
        setCurrentMode("onyomi");
      } else if (currentMode === "onyomi") {
        setCurrentMode("kunyomi");
      } else {
        setIsCompleted(true);
      }
    }
  };

  const { userId } = useUserStore();

  const { mutate: saveSection, isLoading: saveLoading } = useSaveEndSection();
  const { mutate: saveStreak } = useSaveStreak();
  const router = useRouter();
  const { mapItemData, setShouldRefetchChapter } = useGeneralStore();

  const saveSectionWithPayload = (
    onSuccess: () => void,
    onError?: (error: any) => void
  ) => {
    if (!mapItemData?.isCurrent) {
      router.push("/flashmap#resume");
      return;
    }

    const payload = {
      user_id: userId,
      chapter: mapItemData.chapter,
      level: mapItemData.level,
      phase: mapItemData.phase,
      stepIndex: (mapItemData.stepIndex || 1) - 1,
    };

    saveSection(payload, {
      onSuccess,
      onError: (error) => {
        console.error("Failed to save section:", error);
        onError?.(error);
      },
    });
  };

  const handleSaveSectionOnly = () => {
    saveSectionWithPayload(() => {
      setShouldRefetchChapter(true);
      console.log("Section saved successfully.");
      router.push("/flashmap#resume");
    });
  };

  const handleSaveSectionAndStreak = () => {
    saveSectionWithPayload(() => {
      setShouldRefetchChapter(true);
      console.log("Section saved successfully.");

      saveStreak(
        { user_id: userId },
        {
          onSuccess: () => {
            saveStreakToLocalStorage();
            console.log("Streak saved successfully.");
            router.push("/flashmap#resume");
          },
          onError: (error) => {
            console.error("Failed to save streak:", error);
          },
        }
      );
    });
  };

  const handleFinishSection = () => {
    const isAlreadySaved = hasSavedStreakToday();
    if (isAlreadySaved) {
      handleSaveSectionOnly();
    } else {
      handleSaveSectionAndStreak();
    }
  };

  if (isCompleted)
    return (
      <div className="text-center py-10 relative z-30">
        <CharacterImage src="happy.png" className="mx-auto mb-4" />
        <Button
          onClick={handleFinishSection}
          variant="bordered"
          color="primary"
          className="table mx-auto mt-2"
        >
          {saveLoading ? "Saving..." : "Mark as Done"}
        </Button>
      </div>
    );

  if (isFetching)
    return (
      <div>
        <RamenLoading />
      </div>
    );

  return (
    <section className="max-w-screen-md mx-auto px-6 py-8 relative z-20">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-orange-500">Flash Match</h1>
        <p className="text-sm text-gray-500">Match Kanji with their meanings</p>
      </div>
      <div className="flex justify-between gap-5">
        {/* Pick Column (Kanji) */}
        <div className="flex flex-col gap-5 w-1/2">
          {pickColumnData.map((kanji, idx) => (
            <Button
              size="lg"
              disabled={isPickMatched(kanji.id)}
              onClick={() => handlePick(idx, kanji)}
              key={kanji.id}
              className={cn(
                "p-4 rounded text-xl transition-all duration-200",
                isPickMatched(kanji.id)
                  ? "bg-green-200 text-green-800 cursor-default"
                  : selectedPickItem?.kanji.id === kanji.id
                  ? "bg-blue-200 text-blue-800"
                  : "bg-white shadow hover:bg-blue-50"
              )}
            >
              {kanji.character}
            </Button>
          ))}
        </div>

        {/* Match Column (Meaning) */}
        {currentMode === "meaning" && (
          <div className="flex flex-col gap-5 w-1/2">
            {matchColumnData.map((kanji) => (
              <Button
                size="lg"
                disabled={isMatchMatched(kanji.id)}
                onClick={() => handleMatch(kanji)}
                key={kanji.id + "-match"}
                className={cn(
                  "p-4 rounded text-base lg:text-xl transition-all duration-200",
                  isMatchMatched(kanji.id)
                    ? "bg-green-200 text-green-800 cursor-default"
                    : "bg-white shadow hover:bg-yellow-50"
                )}
              >
                {kanji.meaning}
              </Button>
            ))}
          </div>
        )}

        {/* Match Column (Meaning) */}
        {currentMode === "onyomi" && (
          <div className="flex flex-col gap-5 w-1/2">
            {matchColumnData.map((kanji) => (
              <Button
                size="lg"
                disabled={isMatchMatched(kanji.id)}
                onClick={() => handleMatch(kanji)}
                key={kanji.id + "-match"}
                className={cn(
                  "p-4 rounded text-base lg:text-xl transition-all duration-200",
                  isMatchMatched(kanji.id)
                    ? "bg-green-200 text-green-800 cursor-default"
                    : "bg-white shadow hover:bg-yellow-50"
                )}
              >
                {kanji.onyomi}
              </Button>
            ))}
          </div>
        )}

        {/* Match Column (Meaning) */}
        {currentMode === "kunyomi" && (
          <div className="flex flex-col gap-5 w-1/2">
            {matchColumnData.map((kanji) => (
              <Button
                size="lg"
                disabled={isMatchMatched(kanji.id)}
                onClick={() => handleMatch(kanji)}
                key={kanji.id + "-match"}
                className={cn(
                  "p-4 rounded text-base lg:text-xl transition-all duration-200",
                  isMatchMatched(kanji.id)
                    ? "bg-green-200 text-green-800 cursor-default"
                    : "bg-white shadow hover:bg-yellow-50"
                )}
              >
                {kanji.kunyomi}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Button
        className={`${
          matchedPairs.length !== data?.length &&
          "select-none pointer-events-none opacity-55"
        } mt-10 text-center mx-auto table`}
        color={matchedPairs.length !== data?.length ? "default" : "primary"}
        onClick={handleClickContinue}
      >
        Continue
      </Button>
    </section>
  );
};

export default MatchKanji;
