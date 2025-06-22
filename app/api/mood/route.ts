import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { mood } = await request.json()
    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("fapfuel")

    const today = new Date().toISOString().split("T")[0]

    // Upsert mood for today
    await db.collection("moods").updateOne(
      {
        userId: new ObjectId(user.userId),
        date: today,
      },
      {
        $set: {
          userId: new ObjectId(user.userId),
          date: today,
          mood,
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ message: "Mood logged successfully" })
  } catch (error) {
    console.error("Mood logging error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
