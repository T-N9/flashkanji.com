import { Kanji } from "@/types/kanji";
import React, { useEffect, useState } from "react";

interface KanjiCardProps {
  item: Kanji;
  isSwiped?: boolean;
}

const KanjiCard: React.FC<KanjiCardProps> = ({ item, isSwiped = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [item]);

  return (
    <div className="relative">
      <div
        onClick={() => setIsFlipped((prev) => !prev)}
        className={`${
          isSwiped
            ? "bg-primary "
            : "bg-dark"
        } relative font-writing-1 text-white p-5 rounded-md card min-w-[150px] border-4 lg:min-w-[200px] shadow-md ${
          isFlipped && "flipped"
        }`}
      >
        {/* Front Side */}
        {!isSwiped && <span className="front text-gray-400">{item.id}</span>}
        <p
          className={`${
            isSwiped ? "text-[9rem] md:text-[18rem]" : "text-7xl"
          } front text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        >
          {item.kanji_character}
        </p>

        {/* Back Side */}
        <div
          className={`back absolute w-full top-[30%] -left-[0%] -translate-x-1/2 -translate-y-1/2 flex flex-col gap-5 p-2 ${
            isSwiped ? "text-2xl md:text-[3rem]" : "text-xl"
          }`}
        >
          {/* Kunyomi */}
          <p className="text-primary flex flex-wrap justify-center">
            {item.kunyomi?.split(",").map((i, index) => (
              <React.Fragment key={index}>
                <span>{i}</span>
                {index !== item.kunyomi.split(",").length - 1 && ", "}
              </React.Fragment>
            ))}
          </p>

          {/* Onyomi */}
          <p className="text-blue-400 flex flex-wrap justify-center">
            {item.onyomi?.split(",").map((i, index) => (
              <React.Fragment key={index}>
                <span>{i}</span>
                {index !== item.onyomi.split(",").length - 1 && ", "}
              </React.Fragment>
            ))}
          </p>

          {/* Meaning */}
          <p className="text-gray-200">{item.meaning}</p>
        </div>
      </div>
    </div>
  );
};

export default KanjiCard;
