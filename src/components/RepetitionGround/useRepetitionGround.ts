import { useRouter, useSearchParams } from 'next/navigation';

const useRepetitionGround = () => {
      const searchParams = useSearchParams();
      const router = useRouter();
      // Extracting queries
      const chapter = searchParams.get("chapter");
      const level = searchParams.get("level");
  return {
    chapter,
    level
  }
}

export default useRepetitionGround