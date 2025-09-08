"use client"

import type React from "react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
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
  Lightbulb,
  History,
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

export default function DiaryApp() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedWeather, setSelectedWeather] = useState<string>("")
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [diaryText, setDiaryText] = useState<string>("")
  const [entries, setEntries] = useState<any[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const savedMode = localStorage.getItem("deerDiary-darkMode")
    if (savedMode) {
      const isDark = savedMode === "true"
      setIsDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add("dark")
      }
    }

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

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("deerDiary-darkMode", newMode.toString())
    document.documentElement.classList.toggle("dark")

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const handleSaveEntry = () => {
    if (diaryText.trim()) {
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        weather: selectedWeather,
        mood: selectedMood,
        company: selectedCompany,
        text: diaryText,
        timestamp: new Date().toLocaleTimeString(),
      }
      setEntries([newEntry, ...entries])

      setSelectedWeather("")
      setSelectedMood("")
      setSelectedCompany("")
      setDiaryText("")
    }
  }

  const getSelectedOption = (options: any[], value: string) => {
    return options.find((option) => option.value === value)
  }

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

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl pointer-events-none">
        <header className="text-center mb-8 relative">
          <Link href="/history">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-0 left-0 flex items-center gap-2 bg-transparent pointer-events-auto"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </Link>

          <Button
            onClick={toggleDarkMode}
            variant="outline"
            size="sm"
            className="absolute top-0 right-0 flex items-center gap-2 bg-transparent pointer-events-auto"
          >
            {isDarkMode ? <SunIcon className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? "Notebook" : "Blackboard"}
          </Button>

          <h1
            className={`text-4xl font-bold mb-2 text-balance ${isDarkMode ? "font-[family-name:var(--font-chalk)] text-foreground" : "font-[family-name:var(--font-handwritten)] text-gray-900"}`}
          >
            🦌 DeerDiary
          </h1>
          <p
            className={`text-lg ${isDarkMode ? "font-[family-name:var(--font-chalk)] text-foreground" : "font-[family-name:var(--font-handwritten)] text-gray-700"}`}
          >
            {isDarkMode
              ? "Write your thoughts on the blackboard"
              : "Capture your daily moments in your special notebook"}
          </p>

          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={() => setShowHint(!showHint)}
              variant="ghost"
              size="sm"
              className="bg-transparent pointer-events-auto relative"
            >
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              {showHint && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg border border-yellow-200">
                  💡 Tip: Click and drag on the background to draw!
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-100 border-l border-t border-yellow-200 rotate-45"></div>
                </div>
              )}
            </Button>
          </div>
        </header>

        <Card
          className={`glass-card mb-8 border-2 pointer-events-auto ${isDarkMode ? "bg-card/90 border-border" : "bg-white/90 border-blue-200"}`}
        >
          <CardHeader>
            <div className="relative">
              <CardTitle className="flex items-center gap-2 text-card-foreground font-[family-name:var(--font-handwritten)] text-xl relative">
                <Calendar className="w-5 h-5" />
                Today's Entry - {new Date().toLocaleDateString()}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="relative mb-3">
                <h3 className="text-sm font-medium text-card-foreground font-[family-name:var(--font-handwritten)] relative">
                  How's the weather?
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {weatherOptions.map((weather) => (
                  <Button
                    key={weather.value}
                    variant={selectedWeather === weather.value ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedWeather(weather.value)}
                    className="flex items-center gap-2"
                  >
                    <weather.icon className="w-4 h-4" />
                    {weather.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="relative mb-3">
                <h3 className="text-sm font-medium text-card-foreground font-[family-name:var(--font-handwritten)] relative">
                  How are you feeling?
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedMood(mood.value)}
                    className="flex items-center gap-2"
                  >
                    <mood.icon className="w-4 h-4" />
                    {mood.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="relative mb-3">
                <h3 className="text-sm font-medium text-card-foreground font-[family-name:var(--font-handwritten)] relative">
                  Who did you spend time with?
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {companyOptions.map((company) => (
                  <Button
                    key={company.value}
                    variant={selectedCompany === company.value ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedCompany(company.value)}
                    className="flex items-center gap-2"
                  >
                    <company.icon className="w-4 h-4" />
                    {company.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="relative mb-3">
                <h3 className="text-sm font-medium text-card-foreground font-[family-name:var(--font-handwritten)] relative">
                  What happened today?
                </h3>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Share your thoughts, experiences, and memories from today..."
                  value={diaryText}
                  onChange={(e) => setDiaryText(e.target.value)}
                  className="min-h-32 bg-input/50 border-border/50 text-card-foreground placeholder:text-muted-foreground resize-none font-[family-name:var(--font-handwritten)] text-base relative z-10"
                />
              </div>
            </div>

            <Button onClick={handleSaveEntry} className="w-full" disabled={!diaryText.trim()}>
              Save Entry
            </Button>
          </CardContent>
        </Card>

        {entries.length > 0 && (
          <div className="space-y-4 pointer-events-auto">
            <h2
              className={`text-2xl font-semibold mb-4 ${isDarkMode ? "font-[family-name:var(--font-chalk)] text-foreground" : "font-[family-name:var(--font-handwritten)] text-gray-900"}`}
            >
              Previous Entries
            </h2>
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className={`glass-card border-2 ${isDarkMode ? "bg-card/80 border-border" : "bg-white/80 border-blue-100"}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-card-foreground">{entry.date}</CardTitle>
                    <span className="text-sm text-muted-foreground">{entry.timestamp}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {entry.weather && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {(() => {
                          const weather = getSelectedOption(weatherOptions, entry.weather)
                          return weather ? (
                            <>
                              <weather.icon className="w-3 h-3" />
                              {weather.label}
                            </>
                          ) : null
                        })()}
                      </Badge>
                    )}
                    {entry.mood && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {(() => {
                          const mood = getSelectedOption(moodOptions, entry.mood)
                          return mood ? (
                            <>
                              <mood.icon className="w-3 h-3" />
                              {mood.label}
                            </>
                          ) : null
                        })()}
                      </Badge>
                    )}
                    {entry.company && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {(() => {
                          const company = getSelectedOption(companyOptions, entry.company)
                          return company ? (
                            <>
                              <company.icon className="w-3 h-3" />
                              {company.label}
                            </>
                          ) : null
                        })()}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground leading-relaxed text-pretty font-[family-name:var(--font-handwritten)] text-base">
                    {entry.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
