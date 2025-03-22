"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { predefinedKeywords } from "@/lib/predefined-keywords"
import { RefreshCw } from "lucide-react"

interface KeywordSelectorProps {
  category: keyof typeof predefinedKeywords
  onKeywordsChange: (keywords: string[]) => void
  initialKeywords?: string[]
}

export function KeywordSelector({ category, onKeywordsChange, initialKeywords = [] }: KeywordSelectorProps) {
  const [availableKeywords, setAvailableKeywords] = useState<string[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(initialKeywords)

  // Update available keywords when category changes
  useEffect(() => {
    // Get all keywords for the category
    const allKeywords = predefinedKeywords[category]

    // Filter out already selected keywords
    const filtered = allKeywords.filter((keyword) => !selectedKeywords.includes(keyword))

    // Shuffle and take a subset
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    setAvailableKeywords(shuffled.slice(0, 8)) // Show 8 suggestions
  }, [category, selectedKeywords])

  // Update selected keywords when initialKeywords changes
  useEffect(() => {
    setSelectedKeywords(initialKeywords)
  }, [initialKeywords])

  // Toggle keyword selection
  const toggleKeyword = (keyword: string) => {
    let newSelected

    if (selectedKeywords.includes(keyword)) {
      // Remove keyword
      newSelected = selectedKeywords.filter((k) => k !== keyword)
    } else {
      // Add keyword (limit to 5)
      if (selectedKeywords.length < 5) {
        newSelected = [...selectedKeywords, keyword]
      } else {
        return // Don't add more than 5
      }
    }

    setSelectedKeywords(newSelected)
    onKeywordsChange(newSelected)
  }

  // Generate new keyword suggestions
  const refreshKeywords = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling

    const allKeywords = predefinedKeywords[category]
    const filtered = allKeywords.filter((keyword) => !selectedKeywords.includes(keyword))
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    setAvailableKeywords(shuffled.slice(0, 8))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedKeywords.length > 0 ? (
          selectedKeywords.map((keyword) => (
            <Badge
              key={keyword}
              variant="secondary"
              className="px-3 py-1 cursor-pointer bg-black text-white hover:bg-black/80"
              onClick={() => toggleKeyword(keyword)}
            >
              {keyword} ✕
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Ingen nøkkelord valgt. Velg fra forslagene nedenfor.</p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Foreslåtte nøkkelord:</h4>
        <Button variant="ghost" size="sm" onClick={refreshKeywords} className="h-8 px-2" type="button">
          <RefreshCw className="h-4 w-4 mr-1" />
          Nye forslag
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableKeywords.map((keyword) => (
          <Badge
            key={keyword}
            variant="outline"
            className="px-3 py-1 cursor-pointer hover:bg-secondary"
            onClick={() => toggleKeyword(keyword)}
          >
            {keyword}
          </Badge>
        ))}
      </div>

      {selectedKeywords.length >= 5 && (
        <p className="text-xs text-muted-foreground">Maksimalt 5 nøkkelord kan velges.</p>
      )}
    </div>
  )
}

