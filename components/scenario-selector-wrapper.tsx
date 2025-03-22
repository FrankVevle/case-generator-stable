"use client"

import { useSearchParams } from "next/navigation"
import { ScenarioSelector } from "./scenario-selector"
import type { MainCategory } from "@/lib/types"

export function ScenarioSelectorWrapper() {
  const searchParams = useSearchParams()
  const domain = (searchParams.get("domain") as MainCategory) || "helse"

  return <ScenarioSelector domain={domain} />
}

