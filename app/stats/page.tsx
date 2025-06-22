"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Flame, Droplets, TrendingUp, Clock, Target, Trophy, Zap, Loader2 } from "lucide-react"

interface StatsData {
  totalFaps: number
  weeklyFaps: number
  currentStreak: number
  longestStreak: number
  coins: number
  mostCommonTrigger: string
  mostCommonTime: string
  fapLogs: Array<{ timestamp: string }>
  moods: Array<{ date: string; mood: string }>
}

export default function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Failed to load stats</h2>
          <p className="text-gray-300">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-pink-500" />
              <Droplets className="h-6 w-6 text-purple-400" />
              <span className="text-2xl font-bold text-white">FapFuel</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white">
                Dashboard
              </Link>
              <Link href="/stats" className="text-pink-500 font-medium">
                Stats
              </Link>
              <Link href="/premium" className="text-gray-300 hover:text-white">
                Upgrade
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Your Shameful Statistics</h1>
          <p className="text-xl text-gray-300">
            {stats.currentStreak >= 10
              ? "You're a walking miracle 😇"
              : stats.currentStreak >= 5
                ? "Not bad, not great 😐"
                : "These numbers are concerning 😬"}
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-pink-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stats.totalFaps}</div>
              <div className="text-gray-300">Total Faps</div>
              <Badge variant="secondary" className="mt-2 bg-pink-500/20 text-pink-400">
                Last 30 Days
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stats.currentStreak}</div>
              <div className="text-gray-300">Current Streak</div>
              <Badge variant="secondary" className="mt-2 bg-yellow-500/20 text-yellow-400">
                Days
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stats.longestStreak}</div>
              <div className="text-gray-300">Longest Streak</div>
              <Badge variant="secondary" className="mt-2 bg-purple-500/20 text-purple-400">
                Personal Best
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{stats.weeklyFaps}</div>
              <div className="text-gray-300">This Week</div>
              <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400">
                Faps
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-pink-500" />
                Recent Activity (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.fapLogs.map((log, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="text-white w-16">
                      {new Date(log.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Progress value={100} className="flex-1 h-4" />
                    <span className="text-gray-300 w-8">1</span>
                  </div>
                ))}
                {stats.fapLogs.length === 0 && (
                  <div className="text-center text-gray-400 py-8">No recent activity. You're doing great! 🎉</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Patterns & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Most Common Trigger</span>
                  <Badge className="bg-red-500/20 text-red-400">{stats.mostCommonTrigger}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Most Common Time</span>
                  <Badge className="bg-blue-500/20 text-blue-400">{stats.mostCommonTime}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Weekly Average</span>
                  <Badge className="bg-purple-500/20 text-purple-400">
                    {(stats.totalFaps / 4).toFixed(1)} per week
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total FapCoins</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">🪙 {stats.coins}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Messages */}
        <Card className="bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-pink-900/30 border-pink-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              {stats.currentStreak >= 14
                ? "🏆 LEGENDARY STATUS ACHIEVED"
                : stats.currentStreak >= 7
                  ? "🔥 You're on fire! Keep going!"
                  : stats.currentStreak >= 3
                    ? "💪 Building momentum!"
                    : "🤡 Rookie numbers. You can do better."}
            </h3>
            <p className="text-gray-300 text-lg">
              {stats.currentStreak >= 14
                ? "You've transcended mortal limitations. Monks everywhere are jealous."
                : stats.currentStreak >= 7
                  ? "Week-long streak! You're entering monk territory."
                  : stats.currentStreak >= 3
                    ? "Three days strong. Your willpower is awakening."
                    : "Maybe try... not doing it? Revolutionary concept, I know."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
