"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { KeywordSelector } from "@/components/keyword-selector"
import { getRandomKeywords } from "@/lib/predefined-keywords"
import type { MainCategory } from "@/lib/types"

const formSchema = z.object({
  category: z.enum(["helse", "barnevern", "politi", "forsvaret", "nav"], {
    required_error: "Vennligst velg en kategori.",
  }),
  complexity: z.enum(["enkel", "middels", "kompleks"], {
    required_error: "Vennligst velg kompleksitetsnivå.",
  }),
  keywords: z.string().min(1, {
    message: "Vennligst velg minst ett nøkkelord.",
  }),
  additionalInfo: z.string().optional(),
})

interface GenerateFormProps {
  personScenario?: string
  challengeScenario?: string
  outcomeScenario?: string
  mainCategory: MainCategory
}

export function GenerateForm({
  personScenario = "",
  challengeScenario = "",
  outcomeScenario = "",
  mainCategory,
}: GenerateFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error" | "fallback">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: mainCategory,
      complexity: "middels",
      keywords: "",
      additionalInfo: "",
    },
  })

  // Update form when mainCategory changes
  useEffect(() => {
    form.setValue("category", mainCategory)
  }, [mainCategory, form])

  // Update the form with scenario information if available
  useEffect(() => {
    if (personScenario || challengeScenario || outcomeScenario) {
      const scenarioText = [personScenario, challengeScenario, outcomeScenario].filter(Boolean).join(", ")

      if (scenarioText) {
        form.setValue(
          "additionalInfo",
          `Inkluder følgende scenario i case-studien: ${scenarioText}. ${form.getValues("additionalInfo") || ""}`,
        )
      }
    }
  }, [personScenario, challengeScenario, outcomeScenario, form])

  // Initialize keywords when category changes
  const category = form.watch("category")
  useEffect(() => {
    // Get random keywords for the selected category
    const initialKeywords = getRandomKeywords(category as any, 3)
    form.setValue("keywords", initialKeywords.join(", "))
  }, [category, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setApiStatus("loading")
    setErrorMessage(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Noe gikk galt ved generering av case.")
      }

      const data = await response.json()

      if (data.usedFallback) {
        setApiStatus("fallback")
        toast({
          title: "Case generert med maler",
          description: "Vi brukte forhåndsdefinerte maler på grunn av API-begrensninger.",
          variant: "default",
        })
      } else {
        setApiStatus("success")
        toast({
          title: "Case generert med AI!",
          description: "Din case-studie er nå klar.",
        })
      }

      router.push(`/case/${data.id}`)
    } catch (error) {
      console.error("Error generating case:", error)
      setApiStatus("error")

      // Extract error message
      const errorMsg = error instanceof Error ? error.message : "Ukjent feil"
      setErrorMessage(errorMsg)

      toast({
        title: "Feil",
        description: "Kunne ikke generere case. Prøv igjen senere.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {(personScenario || challengeScenario || outcomeScenario) && (
              <div className="bg-muted p-4 rounded-md mb-4">
                <p className="font-medium mb-2">Valgt scenario:</p>
                <p className="text-sm">
                  {[personScenario, challengeScenario, outcomeScenario].filter(Boolean).join(", ")}
                </p>
              </div>
            )}

            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>Det oppstod en feil: {errorMessage}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="complexity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kompleksitet</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Velg kompleksitetsnivå" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="enkel">Enkel</SelectItem>
                      <SelectItem value="middels">Middels</SelectItem>
                      <SelectItem value="kompleks">Kompleks</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Hvor kompleks skal case-studien være?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nøkkelord</FormLabel>
                  <FormControl>
                    <KeywordSelectorWrapper category={category as any} value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>Velg nøkkelord som skal inkluderes i case-studien.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tilleggsinformasjon (valgfritt)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Legg til spesifikke detaljer eller temaer du ønsker inkludert..."
                      className="resize-none bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Legg til spesifikke detaljer eller temaer du ønsker inkludert i case-studien.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {apiStatus === "fallback" && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription>
                  Merk: Vi bruker forhåndsdefinerte maler på grunn av API-begrensninger. Case-studien vil fortsatt være
                  av høy kvalitet, men mindre personlig tilpasset.
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-black hover:bg-black/90 text-white rounded-full py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Genererer med AI...
                </>
              ) : (
                "Generer case-studie"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

// Wrapper component to integrate KeywordSelector with React Hook Form
function KeywordSelectorWrapper({
  category,
  value,
  onChange,
}: {
  category: keyof typeof import("@/lib/predefined-keywords").predefinedKeywords
  value: string
  onChange: (value: string) => void
}) {
  // Convert comma-separated string to array
  const selectedKeywords = value ? value.split(", ").filter(Boolean) : []

  // Handle keyword changes
  const handleKeywordsChange = (newKeywords: string[]) => {
    onChange(newKeywords.join(", "))
  }

  return (
    <KeywordSelector category={category} initialKeywords={selectedKeywords} onKeywordsChange={handleKeywordsChange} />
  )
}

