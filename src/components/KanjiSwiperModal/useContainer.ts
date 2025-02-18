import useKanjiGroundState from "@/store/kanjiGroundState";
import { useGeneralStore } from "@/store/generalState";

export const useContainer = () => {
  const { kanji, isLoading } =
    useKanjiGroundState();

  const { isFlashModalOpen, toggleFlashModal } = useGeneralStore();


  return {
    kanji,
    isLoading,
    isFlashModalOpen,

    /* action */
    toggleFlashModal
  };
};
