"use client"

import { Button, Card, CardBody, CardHeader } from "@heroui/react"
import { BookOpenText, Clock, Fire, Target } from "@phosphor-icons/react"

import ReviewSchedule from "../review-schedule/ReviewSchedule";
import { useUserStore } from "@/store/userState";
import { useApplyExpiryPenalty } from "@/services/progress";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGeneralStore } from "@/store/generalState";

export default function UserDashBoard() {

    const { longestStreak, currentStreak, totalLearned, totalHours, username, resume_learning_section, todayReviewCount, expiredReviewCount, userId, setXpPoints, xp_points, setUser } = useUserStore();
    const { setShouldRefetchCalendar } = useGeneralStore()

    const { mutate: applyPenalty, isLoading: saveLoading } = useApplyExpiryPenalty();

    const handleExpiryPenalty = () => {
        const storedDate = localStorage.getItem("ex_penalty_date");

        const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const storedDay = storedDate ? new Date(storedDate).toISOString().split("T")[0] : null;

        if (storedDay === today) {
            console.log("Expiry penalty already applied today.");
            return;
        }

        applyPenalty({ user_id: userId, point: expiredReviewCount }, {
            onSuccess: (res) => {
                if (res?.isApplied) {
                    if (xp_points - expiredReviewCount < 0) {
                        setXpPoints(0)
                    } else {
                        setXpPoints(xp_points - expiredReviewCount)
                    }
                    toast.error(`${expiredReviewCount} points have been deducted.`)
                    localStorage.setItem('ex_penalty_date', new Date().toString())
                }
            },
            onError: (err) => {
                console.error("Penalty error:", err);
            },
        })
    }

    useEffect(() => {

        if (expiredReviewCount > 0) {
            handleExpiryPenalty();
        }
    }, [expiredReviewCount]);

    const router = useRouter();

    const handleResumeToFlashMap = (chapter: number, level: number) => {
        setShouldRefetchCalendar(true)
        setUser(
            {
                japanese_chapter: chapter,
                //@ts-ignore
                japanese_level: `N${level}`
            }
        )

        router.push('/flashmap')
    }

    return (
        <div className="min-h-screen ">


            <main className="max-w-screen-md mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-4">
                    <div className="flex gap-4 items-center">
                        <h1 className="text-lg lg:text-3xl font-bold text-dark dark:text-gray-100 mb-2">Welcome back, {username}!</h1>

                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 text-xs">
                        Ready to continue your Kanji journey? You have {todayReviewCount} cards due today. {expiredReviewCount > 0 && <span className="text-red-500">You have {expiredReviewCount} expired reviews!</span>}
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mb-4">
                    <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                            <h1 className="text-sm font-medium">Due Today</h1>
                            <Clock className="h-4 w-4" />
                        </CardHeader>
                        <CardBody className="pt-1">
                            <div className="text-2xl font-bold">{todayReviewCount}</div>
                            <p className="text-xs opacity-90">
                                cards to review today. {expiredReviewCount > 0 && `${expiredReviewCount} cards expired.`}
                            </p>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                            <h1 className="text-sm font-medium">Total Learned</h1>
                            <BookOpenText className="h-4 w-4" />
                        </CardHeader>
                        <CardBody className="pt-1">
                            <div className="text-2xl font-bold">{totalLearned}</div>
                            <p className="text-xs opacity-90">cards mastered</p>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                            <h1 className="text-sm font-medium">Study Hours</h1>
                            <Target className="h-4 w-4" />
                        </CardHeader>
                        <CardBody className="pt-1">
                            <div className="text-2xl font-bold">{totalHours}</div>
                            <p className="text-xs opacity-90">Last Pomodoro Sessions</p>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                            <h1 className="text-sm font-medium">Study Streak</h1>
                            <Fire className="h-4 w-4" />
                        </CardHeader>
                        <CardBody className="pt-1">
                            <div className="text-2xl font-bold">{currentStreak === 0 ? 0 : currentStreak - 1}</div>
                            <p className="text-xs opacity-90">{longestStreak === 0 ? 0 : longestStreak - 1} days in a row</p>
                        </CardBody>
                    </Card>
                </div>


                {
                    resume_learning_section?.chapter !== null
                    &&
                    <div className="flex justify-between items-center my-3">
                        Resume your journey

                        <Button className="bg-blue-500 text-white" onClick={() => handleResumeToFlashMap(resume_learning_section.chapter ?? 1, resume_learning_section.level ?? 5)}>
                            Learn
                        </Button>
                    </div>
                }


                <ReviewSchedule />
            </main>
        </div>
    )
}
