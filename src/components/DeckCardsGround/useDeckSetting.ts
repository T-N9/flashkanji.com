
import useDeckGroundState from "@/store/deckGroundState";

export const useDeckSetting = () => {


  const {

    isFlippedMode,
    toggleIsFlippedMode,
    setDeckData,

  } = useDeckGroundState();



  return {
    isFlippedMode,
    toggleIsFlippedMode,
    setDeckData,
  };
};
