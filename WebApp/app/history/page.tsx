"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  Cloud,
  Sun,
  CloudRain,
  SunSnow as Snow,
  Heart,
  Smile,
  Frown,
  Meh,
  Users,
  User,
  UserPlus,
  Moon,
  SunIcon,
  X,
} from "lucide-react"

const weatherOptions = [
  { icon: Sun, label: "Sunny", value: "sunny" },
  { icon: Cloud, label: "Cloudy", value: "cloudy" },
  { icon: CloudRain, label: "Rainy", value: "rainy" },
  { icon: Snow, label: "Snowy", value: "snowy" },
]

const moodOptions = [
  { icon: Smile, label: "Happy", value: "happy", color: "bg-green-500/20 text-green-300" },
  { icon: Heart, label: "Loved", value: "loved", color: "bg-pink-500/20 text-pink-300" },
  { icon: Meh, label: "Okay", value: "okay", color: "bg-yellow-500/20 text-yellow-300" },
  { icon: Frown, label: "Sad", value: "sad", color: "bg-blue-500/20 text-blue-300" },
]

const companyOptions = [
  { icon: User, label: "Alone", value: "alone" },
  { icon: Users, label: "Family", value: "family" },
  { icon: UserPlus, label: "Friends", value: "friends" },
  { icon: Heart, label: "Partner", value: "partner" },
]

