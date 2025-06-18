// components/ui/Calendar.tsx
"use client"

import * as React from "react"
import { DayPicker, DayPickerProps } from "react-day-picker"
import "react-day-picker/dist/style.css"

export function Calendar(props: DayPickerProps) {
  return (
    <div className="rounded-lg border p-3">
      <DayPicker
        className="bg-white"
        showOutsideDays
        fixedWeeks
        {...props}
      />
    </div>
  )
}
