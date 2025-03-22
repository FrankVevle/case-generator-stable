// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { domain, challenge } = await req.json();

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

    console.log("🧠 Perplexity respons:", JSON.stringify(data, null, 2));

    const content = data.choices?.[0]?.message?.content;

    return NextResponse.json({ answer: content || "Ingen respons fra Perplexity" });
  } catch (error: any) {
    console.error("🛑 Generell feil:", error);
    return NextResponse.json(
      { error: error.message || "Ukjent feil ved henting" },
      { status: 500 }
    );
  }
}