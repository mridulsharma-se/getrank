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

interface CodeforcesRatingChange {
  contestId: number
  contestName: string
  handle: string
  rank: number
  ratingUpdateTimeSeconds: number
  oldRating: number
  newRating: number
}

interface HealthCheckResponse {
  status: 'ok' | 'error'
  model_loaded: boolean
  message: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const CODEFORCES_API = "https://codeforces.com/api"

/**
 * Check if backend API is healthy and model is loaded
 */
export async function checkBackendHealth(): Promise<HealthCheckResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health/`)
    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`)
    }
    const data = await response.json()
    return data as HealthCheckResponse
  } catch (error) {
    console.error("Error checking backend health:", error)
    throw new Error("Backend API is not reachable. Make sure Django server is running on port 8000.")
  }
}

/**
 * Fetch user's recent contests from Codeforces API
 */
async function fetchCodeforcesRatingHistory(handle: string): Promise<CodeforcesRatingChange[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/codeforces/ratingHistory/?handle=${handle}`)
    
    if (!response.ok) {
      throw new Error("Failed to fetch Codeforces data")
    }
    const data = await response.json()
    if (!data.result) {
      throw new Error("Invalid Codeforces response")
    }
    // Get last 5 contests
    return data.result.slice(-5)
  } catch (error) {
    console.error("Error fetching Codeforces data:", error)
    throw error
  }
}
/**
 * Fetch user's current rating from Codeforces API
 */
async function fetchCurrentRating(handle: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/codeforces/userInfo/?handles=${handle}`)

    if (!response.ok) {
      throw new Error("Failed to fetch user info")
    }
    const data = await response.json()
    if (!data.result || data.result.length === 0) {
      throw new Error("User not found on Codeforces")
    }
    return data.result[0].rating || 0
  } catch (error) {
    console.error("Error fetching user info:", error)
    throw error
  }
}

/**
 * Get prediction from Django backend
 */
async function getPrediction(
  features: Record<string, number>
): Promise<{ predicted_rating_delta: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(features),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Backend error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error getting prediction:", error)
    throw error
  }
}

/**
 * Main function: Estimate rating change for a Codeforces user
 * 
 * Fetches user data from Codeforces, calculates statistics,
 * and uses ML model to predict next rating change
 */
export async function estimateRating(handle: string): Promise<RatingData> {
  try {
    // Validate input
    if (!handle || handle.trim().length === 0) {
      throw new Error("Handle cannot be empty")
    }

    if (handle.length > 32) {
      throw new Error("Handle must be 32 characters or less")
    }

    // Fetch current rating and history from Codeforces
    console.log(`Fetching data for handle: ${handle}`)
    const [currentRating, ratingHistory] = await Promise.all([
      fetchCurrentRating(handle),
      fetchCodeforcesRatingHistory(handle),
    ])

    // Validate that we have enough contest data
    if (ratingHistory.length === 0) {
      throw new Error("No contest history found for this user")
    }

    // Calculate statistics from rating history
    const ratingChanges = ratingHistory.map((r) => r.newRating - r.oldRating)
    const avgChange = Math.round(ratingChanges.reduce((a, b) => a + b, 0) / ratingChanges.length)
    const bestGain = Math.max(...ratingChanges)
    const worstDrop = Math.min(...ratingChanges)

    // Calculate consistency (inverse of variance)
    const mean = avgChange
    const variance = ratingChanges.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / ratingChanges.length
    const stdDev = Math.sqrt(variance)
    const consistency = Math.max(0, Math.min(100, 100 - stdDev))

    // Prepare features for model prediction
    const features = {
      avg_rating_delta: avgChange,
      best_gain: bestGain,
      worst_loss: Math.abs(worstDrop),
      num_contests: ratingHistory.length,
      recent_trend: ratingChanges.slice(-2).reduce((a, b) => a + b, 0) / 2,
    }

    console.log("Features prepared:", features)

    // Get prediction from backend
    let predictedRatingDelta = avgChange
    try {
      const prediction = await getPrediction(features)
      predictedRatingDelta = Math.round(prediction.predicted_rating_delta)
      console.log("✅ Backend prediction:", predictedRatingDelta)
    } catch (backendError) {
      // If backend prediction fails, use average change as fallback
      console.warn("⚠️ Backend prediction failed, using average change as fallback")
      predictedRatingDelta = avgChange
    }

    // Format rating history for display
    const formattedHistory = ratingHistory.map((r) => ({
      contestName: r.contestName,
      rating: r.newRating,
      ratingChange: r.newRating - r.oldRating,
      date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().split("T")[0],
    }))

    return {
      handle,
      currentRating,
      expectedRating: Math.round(currentRating + predictedRatingDelta),
      ratingChange: predictedRatingDelta,
      confidence: Math.min(95, Math.max(40, Math.round(consistency))),
      ratingHistory: formattedHistory,
      stats: {
        avgChange,
        bestGain,
        worstDrop,
        consistency: Math.round(consistency),
      },
    }
  } catch (error) {
    throw new Error(`Failed to estimate rating: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
