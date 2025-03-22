"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScenarioCard } from "./scenario-card"
import { getRandomScenario } from "@/lib/predefined-scenarios"
import type { MainCategory } from "@/lib/types"

interface ScenarioSelectorProps {
  domain: MainCategory
}

export function ScenarioSelector({ domain }: ScenarioSelectorProps) {
  const router = useRouter()
  const [selectedScenarios, setSelectedScenarios] = useState({
    person: "",
    challenge: "",
    outcome: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [scenarios, setScenarios] = useState({
    person: getRandomScenario("person", domain),
    challenge: getRandomScenario("challenge", domain),
    outcome: getRandomScenario("outcome", domain),
  })

  useEffect(() => {
    // Initialize with random scenarios for the selected domain
    setScenarios({
      person: getRandomScenario("person", domain),
      challenge: getRandomScenario("challenge", domain),
      outcome: getRandomScenario("outcome", domain),
    })
    setIsLoading(false)
  }, [domain])

  function toggleScenario(category: "person" | "challenge" | "outcome", description: string) {
    setSelectedScenarios((prev) => ({
      ...prev,
      [category]: prev[category] === description ? "" : description,
    }))
  }

  function handleGenerateCase() {
    const params = new URLSearchParams()

    params.append("domain", domain)

    if (selectedScenarios.person) {
      params.append("person", selectedScenarios.person)
    }

    if (selectedScenarios.challenge) {
      params.append("challenge", selectedScenarios.challenge)
    }

    if (selectedScenarios.outcome) {
      params.append("outcome", selectedScenarios.outcome)
    }

    router.push(`/generate?${params.toString()}`)
  }

  const handleDescriptionChange = (category: keyof typeof scenarios, description: string) => {
    setScenarios((prev) => ({
      ...prev,
      [category]: description,
    }))

    // If this category was selected, update the selection with the new description
    if (selectedScenarios[category]) {
      setSelectedScenarios((prev) => ({
        ...prev,
        [category]: description,
      }))
    }
  }

  // Get domain-specific colors and images
  const getDomainStyles = (category: "person" | "challenge" | "outcome") => {
    const styles: Record<MainCategory, { color: string; image: string }> = {
      helse: {
        color: category === "challenge" ? "bg-charcoal" : "bg-teal",
        image: `/images/helse-${category}.svg`,
      },
      barnevern: {
        color: category === "challenge" ? "bg-charcoal" : "bg-teal",
        image: `/images/barnevern-${category}.svg`,
      },
      politi: {
        color: category === "challenge" ? "bg-charcoal" : "bg-teal",
        image: `/images/politi-${category}.svg`,
      },
      forsvaret: {
        color: category === "challenge" ? "bg-amber-600" : "bg-teal",
        image: `/images/forsvaret-${category}.svg`,
      },
      nav: {
        color: category === "challenge" ? "bg-sky-600" : "bg-teal",
        image: `/images/nav-${category}.svg`,
      },
    }

    return styles[domain]
  }

  return (
    <div className="space-y-8">
      <div className="bg-muted p-4 rounded-md mb-6">
        <p className="font-medium">
          Valgt fagområde: <span className="font-bold capitalize">{domain}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Klikk på kortene for å generere nye scenarier. Velg de du vil inkludere i din case-studie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`relative ${selectedScenarios.person ? "ring-2 ring-primary rounded-lg" : ""}`}
          onClick={() => toggleScenario("person", scenarios.person)}
        >
          <ScenarioCard
            initialTitle="En person med..."
            initialDescription={scenarios.person}
            imagePath={getDomainStyles("person").image}
            color={getDomainStyles("person").color}
            category="person"
            domain={domain}
            onDescriptionChange={(desc) => handleDescriptionChange("person", desc)}
          />
          {selectedScenarios.person && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              ✓
            </div>
          )}
        </div>

        <div
          className={`relative ${selectedScenarios.challenge ? "ring-2 ring-primary rounded-lg" : ""}`}
          onClick={() => toggleScenario("challenge", scenarios.challenge)}
        >
          <ScenarioCard
            initialTitle="utsettes for..."
            initialDescription={scenarios.challenge}
            imagePath={getDomainStyles("challenge").image}
            color={getDomainStyles("challenge").color}
            category="challenge"
            domain={domain}
            onDescriptionChange={(desc) => handleDescriptionChange("challenge", desc)}
          />
          {selectedScenarios.challenge && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              ✓
            </div>
          )}
        </div>

        <div
          className={`relative ${selectedScenarios.outcome ? "ring-2 ring-primary rounded-lg" : ""}`}
          onClick={() => toggleScenario("outcome", scenarios.outcome)}
        >
          <ScenarioCard
            initialTitle="og..."
            initialDescription={scenarios.outcome}
            imagePath={getDomainStyles("outcome").image}
            color={getDomainStyles("outcome").color}
            category="outcome"
            domain={domain}
            onDescriptionChange={(desc) => handleDescriptionChange("outcome", desc)}
          />
          {selectedScenarios.outcome && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              ✓
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleGenerateCase}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg"
        >
          Generer en treningscase
        </Button>
      </div>
    </div>
  )
}

