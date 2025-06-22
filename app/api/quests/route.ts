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

    // Get active quests
    const quests = await db.collection("quests").find({ active: true }).toArray()

    // Get user's quest progress
    const userQuests = await db
      .collection("userQuests")
      .find({ userId: new ObjectId(user.userId) })
      .toArray()

    // Combine quest data with user progress
    const questsWithProgress = quests.map((quest) => {
      const userQuest = userQuests.find((uq) => uq.questId.toString() === quest._id.toString())
      return {
        ...quest,
        progress: userQuest?.progress || 0,
        completed: userQuest?.completed || false,
        claimed: userQuest?.claimed || false,
      }
    })

    return NextResponse.json({ quests: questsWithProgress })
  } catch (error) {
    console.error("Quests fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { questId } = await request.json()

    const client = await clientPromise
    const db = client.db("fapfuel")

    // Get quest details
    const quest = await db.collection("quests").findOne({ _id: new ObjectId(questId) })
    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 })
    }

    // Check if user has completed this quest
    const userQuest = await db.collection("userQuests").findOne({
      userId: new ObjectId(user.userId),
      questId: new ObjectId(questId),
      completed: true,
      claimed: false,
    })

    if (!userQuest) {
      return NextResponse.json({ error: "Quest not completed or already claimed" }, { status: 400 })
    }

    // Award XP and mark as claimed
    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(user.userId) }, { $inc: { xp: quest.xp, coins: quest.xp / 10 } })

    await db.collection("userQuests").updateOne({ _id: userQuest._id }, { $set: { claimed: true } })

    return NextResponse.json({ message: "Quest reward claimed!", xp: quest.xp })
  } catch (error) {
    console.error("Quest claim error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
