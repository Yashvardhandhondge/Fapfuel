import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"
import type { User } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("fapfuel")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const hashedPassword = await hashPassword(password)
    const newUser: Omit<User, "_id"> = {
      email,
      password: hashedPassword,
      name,
      streak: 0,
      longestStreak: 0,
      coins: 0,
      isPremium: false,
      createdAt: new Date(),
    }

    const result = await db.collection("users").insertOne(newUser)
    const token = generateToken(result.insertedId.toString())

    const response = NextResponse.json({
      message: "User created successfully",
      user: { id: result.insertedId, email, name },
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
