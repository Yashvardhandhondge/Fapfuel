"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Flame, Droplets, Users, Plus, MessageCircle, TrendingUp, Crown, Loader2 } from "lucide-react"

interface Community {
  _id: string
  name: string
  description: string
  memberCount: number
  isMember: boolean
  totalFaps: number
  averageStreak: number
}

export default function Communities() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState<string | null>(null)
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    fetchCommunities()
  }, [])

  const fetchCommunities = async () => {
    try {
      const response = await fetch("/api/communities")
      if (response.ok) {
        const data = await response.json()
        setCommunities(data.communities)
      }
    } catch (error) {
      console.error("Failed to fetch communities:", error)
    } finally {
      setLoading(false)
    }
  }

  const createCommunity = async () => {
    if (!newCommunity.name || !newCommunity.description) return

    setCreating(true)
    try {
      const response = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCommunity),
      })

      if (response.ok) {
        setNewCommunity({ name: "", description: "" })
        await fetchCommunities()
      }
    } catch (error) {
      console.error("Failed to create community:", error)
    } finally {
      setCreating(false)
    }
  }

  const joinCommunity = async (communityId: string) => {
    setJoining(communityId)
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: "POST",
      })

      if (response.ok) {
        await fetchCommunities()
      }
    } catch (error) {
      console.error("Failed to join community:", error)
    } finally {
      setJoining(null)
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
              <Link href="/leaderboard" className="text-gray-300 hover:text-white">
                Leaderboard
              </Link>
              <Link href="/communities" className="text-pink-500 font-medium flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Communities</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <div className="flex items-center mb-4">
              <Users className="h-12 w-12 text-pink-500 mr-4" />
              <h1 className="text-5xl font-bold text-white">Communities</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl">
              Join anonymous communities of like-minded individuals on their self-improvement journey. Share experiences
              and support each other.
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Community</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Community Name
                  </Label>
                  <Input
                    id="name"
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                    className="bg-gray-900/50 border-gray-600 text-white"
                    placeholder="e.g., NoFap Warriors"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                    className="bg-gray-900/50 border-gray-600 text-white"
                    placeholder="Describe your community's purpose and goals..."
                  />
                </div>
                <Button
                  onClick={createCommunity}
                  disabled={creating || !newCommunity.name || !newCommunity.description}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Create Community
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community, index) => (
            <motion.div
              key={community._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`bg-gray-800/50 border-gray-700 hover:border-pink-500/50 transition-all h-full ${
                  community.isMember ? "border-green-500/50" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2 flex items-center">
                        {community.name}
                        {community.memberCount > 100 && <Crown className="h-4 w-4 ml-2 text-yellow-500" />}
                      </CardTitle>
                      <p className="text-gray-400 text-sm line-clamp-2">{community.description}</p>
                    </div>
                    {community.isMember && <Badge className="bg-green-500/20 text-green-400 ml-2">Member</Badge>}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Community Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{community.memberCount}</div>
                        <div className="text-gray-400 text-xs">Members</div>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{community.averageStreak}</div>
                        <div className="text-gray-400 text-xs">Avg Streak</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {community.isMember ? (
                        <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          View Discussions
                        </Button>
                      ) : (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={() => joinCommunity(community._id)}
                            disabled={joining === community._id}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                          >
                            {joining === community._id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4 mr-2" />
                            )}
                            Join Community
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {communities.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Communities Yet</h3>
            <p className="text-gray-500 mb-6">Be the first to create a community and start building connections!</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Community
                </Button>
              </DialogTrigger>
            </Dialog>
          </motion.div>
        )}

        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-pink-900/30 border-pink-500/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">🤝 Community Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="h-8 w-8 text-pink-500 mx-auto mb-3" />
                  <h4 className="text-white font-semibold mb-2">Stay Anonymous</h4>
                  <p className="text-gray-300 text-sm">
                    All interactions are anonymous. Focus on support, not personal details.
                  </p>
                </div>
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="text-white font-semibold mb-2">Be Supportive</h4>
                  <p className="text-gray-300 text-sm">
                    Encourage others, share experiences, and maintain a positive environment.
                  </p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h4 className="text-white font-semibold mb-2">Share Progress</h4>
                  <p className="text-gray-300 text-sm">
                    Celebrate wins, learn from setbacks, and grow together as a community.
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
