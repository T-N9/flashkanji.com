"use client";
import { useJukugoByChapterAndLevel } from "@/services/jukugo";
import useJukugoGroundState from "@/store/jukugoGroundState";
import { relatedJukugoItem } from "@/types/jukugo";
import { buildQuizOptions, OptionSet } from "@/util/buildQuizOptions";
import { Button, Card, CardBody, CardHeader, Progress } from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import CharacterImage from "../common/character";
import RamenLoading from "../common/RamenLoading";
import { useUserStore } from "@/store/userState";
import { useSaveEndSection, useSaveStreak } from "@/services/progress";
import { useRouter } from "next/navigation";
import { useGeneralStore } from "@/store/generalState";
import { hasSavedStreakToday, saveStreakToLocalStorage } from "@/util/streak";
import { shuffleArray } from "@/util";
import { toast } from "sonner";

const JukugoBuilder = () => {
    const {
        level,
        part,
        selectedChapter: chapter,
        isParted,
    } = useJukugoGroundState();

    const { data, isFetching, error } = useJukugoByChapterAndLevel(
        chapter ?? null,
        level ?? null,
        isParted ? part : null
    );
    const [queue, setQueue] = useState<relatedJukugoItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentItem, setCurrentItem] = useState<relatedJukugoItem | null>(null);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const didInit = useRef(false); // 👈 prevent double setup
    const { mapItemData, setShouldRefetchChapter } = useGeneralStore();

    useEffect(() => {
        if (!didInit.current && data && data.length > 0) {
            const initialQueue = shuffleArray(data);
            setQueue(initialQueue);
            setCurrentItem(initialQueue[0]);
            didInit.current = true;
        }
    }, [data]);

    const handleContinue = (wasCorrect: boolean) => {
        const nextIndex = currentIndex + 1;
        const nextQueue = [...queue];

        // If incorrect, re-append to end of queue
        if (!wasCorrect && currentItem) {
            nextQueue.push(currentItem);
        }

        if (nextIndex < nextQueue.length) {
            setCurrentIndex(nextIndex);
            setQueue(nextQueue);
            setCurrentItem(nextQueue[nextIndex]);
        } else {
            setIsCompleted(true);
            setCurrentItem(null); // Done!
        }
    };
    // console.log("queue", queue);
    // console.log("currentItem", currentItem);

    const { userId, xp_points, setXpPoints } = useUserStore();

    const { mutate: saveSection, isLoading: saveLoading } = useSaveEndSection();
    const { mutate: saveStreak } = useSaveStreak();
    const router = useRouter();

    const saveSectionWithPayload = (
        onSuccess: () => void,
        onError?: (error: any) => void
    ) => {
        if (!mapItemData?.isCurrent) {
            router.push('/flashmap#resume');
            return;
        }

        const payload = {
            user_id: userId,
            chapter: mapItemData.chapter,
            level: mapItemData.level,
            phase: mapItemData.phase,
            stepIndex: (mapItemData.stepIndex || 1) - 1,
            xp_points: 5,
            isToDecrease: false,
        };

        saveSection(payload, {
            onSuccess: () => {
                setXpPoints(xp_points + 5)
                toast.success("5 XP points increased.")
                router.push("/flashmap#resume");
                onSuccess();
            },
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

    // const progress = ((currentIndex + 1) / queue.length) * 100;


    if (isFetching) return <div><RamenLoading /></div>;
    if (isCompleted) return <div className="text-center py-10 relative z-30">
        <CharacterImage src="happy.png" className="mx-auto mb-4" />
        <Button onClick={handleFinishSection} variant='bordered' color='primary' className='table mx-auto mt-2'>
            {saveLoading ? 'Saving...' : 'Mark as Done'}
        </Button> </div>;
    if (!data || data.length === 0) {
        return <div className="text-center py-10">No quiz items available.</div>;
    }
    if (!currentItem) {
        return <div className="text-center py-10">Loading current item...</div>;
    }

    return (
        <div className="max-w-screen-sm min-h-screen mx-auto pt-5">
            {!isCompleted && queue.length > 0 && (
                <div className="mb-4">
                    <Progress aria-label="Loading..." className="max-w-md mx-auto" value={((currentIndex + 1) / queue.length) * 100} />
                </div>
            )}
            {
                currentItem &&
                <JukugoBuilderItem key={currentItem.id + "-" + currentIndex} item={currentItem} allData={data ?? []} onContinue={handleContinue} />
            }

        </div>
    );
};

const JukugoBuilderItem = ({
    item,
    allData,
    onContinue
}: {
    item: relatedJukugoItem;
    allData: relatedJukugoItem[];
    onContinue: (wasCorrect: boolean) => void;
}) => {
    const [quizItem, setQuizItem] = useState<OptionSet | null>(null);
    const [answerMora, setAnswerMora] = useState<string[]>([]);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        if (item) {
            const quizData = buildQuizOptions(item, allData);
            setQuizItem(quizData);
            setAnswerMora([]);
            setIsChecked(false);
            setIsAnswerCorrect(null);
        }
    }, [item]);

    const handleClickMora = (mora: string) => {
        if (answerMora.includes(mora)) {
            setAnswerMora((prev) => prev.filter((m) => m !== mora));
        } else {
            setAnswerMora((prev) => {
                if (prev.includes(mora)) {
                    return prev.filter((m) => m !== mora);
                } else {
                    return [...prev, mora];
                }
            });
        }
    };

    const handleCheckAnswer = () => {
        setIsChecked(true);
        if (quizItem) {
            const correctMoras = quizItem.correctMoras;
            const isCorrect =
                answerMora.length === correctMoras.length &&
                answerMora.every((mora, index) => mora === correctMoras[index]);

            setIsAnswerCorrect(isCorrect);
        }
    };

    if (!quizItem) return null;

    return (
        <Card className="w-full p-4  border rounded-xl bg-gradient-to-br from-gray-50 via-gray-200 to-gray-300 ">
            <CardHeader className="flex flex-col gap-2 justify-center items-center">
                <div className="text-5xl lg:text-8xl font-normal text-center">{item.character}</div>
                <p className="text-base italic text-gray-400 text-center">
                    {item.meaning}
                </p>
            </CardHeader>

            <CardBody className="mt-2 space-y-4 relative overflow-visible">

                <div className="flex flex-col items-center">
                    {answerMora.length > 0 ? (
                        <>
                            {
                                isAnswerCorrect !== null && !isAnswerCorrect && <p className="text-xs text-center absolute -top-3 z-30">Correct Answer : <span>{item.hiragana}</span></p>
                            }
                            <div className="flex flex-wrap gap-2 mb-4">
                                {answerMora.map((mora, index) => (
                                    <div
                                        key={index}
                                        className={`bg-white shadow relative text-dark p-2 rounded border-b-2 border-orange-500 ${isChecked ? isAnswerCorrect ? '!bg-green-400' : '!bg-red-400' : ''}`}
                                    >
                                        <p className="text-lg lg:text-2xl">{mora}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )

                        :
                        <div
                            className="bg-white mb-4 shadow relative text-dark px-4 py-2 rounded border-b-2 border-orange-500"
                        >
                            <p className="text-lg lg:text-2xl animate-pulse">???</p>
                        </div>
                    }
                </div>
                <div className={`${isChecked && 'opacity-35 pointer-events-none select-none'} flex flex-wrap justify-center gap-2 mt-4`}>
                    {quizItem.options.map((mora, index) => (
                        <Button
                            key={index}
                            className={`${answerMora.includes(mora) ? "bg-slate-700 text-white" : ""
                                }`}
                            onClick={() => handleClickMora(mora)}
                        >
                            {mora}
                        </Button>
                    ))}
                </div>

                <hr className="border border-dark/30" />
                <div className="flex justify-between items-center">
                    <div className="flex-[7]">
                        {
                            !isChecked ?
                                <div className="relative flex justify-start">
                                    <CharacterImage src="thinking.png" className="mx-0" />
                                    <span className="absolute border-2 border-transparent bg-white p-1 shadow-lg rounded-md top-0 left-[10%]">
                                        {answerMora.length > 0 ? (
                                            <div className="flex">
                                                「
                                                {answerMora.map((mora, index) => (
                                                    <div
                                                        key={index}
                                                        className=""
                                                    >
                                                        <p className="text-xs">{mora}</p>
                                                    </div>
                                                ))}
                                                」
                                            </div>
                                        )

                                            :
                                            <div
                                                className=""
                                            >
                                                <p className="text-xs">「これ……なんて読むんだっけ？」</p>
                                            </div>
                                        }
                                    </span>
                                </div>
                                :
                                <div className="relative flex justify-start">
                                    {
                                        isAnswerCorrect ? (
                                            <CharacterImage src="happy.png" className="mx-0" />
                                        ) : (
                                            <CharacterImage src="crying.png" className="mx-0" />
                                        )
                                    }
                                    {
                                        isAnswerCorrect ?
                                            <span className="absolute bg-white border-dashed border-2 border-green-500 p-1 shadow-lg rounded-md top-0 left-[10%]">
                                                <p className="text-xs">「当たった……！」</p>
                                            </span>
                                            :
                                            <span className="absolute bg-white p-1 border-dashed shadow-lg border-2 border-red-500 rounded-md top-0 left-[10%]">
                                                <p className="text-xs">「読めると思ったのに……」</p>
                                            </span>
                                    }

                                </div>
                        }

                    </div>

                    {
                        isChecked ?
                            <Button className="flex-[3]" onClick={() => onContinue(isAnswerCorrect ?? false)} color={`${isAnswerCorrect ? "success" : "danger"}`}>
                                Continue
                            </Button>
                            :
                            <Button disabled={answerMora.length === 0} className={`${answerMora.length === 0 && 'select-none pointer-events-none opacity-60'} flex-[3]`} onClick={handleCheckAnswer} color={`${answerMora.length > 0 ? "primary" : "default"}`}>
                                Check
                            </Button>
                    }

                </div>
            </CardBody>
        </Card>
    );
};

export default JukugoBuilder;
