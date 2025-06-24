// Updated component using Next UI (Hero UI) and Phosphor Icons
"use client"

import { useEffect, useMemo, useState } from "react"
import { DayPicker } from "react-day-picker"
import { Tabs, Tab, Card, CardBody, CardHeader, Button, Chip } from "@heroui/react"
import { Calendar as CalendarIcon, BookOpen, Check, CircleNotchIcon } from "@phosphor-icons/react"
import { ja } from "react-day-picker/locale";

import "react-day-picker/dist/style.css"
import { formatDate, getTodayReviewCount, normalizeDate } from "@/util"
import useKanjiGroundState from "@/store/kanjiGroundState"
import { useRouter } from "next/navigation"
import { useFetchReviewCalendarData } from "@/services/repetition"
import { useUserStore } from "@/store/userState"
import useJukugoGroundState from "@/store/jukugoGroundState"

export default function SpacedLearningCalendar() {
  // const [selectedReviewDate, setSelectedDate] = useState<Date>(new Date())
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  // const [reviewData, setReviewData] = useState<{ date: string; kanji_count: number }[]>([]);
  const { setSelectedReviewDate, setIsReviewMode, selectedReviewDate } = useKanjiGroundState();
  const { setIsReviewMode: setIsReviewModeJukugo } = useJukugoGroundState();
  const { userId, setToDayReviewCount } = useUserStore()

  const { data: reviewData, refetch, isFetching } = useFetchReviewCalendarData(userId)

  const router = useRouter()

  useEffect(() => {
    if (userId) refetch()
  }, [userId])

  const reviewMap = useMemo(() => {
    const map = new Map<string, { kanji_count: number, jukugo_count: number }>()
    reviewData?.forEach((item) => {
      map.set(item.date, {
        kanji_count: item.kanji_count,
        jukugo_count: item.jukugo_count,
      })
    })
    return map
  }, [reviewData])

  const handleSelectDate = (date: Date) => {
    // setSelectedDate(normalizeDate(date))
    setSelectedReviewDate(formatDate(normalizeDate(date)))
  }

  const handleStartReview = (type: 1 | 2) => {
    if (type === 1) {
      setIsReviewMode(true);
      router.push('/study/kanji/repetition/');
    } else if (type === 2) {
      setIsReviewModeJukugo(true);
      router.push('/study/jukugo/repetition/');
    }

  }

  const selectedDateKey = selectedReviewDate;
  const todayKey = formatDate(normalizeDate(new Date()))

  useEffect(() => {
    reviewMap.size > 0 && setToDayReviewCount(getTodayReviewCount(reviewMap))
  }, [reviewMap]);

  console.log({ reviewMap })



  return (
    <div className="space-y-6">
      <Tabs aria-label="Views" variant="underlined">
        <Tab
          key="calendar"
          className="!mt-0"
          title={
            <span className="flex items-center gap-2">
              <CalendarIcon size={18} /> Calendar
            </span>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="font-semibold text-lg flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={20} /> Review Schedule
                </div>
                {
                  isFetching && <div>
                    <CircleNotchIcon size={22} className="animate-spin" />
                  </div>
                }

              </CardHeader>
              <CardBody>
                <DayPicker
                  locale={ja}
                  mode="single"
                  selected={new Date(selectedReviewDate)}
                  onSelect={(date) => date && handleSelectDate(date)}
                  modifiers={{
                    hasReviews: (date) => reviewMap.has(formatDate(normalizeDate(date))),
                  }}
                  modifiersClassNames={{
                    hasReviews: "bg-orange-200 text-orange-900 font-semibold rounded-full",
                  }}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="font-semibold text-lg">
                {new Date(selectedReviewDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </CardHeader>
              <CardBody>
                {reviewMap.has(selectedDateKey) ? (
                  <div className="flex bg-gray-100 justify-between items-center p-2 rounded">
                    {(() => {
                      const review = reviewMap.get(selectedDateKey);
                      const kanji = review?.kanji_count || 0;
                      const jukugo = review?.jukugo_count || 0;

                      return (
                        <div className="space-y-2 w-full">
                          {kanji !== 0 && <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <p className="text-gray-700">
                              {kanji} kanji review{kanji !== 1 ? "s" : ""}
                            </p>
                            {!completedItems.has(`${selectedDateKey}-kanji`) ? (
                              <div className="flex items-center gap-2">
                                <Button color="primary" onClick={() => handleStartReview(1)}>
                                  Review
                                </Button>
                                <Button

                                  onClick={() => setCompletedItems((prev) => new Set(prev).add(`${selectedDateKey}-kanji`))}
                                  isIconOnly
                                >
                                  <Check size={18} />
                                </Button>
                              </div>
                            ) : (
                              <p className="text-green-600 font-semibold">Completed</p>
                            )}
                          </div>}
                          {jukugo !== 0 && <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <p className="text-gray-700">
                              {jukugo} jukugo review{jukugo !== 1 ? "s" : ""}
                            </p>
                            {!completedItems.has(`${selectedDateKey}-jukugo`) ? (
                              <div className="flex items-center gap-2">
                                <Button color="primary" onClick={() => handleStartReview(2)}>
                                  Review
                                </Button>
                                <Button

                                  onClick={() => setCompletedItems((prev) => new Set(prev).add(`${selectedDateKey}-jukugo`))}
                                  isIconOnly
                                >
                                  <Check size={18} />
                                </Button>
                              </div>
                            ) : (
                              <p className="text-green-600 font-semibold">Completed</p>
                            )}
                          </div>}

                        </div>
                      );
                    })()}

                  </div>
                ) : (
                  <p className="text-gray-500">No reviews scheduled</p>
                )}
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab
          key="reviews"
          title={
            <span className="flex items-center gap-2">
              <BookOpen size={18} /> Today&apos;s Reviews
            </span>
          }
        >
          <Card className="mt-4">
            <CardHeader className="font-semibold text-lg">Today&apos;s Reviews</CardHeader>
            <CardBody>
              {reviewMap.has(todayKey) ? (
                <div className="space-y-3">
                  {(() => {
                    const review = reviewMap.get(todayKey);
                    const kanji = review?.kanji_count || 0;
                    const jukugo = review?.jukugo_count || 0;

                    return (
                      <div className="space-y-2">
                        {kanji !== 0 && <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                          <p className="text-gray-700">
                            {kanji} kanji review{kanji !== 1 ? "s" : ""}
                          </p>
                          {!completedItems.has(`${todayKey}-kanji`) ? (
                            <Button
                              color="primary"
                              onClick={() => handleStartReview(1)}
                            >
                              Start Review
                            </Button>
                          ) : (
                            <p className="text-green-600 font-semibold">Completed</p>
                          )}
                        </div>}
                        {jukugo !== 0 && <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                          <p className="text-gray-700">
                            {jukugo} jukugo review{jukugo !== 1 ? "s" : ""}
                          </p>
                          {!completedItems.has(`${todayKey}-jukugo`) ? (
                            <Button
                              color="primary"
                              onClick={() => handleStartReview(2)}
                            >
                              Start Review
                            </Button>
                          ) : (
                            <p className="text-green-600 font-semibold">Completed</p>
                          )}
                        </div>}
                      </div>
                    );
                  })()}

                </div>
              ) : (
                <p className="text-gray-500 text-center">No reviews scheduled for today</p>
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  )
}
