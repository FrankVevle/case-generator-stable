// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { domain, challenge } = await req.json();

  if (!domain || !challenge) {
    return NextResponse.json(
      { error: "Mangler 'domain' eller 'challenge'" },
      { status: 400 }
    );
  }

  const prompt = `Lag en realistisk treningscase innenfor domenet "${domain}" med utfordringen "${challenge}".`;

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-7b-instruct",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Feilstatus fra Perplexity:", response.status);
      return NextResponse.json(
        { error: "Feil fra Perplexity API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("✅ Perplexity svar:", JSON.stringify(content, null, 2));

    return NextResponse.json({
      domain,
      challenge,
      prompt,
      answer: content || "Ingen respons fra Perplexity",
    });
  } catch (error: any) {
    console.error("🛑 Generell feil:", error);
    return NextResponse.json(
      { error: error.message || "Ukjent feil ved henting" },
      { status: 500 }
    );
  }
}