"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Flame, Droplets, Coins, Target, Zap, Trophy, Star, Users, Loader2, Crown, Gamepad2 } from "lucide-react"

interface DashboardData {
  streak: number
  longestStreak: number
  coins: number
  xp: number
  level: number
  rank: string
  fapsThisMonth: number
  eligibleForPremium: boolean
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [mood, setMood] = useState<string | null>(null)
  const [roast, setRoast] = useState("")
  const [triggers, setTriggers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [fapLoading, setFapLoading] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)

  const triggerOptions = ["Boredom", "Stress", "Loneliness", "Procrastination", "Late Night", "Social Media"]

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [streakRes, roastRes, userRes] = await Promise.all([
        fetch("/api/streak"),
        fetch("/api/roast"),
        fetch("/api/user"),
      ])

      if (streakRes.ok && userRes.ok) {
        const streakData = await streakRes.json()
        const userData = await userRes.json()

        setData({
          streak: streakData.currentStreak,
          longestStreak: streakData.longestStreak,
          coins: streakData.coins,
          xp: userData.user.xp || 0,
          level: userData.user.level || 1,
          rank: userData.user.rank || "Rookie",
          fapsThisMonth: userData.user.fapsThisMonth || 0,
          eligibleForPremium: userData.user.eligibleForPremium || false,
        })
      }

