import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"
import { calculateLevel, calculateRank } from "@/lib/game-utils"

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { mood, trigger } = await request.json()

    const client = await clientPromise
    const db = client.db("fapfuel")

    // Log the fap
    const fapLog = {
      userId: new ObjectId(user.userId),
      timestamp: new Date(),
      mood,
      trigger,
    }

    await db.collection("fapLogs").insertOne(fapLog)

    // Get current user data
    const userData = await db.collection("users").findOne({ _id: new ObjectId(user.userId) })
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate new stats
    const newFapsThisMonth = (userData.fapsThisMonth || 0) + 1
    const newXP = (userData.xp || 0) + 10 // 10 XP for logging a fap
    const newLevel = calculateLevel(newXP)
    const newRank = calculateRank(newLevel, 0) // Streak resets to 0
    const eligibleForPremium = newFapsThisMonth >= 100

    // Update user stats
    await db.collection("users").updateOne(
      { _id: new ObjectId(user.userId) },
      {
        $set: {
          streak: 0,
          lastFapDate: new Date(),
          fapsThisMonth: newFapsThisMonth,
          xp: newXP,
          level: newLevel,
          rank: newRank,
          eligibleForPremium,
        },
        $inc: { coins: 1 },
        $max: { longestStreak: userData.streak || 0 },
      },
    )

    // Update quest progress
    await updateQuestProgress(db, user.userId, "fap", 1)

    return NextResponse.json({
      message: "Fap logged successfully",
      xpGained: 10,
      newLevel: newLevel > (userData.level || 1),
      eligibleForPremium,
    })
  } catch (error) {
    console.error("Fap logging error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function updateQuestProgress(db: any, userId: string, questType: string, progress: number) {
  // Get active quests of this type
  const quests = await db.collection("quests").find({ type: questType, active: true }).toArray()

  for (const quest of quests) {
    // Update or create user quest progress
    await db.collection("userQuests").updateOne(
      {
        userId: new ObjectId(userId),
        questId: quest._id,
      },
      {
        $inc: { progress },
        $setOnInsert: {
          userId: new ObjectId(userId),
          questId: quest._id,
          completed: false,
          claimed: false,
        },
      },
      { upsert: true },
    )

    // Check if quest is completed
    const userQuest = await db.collection("userQuests").findOne({
      userId: new ObjectId(userId),
      questId: quest._id,
    })

    if (userQuest && userQuest.progress >= quest.target && !userQuest.completed) {
      await db.collection("userQuests").updateOne(
        { _id: userQuest._id },
        {
          $set: {
            completed: true,
            completedAt: new Date(),
          },
        },
      )
    }
  }
}
