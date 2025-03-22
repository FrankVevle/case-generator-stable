// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { domain, complexity, keywords, additionalInfo } = await req.json()

  const prompt = `
Lag en realistisk treningscase innen fagområdet "${domain}" med kompleksitet "${complexity}".
Nøkkelord: ${keywords.join(", ")}
${additionalInfo ? `Tilleggsinfo: ${additionalInfo}` : ""}
Format:
1. Tittel
2. Kort beskrivelse
3. Detaljert case
4. Refleksjonsspørsmål
Svar kun med ren tekst, uten formatering.
  `.trim()

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content

    return NextResponse.json({
      domain,
      complexity,
      keywords,
      additionalInfo,
      prompt,
      answer,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Klarte ikke å generere fra Perplexity", details: error.message },
      { status: 500 }
    )
  }
}