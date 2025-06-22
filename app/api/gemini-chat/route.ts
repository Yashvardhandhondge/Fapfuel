import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"
import { generateGeminiResponse } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Rate limiting check
    if (message.length > 500) {
      return NextResponse.json({ error: "Message too long. Keep it under 500 characters." }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("fapfuel")

    // Get user data for context and limits
    const userData = await db.collection("users").findOne({ _id: new ObjectId(user.userId) })
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if it's a new day and reset message count
    const today = new Date().toDateString()
    const lastReset = userData.lastGeminiReset ? userData.lastGeminiReset.toDateString() : null

    let currentMessageCount = userData.geminiMessagesToday || 0

    if (today !== lastReset) {
      // Reset daily count
      currentMessageCount = 0
      await db.collection("users").updateOne(
        { _id: new ObjectId(user.userId) },
        {
          $set: {
            geminiMessagesToday: 0,
            lastGeminiReset: new Date(),
          },
        },
      )
    }

    // Check message limits for free users
    if (!userData.isPremium && currentMessageCount >= 2) {
      return NextResponse.json(
        {
          error:
            "Daily limit reached! Free users get 2 messages per day. Upgrade to FapFuel+ for unlimited AI coaching! 🚀",
          limitReached: true,
          upgradeUrl: "/premium",
        },
        { status: 429 },
      )
    }

    // Prepare user context for better responses
    const userContext = {
      streak: userData.streak || 0,
      longestStreak: userData.longestStreak || 0,
      level: userData.level || 1,
      rank: userData.rank || "Rookie",
      fapsThisMonth: userData.fapsThisMonth || 0,
    }

    // Generate AI response using Gemini
    const aiResponse = await generateGeminiResponse(message, userContext)

    // Save the conversation to database
    const conversationEntry = {
      userId: new ObjectId(user.userId),
      message: message.trim(),
      response: aiResponse,
      timestamp: new Date(),
      userContext,
    }

    await db.collection("geminiMessages").insertOne(conversationEntry)

    // Increment user's daily message count
    await db.collection("users").updateOne(
      { _id: new ObjectId(user.userId) },
      {
        $inc: { geminiMessagesToday: 1 },
        $set: { lastGeminiReset: new Date() },
      },
    )

    // Calculate remaining messages for free users
    const messagesLeft = userData.isPremium ? -1 : Math.max(0, 2 - (currentMessageCount + 1))

    return NextResponse.json({
      response: aiResponse,
      messagesLeft,
      isPremium: userData.isPremium,
      conversationId: conversationEntry._id,
    })
  } catch (error) {
    console.error("Gemini chat error:", error)

    // Return a helpful error message
    return NextResponse.json(
      {
        error: "Sorry, I'm having trouble right now. Try again in a moment, or reach out if this keeps happening.",
        technical: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("fapfuel")

    // Get recent chat history (last 20 messages)
    const messages = await db
      .collection("geminiMessages")
      .find(
        { userId: new ObjectId(user.userId) },
        {
          projection: {
            message: 1,
            response: 1,
            timestamp: 1,
            _id: 1,
          },
        },
      )
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray()

    // Get user's current message count and premium status
    const userData = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(user.userId) },
        { projection: { geminiMessagesToday: 1, isPremium: 1, lastGeminiReset: 1 } },
      )

    // Check if we need to reset daily count
    const today = new Date().toDateString()
    const lastReset = userData?.lastGeminiReset ? userData.lastGeminiReset.toDateString() : null

    let messagesLeft = 2
    if (userData?.isPremium) {
      messagesLeft = -1 // Unlimited
    } else if (today === lastReset) {
      messagesLeft = Math.max(0, 2 - (userData?.geminiMessagesToday || 0))
    }

    return NextResponse.json({
      messages: messages.reverse(), // Return in chronological order
      messagesLeft,
      isPremium: userData?.isPremium || false,
    })
  } catch (error) {
    console.error("Chat history fetch error:", error)
    return NextResponse.json({ error: "Failed to load chat history" }, { status: 500 })
  }
}
