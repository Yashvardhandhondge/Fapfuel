import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"

const defaultRoasts = [
  "Another one bites the dust. Your willpower is weaker than wet tissue paper. 🤡",
  "Congratulations! You've just reset your progress. Hope it was worth those 3 seconds of shame. 😂",
  "Day 0 again? At this point, you're basically a professional failure. Keep practicing! 🎭",
  "Your streak lasted longer than most Hollywood marriages... which isn't saying much. 💔",
  "Breaking news: Local person discovers they have the self-control of a goldfish. More at 11. 📺",
  "You know what they say - practice makes perfect. You're getting really good at failing! 🏆",
  "Your willpower just called in sick. Again. Maybe it needs a vacation? 🏖️",
  "Achievement unlocked: Master of Self-Sabotage! Your parents would be so proud. 🎖️",
]

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("fapfuel")

    // Try to get a random roast from database
    const roasts = await db.collection("roasts").find({}).toArray()

    let selectedRoast
    if (roasts.length > 0) {
      selectedRoast = roasts[Math.floor(Math.random() * roasts.length)].content
    } else {
      // Fallback to default roasts
      selectedRoast = defaultRoasts[Math.floor(Math.random() * defaultRoasts.length)]
    }

    return NextResponse.json({ roast: selectedRoast })
  } catch (error) {
    console.error("Roast fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
