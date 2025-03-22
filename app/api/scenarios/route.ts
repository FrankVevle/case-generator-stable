import { type NextRequest, NextResponse } from "next/server"
import { getRandomScenario } from "@/lib/predefined-scenarios"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, domain, currentDescription } = body

    // Validate inputs
    if (!category) {
      return NextResponse.json({ error: "Manglende kategori" }, { status: 400 })
    }

    if (!domain) {
      return NextResponse.json({ error: "Manglende fagområde" }, { status: 400 })
    }

    // Use predefined scenarios instead of OpenAI API
    const description = getRandomScenario(category, domain, currentDescription)

    return NextResponse.json({ description })
  } catch (error) {
    console.error("Error generating scenario:", error)

    // Fallback to predefined scenarios in case of error
    if (typeof body !== "undefined" && body?.category && body?.domain) {
      const description = getRandomScenario(body.category, body.domain, body.currentDescription)
      return NextResponse.json({ description })
    }

    return NextResponse.json({ error: "Kunne ikke generere scenario" }, { status: 500 })
  }
}

