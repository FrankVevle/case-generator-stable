import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ArrowLeft, Sparkles } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getCaseById } from "@/lib/data"
import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { PdfDownloadButton } from "@/components/pdf-download-button"

interface CasePageProps {
  params: {
    id: string
  }
}

export default async function CasePage({ params }: CasePageProps) {
  const caseItem = await getCaseById(params.id)

  if (!caseItem) {
    notFound()
  }

  const categoryColors = {
    helse: "bg-teal text-white",
    barnevern: "bg-charcoal text-white",
    politi: "bg-teal text-white",
    forsvaret: "bg-amber-600 text-white",
    nav: "bg-sky-600 text-white",
  }

  const categoryColor = categoryColors[caseItem.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="flex items-center text-muted-foreground mb-6 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til forsiden
          </Link>

          <Card className="border shadow-sm overflow-hidden">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${categoryColor} px-3 py-1 rounded-full`}>{caseItem.category}</Badge>

                  {caseItem.isAiGenerated && (
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI-generert
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {formatDate(caseItem.createdAt)}
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-4">{caseItem.title}</h1>
              <p className="text-muted-foreground mb-8">{caseItem.description}</p>

              <div className="prose max-w-none mb-8 dark:prose-invert">
                <div className="whitespace-pre-line">{caseItem.content}</div>
              </div>

              <div className="bg-muted p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-2">Refleksjonsspørsmål</h3>
                <p>{caseItem.reflectionQuestion}</p>
              </div>

              <div className="flex justify-end">
                <PdfDownloadButton caseId={params.id} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

