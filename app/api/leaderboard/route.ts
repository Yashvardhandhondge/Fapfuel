import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("fapfuel")

    // Get top users by different metrics
    const topStreaks = await db
      .collection("users")
      .find({}, { projection: { name: 1, streak: 1, rank: 1 } })
      .sort({ streak: -1 })
      .limit(10)
      .toArray()

    const topXP = await db
      .collection("users")
      .find({}, { projection: { name: 1, xp: 1, level: 1, rank: 1 } })
      .sort({ xp: -1 })
      .limit(10)
      .toArray()

    const topCoins = await db
      .collection("users")
      .find({}, { projection: { name: 1, coins: 1, rank: 1 } })
      .sort({ coins: -1 })
      .limit(10)
      .toArray()

    // Get current user's ranking
    const currentUser = await db.collection("users").findOne({ _id: user.userId })
    const userRankByStreak = await db.collection("users").countDocuments({ streak: { $gt: currentUser?.streak || 0 } })
    const userRankByXP = await db.collection("users").countDocuments({ xp: { $gt: currentUser?.xp || 0 } })

    return NextResponse.json({
      topStreaks,
      topXP,
      topCoins,
      userRanking: {
        streakRank: userRankByStreak + 1,
        xpRank: userRankByXP + 1,
      },
    })
  } catch (error) {
    console.error("Leaderboard fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
