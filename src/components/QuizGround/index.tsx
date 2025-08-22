'use client'
import { Button } from '@heroui/react';
import useContainer from './useContainer';
import { useKanjiQuiz } from '@/services/quiz';
import { QuizItem } from '../common/quiz-item';
import { useEffect } from 'react';
import RamenLoading from '../common/RamenLoading';
import CharacterImage from '../common/character';
import { useGeneralStore } from '@/store/generalState';
import { useUserStore } from '@/store/userState';
import { useAddXpPoints, useRemoveHeart, useSaveEndSection, useSaveStreak } from '@/services/progress';
import { useRouter } from 'next/navigation';
import { CheckCircle } from '@phosphor-icons/react';
import { hasSavedStreakToday, saveStreakToLocalStorage } from '@/util/streak';
import { toast } from 'sonner';
import { playSound } from '@/util/soundPlayer';



type QuizResultReactionProps = {
    score: number;
    total: number;
    className?: string
};

const getReactionImage = (percentage: number): string => {
    if (percentage < 20) return "crying.png";
    if (percentage < 40) return "annoyed.png";
    if (percentage < 60) return "annoyed.png";
    if (percentage < 80) return "good.png";
    return "star.png";
};

function QuizResultReaction({ score, total, className }: QuizResultReactionProps) {
    const percentage = (score / total) * 100;
    const imageSrc = getReactionImage(percentage);

    return (
        <div className={`text-center space-y-4 my-6 ${className}`}>
            <CharacterImage src={imageSrc} alt={`percentage mark`} />
            <div className="text-xl text-gray-500 dark:text-gray-300">
                Score :{" "}
                <span className="font-medium text-info">{score}</span> / {total}
            </div>
        </div>
    );
}
const QuizGround = () => {

    const { level, chapter, mode, isQuizSubmit, currentMark, answeredCount, setIsQuizSubmit, handleQuizQuit, setQuizData, quizData, part, isParted, resetQuizState } = useContainer();
    console.log({ level, chapter, mode, part })

    const { data, isLoading, isError } = useKanjiQuiz(chapter ? chapter : null,
        level ? level : null, mode ? mode : null, isParted ? part : null);

    useEffect(() => {
        if (data && JSON.stringify(data) !== JSON.stringify(quizData)) {
            // console.log({ data });
            setQuizData(data)
            resetQuizState(); // Reset quiz state when new data is fetched
            // @ts-ignore
        }
    }, [data]);

    useEffect(() => {
        handleQuizQuit()
    }, []);

    const { userId, xp_points, setXpPoints, lives, setLives } = useUserStore();
    const { mutate: saveSection, isLoading: saveLoading } = useSaveEndSection();
    const { mutate: saveStreak } = useSaveStreak()
    const router = useRouter();
    const { mapItemData, setShouldRefetchChapter, setVictoryModalType, setVictoryXp, setIsVictoryModalOpen } = useGeneralStore();
    const { mutate: removeHeart } = useRemoveHeart();
    const { mutate: addXpPoints, isLoading: isClaiming } = useAddXpPoints()

    const saveSectionWithPayload = (
        onSuccess: () => void,
        onError?: (error: any) => void
    ) => {
        if (!mapItemData?.isCurrent) {
            addXpPoints({
                user_id: userId, point: 1
            }, {
                onSuccess: () => {
                    playSound('session')
                    setVictoryModalType('victory')
                    setIsVictoryModalOpen(true)
                    setVictoryXp(1)
                    setXpPoints(xp_points + 1);
                    router.push("/flashmap#resume");
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
                playSound('session');
                setXpPoints(xp_points + 5)
                // toast.success("5 XP points increased.")
                setVictoryXp(5)
                setVictoryModalType('victory')
                setIsVictoryModalOpen(true)
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

    const handleQuizSubmit = () => {
        if (answeredCount === quizData.length) {
            setIsQuizSubmit(true);
        }

        if (currentMark < answeredCount) {
            playSound('alert')
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
            toast.error(`💔 Opps, you have  ${answeredCount - currentMark > 1 ? 'wrong answers' : 'a wrong answer'} !`)
        } else {
            playSound('right'),
                toast.success('All answers are correct!')
        }
    };


    return (
        <div className="max-w-[1280px] min-w-[70%] mx-auto p-4">
            <div className=" w-full flex flex-col my-2 justify-between items-center container font-english">
                {
                    data?.length !== 0 &&
                    <div className='relative z-10'>
                        <h1 className="text-md rounded-full font-medium px-4 py-2 bg-dark text-white">
                            Quiz on {level && level}{" "}
                            {chapter && `Chapter ${chapter}`}
                        </h1>
                    </div>
                }


                {isQuizSubmit && data && (
                    <QuizResultReaction className='relative z-20' score={currentMark} total={data?.length} />
                )}
            </div>
            {
                data?.length !== 0 ?
                    <div className="container mx-auto w-full lg:w-1/2">
                        <div className="flex flex-col gap-4">
                            {data?.map((item, index) => {
                                return (
                                    <QuizItem
                                        key={index}
                                        number={index}
                                        isSubmitted={isQuizSubmit}
                                        quizItem={item}
                                    />
                                );
                            })}
                        </div>

                        {isQuizSubmit && data && (
                            <QuizResultReaction score={currentMark} total={data?.length} />
                        )}
                        <div className='flex justify-center space-y-2 flex-col mb-10'>
                            <div className="my-5 flex gap-4 justify-center items-center">
                                {/* <Button
                                    onClick={() => handleQuizQuit()}
                                    className=""
                                    as={Link} href="/flashmap#resume"
                                >
                                    Quit
                                </Button> */}

                                {
                                    !isQuizSubmit &&

                                    <Button
                                        // @ts-ignore
                                        disable={answeredCount !== data?.length || isQuizSubmit}
                                        className={`bg-gradient-radial text-white ${answeredCount !== data?.length || isQuizSubmit ? "cursor-not-allowed opacity-55" : ""}`}
                                        onClick={() => handleQuizSubmit()}
                                    >
                                        Submit
                                    </Button>
                                }

                            </div>

                            {
                                isQuizSubmit &&
                                <>
                                    {
                                        mapItemData?.isCurrent ?
                                            <Button onClick={handleFinishSection} variant='bordered' color='primary' className='table mx-auto mt-2'>
                                                {saveLoading ? 'Saving...' : 'Mark as Done'}
                                            </Button> :

                                            <div className='flex gap-2 justify-center items-center mt-2'>
                                                <CheckCircle className='text-green-500' size={32} />
                                                <Button onClick={handleFinishSection} size="sm" variant='faded' color='default' className=''>
                                                    {isClaiming ? 'Claiming...' : 'Claim Practice Point'}
                                                </Button>
                                            </div>
                                    }
                                </>
                            }

                        </div>
                    </div>
                    :
                    <div className='text-center'>
                        <RamenLoading />
                    </div>
            }

        </div>
    )
}

export default QuizGround