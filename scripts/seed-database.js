// Database seeding script for FapFuel
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fapfuel"

const roasts = [
  {
    content: "Another one bites the dust. Your willpower is weaker than wet tissue paper. 🤡",
    category: "failure",
  },
  {
    content: "Congratulations! You've just reset your progress. Hope it was worth those 3 seconds of shame. 😂",
    category: "sarcastic",
  },
  {
    content: "Day 0 again? At this point, you're basically a professional failure. Keep practicing! 🎭",
    category: "motivational",
  },
  {
    content: "Your streak lasted longer than most Hollywood marriages... which isn't saying much. 💔",
    category: "comparison",
  },
  {
    content: "Breaking news: Local person discovers they have the self-control of a goldfish. More at 11. 📺",
    category: "news",
  },
  {
    content: "You know what they say - practice makes perfect. You're getting really good at failing! 🏆",
    category: "achievement",
  },
  {
    content: "Your willpower just called in sick. Again. Maybe it needs a vacation? 🏖️",
    category: "personification",
  },
  {
    content: "Achievement unlocked: Master of Self-Sabotage! Your parents would be so proud. 🎖️",
    category: "achievement",
  },
  {
    content: "I've seen stronger resistance from a wet napkin in a hurricane. 🌪️",
    category: "comparison",
  },
  {
    content: "Your self-control has left the chat. It's probably getting therapy now. 💬",
    category: "modern",
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("fapfuel")

    // Clear existing roasts
    await db.collection("roasts").deleteMany({})
    console.log("Cleared existing roasts")

    // Insert new roasts
    const result = await db.collection("roasts").insertMany(roasts)
    console.log(`Inserted ${result.insertedCount} roasts`)

    // Create indexes for better performance
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("fapLogs").createIndex({ userId: 1, timestamp: -1 })
    await db.collection("moods").createIndex({ userId: 1, date: -1 })

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
