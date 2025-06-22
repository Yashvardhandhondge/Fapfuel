"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Flame, Droplets, Zap, Shield, Target, Trophy, Star, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-pink-500" />
              <Droplets className="h-6 w-6 text-purple-400" />
              <span className="text-2xl font-bold text-white">FapFuel</span>
            </div>
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
              <Link href="/auth">
                <Button
                  variant="outline"
                  className="bg-transparent border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Wanna fap?
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Log it. Roast yourself.
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Become a meme.
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The most ridiculous self-control tracker ever made. Track your habits, get roasted by AI, earn coins, and
            maybe... just maybe... become a legend.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl px-8 py-4 rounded-full font-bold transform hover:scale-105 transition-all"
            >
              👉 Fap Here (It's Free)
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          Features That'll Make You Question Everything
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gray-800/50 border-gray-700 hover:border-pink-500/50 transition-all">
            <CardContent className="p-6">
              <Target className="h-12 w-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">💦 The Fap Button</h3>
              <p className="text-gray-300">One click. Instant shame. Maximum accountability.</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all">
            <CardContent className="p-6">
              <Zap className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">🔥 Streak Tracking</h3>
              <p className="text-gray-300">Build streaks longer than your attention span.</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-pink-500/50 transition-all">
            <CardContent className="p-6">
              <Trophy className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">🤖 AI Roasts</h3>
              <p className="text-gray-300">Get brutally honest feedback from our AI comedian.</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-red-500/50 transition-all">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">🚨 Panic Mode</h3>
              <p className="text-gray-300">Emergency distractions when willpower fails.</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-all">
            <CardContent className="p-6">
              <Star className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">🪙 FapCoins</h3>
              <p className="text-gray-300">Earn virtual currency for real self-respect.</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">😎 Meme Rewards</h3>
              <p className="text-gray-300">Unlock legendary memes as you progress.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 border-pink-500/50">
          <CardContent className="p-8 text-center">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white mb-4">PREMIUM</Badge>
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Go Pro?</h3>
            <p className="text-gray-300 mb-6">
              Upgrade to Fap+ for advanced features, streak shields, and the power to become a true legend.
            </p>
            <Link href="/premium">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                Upgrade to Fap+ - $4/month
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Flame className="h-6 w-6 text-pink-500" />
              <Droplets className="h-4 w-4 text-purple-400" />
              <span className="text-xl font-bold text-white">FapFuel</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">© 2024 FapFuel. Making self-control fun, one fap at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
