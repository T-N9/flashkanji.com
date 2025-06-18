// Updated component using Next UI (Hero UI) and Phosphor Icons
"use client"

import { useMemo, useState } from "react"
import { DayPicker } from "react-day-picker"
import { Tabs, Tab, Card, CardBody, CardHeader, Button, Chip } from "@heroui/react"
import { Calendar as CalendarIcon, BookOpen, Check } from "@phosphor-icons/react"
import { ja } from "react-day-picker/locale";

import "react-day-picker/dist/style.css"
import { formatDate, normalizeDate } from "@/util"
import useKanjiGroundState from "@/store/kanjiGroundState"
import { useRouter } from "next/navigation"
import { useFetchReviewCalendarData } from "@/services/repetition"
import { useUserStore } from "@/store/userState"

// const reviewData: { date: string; kanji_count: number }[] = [
//   { date: "2025-06-16", kanji_count: 5 },
//   { date: "2025-07-01", kanji_count: 3 },
//   { date: "2025-06-26", kanji_count: 6 },
//   { date: "2025-06-20", kanji_count: 1 },
//   { date: "2025-06-23", kanji_count: 2 },
//   { date: "2025-07-23", kanji_count: 2 },
//   { date: "2025-08-25", kanji_count: 1 },
//   { date: "2025-06-18", kanji_count: 1 },
//   { date: "2025-07-06", kanji_count: 3 },
// ]


export default function SpacedLearningCalendar() {
  // const [selectedReviewDate, setSelectedDate] = useState<Date>(new Date())
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  // const [reviewData, setReviewData] = useState<{ date: string; kanji_count: number }[]>([]);
  const { setSelectedReviewDate, setIsReviewMode, selectedReviewDate } = useKanjiGroundState();
  const { userId } = useUserStore()

  const { data: reviewData } = useFetchReviewCalendarData(userId)

  const router = useRouter()

  const reviewMap = useMemo(() => {
    const map = new Map<string, number>()
    reviewData?.forEach((item) => {
      map.set(item.date, item.kanji_count)
    })
    return map
  }, [reviewData])

  const handleSelectDate = (date: Date) => {
    // setSelectedDate(normalizeDate(date))
    setSelectedReviewDate(formatDate(normalizeDate(date)))
  }

  const handleStartReview = () => {
    setIsReviewMode(true);
    router.push('/study/kanji/repetition');
  }

  const selectedDateKey = selectedReviewDate;
  const todayKey = formatDate(normalizeDate(new Date()))

  console.log("Today key:", todayKey, "Has review?", reviewMap.has(todayKey))
  console.log("Selected date key:", selectedDateKey, "Has review?", reviewMap.has(selectedDateKey))


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
              <CardHeader className="font-semibold text-lg flex items-center gap-2">
                <CalendarIcon size={20} /> Review Schedule
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
                  <div className="flex justify-between items-center space-y-2">
                    <p className="text-gray-700">
                      {reviewMap.get(selectedDateKey)} kanji review
                      {reviewMap.get(selectedDateKey)! > 1 ? "s" : ""} scheduled
                    </p>
                    {!completedItems.has(selectedDateKey) ? (
                      <div className="flex items-center gap-2">
                        <Button color="primary" onClick={handleStartReview}>
                          Start Review
                        </Button>
                        <Button

                          onClick={() => setCompletedItems((prev) => new Set(prev).add(selectedDateKey))}
                          isIconOnly
                        >
                          <Check size={18} />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-green-600 font-semibold">Completed</p>
                    )}
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
                  <p className="text-gray-700">
                    You have {reviewMap.get(todayKey)} kanji review
                    {reviewMap.get(todayKey)! > 1 ? "s" : ""} today.
                  </p>
                  {!completedItems.has(todayKey) ? (
                    <Button
                      color="primary"
                      onClick={() => setCompletedItems((prev) => new Set(prev).add(todayKey))}
                    >
                      Start Review
                    </Button>
                  ) : (
                    <p className="text-green-600 font-semibold">Completed</p>
                  )}
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
