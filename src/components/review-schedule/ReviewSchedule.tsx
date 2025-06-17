import { useState } from "react"

import { Tabs, Tab, Card, CardBody, CardHeader, Button, Chip, Calendar } from "@nextui-org/react"
import { Calendar as CalendarIcon, BookOpen, CheckCircle, AlignCenterVertical } from "@phosphor-icons/react"

interface ReviewItem {
  id: number
  subject: keyof typeof subjectColors
  topic: string
  difficulty: keyof typeof difficultyColors
  overdue: boolean
  deck: string
}

const reviewData: Record<string, ReviewItem[]> = {
  "2024-12-17": [
    { id: 1, subject: "Spanish", topic: "Irregular Verbs", difficulty: "hard", overdue: false, deck: "Grammar" },
    { id: 2, subject: "Math", topic: "Calculus Derivatives", difficulty: "medium", overdue: false, deck: "Calculus I" },
    {
      id: 3,
      subject: "History",
      topic: "World War II Timeline",
      difficulty: "easy",
      overdue: true,
      deck: "Modern History",
    },
  ],
  "2024-12-18": [
    {
      id: 4,
      subject: "Spanish",
      topic: "Past Tense Conjugation",
      difficulty: "medium",
      overdue: false,
      deck: "Grammar",
    },
    { id: 5, subject: "Science", topic: "Photosynthesis Process", difficulty: "easy", overdue: false, deck: "Biology" },
  ],
  "2024-12-19": [
    { id: 6, subject: "Math", topic: "Integration by Parts", difficulty: "hard", overdue: false, deck: "Calculus I" },
    {
      id: 7,
      subject: "Spanish",
      topic: "Subjunctive Mood",
      difficulty: "hard",
      overdue: false,
      deck: "Advanced Grammar",
    },
  ],
  "2024-12-20": [
    {
      id: 8,
      subject: "History",
      topic: "Cold War Events",
      difficulty: "medium",
      overdue: false,
      deck: "Modern History",
    },
    { id: 9, subject: "Science", topic: "Cell Division", difficulty: "easy", overdue: false, deck: "Biology" },
  ],
}

const subjectColors: Record<string, string> = {
  Spanish: "bg-red-100 text-red-800",
  Math: "bg-blue-100 text-blue-800",
  History: "bg-green-100 text-green-800",
  Science: "bg-purple-100 text-purple-800",
}

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500",
}

export default function ReviewSchedule() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set())

  const formatDate = (date: Date): string => date.toISOString().split("T")[0]

  const getReviewsForDate = (date: Date): ReviewItem[] => reviewData[formatDate(date)] || []

  const completeReview = (itemId: number) => {
    setCompletedItems((prev) => new Set([...prev, itemId]))
  }

  const selectedDateReviews = getReviewsForDate(selectedDate)
  const todayReviews = getReviewsForDate(new Date())

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Tabs aria-label="Views" variant="underlined">
        <Tab key="calendar" title={<span className="flex items-center gap-2"><CalendarIcon size={18} /> Calendar</span>}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <Card className="lg:col-span-2">
              <CardHeader className="font-semibold text-lg flex items-center gap-2">
                <CalendarIcon size={20} /> Review Schedule
              </CardHeader>
              <CardBody>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  components={{
                    DayContent: ({ date }: { date: Date }) => {
                      const reviewCount = getReviewsForDate(date).length
                      const overdueCount = getReviewsForDate(date).filter(i => i.overdue).length
                      return (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <span>{date.getDate()}</span>
                          {reviewCount > 0 && (
                            <div className="flex gap-1 mt-1">
                              <div className={`w-2 h-2 rounded-full ${overdueCount > 0 ? "bg-red-500" : "bg-blue-500"}`} />
                              {reviewCount > 1 && <span className="text-xs font-medium">{reviewCount}</span>}
                            </div>
                          )}
                        </div>
                      )
                    },
                  }}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="font-semibold text-lg">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </CardHeader>
              <CardBody className="space-y-3">
                {selectedDateReviews.length === 0 ? (
                  <p className="text-center text-gray-500">No reviews scheduled</p>
                ) : (
                  selectedDateReviews.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Chip className={subjectColors[item.subject]}>{item.subject}</Chip>
                            <div className={`w-2 h-2 rounded-full ${difficultyColors[item.difficulty]}`} />
                            {item.overdue && <AlignCenterVertical size={16} className="text-red-500" />}
                          </div>
                          <p className="text-sm font-medium">{item.topic}</p>
                          <p className="text-xs text-gray-500">{item.deck}</p>
                        </div>
                        {!completedItems.has(item.id) ? (
                          <Button size="sm" variant="bordered" onClick={() => completeReview(item.id)}>
                            <CheckCircle size={18} />
                          </Button>
                        ) : (
                          <CheckCircle size={20} className="text-green-500" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="reviews" title={<span className="flex items-center gap-2"><BookOpen size={18} /> Today's Reviews</span>}>
          <Card className="mt-4">
            <CardHeader className="font-semibold text-lg">Today's Reviews</CardHeader>
            <CardBody className="space-y-4">
              {todayReviews.length === 0 ? (
                <p className="text-center text-gray-500">No reviews scheduled for today</p>
              ) : (
                todayReviews.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border ${completedItems.has(item.id) ? "bg-green-50 border-green-200" : item.overdue ? "bg-red-50 border-red-200" : "bg-white"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Chip className={subjectColors[item.subject]}>{item.subject}</Chip>
                          <div className={`w-3 h-3 rounded-full ${difficultyColors[item.difficulty]}`} />
                          {item.overdue && !completedItems.has(item.id) && (
                            <Chip color="danger" size="sm">Overdue</Chip>
                          )}
                          {completedItems.has(item.id) && (
                            <Chip color="success" size="sm">Completed</Chip>
                          )}
                        </div>
                        <h3 className="font-medium">{item.topic}</h3>
                        <p className="text-sm text-gray-500">{item.deck}</p>
                      </div>
                      <div>
                        {!completedItems.has(item.id) ? (
                          <Button color="primary" onClick={() => completeReview(item.id)}>
                            Start Review
                          </Button>
                        ) : (
                          <CheckCircle size={24} className="text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  )
}
