"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getRandomScenario } from "@/lib/predefined-scenarios"
import type { MainCategory } from "@/lib/types"
import { useTheme } from "next-themes"

interface ScenarioCardProps {
  initialTitle: string
  initialDescription: string
  imagePath: string
  color: string
  category: "person" | "challenge" | "outcome"
  domain: MainCategory
  onDescriptionChange?: (description: string) => void
}

export function ScenarioCard({
  initialTitle,
  initialDescription,
  imagePath,
  color,
  category,
  domain,
  onDescriptionChange,
}: ScenarioCardProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  async function generateNewScenario() {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/scenarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          domain,
          currentDescription: description,
        }),
      })

      if (!response.ok) {
        throw new Error("Kunne ikke generere nytt scenario")
      }

      const data = await response.json()
      setDescription(data.description)
      if (onDescriptionChange) {
        onDescriptionChange(data.description)
      }
    } catch (error) {
      console.error("Error generating scenario:", error)

      // Fallback to local generation in case of API error
      const newDescription = getRandomScenario(category, domain, description)
      setDescription(newDescription)
      if (onDescriptionChange) {
        onDescriptionChange(newDescription)
      }

      toast({
        title: "Merknad",
        description: "Bruker forhåndsdefinerte scenarier på grunn av API-begrensninger.",
        variant: "default",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      className="overflow-hidden border shadow-sm h-full cursor-pointer transition-all hover:shadow-md"
      onClick={generateNewScenario}
    >
      <CardContent className="p-6 flex flex-col items-center">
        <div
          className={`w-32 h-32 ${color} rounded-md mb-4 flex items-center justify-center relative ${isDark ? "p-1 bg-gray-700" : ""}`}
        >
          {isLoading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <Image
              src={imagePath || "/placeholder.svg"}
              alt={title}
              width={100}
              height={100}
              className="object-contain"
            />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-medium">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

