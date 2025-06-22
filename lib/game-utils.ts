export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1
}

export function calculateRank(level: number, streak: number): string {
  if (level >= 50 && streak >= 100) return "NoNut God"
  if (level >= 30 && streak >= 50) return "Diamond"
  if (level >= 20 && streak >= 30) return "Platinum"
  if (level >= 15 && streak >= 14) return "Gold"
  if (level >= 10 && streak >= 7) return "Silver"
  if (level >= 5 && streak >= 3) return "Bronze"
  return "Rookie"
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  return currentLevel * 100
}

export function getRankColor(rank: string): string {
  switch (rank) {
    case "NoNut God":
      return "from-purple-500 to-pink-500"
    case "Diamond":
      return "from-blue-400 to-cyan-400"
    case "Platinum":
      return "from-gray-300 to-gray-500"
    case "Gold":
      return "from-yellow-400 to-yellow-600"
    case "Silver":
      return "from-gray-400 to-gray-600"
    case "Bronze":
      return "from-orange-400 to-orange-600"
    default:
      return "from-gray-600 to-gray-800"
  }
}
