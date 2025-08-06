'use client'
import { useRestoreHeart } from '@/services/progress'
import { useUserStore } from '@/store/userState'
import Cookies from 'js-cookie';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const HeartRestorer = () => {
    const { userId, setTimeToRestoreHeart, setLives, lives } = useUserStore();
    const { mutate: restoreHeart } = useRestoreHeart();

    const restoredRef = useRef(false); // prevent multiple calls

    useEffect(() => {
        const cookie = Cookies.get('sb-access-token');

        if (userId && cookie !== undefined && lives < 5 && !restoredRef.current) {
            restoredRef.current = true; // block further calls in this session

            restoreHeart(
                { user_id: userId },
                {
                    onSuccess: (res) => {
                        if (res.restored_lives > 0) {
                            setLives(lives + res.restored_lives);
                            toast.info(`${res.restored_lives} heart${res.restored_lives > 1 ? 's' : ''} restored!`);
                        }

                        if (res.next_restore_time) {
                            setTimeToRestoreHeart(res.next_restore_time);
                        }
                    },
                    onError: (err) => {
                        console.error("Restore heart failed:", err);
                    },
                }
            );
        }
    }, [userId, lives]);

    return null;
}

export default HeartRestorer