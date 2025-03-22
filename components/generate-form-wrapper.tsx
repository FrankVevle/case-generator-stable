"use client"

import { useSearchParams } from "next/navigation"
import { GenerateForm } from "./generate-form"
import type { MainCategory } from "@/lib/types"

export function GenerateFormWrapper() {
  const searchParams = useSearchParams()

  const domain = (searchParams.get("domain") as MainCategory) || "helse"
  const personScenario = searchParams.get("person") || ""
  const challengeScenario = searchParams.get("challenge") || ""
  const outcomeScenario = searchParams.get("outcome") || ""

  return (
    <GenerateForm
      personScenario={personScenario}
      challengeScenario={challengeScenario}
      outcomeScenario={outcomeScenario}
      mainCategory={domain}
    />
  )
}

