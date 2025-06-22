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

    const communities = await db.collection("communities").find({}).sort({ members: -1 }).limit(20).toArray()

    // Add member count and check if user is member
    const communitiesWithDetails = await Promise.all(
      communities.map(async (community) => {
        const memberCount = community.members?.length || 0
        const isMember = community.members?.some((memberId: ObjectId) => memberId.toString() === user.userId)

        return {
          ...community,
          memberCount,
          isMember,
        }
      }),
    )

    return NextResponse.json({ communities: communitiesWithDetails })
  } catch (error) {
    console.error("Communities fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description } = await request.json()

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("fapfuel")

    const newCommunity = {
      name,
      description,
      members: [new ObjectId(user.userId)],
      createdBy: new ObjectId(user.userId),
      createdAt: new Date(),
      totalFaps: 0,
      averageStreak: 0,
    }

    const result = await db.collection("communities").insertOne(newCommunity)

    return NextResponse.json({ message: "Community created!", communityId: result.insertedId })
  } catch (error) {
    console.error("Community creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
