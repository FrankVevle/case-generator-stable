"use client"
import { Card, CardContent } from "@/components/ui/card"
import type { MainCategory } from "@/lib/types"

interface CategorySelectorProps {
  selectedCategory: MainCategory
  onCategoryChange: (category: MainCategory) => void
}

export function CategorySelector({ selectedCategory, onCategoryChange }: CategorySelectorProps) {
  const categories: { id: MainCategory; name: string; description: string }[] = [
    {
      id: "helse",
      name: "Helse",
      description: "Case-studier for helsepersonell og helsetjenester",
    },
    {
      id: "barnevern",
      name: "Barnevern",
      description: "Case-studier for barnevernstjenesten",
    },
    {
      id: "politi",
      name: "Politi",
      description: "Case-studier for politiet og rettsvesen",
    },
    {
      id: "forsvaret",
      name: "Forsvaret",
      description: "Case-studier for militært personell",
    },
    {
      id: "nav",
      name: "NAV",
      description: "Case-studier for NAV og velferdstjenester",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Velg fagområde</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCategory === category.id ? "ring-2 ring-black" : ""
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <CardContent className="p-4 text-center">
              <h3 className="font-medium text-lg">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

