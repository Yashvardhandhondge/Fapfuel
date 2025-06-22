import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("fapfuel")

    const communityId = new ObjectId(params.id)
    const userId = new ObjectId(user.userId)

    // Check if already a member
    const community = await db.collection("communities").findOne({ _id: communityId })
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 })
    }

    const isMember = community.members?.some((memberId: ObjectId) => memberId.toString() === user.userId)
    if (isMember) {
      return NextResponse.json({ error: "Already a member" }, { status: 400 })
    }

    // Add user to community
    await db.collection("communities").updateOne({ _id: communityId }, { $push: { members: userId } })

    return NextResponse.json({ message: "Joined community successfully!" })
  } catch (error) {
    console.error("Join community error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
