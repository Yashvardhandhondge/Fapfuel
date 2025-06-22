// Quest seeding script for FapFuel
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fapfuel"

const quests = [
  {
    title: "First Steps",
    description: "Log your first fap to start tracking",
    xp: 50,
    type: "fap",
    target: 1,
    active: true,
    createdAt: new Date(),
  },
  {
    title: "Honest Tracker",
    description: "Log 5 faps to understand your patterns",
    xp: 100,
    type: "fap",
    target: 5,
    active: true,
    createdAt: new Date(),
  },
  {
    title: "Mood Master",
    description: "Log your mood 3 times",
    xp: 75,
    type: "mood",
    target: 3,
    active: true,
    createdAt: new Date(),
  },
  {
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    xp: 200,
    type: "streak",
    target: 7,
    active: true,
    createdAt: new Date(),
  },
  {
    title: "Consistency King",
    description: "Log 10 faps (for science)",
    xp: 150,
    type: "fap",
    target: 10,
    active: true,
    createdAt: new Date(),
  },
  {
    title: "Emotional Intelligence",
    description: "Track your mood for 7 days",
    xp: 125,
    type: "mood",
    target: 7,
    active: true,
    createdAt: new Date(),
  },
  {
    title: "Two Week Legend",
    description: "Achieve a 14-day streak",
    xp: 300,
    type: "streak",
    target: 14,
    active: true,
    createdAt: new Date(),
  },
  {
    title: "Data Collector",
    description: "Log 25 faps for comprehensive analysis",
    xp: 250,
    type: "fap",
    target: 25,
    active: true,
    createdAt: new Date(),
  },
]

async function seedQuests() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("fapfuel")

    // Clear existing quests
    await db.collection("quests").deleteMany({})
    console.log("Cleared existing quests")

    // Insert new quests
    const result = await db.collection("quests").insertMany(quests)
    console.log(`Inserted ${result.insertedCount} quests`)

    // Create additional indexes
    await db.collection("userQuests").createIndex({ userId: 1, questId: 1 }, { unique: true })
    await db.collection("pornLinks").createIndex({ userId: 1, url: 1 }, { unique: true })
    await db.collection("geminiMessages").createIndex({ userId: 1, timestamp: -1 })
    await db.collection("communities").createIndex({ name: 1 }, { unique: true })

    console.log("Quest database seeded successfully!")
  } catch (error) {
    console.error("Error seeding quests:", error)
  } finally {
    await client.close()
  }
}

seedQuests()
