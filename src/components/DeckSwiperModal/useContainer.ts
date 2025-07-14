import useDeckGroundState from "@/store/deckGroundState";
import { useGeneralStore } from "@/store/generalState";

export const useContainer = () => {
  const { deckData } = useDeckGroundState();

  const { isDeckModalOpen, toggleDeckModal } = useGeneralStore();

  return {
    deckData,
    isDeckModalOpen,
    toggleDeckModal,
  };
};
