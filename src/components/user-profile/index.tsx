'use client'
import { useRestoreOrBuyHeart } from '@/services/progress';
import { useGeneralStore } from '@/store/generalState';
import { useUserStore } from '@/store/userState';
import { playSound } from '@/util/soundPlayer';
import { Avatar, Button, Card, CardBody, CardHeader, Progress, SelectItem, Select } from '@heroui/react';
import { Clover, HeartIcon } from '@phosphor-icons/react';
import moment from 'moment';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function ThemeSelector() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 dark:text-gray-300">
        Theme: <span className="font-medium capitalize">{currentTheme}</span>
      </span>

      <Select
        aria-label="Theme Selector"
        selectedKeys={[theme ?? 'system']}
        className="w-[140px]"
        onChange={(e) => setTheme(e.target.value)}
      >
        <SelectItem key="system">
          System
        </SelectItem>
        <SelectItem key="light">
          Light
        </SelectItem>
        <SelectItem key="dark">
          Dark
        </SelectItem>
      </Select>
    </div>
  );
}

const UserProfileSection = () => {
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
    const { username, userId, email, created_at, japanese_level, avatarUrl, rank, xp_points, setLives, lives, timeToRestoreHeart, setXpPoints } = useUserStore();
    // console.log({ timeToRestoreHeart })
    const RANKS = [
        {
            name: "Mizunoto",
            kanji: "癸",
            xp: 0,
            color: "bg-gradient-to-r from-yellow-500 to-amber-600", // Bronze vibe
        },
        {
            name: "Mizunoe",
            kanji: "壬",
            xp: 500,
            color: "bg-gradient-to-r from-orange-400 to-yellow-500",
        },
        {
            name: "Kanoto",
            kanji: "辛",
            xp: 1500,
            color: "bg-gradient-to-r from-amber-500 to-orange-600",
        },
        {
            name: "Kanoe",
            kanji: "庚",
            xp: 3000,
            color: "bg-gradient-to-r from-slate-400 to-gray-500", // Silver-like
        },
        {
            name: "Tsuchinoto",
            kanji: "己",
            xp: 5000,
            color: "bg-gradient-to-r from-blue-400 to-sky-500",
        },
        {
            name: "Tsuchinoe",
            kanji: "戊",
            xp: 8000,
            color: "bg-gradient-to-r from-violet-500 to-indigo-600",
        },
        {
            name: "Hinoto",
            kanji: "丁",
            xp: 12000,
            color: "bg-gradient-to-r from-rose-400 to-pink-500",
        },
        {
            name: "Hinoe",
            kanji: "丙",
            xp: 17000,
            color: "bg-gradient-to-r from-red-500 to-rose-600",
        },
        {
            name: "Kinoto",
            kanji: "乙",
            xp: 23000,
            color: "bg-gradient-to-r from-lime-400 to-green-500",
        },
        {
            name: "Kinoe",
            kanji: "甲",
            xp: 30000,
            color: "bg-gradient-to-r from-teal-400 to-emerald-500",
        },
        {
            name: "Hashira",
            kanji: "柱",
            xp: 40000,
            color: "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500", // Rainbow/elite
        },
    ];

    const { setIsVictoryModalOpen, setVictoryModalType } = useGeneralStore();

    const { mutate: buyHeart, isLoading } = useRestoreOrBuyHeart();

    useEffect(() => {
        if (timeToRestoreHeart === "" || lives >= 5) {
            setRemainingSeconds(null);
            return;
        }

        const targetTime = new Date(timeToRestoreHeart).getTime();

        const updateCountdown = () => {
            const now = Date.now();
            const diff = Math.floor((targetTime - now) / 1000);
            setRemainingSeconds(diff > 0 ? diff : 0);

            if (diff <= 0) {

                const newLives = Math.min(lives + 1, 5); // cap at 5
                if (newLives <= 5) {
                    toast.info("❤️ A heart has been restored!");
                }
                setLives(lives + 1);

                setRemainingSeconds(null); // stop timer display
                clearInterval(interval);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [timeToRestoreHeart, lives, setLives]);

    // if (remainingSeconds === null) return null;

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleBuyHeart = () => {
        setLives(lives + 1)

        if (xp_points >= 50) {
            setXpPoints(xp_points - 50)
            buyHeart({ user_id: userId, mode: 'buy' },
                {
                    onSuccess: () => {
                        playSound('session')

                        setVictoryModalType('restore')
                        setIsVictoryModalOpen(true)

                    },
                    onError: (err) => {
                        setLives(lives - 1)
                        console.log(err, "Buying heart fails.")
                    }
                }
            )
        } else {
            toast.error("You don't have sufficient points to buy.")
        }

    }

    return (
        <section className="">
            <Card className="rounded-2xl border border-gray-200 dark:border-gray-800">
                <CardHeader className="flex gap-4 items-center">
                    <Avatar
                        src={avatarUrl}
                        className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white"
                    />
                    <div>
                        <h3 className="text-lg font-semibold">{username || 'Guest'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{email || 'No email'}</p>
                    </div>
                </CardHeader>

                <CardBody className="text-sm text-gray-700 dark:text-gray-300 space-y-5">
                    {
                        lives < 5 && remainingSeconds !== null &&
                        <div className=' flex  justify-between items-center flex-col lg:flex-row'>
                            <div className='flex gap-2 items-center'>
                                <HeartIcon size={32} weight='fill' color='red' className='animate-heartbeat' />
                                <p>Next heart restores in: <strong>{formatTime(remainingSeconds)}</strong></p>
                            </div>
                            {
                                isLoading ?
                                    <Button className=' bg-white dark:bg-dark shadow'>
                                        Buying...
                                    </Button>
                                    :
                                    <Button onClick={handleBuyHeart} className=' bg-white dark:bg-dark shadow'>
                                        Buy <HeartIcon size={22} weight='fill' color='red' />/ 50  <Clover size={22} weight='fill' color='green' />
                                    </Button>
                            }

                        </div>
                    }

                    <div className='space-y-2'>
                        <div className='flex px-2 gap-2 justify-between items-center'>
                            <span>
                                {RANKS[rank - 1].name}
                            </span>
                            <Progress value={(100 / RANKS[rank].xp) * xp_points} size='sm' />
                            <span>
                                {RANKS[rank].name}
                            </span>
                        </div>
                        <div className='flex gap-3 justify-between overflow-x-scroll py-4'>
                            {
                                RANKS.map((item, idx) => {
                                    return (
                                        <div key={idx} className=''>
                                            <div className={`text-3xl font-bold text-white ${item.color} p-2 rounded-full border shadow ${idx + 1 === rank ? 'scale-110' : 'scale-90 opacity-50'}`}>
                                                {item.kanji}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <div>
                            <span className="font-medium">Japanese Level: </span>
                            {japanese_level || 'Unknown'}
                        </div>
                        <div>
                            <span className="font-medium">Joined: </span>
                            {created_at ? moment(created_at).format('MMMM Do YYYY') : 'N/A'}
                        </div>
                    </div>

                    <ThemeSelector/>
                </CardBody>
            </Card>
        </section>
    )
}

export default UserProfileSection