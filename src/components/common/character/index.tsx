// components/CharacterImage.tsx
import Image from "next/image";

type CharacterImageProps = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function CharacterImage({
  src,
  alt = "Character",
  width = 100,
  height = 100,
  className = "mx-auto",
}: CharacterImageProps) {
  return (
    <Image
      className={className}
      src={`/assets/character/${src}`}
      width={width}
      height={height}
      alt={alt}
    />
  );
}
