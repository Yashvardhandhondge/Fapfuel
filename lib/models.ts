import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  streak: number
  longestStreak: number
  coins: number
  xp: number
  level: number
  rank: string
  isPremium: boolean
  avatar?: string
  createdAt: Date
  lastFapDate?: Date
  fapsThisMonth: number
  eligibleForPremium: boolean
  geminiMessagesToday: number
  lastGeminiReset: Date
}

export interface FapLog {
  _id?: ObjectId
  userId: ObjectId
  timestamp: Date
  mood?: string
  trigger?: string[]
}

export interface Mood {
  _id?: ObjectId
  userId: ObjectId
  date: string
  mood: string
}

export interface Roast {
  _id?: ObjectId
  content: string
  category: string
}

export interface Quest {
  _id?: ObjectId
  title: string
  description: string
  xp: number
  type: string
  target: number
  active: boolean
  createdAt: Date
}

export interface UserQuest {
  _id?: ObjectId
  userId: ObjectId
  questId: ObjectId
  progress: number
  completed: boolean
  completedAt?: Date
  claimed: boolean
}

export interface Community {
  _id?: ObjectId
  name: string
  description: string
  members: ObjectId[]
  createdBy: ObjectId
  createdAt: Date
  totalFaps: number
  averageStreak: number
}

export interface CommunityPost {
  _id?: ObjectId
  communityId: ObjectId
  userId: ObjectId
  userName: string
  content: string
  timestamp: Date
  likes: number
}

export interface PornLink {
  _id?: ObjectId
  userId: ObjectId
  url: string
  title?: string
  clicks: number
  timestamps: Date[]
  firstVisited: Date
}

export interface GeminiMessage {
  _id?: ObjectId
  userId: ObjectId
  message: string
  response: string
  timestamp: Date
}
