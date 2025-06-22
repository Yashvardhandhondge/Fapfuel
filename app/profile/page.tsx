"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Flame, Droplets, User, Trophy, Coins, Loader2 } from "lucide-react"

interface UserData {
  _id: string
  email: string
  name: string
  streak: number
  longestStreak: number
  coins: number
  isPremium: boolean
  createdAt: string
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setFormData({
          name: data.user.name,
          email: data.user.email,
        })
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in to view your profile</h2>
          <Link href="/auth">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600">Sign In</Button>
          </Link>
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
              <Link href="/stats" className="text-gray-300 hover:text-white">
                Stats
              </Link>
              <Link href="/premium" className="text-gray-300 hover:text-white">
                Upgrade
              </Link>
              <Link href="/profile" className="text-pink-500 font-medium">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
          <p className="text-gray-300">{user.email}</p>
          {user.isPremium && (
            <Badge className="mt-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white">FapFuel+ Member</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Stats */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-300">Current Streak</span>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400">{user.streak} days</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-300">Longest Streak</span>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400">{user.longestStreak} days</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-300">FapCoins</span>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400">🪙 {user.coins}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Member Since</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Profile Settings
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(!editing)}
                  className="border-gray-600 text-gray-300"
                >
                  {editing ? "Cancel" : "Edit"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                  className="bg-gray-900/50 border-gray-600 text-white disabled:opacity-50"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editing}
                  className="bg-gray-900/50 border-gray-600 text-white disabled:opacity-50"
                />
              </div>

              {editing && (
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="bg-gray-800/50 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-lg border ${user.streak >= 1 ? "border-green-500/50 bg-green-500/10" : "border-gray-600 bg-gray-700/50"}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className={`font-bold ${user.streak >= 1 ? "text-green-400" : "text-gray-400"}`}>First Step</h3>
                  <p className={`text-sm ${user.streak >= 1 ? "text-green-300" : "text-gray-500"}`}>
                    Complete 1 day streak
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border ${user.streak >= 7 ? "border-yellow-500/50 bg-yellow-500/10" : "border-gray-600 bg-gray-700/50"}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🔥</div>
                  <h3 className={`font-bold ${user.streak >= 7 ? "text-yellow-400" : "text-gray-400"}`}>
                    Week Warrior
                  </h3>
                  <p className={`text-sm ${user.streak >= 7 ? "text-yellow-300" : "text-gray-500"}`}>
                    Complete 7 day streak
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border ${user.streak >= 30 ? "border-purple-500/50 bg-purple-500/10" : "border-gray-600 bg-gray-700/50"}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">👑</div>
                  <h3 className={`font-bold ${user.streak >= 30 ? "text-purple-400" : "text-gray-400"}`}>
                    Monk Status
                  </h3>
                  <p className={`text-sm ${user.streak >= 30 ? "text-purple-300" : "text-gray-500"}`}>
                    Complete 30 day streak
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-900/20 border-red-500/50 mt-8">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-500/50 bg-red-500/10 mb-4">
              <AlertDescription className="text-red-300">
                Warning: Deleting your account will permanently remove all your data, including streaks, coins, and
                achievements. This action cannot be undone.
              </AlertDescription>
            </Alert>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
