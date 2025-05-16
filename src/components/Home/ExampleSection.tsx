'use client'
import KanjiCard from "../cards/KanjiCard";
const staticKanjiData = [
    {
        id: 1,
        kanji_character: "日",
        onyomi: "ニチ, ジツ",
        kunyomi: "ひ, -び, -か",
        meaning: "Day, Sun",
        chapter: 1,
        level: 5
    },
    {
        id: 2,
        kanji_character: "本",
        onyomi: "ホン",
        kunyomi: "もと",
        meaning: "Book, Origin",
        chapter: 1,
        level: 5
    },
    {
        id: 3,
        kanji_character: "漢",
        onyomi: "カン",
        kunyomi: "-",
        meaning: "China",
        chapter: 7,
        level: 4
    },
    {
        id: 4,
        kanji_character: "字",
        onyomi: "ジ",
        kunyomi: "あざ, あざな, -な",
        meaning: "Character, Letter",
        chapter: 3,
        level: 5
    }
];


const ExampleSection = () => {

    return (
        <section className="w-full py-12 md:py-14 lg:py-16">
            <div className="main-container space-y-12 ">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                            Flashcards
                        </div>
                        <h2 className="text-3xl text-dark font-bold tracking-tighter sm:text-5xl">
                            Learn with Interactive{" "}
                            <span className="text-primary">Flashcards</span>
                        </h2>
                        <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Our flashcards provide a fun and interactive way to learn
                            and review kanji. Flip the card to see the meaning,
                            pronunciation, Kunyomi and Onyomi. We also provide an
                            all-in-one package of information such as stroke order,
                            jukugo and related information for each Kanji.
                        </p>
                    </div>
                </div>
                <div className="mx-auto text-center grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
                    <div className="grid gap-1">
                        <h3 className="text-lg font-bold text-primary">
                            Interactive Learning
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Flip the card to learn the meaning, pronunciation, and
                            example sentences.
                        </p>
                    </div>
                    <div className="grid gap-1">
                        <h3 className="text-lg font-bold text-primary">
                            Track Your Progress
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Mark cards as &quot;learned&quot; or &quot;need more practice&quot; to track
                            your progress.
                        </p>
                    </div>
                    <div className="grid gap-1">
                        <h3 className="text-lg font-bold text-primary">
                            Personalized Learning
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Customize your learning by selecting the kanji you want to
                            focus on.
                        </p>
                    </div>
                </div>

                <div>
                    <div className="table mb-4 mx-auto rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                        Example kanjis
                    </div>
                    <div className="mx-auto grid items-start gap-4 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-4 grid-cols-1">
                        {
                            staticKanjiData?.map((kanji, index) => {
                                return <KanjiCard key={index} item={kanji} isInfoShow={false} />;
                            })

                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ExampleSection