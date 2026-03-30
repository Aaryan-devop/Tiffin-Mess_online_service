"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export interface CalendarProps {
  className?: string
  classNames?: Record<string, string>
  showOutsideDays?: boolean
  disabled?: (date: Date) => boolean
  onDayClick?: (date: Date) => void
  selected?: Date
  defaultMonth?: Date
  month?: Date
  onMonthChange?: (month: Date) => void
  mode?: "single" | "range" | "multiple"
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onDayClick,
  selected,
  defaultMonth,
  disabled,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0",
        month: "flex flex-col",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 absolute left-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 absolute right-1"
        ),
        month_caption: "flex h-10 items-center justify-center relative",
        dropdowns: "flex justify-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 absolute"
        ),
        caption_label: "text-sm font-medium",
        nav_icon: "h-4 w-4",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "rounded-md [&:has([aria-selected].day-range-end)]:rounded-r-none [&:has([aria-selected].day-range-start)]:rounded-l-none first:[&:has([aria-selected])]:rounded-l-none last:[&:has([aria-selected])]:rounded-r-none"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className }) => <ChevronLeft className={cn("h-4 w-4", className)} />,
        IconRight: ({ className }) => <ChevronRight className={cn("h-4 w-4", className)} />,
      }}
      disabled={disabled}
      selected={selected}
      defaultMonth={defaultMonth}
      onDayClick={onDayClick}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
