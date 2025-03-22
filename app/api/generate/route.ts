// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { domain, challenge } = await req.json();

  const prompt = `Lag en realistisk treningscase innenfor domenet "${domain}" med utfordringen "${challenge}".`;

  try {
    const response = await fetch("https://api.perplexity.ai/query", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, // OBS: Ikke NEXT_PUBLIC her!
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: prompt,
        model: "pplx-7b-chat",
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Feil fra Perplexity" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ answer: data.answer || JSON.stringify(data) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Ukjent feil" }, { status: 500 });
  }
}