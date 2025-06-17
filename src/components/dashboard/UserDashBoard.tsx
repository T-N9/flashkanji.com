"use client"

import useKanjiGroundState from "@/store/kanjiGroundState";
import { Badge, Button, Card, CardBody, CardHeader, Progress } from "@nextui-org/react"
import { AirplaneTakeoff, ArrowElbowRightUp, BookOpen, BookOpenText, Brain, Calendar, Clock, Fire, Target } from "@phosphor-icons/react"
import { useRouter } from "next/navigation";
import ReviewSchedule from "../review-schedule/ReviewSchedule";

export default function UserDashBoard() {

    const { setIsReviewMode } = useKanjiGroundState();
    const router = useRouter();

    const handleStartReview = () => {
        setIsReviewMode(true);
        router.push('/study/kanji/repetition');
    }

    const currentStreak = 12;

    // Sample data for the dashboard
    const studyStats = {
        dueToday: 47,
        newCards: 15,
        reviewCards: 32,
        totalLearned: 1247,
        accuracy: 87,
        streak: currentStreak,
        studyTime: 45, // minutes today
    }

    const srsLevels = [
        { level: "Apprentice I", count: 23, color: "bg-pink-500" },
        { level: "Apprentice II", count: 18, color: "bg-pink-400" },
        { level: "Apprentice III", count: 15, color: "bg-pink-300" },
        { level: "Apprentice IV", count: 12, color: "bg-pink-200" },
        { level: "Guru I", count: 34, color: "bg-purple-500" },
        { level: "Guru II", count: 28, color: "bg-purple-400" },
        { level: "Master", count: 156, color: "bg-blue-500" },
        { level: "Enlightened", count: 89, color: "bg-yellow-500" },
        { level: "Burned", count: 872, color: "bg-gray-600" },
    ]

    const recentActivity = [
        { kanji: "学", reading: "がく", meaning: "study", result: "correct", time: "2 min ago" },
        { kanji: "生", reading: "せい", meaning: "life", result: "correct", time: "3 min ago" },
        { kanji: "時", reading: "じ", meaning: "time", result: "incorrect", time: "5 min ago" },
        { kanji: "人", reading: "じん", meaning: "person", result: "correct", time: "7 min ago" },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">


            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Student!</h1>
                    <p className="text-gray-600 mb-3">
                        Ready to continue your Kanji journey? You have {studyStats.dueToday} cards due today.
                    </p>

                    <Button variant="bordered" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h1 className="text-sm font-medium">Due Today</h1>
                            <Clock className="h-4 w-4" />
                        </CardHeader>
                        <CardBody>
                            <div className="text-2xl font-bold">{studyStats.dueToday}</div>
                            <p className="text-xs opacity-90">
                                {studyStats.newCards} new • {studyStats.reviewCards} review
                            </p>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h1 className="text-sm font-medium">Total Learned</h1>
                            <BookOpenText className="h-4 w-4" />
                        </CardHeader>
                        <CardBody>
                            <div className="text-2xl font-bold">{studyStats.totalLearned.toLocaleString()}</div>
                            <p className="text-xs opacity-90">Kanji mastered</p>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h1 className="text-sm font-medium">Accuracy</h1>
                            <Target className="h-4 w-4" />
                        </CardHeader>
                        <CardBody>
                            <div className="text-2xl font-bold">{studyStats.accuracy}%</div>
                            <p className="text-xs opacity-90">Last 100 reviews</p>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h1 className="text-sm font-medium">Study Streak</h1>
                            <Fire className="h-4 w-4" />
                        </CardHeader>
                        <CardBody>
                            <div className="text-2xl font-bold">{studyStats.streak}</div>
                            <p className="text-xs opacity-90">days in a row</p>
                        </CardBody>
                    </Card>
                </div>

                <ReviewSchedule/>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Study Session */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <h1 className="flex items-center">
                                    <AirplaneTakeoff className="w-5 h-5 mr-2 text-yellow-500" />
                                    Start Study Session
                                </h1>
                                <p>Continue your learning journey with spaced repetition</p>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-blue-900">Reviews Available</h3>
                                        <p className="text-sm text-blue-700">{studyStats.reviewCards} cards ready for review</p>
                                    </div>
                                    <Button onClick={handleStartReview} className="bg-blue-600 hover:bg-blue-700">Start Reviews</Button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-green-900">New Lessons</h3>
                                        <p className="text-sm text-green-700">{studyStats.newCards} new Kanji to learn</p>
                                    </div>
                                    <Button
                                        variant="bordered"
                                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                    >
                                        Start Lessons
                                    </Button>
                                </div>

                                <div className="pt-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Today&apos;s Progress</span>
                                        <span>{studyStats.studyTime} min studied</span>
                                    </div>
                                    <Progress value={65} className="h-2" />
                                </div>
                            </CardBody>
                        </Card>

                        {/* SRS Level Distribution */}
                        <Card>
                            <CardHeader>
                                <h1 className="flex items-center">
                                    <ArrowElbowRightUp className="w-5 h-5 mr-2 text-purple-500" />
                                    SRS Level Distribution
                                </h1>
                                <p>Your Kanji organized by spaced repetition intervals</p>
                            </CardHeader>
                            <CardBody>
                                <div className="grid grid-cols-3 gap-3">
                                    {srsLevels.map((level, index) => (
                                        <div key={index} className="text-center">
                                            <div
                                                className={`w-full h-8 ${level.color} rounded-md flex items-center justify-center text-white text-sm font-medium mb-1`}
                                            >
                                                {level.count}
                                            </div>
                                            <p className="text-xs text-gray-600">{level.level}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Study Goals */}
                        <Card>
                            <CardHeader>
                                <h1>Daily Goals</h1>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Reviews</span>
                                        <span>32/50</span>
                                    </div>
                                    <Progress value={64} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>New Lessons</span>
                                        <span>8/15</span>
                                    </div>
                                    <Progress value={53} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Study Time</span>
                                        <span>45/60 min</span>
                                    </div>
                                    <Progress value={75} className="h-2" />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <h1>Quick Actions</h1>
                            </CardHeader>
                            <CardBody className="space-y-2">
                                <Button variant="bordered" className="w-full justify-start">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Browse Kanji
                                </Button>
                                <Button variant="bordered" className="w-full justify-start">
                                    <ArrowElbowRightUp className="w-4 h-4 mr-2" />
                                    View Statistics
                                </Button>
                                <Button variant="bordered" className="w-full justify-start">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Study Calendar
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
