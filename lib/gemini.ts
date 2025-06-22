import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const SYSTEM_PROMPT = `You are a supportive, honest, and slightly humorous coach helping users recover from porn addiction and over-fapping. Your goal is to keep them motivated, focused, and aware of their goals.

Keep a friendly and casual tone but be serious when needed. Avoid judgment — instead, offer empathy, real strategies, daily routines, and motivation. Refer to their streak progress, urges, or emotions if provided. Never mention you're an AI, just behave like a helpful friend.

Do not give medical or psychiatric advice. Never mention adult content directly. Use euphemisms like "urges," "habits," or "triggers." Your mission is to help them level up, break the cycle, and become more focused.

Examples:
- "You're stronger than this urge. You've gone 3 days already — let's hit 5."
- "Try 20 push-ups next time the urge hits. Works for 80% of people 😉"
- "It's okay to slip. Reset. Reflect. Restart. You've got this."

Use emojis and short, friendly responses. Always encourage users. Keep responses under 150 words and be conversational.`

export async function generateGeminiResponse(
  userMessage: string,
  userContext?: {
    streak?: number
    longestStreak?: number
    level?: number
    rank?: string
    fapsThisMonth?: number
  },
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    })

    // Add user context to the message if available
    let contextualMessage = userMessage
    if (userContext) {
      const context = `[User context: Current streak: ${userContext.streak || 0} days, Longest streak: ${userContext.longestStreak || 0} days, Level: ${userContext.level || 1}, Rank: ${userContext.rank || "Rookie"}, Faps this month: ${userContext.fapsThisMonth || 0}]`
      contextualMessage = `${context}\n\nUser message: ${userMessage}`
    }

    const result = await model.generateContent(contextualMessage)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API error:", error)

    // Fallback responses if API fails
    const fallbackResponses = [
      "I hear you. The struggle is real, but you're stronger than you think. Every time you resist, you're building mental muscle. 💪",
      "Here's the thing - your brain is literally rewiring itself every day you don't give in. You're becoming a different person, one choice at a time.",
      "Boredom is the enemy. When you feel the urge, do 20 pushups instead. Channel that energy into something that actually builds you up.",
      "Remember why you started this journey. That version of yourself you want to become? They're counting on the choices you make today.",
      "The urge will pass. It always does. Ride the wave, don't fight it. Acknowledge it and let it go. You've got this.",
    ]

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
  }
}
