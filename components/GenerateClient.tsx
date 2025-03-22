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
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ domain, challenge }),
        });

        if (!response.ok) {
          throw new Error("Feil ved generering av case");
        }

        const data = await response.json();
        setCaseText(data.answer);
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