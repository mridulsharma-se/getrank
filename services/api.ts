export interface RatingData {
  handle: string
  currentRating: number
  expectedRating: number
  ratingChange: number
  confidence: number
  ratingHistory: {
    contestName: string
    rating: number
    ratingChange: number
    date: string
  }[]
  stats: {
    avgChange: number
    bestGain: number
    worstDrop: number
    consistency: number
  }
}

// Mock data for demonstration
const mockRatingData: Record<string, RatingData> = {
  tourist: {
    handle: "tourist",
    currentRating: 3798,
    expectedRating: 3812,
    ratingChange: 14,
    confidence: 85,
    ratingHistory: [
      { contestName: "Codeforces Round #920", rating: 3756, ratingChange: -12, date: "2024-01-15" },
      { contestName: "Codeforces Round #921", rating: 3780, ratingChange: 24, date: "2024-01-22" },
      { contestName: "Codeforces Round #922", rating: 3768, ratingChange: -12, date: "2024-01-29" },
      { contestName: "Codeforces Round #923", rating: 3792, ratingChange: 24, date: "2024-02-05" },
      { contestName: "Codeforces Round #924", rating: 3798, ratingChange: 6, date: "2024-02-12" },
    ],
    stats: {
      avgChange: 6,
      bestGain: 24,
      worstDrop: -12,
      consistency: 78,
    },
  },
}

function generateMockData(handle: string): RatingData {
  const baseRating = 1200 + Math.floor(Math.random() * 1500)
  const change = Math.floor(Math.random() * 100) - 30

  const history = []
  let currentRating = baseRating - 200

  for (let i = 0; i < 5; i++) {
    const ratingChange = Math.floor(Math.random() * 80) - 30
    currentRating += ratingChange
    history.push({
      contestName: `Codeforces Round #${920 + i}`,
      rating: currentRating,
      ratingChange,
      date: `2024-0${1 + Math.floor(i / 2)}-${10 + (i % 2) * 7}`,
    })
  }

  const changes = history.map((h) => h.ratingChange)

  return {
    handle,
    currentRating: history[history.length - 1].rating,
    expectedRating: history[history.length - 1].rating + change,
    ratingChange: change,
    confidence: 50 + Math.floor(Math.random() * 40),
    ratingHistory: history,
    stats: {
      avgChange: Math.round(changes.reduce((a, b) => a + b, 0) / changes.length),
      bestGain: Math.max(...changes),
      worstDrop: Math.min(...changes),
      consistency: 50 + Math.floor(Math.random() * 40),
    },
  }
}

export async function estimateRating(handle: string): Promise<RatingData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const lowerHandle = handle.toLowerCase()

  if (mockRatingData[lowerHandle]) {
    return mockRatingData[lowerHandle]
  }

  return generateMockData(handle)
}
