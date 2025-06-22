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

    const client = await clientPromise
    const db = client.db("fapfuel")

    // Get user data to check eligibility
    const userData = await db.collection("users").findOne({ _id: new ObjectId(user.userId) })
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has fapped enough this month (100+ faps)
    if (userData.fapsThisMonth < 100) {
      return NextResponse.json(
        {
          error: "Bro, grind first. You ain't even fapping enough.",
          fapsThisMonth: userData.fapsThisMonth,
          required: 100,
          eligible: false,
        },
        { status: 403 },
      )
    }

    // Mock Razorpay integration
    const mockPaymentData = {
      orderId: `order_${Date.now()}`,
      amount: 400, // $4 in cents
      currency: "USD",
      key: process.env.RAZORPAY_KEY_ID || "mock_key",
      name: "FapFuel+",
      description: "Premium subscription - $4/month",
      prefill: {
        email: userData.email,
        name: userData.name,
      },
      eligible: true,
    }

    return NextResponse.json(mockPaymentData)
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
