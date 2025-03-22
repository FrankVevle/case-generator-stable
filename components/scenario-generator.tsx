"use client"

import { useEffect, useState } from "react"
import { ScenarioCard } from "./scenario-card"
import { getRandomScenario } from "@/lib/predefined-scenarios"

export function ScenarioGenerator() {
  const [isLoading, setIsLoading] = useState(true)
  const [scenarios, setScenarios] = useState({
    person: getRandomScenario("person"),
    challenge: getRandomScenario("challenge"),
    outcome: getRandomScenario("outcome"),
  })

  useEffect(() => {
    // Initialize with random scenarios
    setScenarios({
      person: getRandomScenario("person"),
      challenge: getRandomScenario("challenge"),
      outcome: getRandomScenario("outcome"),
    })
    setIsLoading(false)
  }, [])

  const handleDescriptionChange = (category: keyof typeof scenarios, description: string) => {
    setScenarios((prev) => ({
      ...prev,
      [category]: description,
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ScenarioCard
        initialTitle="En person med..."
        initialDescription={scenarios.person}
        imagePath="/images/person.svg"
        color="bg-teal"
        category="person"
        onDescriptionChange={(desc) => handleDescriptionChange("person", desc)}
      />
      <ScenarioCard
        initialTitle="utsettes for..."
        initialDescription={scenarios.challenge}
        imagePath="/images/challenge.svg"
        color="bg-charcoal"
        category="challenge"
        onDescriptionChange={(desc) => handleDescriptionChange("challenge", desc)}
      />
      <ScenarioCard
        initialTitle="og..."
        initialDescription={scenarios.outcome}
        imagePath="/images/outcome.svg"
        color="bg-teal"
        category="outcome"
        onDescriptionChange={(desc) => handleDescriptionChange("outcome", desc)}
      />
    </div>
  )
}

