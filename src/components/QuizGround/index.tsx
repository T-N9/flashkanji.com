'use client'

/* Components */
import { Button, Select, SelectItem } from "@nextui-org/react";

/* Hook */
import useContainer from "./useContainer";
import Link from "next/link";

export const Quiz_Ground = () => {
    const {

        level,
        chapter,
        mode,
        selectedChapter,
        selectedLevel,

        selectedMultiChapters,
        noChapters,

        quizData,
        isQuizReady,
        answeredCount,
        currentMark,
        isQuizSubmit,
        /* action */
        setSelectedChapter,
        updateQueryParams,
        setSelectedLevel,
        setSelectedMultiChapters,
        handleChapterData,
        handleQuizStart,
        handleQuizSubmit,
        handleQuizQuit,
        setQuizMode,
    } = useContainer();

    console.log({ level })
    return (
        <section className="relative flex  min-h-screen flex-col items-center p-4 pt-16">

            <>
                <h1 className="text-4xl font-english text-center font-bold text-info">
                    Let&apos;s practice with FlashQuiz!
                </h1>
                <p className="">今、漢字を練習しましょう。</p>
                <div className="mt-5 w-full flex flex-col justify-center items-center">
                    <div className="flex gap-4 w-full md:w-fit flex-wrap">
                        <div className="flex w-full md:w-36 min-w-36 select-box flex-col gap-6">
                            <Select
                                // @ts-ignore
                                items={[5, 4, 3, 2, 1]}
                                color="default"
                                size="sm"
                                className="drop-shadow"
                                label="Select Level"
                                defaultSelectedKeys={level?.toString()}
                            >
                                {[5, 4, 3, 2, 1].map((item) => (
                                    <SelectItem
                                        key={item}
                                        onClick={() => {
                                            updateQueryParams('level', item.toString())
                                        }}
                                        value={"N" + item.toString()}
                                        isDisabled={item <= 2} // Assuming that levels 3 and above are disabled
                                        isSelected={"N" + item === level}
                                    >
                                        {"N" + item.toString()}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="flex w-full md:w-36 min-w-36 select-box flex-col gap-6">
                            <Select
                                // @ts-ignore
                                items={noChapters}
                                color="default"
                                size="sm"
                                className="drop-shadow"
                                label="Select Chapter"
                                defaultSelectedKeys={[
                                    // @ts-ignore
                                    noChapters[chapter - 1]?.toString(),
                                ]}
                                // @ts-ignore
                                selectedKeys={[chapter?.toString() || '']}
                            >
                                {noChapters.map((item) => (
                                    <SelectItem
                                        key={item}
                                        onClick={() => {
                                            updateQueryParams('chapter', item.toString())
                                        }}
                                        value={item.toString()}
                                        isSelected={item.toString() === chapter}
                                        textValue={item.toString()}
                                    >
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="flex w-full md:w-36 min-w-36 select-box flex-col gap-6">

                            <Select
                                items={[
                                    {
                                        id: 1,
                                        name: "Onyomi",
                                    },
                                    {
                                        id: 2,
                                        name: "Kunyomi",
                                    },
                                    {
                                        id: 3,
                                        name: "Meaning",
                                    },
                                ]}
                                color="default"
                                size="sm"
                                className="drop-shadow"
                                label="Select Mode"
                                defaultSelectedKeys={selectedLevel}
                            >
                                {[
                                    {
                                        id: 1,
                                        name: "Onyomi",
                                    },
                                    {
                                        id: 2,
                                        name: "Kunyomi",
                                    },
                                    {
                                        id: 3,
                                        name: "Meaning",
                                    },
                                ].map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        onClick={() => {
                                            updateQueryParams("mode", item.id.toString())
                                        }}
                                        value={item.name}
                                        isSelected={item.id.toString() === mode}
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <Button
                        className={`${level === null && 'cursor-not-allowed'}` + " mt-5 mx-auto bg-gradient-radial text-2xl text-white table"}
                        disabled={level === null}
                        as={Link} href={`/study/kanji/quiz?chapter=${chapter}&level=${level}&mode=${mode}`}
                    >
                        Start
                    </Button>

                </div>
            </>

        </section>
    );
};
