import Image from "next/image";

interface KanjiGifProps {
  kanji: string;
}

export const KanjiGif: React.FC<KanjiGifProps> = ({ kanji }) => {
  return (
    <div className="flex sticky top-4 flex-col items-center">
      <Image
        src={`https://raw.githubusercontent.com/jcsirot/kanji.gif/master/kanji/gif/150x150/${kanji}.gif`}
        width={200}
        height={200}
        className="rounded-md w-2/3 border-4 border-orange-500 shadow-md"
        alt={`Kanji ${kanji} GIF animation`}
      />

      <a
        className="text-sm font-normal hover:text-orange-400 transition-all duration-250 text-gray-500 font-english-text p-2 mt-2 rounded bg-transparent text-center underline"
        href={`/viewer?kanji=${kanji}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Check stroke information
      </a>
    </div>
  );
};
