"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Flame, Droplets, Eye, EyeOff, Loader2 } from "lucide-react"

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      const endpoint = isSignUp ? "/api/signup" : "/api/login"
      const body = isSignUp
        ? { email: formData.email, password: formData.password, name: formData.name }
        : { email: formData.email, password: formData.password }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard")
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <Flame className="h-10 w-10 text-pink-500" />
            <Droplets className="h-8 w-8 text-purple-400" />
            <span className="text-3xl font-bold text-white">FapFuel</span>
          </Link>
          <p className="text-gray-300">{isSignUp ? "Join the degenerates" : "Welcome back, champion"}</p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              {isSignUp ? "Create Account" : "Sign In"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-500/50 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <Label htmlFor="name" className="text-white">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your shameful name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.shame@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Make it strong like your willpower"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Yes, the same password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isSignUp ? "🚀 Join the Club" : "👋 Welcome Back"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">{isSignUp ? "Already have an account?" : "New to the shame game?"}</p>
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-pink-500 hover:text-pink-400 p-0 h-auto font-medium"
              >
                {isSignUp ? "Sign in instead" : "Create account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
