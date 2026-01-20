"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

interface HandleInputProps {
  onSubmit: (handle: string) => void
  isLoading: boolean
}

export function HandleInput({ onSubmit, isLoading }: HandleInputProps) {
  const [handle, setHandle] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!handle.trim()) {
      setError("Please enter a Codeforces handle")
      return
    }

    if (handle.length < 3) {
      setError("Handle must be at least 3 characters")
      return
    }

    setError("")
    onSubmit(handle.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={handle}
          onChange={(e) => {
            setHandle(e.target.value)
            if (error) setError("")
          }}
          placeholder="Enter your Codeforces handle"
          disabled={isLoading}
          className="w-full px-5 py-4 pr-36 text-lg bg-card border border-border rounded-xl 
                     text-foreground placeholder:text-muted-foreground shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 
                     bg-primary text-primary-foreground font-medium rounded-lg
                     hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>Estimate</span>
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-destructive text-center">{error}</p>}
    </form>
  )
}
