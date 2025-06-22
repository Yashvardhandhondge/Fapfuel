"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Flame, Droplets, Send, Bot, User, Star, Crown, Loader2, AlertCircle, Zap } from "lucide-react"

interface ChatMessage {
  _id: string
  message: string
  response: string
  timestamp: string
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [messagesLeft, setMessagesLeft] = useState(2)
  const [isPremium, setIsPremium] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchChatHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchChatHistory = async () => {
    try {
      const response = await fetch("/api/gemini-chat")
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
        setMessagesLeft(data.messagesLeft)
        setIsPremium(data.isPremium)
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error)
      setError("Failed to load chat history")
    } finally {
      setInitialLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || loading) return

    // Clear any previous errors
    setError("")
    setLimitReached(false)

    // Optimistically add user message to UI
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      message: newMessage.trim(),
      response: "",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempMessage])
    const messageToSend = newMessage.trim()
    setNewMessage("")
    setLoading(true)

    try {
      const response = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update the temporary message with the real response
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === tempMessage._id
              ? { ...msg, response: data.response, _id: data.conversationId || msg._id }
              : msg,
          ),
        )
        setMessagesLeft(data.messagesLeft)
        setIsPremium(data.isPremium)
      } else {
        // Remove the temporary message and show error
        setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id))

        if (response.status === 429) {
          setLimitReached(true)
          setError(data.error || "Daily limit reached")
        } else {
          setError(data.error || "Failed to send message")
        }

        // Restore the message in input if there was an error
        setNewMessage(messageToSend)
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id))
      setError("Network error. Please check your connection and try again.")
      setNewMessage(messageToSend)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const canSendMessage = !loading && newMessage.trim() && !limitReached && (isPremium || messagesLeft > 0)

  if (initialLoading) {
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
              <Link href="/porn-tracker" className="text-gray-300 hover:text-white">
                Porn Tracker
              </Link>
              <Link href="/chat" className="text-pink-500 font-medium flex items-center space-x-1">
                <Bot className="h-4 w-4" />
                <span>AI Coach</span>
              </Link>
              {!isPremium && (
                <Link href="/premium">
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all">
                    <Zap className="h-3 w-3 mr-1" />
                    Upgrade
                  </Badge>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Bot className="h-12 w-12 text-pink-500 mr-4" />
            <h1 className="text-4xl font-bold text-white">AI Recovery Coach</h1>
            {isPremium && <Crown className="h-8 w-8 text-yellow-500 ml-4" />}
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get personalized advice and support from your AI coach for porn addiction recovery.
            {!isPremium && ` Free users get ${messagesLeft} messages per day.`}
          </p>
        </motion.div>

        {/* Usage Limit Alert */}
        {!isPremium && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert
              className={`border-${messagesLeft === 0 ? "red" : messagesLeft === 1 ? "yellow" : "blue"}-500/50 bg-${messagesLeft === 0 ? "red" : messagesLeft === 1 ? "yellow" : "blue"}-500/10`}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription
                className={`text-${messagesLeft === 0 ? "red" : messagesLeft === 1 ? "yellow" : "blue"}-300`}
              >
                {messagesLeft === 0 ? (
                  <>
                    Daily limit reached! 🚫{" "}
                    <Link href="/premium" className="underline font-medium hover:text-pink-400">
                      Upgrade to FapFuel+
                    </Link>{" "}
                    for unlimited AI coaching and support.
                  </>
                ) : messagesLeft === 1 ? (
                  <>
                    ⚠️ Last free message today!{" "}
                    <Link href="/premium" className="underline font-medium hover:text-pink-400">
                      Upgrade
                    </Link>{" "}
                    for unlimited access.
                  </>
                ) : (
                  <>
                    💬 You have {messagesLeft} free messages left today.{" "}
                    <Link href="/premium" className="underline font-medium hover:text-pink-400">
                      Upgrade
                    </Link>{" "}
                    for unlimited coaching.
                  </>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Error Alert */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-300">
                {error}
                {limitReached && (
                  <>
                    {" "}
                    <Link href="/premium" className="underline font-medium">
                      Upgrade now
                    </Link>{" "}
                    to continue chatting.
                  </>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Chat Container */}
        <Card className="bg-gray-800/50 border-gray-700 h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-pink-500" />
                Your Personal Recovery Coach
              </div>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <Bot className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">Start Your Recovery Journey</h3>
                  <p className="text-gray-500 mb-4">
                    Ask me anything about overcoming urges, building streaks, or staying motivated.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md mx-auto text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMessage("I'm having strong urges right now, what should I do?")}
                      className="border-gray-600 text-gray-300 hover:text-white"
                    >
                      "I'm having urges..."
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMessage("I broke my streak and feel terrible")}
                      className="border-gray-600 text-gray-300 hover:text-white"
                    >
                      "I broke my streak..."
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMessage("How do I build a longer streak?")}
                      className="border-gray-600 text-gray-300 hover:text-white"
                    >
                      "How to build streaks?"
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMessage("What are some good daily habits?")}
                      className="border-gray-600 text-gray-300 hover:text-white"
                    >
                      "Daily habits?"
                    </Button>
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-4"
                  >
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-2xl rounded-br-md">
                        <div className="flex items-start space-x-2">
                          <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Response */}
                    {msg.response && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] bg-gray-700/50 text-white p-4 rounded-2xl rounded-bl-md">
                          <div className="flex items-start space-x-2">
                            <Bot className="h-4 w-4 mt-0.5 text-pink-500 flex-shrink-0" />
                            <p className="text-sm whitespace-pre-wrap">{msg.response}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-700/50 text-white p-4 rounded-2xl rounded-bl-md">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-pink-500" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Your coach is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-700 p-6">
              <div className="flex space-x-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    limitReached || (!isPremium && messagesLeft === 0)
                      ? "Daily limit reached. Upgrade to continue..."
                      : "Ask your recovery coach anything..."
                  }
                  disabled={loading || limitReached || (!isPremium && messagesLeft === 0)}
                  className="flex-1 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400"
                  maxLength={500}
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={sendMessage}
                    disabled={!canSendMessage}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </motion.div>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                <span>{newMessage.length}/500 characters</span>
                {!isPremium && (
                  <span>{messagesLeft > 0 ? `${messagesLeft} messages left today` : "Daily limit reached"}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Upsell */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-pink-900/30 border-pink-500/30">
              <CardContent className="p-8 text-center">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Unlock Unlimited AI Coaching</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Get unlimited access to your personal recovery coach, advanced insights, and premium features to
                  accelerate your journey to freedom from porn addiction.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <Bot className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                    <div className="text-white font-medium">Unlimited Chat</div>
                    <div className="text-gray-400">24/7 AI support</div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <div className="text-white font-medium">Advanced Features</div>
                    <div className="text-gray-400">Streak shields & more</div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <Star className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <div className="text-white font-medium">Priority Support</div>
                    <div className="text-gray-400">Faster responses</div>
                  </div>
                </div>
                <Link href="/premium">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg px-8 py-3">
                    <Star className="h-5 w-5 mr-2" />
                    Upgrade to FapFuel+ - $4/month
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
