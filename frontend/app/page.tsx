"use client"

import { useState } from "react"
import { HandleInput } from "@/components/handle-input"
import { Loader } from "@/components/loader"
import { RatingCard } from "@/components/rating-card"
import { ConfidenceBar } from "@/components/confidence-bar"
import { RatingTrendChart } from "@/components/rating-trend-chart"
import { StatsRow } from "@/components/stats-row"
import { estimateRating, type RatingData } from "@/services/api"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [ratingData, setRatingData] = useState<RatingData | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (handle: string) => {
    setIsLoading(true)
    setError("")
    setRatingData(null)

    try {
      const data = await estimateRating(handle)
      setRatingData(data)
    } catch (err) {
      setError("Failed to fetch rating data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            rank<span className="text-primary">Track</span>
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Codeforces Rating Estimator</p>
        </div>
      </header>

      <section className="py-12 md:py-16 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Estimate your next rating</h2>
        <p className="mt-3 text-muted-foreground text-lg max-w-md mx-auto">
          Enter your Codeforces handle to see your predicted rating change.
        </p>
      </section>

      {/* Input Section */}
      <section className="px-4 pb-8">
        <HandleInput onSubmit={handleSubmit} isLoading={isLoading} />
      </section>

      {/* Loading State */}
      {isLoading && (
        <section className="px-4">
          <Loader />
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="px-4 py-8 text-center">
          <p className="text-destructive">{error}</p>
        </section>
      )}

      {/* Results Section */}
      {ratingData && !isLoading && (
        <section className="px-4 pb-16 max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              Results for <span className="font-medium text-foreground font-mono">{ratingData.handle}</span>
            </p>
          </div>

          <RatingCard
            expectedRating={ratingData.expectedRating}
            ratingChange={ratingData.ratingChange}
            currentRating={ratingData.currentRating}
          />

          <ConfidenceBar confidence={ratingData.confidence} />

          <RatingTrendChart ratingHistory={ratingData.ratingHistory} />

          <StatsRow stats={ratingData.stats} />
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border">
        <p className="text-xs text-muted-foreground max-w-md mx-auto px-4">
          Rating estimates are probabilistic and not guaranteed. Based on recent contest trends and historical
          performance data.
        </p>
      </footer>
    </main>
  )
}
