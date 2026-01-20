import { TrendingUp, TrendingDown } from "lucide-react"

interface RatingCardProps {
  expectedRating: number
  ratingChange: number
  currentRating: number
}

export function RatingCard({ expectedRating, ratingChange, currentRating }: RatingCardProps) {
  const isPositive = ratingChange >= 0

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Estimated Rating Outcome</h3>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Expected Rating</p>
          <p className="text-4xl font-bold text-foreground font-mono">{expectedRating}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground mb-1">Estimated Change</p>
          <div className={`flex items-center gap-2 justify-end ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <span className="text-3xl font-bold font-mono">
              {isPositive ? "+" : ""}
              {ratingChange}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Current rating: <span className="font-mono font-medium text-foreground">{currentRating}</span>
          {" · "}Estimated from recent contest trends and historical performance.
        </p>
      </div>
    </div>
  )
}
