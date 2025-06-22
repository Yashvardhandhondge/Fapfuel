"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import {
  Flame,
  Droplets,
  Target,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Eye,
  Loader2,
  Plus,
} from "lucide-react"

interface PornLink {
  _id: string
  url: string
  title: string
  clicks: number
  timestamps: string[]
  firstVisited: string
}

interface PornStats {
  totalClicks: number
  totalLinks: number
  monthlyClicks: number
  shameLevel: string
}

export default function PornTracker() {
  const [links, setLinks] = useState<PornLink[]>([])
  const [stats, setStats] = useState<PornStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newLink, setNewLink] = useState({
    url: "",
    title: "",
  })

  useEffect(() => {
    fetchPornData()
  }, [])

  const fetchPornData = async () => {
    try {
      const response = await fetch("/api/porn-links")
      if (response.ok) {
        const data = await response.json()
        setLinks(data.links)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch porn data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addPornLink = async () => {
    if (!newLink.url) return

    setAdding(true)
    try {
      const response = await fetch("/api/porn-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLink),
      })

      if (response.ok) {
        setNewLink({ url: "", title: "" })
        await fetchPornData()
      }
    } catch (error) {
      console.error("Failed to add porn link:", error)
    } finally {
      setAdding(false)
    }
  }

  const getShameColor = (level: string) => {
    switch (level) {
      case "Danger Zone":
        return "from-red-500 to-red-700"
      case "High Risk":
        return "from-orange-500 to-red-500"
      case "Moderate":
        return "from-yellow-500 to-orange-500"
      default:
        return "from-green-500 to-yellow-500"
    }
  }

  const getShameEmoji = (level: string) => {
    switch (level) {
      case "Danger Zone":
        return "🔥"
      case "High Risk":
        return "⚠️"
      case "Moderate":
        return "😬"
      default:
        return "😌"
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
              <Link href="/porn-tracker" className="text-pink-500 font-medium flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>Porn Tracker</span>
              </Link>
              <Link href="/chat" className="text-gray-300 hover:text-white">
                AI Coach
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-12 w-12 text-pink-500 mr-4" />
            <h1 className="text-5xl font-bold text-white">Porn Tracker</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track your porn consumption to understand patterns and triggers. Knowledge is the first step to change.
          </p>
        </motion.div>

        {/* Shame Meter */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card
              className={`bg-gradient-to-r ${getShameColor(stats.shameLevel)}/20 border-${stats.shameLevel === "Danger Zone" ? "red" : stats.shameLevel === "High Risk" ? "orange" : stats.shameLevel === "Moderate" ? "yellow" : "green"}-500/50`}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">{getShameEmoji(stats.shameLevel)}</div>
                <h3 className="text-3xl font-bold text-white mb-2">Shame Level: {stats.shameLevel}</h3>
                <p className="text-gray-300 text-lg mb-4">
                  {stats.shameLevel === "Danger Zone"
                    ? "Bro, you need to touch grass. This is concerning."
                    : stats.shameLevel === "High Risk"
                      ? "You're in the danger zone. Time to pump the brakes."
                      : stats.shameLevel === "Moderate"
                        ? "Not terrible, but there's room for improvement."
                        : "You're doing great! Keep it up!"}
                </p>
                <div className="max-w-md mx-auto">
                  <Progress value={Math.min((stats.monthlyClicks / 100) * 100, 100)} className="h-4" />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>0 clicks</span>
                    <span>{stats.monthlyClicks} this month</span>
                    <span>100+ (Danger)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 text-pink-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stats.totalClicks}</div>
                  <div className="text-gray-300">Total Clicks</div>
                  <Badge variant="secondary" className="mt-2 bg-pink-500/20 text-pink-400">
                    All Time
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <ExternalLink className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stats.totalLinks}</div>
                  <div className="text-gray-300">Unique Links</div>
                  <Badge variant="secondary" className="mt-2 bg-purple-500/20 text-purple-400">
                    Tracked
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stats.monthlyClicks}</div>
                  <div className="text-gray-300">This Month</div>
                  <Badge variant="secondary" className="mt-2 bg-yellow-500/20 text-yellow-400">
                    Recent
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Add New Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Plus className="h-5 w-5 mr-2 text-pink-500" />
                Track New Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Paste the shameful URL here..."
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="bg-gray-900/50 border-gray-600 text-white"
                  />
                </div>
                <Button
                  onClick={addPornLink}
                  disabled={adding || !newLink.url}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {adding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Track Link
                </Button>
              </div>
              <Alert className="mt-4 border-yellow-500/50 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-yellow-300">
                  Only you can see your tracked links. This data helps identify patterns in your behavior.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        {/* Links List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-pink-500" />
                Your Tracked Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              {links.length > 0 ? (
                <div className="space-y-4">
                  {links.map((link, index) => (
                    <motion.div
                      key={link._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600"
                    >
                      <div className="flex-1">
                        <div className="text-white font-medium mb-1">{link.title || "Untitled"}</div>
                        <div className="text-gray-400 text-sm truncate max-w-md">{link.url}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          First visited: {new Date(link.firstVisited).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`${
                            link.clicks > 20
                              ? "bg-red-500/20 text-red-400"
                              : link.clicks > 10
                                ? "bg-orange-500/20 text-orange-400"
                                : link.clicks > 5
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {link.clicks} clicks
                        </Badge>
                        <div className="text-gray-400 text-xs mt-1">
                          {link.clicks > 20
                            ? "🔥 Addicted"
                            : link.clicks > 10
                              ? "⚠️ Frequent"
                              : link.clicks > 5
                                ? "😬 Regular"
                                : "😌 Occasional"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No Links Tracked Yet</h3>
                  <p className="text-gray-500">Start tracking your porn consumption to understand your patterns.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights */}
        {links.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-pink-900/30 border-pink-500/30">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">📊 Your Consumption Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Most Visited</h4>
                    <div className="space-y-2">
                      {links
                        .sort((a, b) => b.clicks - a.clicks)
                        .slice(0, 3)
                        .map((link, index) => (
                          <div key={link._id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-300 truncate max-w-48">
                              #{index + 1} {link.title || "Untitled"}
                            </span>
                            <Badge variant="secondary" className="bg-pink-500/20 text-pink-400">
                              {link.clicks} times
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">Reality Check</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>• You've clicked {stats?.totalClicks} times total</p>
                      <p>• That's {stats?.monthlyClicks} times this month</p>
                      <p>
                        • Average:{" "}
                        {stats?.totalLinks ? Math.round((stats.totalClicks / stats.totalLinks) * 10) / 10 : 0} clicks
                        per link
                      </p>
                      <p className="text-yellow-400 font-medium">💡 Time to go touch some grass?</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