      if (roastRes.ok) {
        const roastData = await roastRes.json()
        setRoast(roastData.roast)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFapClick = async () => {
    setFapLoading(true)
    try {
      const response = await fetch("/api/fap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, trigger: triggers }),
      })

      if (response.ok) {
        const result = await response.json()

        // Show level up animation if leveled up
        if (result.newLevel) {
          setShowLevelUp(true)
          setTimeout(() => setShowLevelUp(false), 3000)
        }

        // Refresh data
        await fetchDashboardData()

        // Get new roast
        const roastRes = await fetch("/api/roast")
        if (roastRes.ok) {
          const roastData = await roastRes.json()
          setRoast(roastData.roast)
        }

        // Reset form
        setMood(null)
        setTriggers([])
      }
    } catch (error) {
      console.error("Failed to log fap:", error)
    } finally {
      setFapLoading(false)
    }
  }

  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood)
    try {
      await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood }),
      })
    } catch (error) {
      console.error("Failed to log mood:", error)
    }
  }

  const handleTriggerChange = (trigger: string, checked: boolean) => {
    if (checked) {
      setTriggers((prev) => [...prev, trigger])
    } else {
      setTriggers((prev) => prev.filter((t) => t !== trigger))
    }
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "NoNut God":
        return "from-purple-500 to-pink-500"
      case "Diamond":
        return "from-blue-400 to-cyan-400"
      case "Platinum":
        return "from-gray-300 to-gray-500"
      case "Gold":
        return "from-yellow-400 to-yellow-600"
      case "Silver":
        return "from-gray-400 to-gray-600"
      case "Bronze":
        return "from-orange-400 to-orange-600"
      default:
        return "from-gray-600 to-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-pink-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-2xl text-center"
            >
              <Crown className="h-16 w-16 mx-auto mb-4 text-white" />
              <h2 className="text-3xl font-bold text-white mb-2">LEVEL UP!</h2>
              <p className="text-white/90">You've reached level {data?.level}!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-pink-500" />
              <Droplets className="h-6 w-6 text-purple-400" />
              <span className="text-2xl font-bold text-white">FapFuel</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-pink-500 font-medium flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/quests" className="text-gray-300 hover:text-white flex items-center space-x-1">
                <Gamepad2 className="h-4 w-4" />
                <span>Quests</span>
              </Link>
              <Link href="/leaderboard" className="text-gray-300 hover:text-white flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              <Link href="/communities" className="text-gray-300 hover:text-white flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Communities</span>
              </Link>
              <Link href="/premium" className="text-gray-300 hover:text-white">
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">Premium</Badge>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Player Stats */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-300">Time to face the music... or make some music 🎵</p>
            </div>
            <div className="text-right">
              <Badge
                className={`bg-gradient-to-r ${getRankColor(data?.rank || "Rookie")} text-white text-lg px-4 py-2 mb-2`}
              >
                {data?.rank}
              </Badge>
              <div className="text-white text-sm">
                Level {data?.level} • {data?.xp} XP
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Progress to Level {(data?.level || 1) + 1}</span>
              <span className="text-gray-300 text-sm">
                {data?.xp || 0} / {(data?.level || 1) * 100} XP
              </span>
            </div>
            <Progress value={(data?.xp || 0) % 100} className="h-3 bg-gray-700" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Fap Button */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 mb-8 overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-600/10"></div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10">
                  <Button
                    onClick={handleFapClick}
                    disabled={fapLoading}
                    size="lg"
                    className="w-64 h-64 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-4xl font-bold shadow-2xl disabled:opacity-50 relative overflow-hidden"
                  >
                    {fapLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Loader2 className="h-12 w-12" />
                      </motion.div>
                    ) : (
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        💦 FAP
                      </motion.span>
                    )}
                  </Button>
                </motion.div>
                <p className="text-gray-300 mt-4 relative z-10">
                  The button of shame. Click when you've done the deed.
                </p>

                {/* Premium Eligibility Notice */}
                {data?.fapsThisMonth && data.fapsThisMonth >= 80 && !data.eligibleForPremium && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg"
                  >
                    <p className="text-yellow-400 text-sm">
                      🔥 {100 - data.fapsThisMonth} more faps to unlock Premium eligibility!
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Triggers */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">What triggered you?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {triggerOptions.map((trigger) => (
                    <motion.div key={trigger} className="flex items-center space-x-2" whileHover={{ scale: 1.02 }}>
                      <Checkbox
                        id={trigger}
                        checked={triggers.includes(trigger)}
                        onCheckedChange={(checked) => handleTriggerChange(trigger, checked as boolean)}
                      />
                      <label htmlFor={trigger} className="text-gray-300 text-sm cursor-pointer">
                        {trigger}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Streak Counter */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <motion.div
                      className="text-4xl font-bold text-white mb-2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {data?.streak}
                    </motion.div>
                    <div className="text-gray-300 mb-2">days</div>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      {(data?.streak || 0) >= 14
                        ? "Legend 🏆"
                        : (data?.streak || 0) >= 7
                          ? "Monk in Training 🧘‍♂️"
                          : (data?.streak || 0) >= 3
                            ? "Getting There 💪"
                            : "Rookie Numbers 🤡"}
                    </Badge>
                    <div className="text-sm text-gray-400 mt-2">Best: {data?.longestStreak} days</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Coins & Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Coins className="h-5 w-5 mr-2 text-yellow-500" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">FapCoins</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">🪙 {data?.coins}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">This Month</span>
                    <Badge className="bg-pink-500/20 text-pink-400">{data?.fapsThisMonth} faps</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Level</span>
                    <Badge className="bg-purple-500/20 text-purple-400">Level {data?.level}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Roast */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="h-5 w-5 mr-2 text-pink-500" />
                    Latest AI Roast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="bg-gray-900/50 p-4 rounded-lg border border-gray-700"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-gray-300 text-sm italic">{roast || "Loading your personalized roast..."}</p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Daily Mood */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Daily Mood</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-around">
                    {[
                      { mood: "happy", emoji: "😃" },
                      { mood: "neutral", emoji: "😐" },
                      { mood: "sad", emoji: "😩" },
                    ].map(({ mood: moodType, emoji }) => (
                      <motion.div key={moodType} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant={mood === moodType ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleMoodSelect(moodType)}
                          className="text-2xl"
                        >
                          {emoji}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Links */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/chat">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-600 text-gray-300 hover:text-white"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      AI Coach Chat
                    </Button>
                  </Link>
                  <Link href="/porn-tracker">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-gray-600 text-gray-300 hover:text-white"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Porn Tracker
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
