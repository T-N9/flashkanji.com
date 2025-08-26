
import useJukugoGroundState from "@/store/jukugoGroundState";
import useKanjiGroundState from "@/store/kanjiGroundState";
import { SR_DeckCard, SR_KanjiCard } from "@/util";
import moment from "moment";
import React, { useMemo } from "react";

type Card = {
    id: number;
    character: string;
    meaning: string;
    hiragana?: string;
};

type TrackedItem = {
    updatedCard: {
        updatedCard: SR_DeckCard | SR_KanjiCard;
        satisfaction: number;
    };
    index: number;
};

type Props = {
    cardData: Card[];
    trackedData: TrackedItem[];
};

const difficultyMap: Record<
    number,
    { label: string; color: string }
> = {
    0: { label: "Insane", color: "bg-red-500" },
    1: { label: "Hard", color: "bg-orange-500" },
    2: { label: "Medium", color: "bg-blue-500" },
    3: { label: "Easy", color: "bg-green-500" },
};


const RepetitionSummary: React.FC<Props> = ({ cardData, trackedData }) => {
    const { isReviewMode } = useKanjiGroundState();
    const { isReviewMode: isJukugoReviewMode } = useJukugoGroundState()

    // group tracked data by card.id
    const grouped = useMemo(() => {
        const map: Record<
            number,
            {
                clicks: number;
                indexes: number[];
                lastReviewDate: string;
                satisfaction: number;
            }
        > = {};



        trackedData.forEach((entry) => {
            const cardId = (isReviewMode || isJukugoReviewMode) ? entry.updatedCard.updatedCard.card_id || 0 : entry.updatedCard.updatedCard.id;

            if (!map[cardId]) {
                map[cardId] = {
                    clicks: 0,
                    indexes: [],
                    lastReviewDate:
                        entry.updatedCard.updatedCard.nextReviewDate?.toString() ?? "",
                    satisfaction: entry.updatedCard.satisfaction,
                };
            }

            map[cardId].clicks += 1;
            map[cardId].indexes.push(entry.index);
            map[cardId].lastReviewDate =
                entry.updatedCard.updatedCard.nextReviewDate?.toString() ?? "";
            map[cardId].satisfaction = entry.updatedCard.satisfaction; // keep latest
        });

        return map;
    }, [trackedData]);

    return (
        <div className="overflow-auto max-h-96">
            <table className="min-w-full border-collapse border border-gray-300 bg-white dark:bg-backdrop text-xs">
                <thead className="bg-gray-100 dark:bg-slate-700">
                    <tr>
                        <th className="border px-3 py-2">#</th>
                        <th className="border px-3 py-2">Character</th>
                        <th className="border px-3 py-2">Clicks</th>
                        <th className="border px-3 py-2">Button Indexes</th>
                        {/* <th className="border px-3 py-2">Satisfaction</th> */}
                        <th className="border px-3 py-2">Final Review Date</th>
                    </tr>
                </thead>
                <tbody>
                    {/** 🔥 sort cards by clicks high → low before mapping */}
                    {[...cardData]
                        .sort((a, b) => {
                            const clicksA = grouped[a.id]?.clicks ?? 0;
                            const clicksB = grouped[b.id]?.clicks ?? 0;
                            return clicksB - clicksA;
                        })
                        .map((card, i) => {
                            const summary = grouped[card.id];

                            return (
                                <tr key={card.id} className="text-center">
                                    <td className="border px-3 py-2">{i + 1}</td>
                                    <td className="border px-3 py-2 font-bold">{card.character}</td>

                                    {summary ? (
                                        <>
                                            <td className="border px-3 py-2">{summary.clicks}</td>
                                            <td className="border px-3 py-2 flex max-w-52 flex-wrap">
                                                {summary.indexes.map((idx, j) => {
                                                    const diff = difficultyMap[idx];
                                                    return (
                                                        <div
                                                            key={j}
                                                            title={diff.label}
                                                            className={`w-5 h-5 ${diff.color}`}
                                                        />
                                                    );
                                                })}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {summary.lastReviewDate
                                                    ? moment(summary.lastReviewDate).format("MMM Do YY")
                                                    : "-"}
                                            </td>
                                        </>
                                    ) : (
                                        <td
                                            className="border px-3 py-2 italic text-gray-400"
                                            colSpan={4}
                                        >
                                            No interactions yet
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                </tbody>

            </table>
        </div>
    );
};

export default RepetitionSummary;
