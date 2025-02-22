import { useGeneralStore } from "@/store/generalState";
import useJukugoGroundState from "@/store/jukugoGroundState";

export const useContainer = () => {
  const { jukugo, isLoading } =
    useJukugoGroundState();

  const { isJukugoModalOpen, toggleJukugoModal } = useGeneralStore();


  return {
    jukugo,
    isLoading,
    isJukugoModalOpen,
    
    /* action */
    toggleJukugoModal
  };
};
