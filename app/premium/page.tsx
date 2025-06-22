"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Flame, Droplets, Shield, Zap, Target, Trophy, Star, Users, Check, Loader2 } from "lucide-react"

export default function Premium() {
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)

  const handleRazorpayPayment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const paymentData = await response.json()

        // Mock Razorpay integration
        // In production, you would use actual Razorpay SDK here
        setTimeout(() => {
          setPaymentStatus("success")
          setLoading(false)
        }, 2000)
      }
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentStatus("error")
      setLoading(false)
    }
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
              <Link href="/premium" className="text-pink-500 font-medium">
                Upgrade
              </Link>
              <Link href="/profile" className="text-gray-300 hover:text-white">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white mb-4 text-lg px-4 py-2">
            FAPFUEL+
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-4">
            Upgrade to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Legendary
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to transcend mere mortal status? Upgrade to FapFuel+ and unlock powers that would make monks jealous.
          </p>
        </div>

        {/* Payment Status */}
        {paymentStatus && (
          <div className="max-w-md mx-auto mb-8">
            <Alert
              className={`${paymentStatus === "success" ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"}`}
            >
              <AlertDescription className={`${paymentStatus === "success" ? "text-green-400" : "text-red-400"}`}>
                {paymentStatus === "success"
                  ? "🎉 Payment successful! Welcome to FapFuel+ legend status!"
                  : "❌ Payment failed. Please try again."}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Pricing Card */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="bg-gradient-to-br from-pink-900/50 via-purple-900/50 to-pink-900/50 border-pink-500/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-600/10"></div>
            <CardHeader className="text-center relative z-10">
              <CardTitle className="text-3xl font-bold text-white mb-2">FapFuel+</CardTitle>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
                $4<span className="text-2xl">/month</span>
              </div>
              <p className="text-gray-300">Become the legend you were meant to be</p>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                onClick={handleRazorpayPayment}
                disabled={loading}
                size="lg"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 text-lg transform hover:scale-105 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}💳 Upgrade with Razorpay
              </Button>
              <p className="text-center text-gray-400 text-sm mt-4">Cancel anytime. Your dignity is non-refundable.</p>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-800/50 border-gray-700 hover:border-pink-500/50 transition-all">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">🛡️ Streak Shield™</h3>
              <p className="text-gray-300 mb-4">
                One free pass per week when you slip up. Because everyone needs a second chance.
              </p>
              <Badge variant="secondary" className="bg-pink-500/20 text-pink-400">
                Premium Only
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-red-500/50 transition-all">
            <CardContent className="p-6">
              <Zap className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">🚨 Emergency Panic Button</h3>
              <p className="text-gray-300 mb-4">
                Instant distractions, motivational videos, and cold shower reminders when willpower fails.
              </p>
              <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                Life Saver
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all">
            <CardContent className="p-6">
              <Target className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">🔮 AI Mood Predictor</h3>
              <p className="text-gray-300 mb-4">
                Advanced AI that predicts your weak moments and sends preventive roasts.
              </p>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                Futuristic
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-all">
            <CardContent className="p-6">
              <Trophy className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">🏪 Meme Rewards Store</h3>
              <p className="text-gray-300 mb-4">
                Unlock exclusive memes, GIFs, and legendary badges to flex your self-control.
              </p>
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                Flex Mode
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">😳 Anonymous Shame Wall</h3>
              <p className="text-gray-300 mb-4">Compare your failures with other degenerates. Misery loves company.</p>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                Social Shame
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all">
            <CardContent className="p-6">
              <Star className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">📊 Advanced Analytics</h3>
              <p className="text-gray-300 mb-4">
                Deep insights into your patterns, triggers, and the meaning of life (maybe).
              </p>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                Data Nerd
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <Card className="bg-gray-800/50 border-gray-700 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Free vs Premium: The Ultimate Showdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free */}
              <div>
                <h3 className="text-xl font-bold text-gray-300 mb-4 text-center">Free (Peasant Tier)</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Basic fap tracking
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Simple streak counter
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Weekly AI roasts
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Basic mood tracking
                  </div>
                </div>
              </div>

              {/* Premium */}
              <div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4 text-center">
                  Premium (Legend Tier)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-white">
                    <Check className="h-4 w-4 text-pink-500 mr-2" />
                    Everything in Free +
                  </div>
                  <div className="flex items-center text-white">
                    <Check className="h-4 w-4 text-pink-500 mr-2" />
                    Streak Shield™ protection
                  </div>
                  <div className="flex items-center text-white">
                    <Check className="h-4 w-4 text-pink-500 mr-2" />
                    Emergency Panic Button
                  </div>
                  <div className="flex items-center text-white">
                    <Check className="h-4 w-4 text-pink-500 mr-2" />
                    AI Mood Predictor
                  </div>
                  <div className="flex items-center text-white">
                    <Check className="h-4 w-4 text-pink-500 mr-2" />
                    Meme Rewards Store
                  </div>
                  <div className="flex items-center text-white">
                    <Check className="h-4 w-4 text-pink-500 mr-2" />
                    Anonymous Shame Wall
                  </div>
                  <div className="flex items-center text-white">
                    <Check className="h-4 w-4 text-pink-500 mr-2" />
                    Advanced Analytics
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Premium Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <p className="text-gray-300 mb-4 italic">
                  "The Streak Shield saved me during my weak moment. Now I'm on day 30 and feeling like a god among
                  mortals."
                </p>
                <p className="text-pink-500 font-bold">— EliteMonk2024</p>
                <Badge className="mt-2 bg-yellow-500/20 text-yellow-400">30-day streak</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <p className="text-gray-300 mb-4 italic">
                  "The Panic Button literally saved my relationship. My girlfriend thinks I'm finally growing up. 😂"
                </p>
                <p className="text-purple-500 font-bold">— ReformedDegen</p>
                <Badge className="mt-2 bg-green-500/20 text-green-400">Relationship saved</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <Button
            onClick={handleRazorpayPayment}
            disabled={loading}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl px-12 py-6 rounded-full font-bold transform hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}🚀 Ascend to Premium Now
          </Button>
          <p className="text-gray-400 mt-4">Join the elite. Become the legend. Stop being a peasant.</p>
        </div>
      </div>
    </div>
  )
}
