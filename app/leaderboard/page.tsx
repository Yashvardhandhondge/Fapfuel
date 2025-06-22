"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Flame, Droplets, Trophy, Zap, Coins, Crown, Medal, Award, Loader2 } from "lucide-react"

interface LeaderboardUser {
  _id: string
  name: string
  streak?: number
  xp?: number
  level?: number
  coins?: number
  rank: string
}

interface LeaderboardData {
  topStreaks: LeaderboardUser[]
  topXP: LeaderboardUser[]
  topCoins: LeaderboardUser[]
  userRanking: {
    streakRank: number
    xpRank: number
  }
}

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard")
      if (response.ok) {
        const leaderboardData = await response.json()
        setData(leaderboardData)
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />
      default:
        return <span className="text-gray-400 font-bold">#{position}</span>
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
              <Link href="/quests" className="text-gray-300 hover:text-white">
                Quests
              </Link>
              <Link href="/leaderboard" className="text-pink-500 font-medium flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
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
            <Trophy className="h-12 w-12 text-yellow-500 mr-4" />
            <h1 className="text-5xl font-bold text-white">Leaderboard</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See how you stack up against other legends in the community. Climb the ranks and earn your place among the
            elite.
          </p>
        </motion.div>

        {/* User Ranking Card */}
        {data && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-pink-900/30 border-pink-500/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Your Global Ranking</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">#{data.userRanking.streakRank}</div>
                    <div className="text-gray-300">Streak Ranking</div>
                  </div>
                  <div className="text-center">
                    <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">#{data.userRanking.xpRank}</div>
                    <div className="text-gray-300">XP Ranking</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="streaks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="streaks" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Zap className="h-4 w-4 mr-2" />
              Top Streaks
            </TabsTrigger>
            <TabsTrigger value="xp" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Trophy className="h-4 w-4 mr-2" />
              Top XP
            </TabsTrigger>
            <TabsTrigger value="coins" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              <Coins className="h-4 w-4 mr-2" />
              Top Coins
            </TabsTrigger>
          </TabsList>

          <TabsContent value="streaks" className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-6 w-6 mr-2 text-yellow-500" />
                  Longest Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.topStreaks.map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        index < 3
                          ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                          : "bg-gray-700/30"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10">{getRankIcon(index + 1)}</div>
                        <div>
                          <div className="text-white font-semibold">{user.name}</div>
                          <Badge className={`bg-gradient-to-r ${getRankColor(user.rank)} text-white text-xs`}>
                            {user.rank}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-500">{user.streak}</div>
                        <div className="text-gray-400 text-sm">days</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="xp" className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-purple-500" />
                  Highest XP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.topXP.map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        index < 3
                          ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                          : "bg-gray-700/30"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10">{getRankIcon(index + 1)}</div>
                        <div>
                          <div className="text-white font-semibold">{user.name}</div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`bg-gradient-to-r ${getRankColor(user.rank)} text-white text-xs`}>
                              {user.rank}
                            </Badge>
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                              Level {user.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-500">{user.xp?.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">XP</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coins" className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Coins className="h-6 w-6 mr-2 text-yellow-500" />
                  Most FapCoins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.topCoins.map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        index < 3
                          ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                          : "bg-gray-700/30"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10">{getRankIcon(index + 1)}</div>
                        <div>
                          <div className="text-white font-semibold">{user.name}</div>
                          <Badge className={`bg-gradient-to-r ${getRankColor(user.rank)} text-white text-xs`}>
                            {user.rank}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-500">🪙 {user.coins?.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">coins</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Ranking System Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-center">🏆 Ranking System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { rank: "Rookie", color: "from-gray-600 to-gray-800", requirement: "Start your journey" },
                  { rank: "Bronze", color: "from-orange-400 to-orange-600", requirement: "Level 5, 3+ day streak" },
                  { rank: "Silver", color: "from-gray-400 to-gray-600", requirement: "Level 10, 7+ day streak" },
                  { rank: "Gold", color: "from-yellow-400 to-yellow-600", requirement: "Level 15, 14+ day streak" },
                  { rank: "Platinum", color: "from-gray-300 to-gray-500", requirement: "Level 20, 30+ day streak" },
                  { rank: "Diamond", color: "from-blue-400 to-cyan-400", requirement: "Level 30, 50+ day streak" },
                ].map((rankInfo) => (
                  <div key={rankInfo.rank} className="text-center">
                    <Badge className={`bg-gradient-to-r ${rankInfo.color} text-white mb-2 w-full`}>
                      {rankInfo.rank}
                    </Badge>
                    <p className="text-gray-400 text-xs">{rankInfo.requirement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
