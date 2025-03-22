"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function GenerateClient() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const challenge = searchParams.get("challenge");

  const [caseText, setCaseText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      if (!domain || !challenge) return;

      setLoading(true);
      setError(null);

      try {
        const prompt = `Lag en realistisk treningscase innenfor domenet "${domain}" med utfordringen "${challenge}".`;

        const response = await fetch("https://api.perplexity.ai/query", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: prompt,
            model: "pplx-7b-chat",
          }),
        });

        const data = await response.json();
        setCaseText(data.answer || JSON.stringify(data, null, 2));
      } catch (err: any) {
        setError(err.message || "Ukjent feil");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [domain, challenge]);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Generert treningscase</h1>
      {domain && <p><strong>Domenefelt:</strong> {domain}</p>}
      {challenge && <p><strong>Utfordring:</strong> {challenge}</p>}

      {loading && <p>Laster case...</p>}
      {error && <p style={{ color: "red" }}>Feil: {error}</p>}
      {caseText && (
        <div style={{ marginTop: "2rem", whiteSpace: "pre-wrap" }}>
          {caseText}
        </div>
      )}
    </main>
  );
}