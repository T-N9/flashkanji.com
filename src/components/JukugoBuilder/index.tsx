"use client";
import { useJukugoByChapterAndLevel } from "@/services/jukugo";
import useJukugoGroundState from "@/store/jukugoGroundState";
import { relatedJukugoItem } from "@/types/jukugo";
import { buildQuizOptions, handleChouon, OptionSet } from "@/util/buildQuizOptions";
import { Button, Card, CardBody, CardHeader, Progress } from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import CharacterImage from "../common/character";
import RamenLoading from "../common/RamenLoading";
import { useUserStore } from "@/store/userState";
import { useAddXpPoints, useRemoveHeart, useSaveEndSection, useSaveStreak } from "@/services/progress";
import { useRouter } from "next/navigation";
import { useGeneralStore } from "@/store/generalState";
import { hasSavedStreakToday, saveStreakToLocalStorage } from "@/util/streak";
import { shuffleArray } from "@/util";
import { toast } from "sonner";
import { playSound } from "@/util/soundPlayer";
import { CheckCircle } from "@phosphor-icons/react";

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
    const { mapItemData, setShouldRefetchChapter, setVictoryXp, setIsVictoryModalOpen } = useGeneralStore();

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
            // console.log('Next Item??')
            setCurrentIndex(nextIndex);
            setQueue(nextQueue);
            setCurrentItem(nextQueue[nextIndex]);
        } else {
            // console.log('ending....')
            setIsCompleted(true);
            setCurrentItem(null); // Done!
        }
    };
    // console.log("queue", queue);
    // console.log("currentItem", currentItem);

    const { userId, xp_points, setXpPoints } = useUserStore();

    const { mutate: saveSection, isLoading: saveLoading } = useSaveEndSection();
    const { mutate: saveStreak } = useSaveStreak();
    const { mutate: addXpPoints, isLoading: isClaiming } = useAddXpPoints()
    const router = useRouter();

    const handleAddPointsAndEndSession = (point: number) => {
        playSound('session')
        setIsVictoryModalOpen(true)
        setVictoryXp(point)
        setXpPoints(xp_points + point);
        router.push("/flashmap#resume");
    }

    const handleAddPracticePointsAndEndSession = () => {
        playSound('session')
        setIsVictoryModalOpen(true)
        setVictoryXp(1)
        setXpPoints(xp_points + 1);
        router.push("/flashmap#resume");
    }

    const saveSectionWithPayload = (
        onSuccess: () => void,
        onError?: (error: any) => void
    ) => {
        if (!mapItemData?.isCurrent) {
            addXpPoints({
                user_id: userId, point: 1
            }, {
                onSuccess: () => {
                    handleAddPracticePointsAndEndSession();
                },
                onError: (err) => {
                    console.log(err, "Error ending session")
                }
            })
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
                handleAddPointsAndEndSession(5);
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
    if (isCompleted) return (<div className="text-center py-10 relative z-30">
        <CharacterImage src="happy.png" className="mx-auto mb-4" />

        {
            mapItemData?.isCurrent ?
                <Button onClick={handleFinishSection} variant='bordered' color='primary' className='table mx-auto mt-2'>
                    {saveLoading ? 'Saving...' : 'Mark as Done'}
                </Button>
                :
                <div className='flex gap-2 justify-center items-center mt-2'>
                    <CheckCircle className='text-green-500' size={32} />
                    <Button onClick={handleFinishSection} size="sm" variant='faded' color='default' className=''>
                        {isClaiming ? 'Claiming...' : 'Claim Practice Point'}
                    </Button>
                </div>
        }
    </div>);
    if (!data || data.length === 0) {
        return <div className="text-center py-10">No quiz items available.</div>;
    }
    if (!currentItem) {
        return <div className="text-center py-10">Loading current item...</div>;
    }

    return (
        <div className="max-w-screen-sm min-h-screen mx-auto pt-5">
            {!isCompleted && queue.length > 0 && (
                <div className="mb-4 px-6">
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
    const [answerMora, setAnswerMora] = useState<number[]>([]);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const { mutate: removeHeart, isLoading } = useRemoveHeart();
    const { userId, setLives, lives } = useUserStore()
    const { setVictoryModalType, setIsVictoryModalOpen } = useGeneralStore()

    useEffect(() => {
        if (item) {
            const quizData = buildQuizOptions(item, allData);
            setQuizItem(quizData);
            setAnswerMora([]);
            setIsChecked(false);
            setIsAnswerCorrect(null);
            console.log({ quizData, item, allData })
        }
    }, [item]);

    console.log({ quizItem })

    console.log({ trick: handleChouon("びょ") })

    const handleClickMora = (index: number) => {
        playSound('click')
        // if (answerMora.includes(mora)) {
        //     setAnswerMora((prev) => prev.filter((m) => m !== mora));
        // } else {
        //     setAnswerMora((prev) => {
        //         if (prev.includes(mora)) {
        //             return prev.filter((m) => m !== mora);
        //         } else {
        //             return [...prev, mora];
        //         }
        //     });
        // }

        setAnswerMora((prev) => {
            if (prev.includes(index)) {
                return prev.filter((i) => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const handleCheckAnswer = () => {
        setIsChecked(true);
        if (quizItem) {
            const selectedMoras = answerMora.map((i) => quizItem.options[i]);
            const correctMoras = quizItem.correctMoras;

            const isCorrect =
                selectedMoras.length === correctMoras.length &&
                selectedMoras.every((mora, index) => mora === correctMoras[index]);

            if (isCorrect) {
                playSound('right')
                setIsAnswerCorrect(isCorrect);
            } else {
                if (lives === 1) {
                    playSound('loss')
                    setVictoryModalType('loss');
                    setIsVictoryModalOpen(true)

                }
                setLives(lives - 1)
                removeHeart({
                    user_id: userId
                }, {
                    onSuccess: () => {
                        // toast.error("A life have lost.")
                        console.log("one live lost.")
                    },
                    onError: () => {
                        setLives(lives + 1)
                    },
                })
                playSound('alert')
                toast.error('💔 Opps, wrong answer!')
            }


        }
    };

    if (!quizItem) return null;

    return (
        <Card className="w-full p-4  border dark:border-slate-800 rounded-xl bg-gradient-to-br from-gray-50 via-gray-200 to-gray-300 dark:from-slate-950 dark:via-slate-800 dark:to-slate-700">
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
                                {answerMora.map((selectedIndex, index) => {
                                    const mora = quizItem.options[selectedIndex];
                                    return (
                                        <div
                                            key={index}
                                            className={`bg-white dark:bg-dark shadow relative text-dark dark:text-gray-100 p-2 rounded border-b-2 border-orange-500 
                    ${isChecked ? (isAnswerCorrect ? '!bg-green-400' : '!bg-red-400') : ''}`}
                                        >
                                            <p className="text-lg lg:text-2xl">{mora}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )

                        :
                        <div
                            className="bg-white dark:bg-dark mb-4 shadow relative text-dark dark:text-gray-100 px-4 py-2 rounded border-b-2 border-orange-500"
                        >
                            <p className="text-lg lg:text-2xl animate-pulse">???</p>
                        </div>
                    }
                </div>
                <div className={`${isChecked && 'opacity-35 pointer-events-none select-none'} flex flex-wrap justify-center gap-2 mt-4`}>
                    {quizItem.options.map((mora, index) => (
                        <Button
                            key={index}
                            className={`${answerMora.includes(index) ? "bg-slate-700 dark:bg-blue-900 text-white" : "bg-white dark:bg-dark_1"
                                }`}
                            onClick={() => handleClickMora(index)}
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
                                    <CharacterImage src="thinking.png" className="mx-0 w-[100px] h-[100px]" />
                                    <span className="absolute border-2 border-transparent bg-white p-1 dark:bg-dark shadow-lg rounded-md top-0 left-[10%]">
                                        {answerMora.length > 0 ? (
                                            <div className="flex">
                                                「
                                                {answerMora.map((selectedIndex, index) => {
                                                    const mora = quizItem.options[selectedIndex];
                                                    return (

                                                        <div
                                                            key={index}
                                                            className=""
                                                        >
                                                            <p className="text-xs">{mora}</p>
                                                        </div>
                                                    )
                                                })}
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
                                            <CharacterImage src="happy.png" className="mx-0 w-[100px] h-[100px]" />
                                        ) : (
                                            <CharacterImage src="crying.png" className="mx-0 w-[100px] h-[100px]" />
                                        )
                                    }
                                    {
                                        isAnswerCorrect ?
                                            <span className="absolute bg-white dark:bg-dark border-dashed border-2 border-green-500 p-1 shadow-lg rounded-md top-0 left-[10%]">
                                                <p className="text-xs">「当たった……！」</p>
                                            </span>
                                            :
                                            <span className="absolute bg-white p-1 dark:bg-dark border-dashed shadow-lg border-2 border-red-500 rounded-md top-0 left-[10%]">
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