export default function HistoryPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [entries, setEntries] = useState<any[]>([
    {
      date: "9/8/2025",
      weather: "sunny",
      mood: "happy",
      company: "friends",
      text: "Had a wonderful day at the park with my friends! We played frisbee and had a picnic.",
      timestamp: "2:30 PM",
    },
    {
      date: "9/7/2025",
      weather: "cloudy",
      mood: "okay",
      company: "alone",
      text: "Quiet day at home reading a good book. Sometimes solitude is exactly what you need.",
      timestamp: "7:45 PM",
    },
  ])
  const [showModal, setShowModal] = useState(false)
  const [currentDate] = useState(new Date())
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const savedMode = localStorage.getItem("deerDiary-darkMode")
    if (savedMode) {
      const isDark = savedMode === "true"
      setIsDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    const point = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
    setLastPoint(point)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    const currentPoint = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }

    ctx.beginPath()
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(currentPoint.x, currentPoint.y)

    if (isDarkMode) {
      ctx.strokeStyle = "#f0f0f0"
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      ctx.globalAlpha = 0.8
      ctx.shadowBlur = 2
      ctx.shadowColor = "#ffffff"
    } else {
      ctx.strokeStyle = "#2d3748"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.globalAlpha = 0.7
      ctx.shadowBlur = 0
    }

    ctx.stroke()
    setLastPoint(currentPoint)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setLastPoint(null)
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getDayEntry = (day: number) => {
    const dateStr = `${currentMonth.getMonth() + 1}/${day}/${currentMonth.getFullYear()}`
    return entries.find((entry) => entry.date === dateStr)
  }

  const getSelectedOption = (options: any[], value: string) => {
    return options.find((option) => option.value === value)
  }

  const toggleDarkMode = () => {
    console.log("[v0] Dark mode toggle clicked, current state:", isDarkMode)
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("deerDiary-darkMode", newMode.toString())

    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const selectedEntry = selectedDate ? entries.find((entry) => entry.date === selectedDate) : null

  return (
    <div className={`min-h-screen ${isDarkMode ? "blackboard-bg dark" : "notebook-bg"} relative overflow-hidden`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-5 pointer-events-auto cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ touchAction: "none" }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl pointer-events-none">
        <header className="text-center mb-8 relative">
          <div className="absolute top-0 left-0 z-20">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border-gray-300 pointer-events-auto"
                onClick={() => console.log("[v0] Back to Diary clicked")}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to DeerDiary
              </Button>
            </Link>
          </div>

          <div className="absolute top-0 right-0 z-20">
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border-gray-300 pointer-events-auto"
            >
              {isDarkMode ? <SunIcon className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDarkMode ? "Notebook" : "Blackboard"}
            </Button>
          </div>

          <div className="relative">
            <h1
              className={`text-4xl font-bold mb-2 text-balance ${isDarkMode ? "font-[family-name:var(--font-chalk)] text-foreground" : "font-[family-name:var(--font-handwritten)] text-gray-900"}`}
            >
              🦌 DeerDiary History
            </h1>
            {!isDarkMode && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-2 -left-4 text-red-400 text-lg rotate-12">⭐</div>
                <div className="absolute -top-1 right-8 text-blue-400 text-sm -rotate-6">♪</div>
                <div className="absolute -bottom-2 left-12 text-green-400 text-xs rotate-45">✿</div>
                <div className="absolute -bottom-1 -right-2 text-purple-400 text-lg -rotate-12">♡</div>
              </div>
            )}
            {isDarkMode && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-2 -left-4 text-green-300 text-lg rotate-12 opacity-60">★</div>
                <div className="absolute -top-1 right-8 text-yellow-300 text-sm -rotate-6 opacity-60">♫</div>
                <div className="absolute -bottom-2 left-12 text-pink-300 text-xs rotate-45 opacity-60">❀</div>
                <div className="absolute -bottom-1 -right-2 text-blue-300 text-lg -rotate-12 opacity-60">♥</div>
              </div>
            )}
          </div>

          <p
            className={`text-lg ${isDarkMode ? "font-[family-name:var(--font-chalk)] text-foreground" : "font-[family-name:var(--font-handwritten)] text-gray-700"}`}
          >
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </p>
        </header>

        <div className="flex justify-center">
          <Card
            className={`glass-card border-2 w-full max-w-4xl pointer-events-auto ${isDarkMode ? "bg-card/90 border-border" : "bg-white/90 border-pink-200"}`}
          >
            <CardHeader className="pb-8">
              <CardTitle
                className={`flex items-center justify-between text-2xl ${isDarkMode ? "text-foreground font-[family-name:var(--font-chalk)]" : "text-gray-900 font-[family-name:var(--font-handwritten)]"}`}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="hover:bg-white/10"
                >
                  ←
                </Button>
                <span>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="hover:bg-white/10"
                >
                  →
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid grid-cols-7 gap-3 mb-6">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className={`text-center text-lg font-medium p-3 ${isDarkMode ? "text-muted-foreground" : "text-gray-600"}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-3">
                {generateCalendarDays().map((day, index) => {
                  if (!day) return <div key={index} className="p-3"></div>

                  const entry = getDayEntry(day)
                  const dateStr = `${currentMonth.getMonth() + 1}/${day}/${currentMonth.getFullYear()}`
                  const hasEntry = !!entry
                  const todayHighlight = isToday(day)
                  const isSelected = selectedDate === dateStr

                  let dayClasses = "p-3 h-16 relative text-lg font-medium"

                  if (isSelected) {
                    dayClasses += isDarkMode ? " ring-2 ring-blue-400 bg-blue-400/30" : " ring-2 ring-pink-400 bg-pink-200"
                  } else if (todayHighlight) {
                    dayClasses += isDarkMode ? " ring-2 ring-green-400 bg-green-400/20" : " ring-2 ring-yellow-500 bg-yellow-100"
                  } else if (hasEntry) {
                    dayClasses += isDarkMode ? " hover:bg-secondary/30" : " hover:bg-pink-50 hover:text-gray-900"
                  } else {
                    dayClasses += isDarkMode ? " hover:bg-white/10" : " hover:bg-yellow-50 hover:text-gray-900"
                  }

                  return (
                    <Button
                      key={day}
                      variant="ghost"
                      className={dayClasses}
                      onClick={() => {
                        console.log("[v0] Calendar day clicked:", day, "Has entry:", hasEntry)
                        setSelectedDate(dateStr)
                        setShowModal(true)
                        console.log("[v0] Modal should open for date:", dateStr)
                      }}
                    >
                      {day}
                      {hasEntry && (
                        <div
                          className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
                            isDarkMode ? "bg-primary" : "bg-pink-500"
                          }`}
                        ></div>
                      )}
                      {todayHighlight && <div className="absolute top-1 right-1 text-xs font-bold text-red-500">•</div>}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card
            className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto ${isDarkMode ? "bg-card border-border" : "bg-white border-pink-200"}`}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle
                className={`flex items-center gap-2 ${isDarkMode ? "text-foreground font-[family-name:var(--font-chalk)]" : "text-gray-900 font-[family-name:var(--font-handwritten)]"}`}
              >
                <Calendar className="w-5 h-5" />
                {selectedEntry ? `Entry for ${selectedDate}` : `No entry for ${selectedDate}`}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)} className="hover:bg-white/10">
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedEntry ? (
                <>
                  <div className="flex flex-wrap gap-3">
                    {selectedEntry.weather && (
                      <Badge variant="secondary" className="flex items-center gap-2 text-sm px-3 py-1">
                        {(() => {
                          const weather = getSelectedOption(weatherOptions, selectedEntry.weather)
                          return weather ? (
                            <>
                              <weather.icon className="w-4 h-4" />
                              {weather.label}
                            </>
                          ) : null
                        })()}
                      </Badge>
                    )}
                    {selectedEntry.mood && (
                      <Badge variant="secondary" className="flex items-center gap-2 text-sm px-3 py-1">
                        {(() => {
                          const mood = getSelectedOption(moodOptions, selectedEntry.mood)
                          return mood ? (
                            <>
                              <mood.icon className="w-4 h-4" />
                              {mood.label}
                            </>
                          ) : null
                        })()}
                      </Badge>
                    )}
                    {selectedEntry.company && (
                      <Badge variant="secondary" className="flex items-center gap-2 text-sm px-3 py-1">
                        {(() => {
                          const company = getSelectedOption(companyOptions, selectedEntry.company)
                          return company ? (
                            <>
                              <company.icon className="w-4 h-4" />
                              {company.label}
                            </>
                          ) : null
                        })()}
                      </Badge>
                    )}
                  </div>
                  <div className={`p-6 rounded-lg ${isDarkMode ? "bg-muted/50" : "bg-gray-50"}`}>
                    <p
                      className={`leading-relaxed text-pretty text-lg ${
                        isDarkMode
                          ? "text-foreground font-[family-name:var(--font-chalk)]"
                          : "text-gray-900 font-[family-name:var(--font-handwritten)]"
                      }`}
                    >
                      {selectedEntry.text}
                    </p>
                  </div>
                  <p className={`text-sm ${isDarkMode ? "text-muted-foreground" : "text-gray-500"}`}>
                    Written at {selectedEntry.timestamp}
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <p
                    className={`text-lg mb-4 ${
                      isDarkMode
                        ? "text-muted-foreground font-[family-name:var(--font-chalk)]"
                        : "text-gray-600 font-[family-name:var(--font-handwritten)]"
                    }`}
                  >
                    No diary entry for this date yet.
                  </p>
                  <Link href="/">
                    <Button variant="outline" className="mt-2 bg-transparent">
                      Create New DeerDiary Entry
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
