"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Flame, Droplets, Trophy, Target, Zap, Clock, CheckCircle, Gift, Loader2, Gamepad2 } from "lucide-react"

interface Quest {
  _id: string
  title: string
  description: string
  xp: number
  type: string
  target: number
  progress: number
  completed: boolean
  claimed: boolean
}

export default function Quests() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)

  useEffect(() => {
    fetchQuests()
  }, [])

  const fetchQuests = async () => {
    try {
      const response = await fetch("/api/quests")
      if (response.ok) {
        const data = await response.json()
        setQuests(data.quests)
      }
    } catch (error) {
      console.error("Failed to fetch quests:", error)
    } finally {
      setLoading(false)
    }
  }

  const claimReward = async (questId: string) => {
    setClaiming(questId)
    try {
      const response = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questId }),
      })

      if (response.ok) {
        const result = await response.json()
        // Show success animation or notification
        await fetchQuests() // Refresh quests
      }
    } catch (error) {
      console.error("Failed to claim reward:", error)
    } finally {
      setClaiming(null)
    }
  }

  const getQuestIcon = (type: string) => {
    switch (type) {
      case "streak":
        return <Zap className="h-6 w-6 text-yellow-500" />
      case "fap":
        return <Target className="h-6 w-6 text-pink-500" />
      case "mood":
        return <Trophy className="h-6 w-6 text-purple-500" />
      default:
        return <Gamepad2 className="h-6 w-6 text-blue-500" />
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
              <Link href="/dashboard" className="text-gray-300 hover:text-white">
                Dashboard
              </Link>
              <Link href="/quests" className="text-pink-500 font-medium flex items-center space-x-1">
                <Gamepad2 className="h-4 w-4" />
                <span>Quests</span>
              </Link>
              <Link href="/leaderboard" className="text-gray-300 hover:text-white">
                Leaderboard
              </Link>
              <Link href="/communities" className="text-gray-300 hover:text-white">
                Communities
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="h-12 w-12 text-pink-500 mr-4" />
            <h1 className="text-5xl font-bold text-white">Daily Quests</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Complete challenges to earn XP, level up, and unlock exclusive rewards. Your journey to self-mastery starts
            here.
          </p>
        </motion.div>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((quest, index) => (
            <motion.div
              key={quest._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`bg-gray-800/50 border-gray-700 hover:border-pink-500/50 transition-all relative overflow-hidden ${
                  quest.completed ? "border-green-500/50" : ""
                }`}
              >
                {quest.completed && !quest.claimed && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500/20 text-green-400 animate-pulse">Ready to Claim!</Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getQuestIcon(quest.type)}
                      <div>
                        <CardTitle className="text-white text-lg">{quest.title}</CardTitle>
                        <p className="text-gray-400 text-sm">{quest.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400">+{quest.xp} XP</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-gray-300">
                          {Math.min(quest.progress, quest.target)} / {quest.target}
                        </span>
                      </div>
                      <Progress value={(quest.progress / quest.target) * 100} className="h-2" />
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {quest.claimed ? (
                        <Button disabled className="w-full bg-gray-600 text-gray-400">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Claimed
                        </Button>
                      ) : quest.completed ? (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={() => claimReward(quest._id)}
                            disabled={claiming === quest._id}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                          >
                            {claiming === quest._id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Gift className="h-4 w-4 mr-2" />
                            )}
                            Claim Reward
                          </Button>
                        </motion.div>
                      ) : (
                        <Button disabled className="w-full bg-gray-700 text-gray-400">
                          <Clock className="h-4 w-4 mr-2" />
                          In Progress
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {quests.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Gamepad2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Active Quests</h3>
            <p className="text-gray-500">Check back later for new challenges!</p>
          </motion.div>
        )}

        {/* Quest Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-pink-900/30 border-pink-500/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">🎯 Quest Tips & Strategies</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-2">Daily Consistency</h4>
                  <p className="text-gray-300 text-sm">Log in daily to maintain quest streaks and maximize XP gains.</p>
                </div>
                <div>
                  <Target className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-2">Track Everything</h4>
                  <p className="text-gray-300 text-sm">
                    The more data you log, the more quest opportunities you unlock.
                  </p>
                </div>
                <div>
                  <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-2">Claim Rewards</h4>
                  <p className="text-gray-300 text-sm">
                    Don't forget to claim your XP and coins when quests are completed!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
