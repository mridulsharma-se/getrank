"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, CartesianGrid } from "recharts"

interface RatingTrendChartProps {
  ratingHistory: {
    contestName: string
    rating: number
    ratingChange: number
    date: string
  }[]
}

export function RatingTrendChart({ ratingHistory }: RatingTrendChartProps) {
  const data = ratingHistory.map((entry, index) => ({
    name: `R${index + 1}`,
    fullName: entry.contestName,
    rating: entry.rating,
    change: entry.ratingChange,
  }))

  const minRating = Math.min(...data.map((d) => d.rating)) - 50
  const maxRating = Math.max(...data.map((d) => d.rating)) + 50

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Rating Trend</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
            <YAxis
              domain={[minRating, maxRating]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                color: "#0F172A",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "#475569", marginBottom: "4px" }}
              formatter={(value: number, name: string, props: { payload?: { change?: number } }) => {
                const change = props.payload?.change ?? 0
                return [
                  <span key="rating" className="font-mono text-foreground">
                    {value} ({change >= 0 ? "+" : ""}
                    {change})
                  </span>,
                  "Rating",
                ]
              }}
              labelFormatter={(label: string, payload: { payload?: { fullName?: string } }[]) => {
                if (payload && payload.length > 0) {
                  return payload[0].payload?.fullName ?? label
                }
                return label
              }}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ fill: "#2563EB", strokeWidth: 0, r: 4 }}
              activeDot={{ fill: "#2563EB", strokeWidth: 2, stroke: "#FFFFFF", r: 6 }}
            />
            <ReferenceDot
              x={data[data.length - 1]?.name}
              y={data[data.length - 1]?.rating}
              r={8}
              fill="#2563EB"
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs text-muted-foreground text-center">
        Last {ratingHistory.length} contests · Most recent highlighted
      </p>
    </div>
  )
}
