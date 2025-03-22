// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { domain, challenge } = await req.json();

    if (!domain || !challenge) {
      return NextResponse.json(
        { error: "Manglende domain eller challenge" },
        { status: 400 }
      );
    }

    const prompt = `Lag en realistisk treningscase innenfor domenet "${domain}" med utfordringen "${challenge}".`;

    const response = await fetch("https://api.perplexity.ai/query", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: prompt,
        model: "pplx-7b-chat",
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json(
        { error: `Feil fra Perplexity: ${response.status} - ${errorBody}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ answer: data.answer || JSON.stringify(data) });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Ukjent feil" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      error: "GET er ikke støttet for denne endepunktet. Bruk POST.",
    },
    { status: 405 }
  );
}