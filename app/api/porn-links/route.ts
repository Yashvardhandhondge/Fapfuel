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

    const pornLinks = await db
      .collection("pornLinks")
      .find({ userId: new ObjectId(user.userId) })
      .sort({ firstVisited: -1 })
      .toArray()

    const totalClicks = pornLinks.reduce((sum, link) => sum + link.clicks, 0)
    const totalLinks = pornLinks.length
    const thisMonth = new Date()
    thisMonth.setDate(1)

    const monthlyClicks = pornLinks.reduce((sum, link) => {
      const monthlyTimestamps = link.timestamps.filter((timestamp: Date) => timestamp >= thisMonth)
      return sum + monthlyTimestamps.length
    }, 0)

    return NextResponse.json({
      links: pornLinks,
      stats: {
        totalClicks,
        totalLinks,
        monthlyClicks,
        shameLevel:
          monthlyClicks > 100
            ? "Danger Zone"
            : monthlyClicks > 50
              ? "High Risk"
              : monthlyClicks > 20
                ? "Moderate"
                : "Low",
      },
    })
  } catch (error) {
    console.error("Porn links fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url, title } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("fapfuel")

    // Check if link already exists
    const existingLink = await db.collection("pornLinks").findOne({
      userId: new ObjectId(user.userId),
      url,
    })

    if (existingLink) {
      // Increment click count
      await db.collection("pornLinks").updateOne(
        { _id: existingLink._id },
        {
          $inc: { clicks: 1 },
          $push: { timestamps: new Date() },
        },
      )
    } else {
      // Create new link entry
      await db.collection("pornLinks").insertOne({
        userId: new ObjectId(user.userId),
        url,
        title: title || "Untitled",
        clicks: 1,
        timestamps: [new Date()],
        firstVisited: new Date(),
      })
    }

    return NextResponse.json({ message: "Link tracked successfully" })
  } catch (error) {
    console.error("Porn link tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
