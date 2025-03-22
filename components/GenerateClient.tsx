"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export function GenerateClient() {
  const searchParams = useSearchParams()
  const defaultDomain = searchParams.get("domain") || ""
  const defaultChallenge = searchParams.get("challenge") || ""

  const [domain, setDomain] = useState(defaultDomain)
  const [challenge, setChallenge] = useState(defaultChallenge)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!domain || !challenge) {
      setError("Fyll ut både domenefelt og utfordring.")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain, challenge }),
      })

      const text = await response.text()

      if (!response.ok) {
        throw new Error(`API-feil (${response.status}): ${text}`)
      }

      const data = JSON.parse(text)
      setResult(data)
    } catch (err: any) {
      console.error("🛑 Feil ved kall til API:", err)
      setError(err.message || "Ukjent feil")
    } finally {
      setLoading(false)
    }
  }

  // Hvis URL-parametere finnes på første last, generer automatisk
  useEffect(() => {
    if (defaultDomain && defaultChallenge) {
      handleGenerate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Generer treningscase</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Domenefelt:{" "}
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            style={{ padding: "0.4rem", width: "300px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Utfordring:{" "}
          <input
            type="text"
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            style={{ padding: "0.4rem", width: "300px" }}
          />
        </label>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {loading ? "Genererer..." : "Generer"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          <strong>Feil:</strong> {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f4f4f4",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
          }}
        >
          <h2>🎓 Treningscase</h2>
          <p>
            <strong>Domenefelt:</strong> {result.domain}
          </p>
          <p>
            <strong>Utfordring:</strong> {result.challenge}
          </p>
          <p>
            <strong>Prompt brukt:</strong> {result.prompt}
          </p>
          <hr style={{ margin: "1rem 0" }} />
          <p>{result.answer}</p>
        </div>
      )}
    </div>
  )
}