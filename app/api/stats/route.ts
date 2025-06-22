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

    const userId = new ObjectId(user.userId)

    // Get user data
    const userData = await db.collection("users").findOne({ _id: userId })
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get fap logs for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const fapLogs = await db
      .collection("fapLogs")
      .find({
        userId,
        timestamp: { $gte: thirtyDaysAgo },
      })
      .sort({ timestamp: -1 })
      .toArray()

    // Get mood data for the last 30 days
    const moods = await db
      .collection("moods")
      .find({
        userId,
        date: { $gte: thirtyDaysAgo.toISOString().split("T")[0] },
      })
      .toArray()

    // Calculate stats
    const totalFaps = fapLogs.length
    const weeklyFaps = fapLogs.filter((log) => log.timestamp >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length

    // Most common trigger
    const triggerCounts: Record<string, number> = {}
    fapLogs.forEach((log) => {
      if (log.trigger && Array.isArray(log.trigger)) {
        log.trigger.forEach((t: string) => {
          triggerCounts[t] = (triggerCounts[t] || 0) + 1
        })
      }
    })

    const mostCommonTrigger = Object.entries(triggerCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "None"

    // Most common time (hour of day)
    const hourCounts: Record<number, number> = {}
    fapLogs.forEach((log) => {
      const hour = log.timestamp.getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    const mostCommonHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "12"

    const mostCommonTime = `${mostCommonHour}:00`

    // Calculate current streak
    let currentStreak = 0
    if (userData.lastFapDate) {
      currentStreak = Math.floor((Date.now() - userData.lastFapDate.getTime()) / (1000 * 60 * 60 * 24))
    } else {
      currentStreak = Math.floor((Date.now() - userData.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    }

    return NextResponse.json({
      totalFaps,
      weeklyFaps,
      currentStreak,
      longestStreak: userData.longestStreak,
      coins: userData.coins,
      mostCommonTrigger,
      mostCommonTime,
      fapLogs: fapLogs.slice(0, 7), // Last 7 for chart
      moods: moods.slice(0, 7),
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
