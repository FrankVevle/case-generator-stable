"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { KeywordSelector } from "@/components/keyword-selector"
import { getRandomKeywords } from "@/lib/predefined-keywords"
import type { MainCategory } from "@/lib/types"

const formSchema = z.object({
  category: z.enum(["helse", "barnevern", "politi", "forsvaret", "nav"]),
  complexity: z.enum(["enkel", "middels", "kompleks"]),
  keywords: z.string().min(1),
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
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

  useEffect(() => {
    form.setValue("category", mainCategory)
  }, [mainCategory, form])

  useEffect(() => {
    const text = [personScenario, challengeScenario, outcomeScenario].filter(Boolean).join(", ")
    if (text) {
      form.setValue("additionalInfo", `Inkluder følgende scenario i case-studien: ${text}.`)
    }
  }, [personScenario, challengeScenario, outcomeScenario, form])

  const category = form.watch("category")
  useEffect(() => {
    const initial = getRandomKeywords(category as any, 3)
    form.setValue("keywords", initial.join(", "))
  }, [category, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setErrorMessage(null)
    setAnswer(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: values.category,
          complexity: values.complexity,
          keywords: values.keywords.split(",").map((k) => k.trim()),
          additionalInfo: values.additionalInfo,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Feil ved generering av case.")
      }

      const data = await response.json()
      if (!data.answer) throw new Error("Tomt svar fra Perplexity")

      toast({
        title: "Case generert med AI!",
        description: "Din case-studie er klar.",
      })

      setAnswer(data.answer)
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Ukjent feil"
      setErrorMessage(msg)
      toast({ title: "Feil", description: msg, variant: "destructive" })
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
                        <SelectValue placeholder="Velg kompleksitet" />
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
                      placeholder="Detaljer, scenarier eller mål for treningen..."
                      className="resize-none bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

        {answer && (
          <div className="mt-10 whitespace-pre-wrap bg-gray-50 border rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Generert treningscase:</h2>
            <p>{answer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function KeywordSelectorWrapper({
  category,
  value,
  onChange,
}: {
  category: keyof typeof import("@/lib/predefined-keywords").predefinedKeywords
  value: string
  onChange: (value: string) => void
}) {
  const selectedKeywords = value ? value.split(", ").filter(Boolean) : []
  const handleKeywordsChange = (newKeywords: string[]) => {
    onChange(newKeywords.join(", "))
  }

  return (
    <KeywordSelector category={category} initialKeywords={selectedKeywords} onKeywordsChange={handleKeywordsChange} />
  )
}