"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MainCategory } from "@/lib/types"

export function DomainSelector() {
  const router = useRouter()
  const [selectedDomain, setSelectedDomain] = useState<MainCategory | null>(null)

  const domains: { id: MainCategory; name: string; description: string; icon: string }[] = [
    {
      id: "helse",
      name: "Helse",
      description: "Case-studier for helsepersonell og helsetjenester",
      icon: "/images/helse-icon.svg",
    },
    {
      id: "barnevern",
      name: "Barnevern",
      description: "Case-studier for barnevernstjenesten",
      icon: "/images/barnevern-icon.svg",
    },
    {
      id: "politi",
      name: "Politi",
      description: "Case-studier for politiet og rettsvesen",
      icon: "/images/politi-icon.svg",
    },
    {
      id: "forsvaret",
      name: "Forsvaret",
      description: "Case-studier for militært personell",
      icon: "/images/forsvaret-icon.svg",
    },
    {
      id: "nav",
      name: "NAV",
      description: "Case-studier for NAV og velferdstjenester",
      icon: "/images/nav-icon.svg",
    },
  ]

  function handleContinue() {
    if (selectedDomain) {
      router.push(`/scenarios?domain=${selectedDomain}`)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Velg fagområde</h2>
        <p className="text-muted-foreground">Velg det fagområdet du ønsker å generere case-studier for</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {domains.map((domain) => (
          <Card
            key={domain.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedDomain === domain.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedDomain(domain.id)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-4 flex items-center justify-center">
                <Image
                  src={domain.icon || "/placeholder.svg"}
                  alt={domain.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h3 className="font-medium text-lg mb-1">{domain.name}</h3>
              <p className="text-sm text-muted-foreground">{domain.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleContinue}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg"
          disabled={!selectedDomain}
        >
          Fortsett
        </Button>
      </div>
    </div>
  )
}

