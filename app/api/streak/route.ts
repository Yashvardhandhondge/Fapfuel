import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
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

    const userData = await db.collection("users").findOne({ _id: new ObjectId(user.userId) })
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate current streak based on last fap date
    let currentStreak = 0
    if (userData.lastFapDate) {
      const daysSinceLastFap = Math.floor((Date.now() - userData.lastFapDate.getTime()) / (1000 * 60 * 60 * 24))
      currentStreak = daysSinceLastFap
    } else {
      // If no fap logged yet, calculate from creation date
      const daysSinceCreation = Math.floor((Date.now() - userData.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      currentStreak = daysSinceCreation
    }

    // Update streak if it's higher than stored
    if (currentStreak > userData.streak) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(user.userId) },
        {
          $set: { streak: currentStreak },
          $max: { longestStreak: currentStreak },
        },
      )
    }

    return NextResponse.json({
      currentStreak,
      longestStreak: Math.max(userData.longestStreak, currentStreak),
      coins: userData.coins,
    })
  } catch (error) {
    console.error("Streak fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
