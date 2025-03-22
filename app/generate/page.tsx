import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { GenerateFormWrapper } from "@/components/generate-form-wrapper"
import { Footer } from "@/components/footer"

export default function GeneratePage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/scenarios"
            className="flex items-center text-muted-foreground mb-6 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til scenariovalg
          </Link>

          <h1 className="text-3xl font-bold mb-8">Generer en treningscase</h1>

          <Suspense fallback={<div className="p-8 text-center">Laster skjema...</div>}>
            <GenerateFormWrapper />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}

