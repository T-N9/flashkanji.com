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
import useDeckGroundState from "@/store/deckGroundState"
import { useGeneralStore } from "@/store/generalState"
import CharacterImage from "../common/character"
import { isFutureDate } from "@/util/schedule"

export default function SpacedLearningCalendar() {
  const { setSelectedReviewDate, setIsReviewMode, selectedReviewDate } = useKanjiGroundState();
  const { setIsReviewMode: setIsReviewModeJukugo } = useJukugoGroundState();
  const { setIsReviewMode: setIsReviewModeDeck, setDeckId, setIsReviewByDate, setSrsId } = useDeckGroundState();
  const { userId, setToDayReviewCount, setExpiredReviewCount } = useUserStore()
  const { setIsInGround, setIsSaveRepetition } = useGeneralStore();

  const { data: reviewData, refetch, isFetching } = useFetchReviewCalendarData(userId)

  const router = useRouter()

  useEffect(() => {
    if (userId) refetch()
  }, [userId])

  const reviewMap = useMemo(() => {
    const map = new Map<string, { kanji_count: number, jukugo_count: number, deck: { id: number; name: string; card_count: number, srs_id: number }[] }>()
    reviewData?.forEach((item) => {
      map.set(item.date, {
        kanji_count: item.kanji_count,
        jukugo_count: item.jukugo_count,
        deck: item.deck,
      })
    })
    return map
  }, [reviewData])

  const handleSelectDate = (date: Date) => {
    // setSelectedDate(normalizeDate(date))
    setSelectedReviewDate(formatDate(normalizeDate(date)))
  }

  const handleStartReview = (type: 1 | 2 | 3, deckId?: number, srsId?: number) => {
    if (isFutureDate(selectedReviewDate)) {
      setIsSaveRepetition(false);
    } else {
      setIsSaveRepetition(true);
    }

    setIsInGround(true);
    if (type === 1) {
      setIsReviewMode(true);
      router.push('/study/kanji/repetition/');
    } else if (type === 2) {
      setIsReviewModeJukugo(true);
      router.push('/study/jukugo/repetition/');
    } else if (type === 3 && deckId && srsId) {
      setIsReviewModeDeck(true);
      setDeckId(deckId);
      setIsReviewByDate(true);
      setSrsId(srsId)
      router.push('/study/deck/repetition/');
    }

  }

  const selectedDateKey = selectedReviewDate;
  const todayKey = formatDate(normalizeDate(new Date()))

  useEffect(() => {
    if (reviewMap.size > 0) {
      setToDayReviewCount(getTodayReviewCount(reviewMap).today_count);
      setExpiredReviewCount(getTodayReviewCount(reviewMap).expired_count);
    }
  }, [reviewMap]);

  console.log({ reviewMap, selectedReviewDate })



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
                <div className="flex items-center gap-2 text-dark">
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
              <CardHeader className="font-semibold text-lg text-dark">
                {new Date(selectedReviewDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </CardHeader>
              <CardBody>
                {reviewMap.has(selectedDateKey) ? (
                  <div className="flex justify-between items-center rounded">
                    {(() => {
                      const review = reviewMap.get(selectedDateKey);
                      const kanji = review?.kanji_count || 0;
                      const jukugo = review?.jukugo_count || 0;
                      const deck = review?.deck;

                      return (
                        <div className="space-y-2 w-full">
                          {kanji !== 0 && <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <p className="text-gray-700 text-xs">
                              <span className="text-orange-500 text-base">{kanji}</span> Kanji review{kanji !== 1 ? "s" : ""}
                            </p>

                            <div className="flex items-center gap-2">

                              <Button className={`${isFutureDate(selectedDateKey) && 'bg-purple-500'}`} color="primary" onClick={() => handleStartReview(1)}>
                                {isFutureDate(selectedDateKey) ? 'Preview' : 'Review'}
                              </Button>

                            </div>

                          </div>}
                          {jukugo !== 0 && <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <p className="text-gray-700 text-xs">
                              <span className="text-orange-500 text-base">{jukugo}</span> Jukugo review{jukugo !== 1 ? "s" : ""}
                            </p>

                            <div className="flex items-center gap-2">
                              <Button className={`${isFutureDate(selectedDateKey) && 'bg-purple-500'}`} color="primary" onClick={() => handleStartReview(2)}>
                                {isFutureDate(selectedDateKey) ? 'Preview' : 'Review'}
                              </Button>

                            </div>

                          </div>}

                          {

                            deck?.map((item) => {
                              return (
                                <div key={item.srs_id} className="relative flex items-center justify-between bg-gray-100 p-2 rounded">
                                  <p className="text-gray-700 text-xs">
                                    <span className="absolute -top-1 px-1 py-0 rounded bg-white border">Session</span>
                                    <span className="text-orange-500 text-base">{item.card_count}</span> cards in <span className="font-bold">{item.name}</span>
                                  </p>

                                  <Button
                                    color="primary"
                                    className={`${isFutureDate(selectedDateKey) && 'bg-purple-500'}`}
                                    onClick={() => handleStartReview(3, item.id, item.srs_id)}
                                  >
                                    {isFutureDate(selectedDateKey) ? 'Preview' : 'Review'}
                                  </Button>

                                </div>
                              )
                            })
                          }

                        </div>
                      );
                    })()}

                  </div>
                ) : (
                  <div className="text-center">
                    <CharacterImage src={'happy.png'} alt={"Great Job"} />
                    <p className="text-gray-500">No reviews scheduled</p>
                  </div>
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
                    const deck = review?.deck;

                    return (
                      <div className="space-y-2">
                        {kanji !== 0 && <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                          <p className="text-gray-700 text-xs">
                            <span className="text-orange-500 text-base">{kanji}</span> Kanji review{kanji !== 1 ? "s" : ""}
                          </p>

                          <Button
                            color="primary"
                            onClick={() => handleStartReview(1)}
                          >
                            Review
                          </Button>

                        </div>}
                        {jukugo !== 0 && <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                          <p className="text-gray-700 text-xs">
                            <span className="text-orange-500 text-base">{jukugo}</span> Jukugo review{jukugo !== 1 ? "s" : ""}
                          </p>

                          <Button
                            color="primary"
                            onClick={() => handleStartReview(2)}
                          >
                            Review
                          </Button>

                        </div>}

                        {

                          deck?.map((item) => {
                            return (
                              <div key={item.srs_id} className="relative flex items-center justify-between bg-gray-100 p-2 rounded">
                                <p className="text-gray-700 text-xs">
                                  <span className="absolute -top-1 px-1 py-0 rounded bg-white border">Session {item.srs_id}</span>
                                  <span className="text-orange-500 text-base">{item.card_count}</span> cards in <span className="font-bold">{item.name}</span>
                                </p>

                                <Button
                                  color="primary"
                                  onClick={() => handleStartReview(3, item.id, item.srs_id)}
                                >
                                  Review
                                </Button>

                              </div>
                            )
                          })
                        }
                      </div>
                    );
                  })()}

                </div>
              ) : (
                <div className="text-center">
                  <CharacterImage src={'happy.png'} alt={"Great Job"} />
                  <p className="text-gray-500 text-center">No reviews scheduled for today</p>
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  )
}
