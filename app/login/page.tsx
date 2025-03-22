"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Ugyldig brukernavn eller passord")
        setIsLoading(false)
        return
      }

      router.push(callbackUrl)
    } catch (error) {
      setError("Noe gikk galt. Prøv igjen senere.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md border shadow-sm">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <p className="text-muted-foreground mb-6">Logg inn for å få tilgang til admin-dashbordet</p>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Brukernavn</Label>
              <Input id="username" name="username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passord</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logger inn...
                </>
              ) : (
                "Logg inn"
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">Kun for administratorer</p>
        </CardContent>
      </Card>
    </div>
  )
}

