'use client'
import { Button } from '@heroui/react';
import useContainer from './useContainer';
import { useKanjiQuiz } from '@/services/quiz';
import { QuizItem } from '../common/quiz-item';
import { useEffect } from 'react';
import Link from 'next/link';
import RamenLoading from '../common/RamenLoading';

const QuizGround = () => {

    const { level, chapter, mode, isQuizSubmit, currentMark, answeredCount, handleQuizQuit, handleQuizSubmit, setQuizData, quizData, part, isParted, resetQuizState } = useContainer();
    console.log({ level, chapter, mode, part })

    const { data, isLoading, isError } = useKanjiQuiz(chapter ? chapter : null,
        level ? level : null, mode ? mode : null, isParted ? part : null);

    useEffect(() => {
        if (data && JSON.stringify(data) !== JSON.stringify(quizData)) {
            console.log({ data });
            setQuizData(data)
            resetQuizState(); // Reset quiz state when new data is fetched
            // @ts-ignore
        }
    }, [data]);

    // console.log({ answeredCount, length: data?.length, isQuizSubmit })

    return (
        <div className="max-w-[1280px] min-w-[70%] mx-auto p-4">
            <div className=" w-full flex flex-col my-8 justify-between items-center container font-english">
                {
                    data?.length !== 0 &&
                    <div className=''>
                        <h1 className="text-md rounded-full font-medium px-4 py-2 bg-dark text-white">
                            Quiz on {level && level}{" "}
                            {chapter && `Chapter ${chapter}`}
                        </h1>
                    </div>
                }


                {isQuizSubmit && (
                    <div className="text-xl text-gray-500">
                        Score :{" "}
                        <span className="font-medium text-info">{currentMark}</span> /{" "}
                        {data?.length}
                    </div>
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

                        {isQuizSubmit && (
                            <div className="text-xl text-center font-english mt-5 text-gray-500">
                                Score :{" "}
                                <span className="font-medium text-info">{currentMark}</span> /{" "}
                                {data?.length}
                            </div>
                        )}
                        <div className="my-5 flex gap-4 justify-center items-center">
                            <Button
                                onClick={() => handleQuizQuit()}
                                className=""
                                as={Link} href="/flashmap"
                            >
                                Quit
                            </Button>
                            <Button
                                // @ts-ignore
                                disable={answeredCount !== data?.length || isQuizSubmit}
                                className={`bg-gradient-radial text-white ${answeredCount !== data?.length || isQuizSubmit ? "cursor-not-allowed" : ""}`}
                                onClick={() => handleQuizSubmit()}
                            >
                                Submit
                            </Button>
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