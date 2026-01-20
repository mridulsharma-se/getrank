interface ConfidenceBarProps {
  confidence: number
}

export function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Confidence Level</h3>
        <span className="text-lg font-bold text-foreground font-mono">{confidence}%</span>
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${confidence}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Based on performance consistency and recent contest participation frequency.
      </p>
    </div>
  )
}
