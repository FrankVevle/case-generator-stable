import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ScenarioSelectorWrapper } from "@/components/scenario-selector-wrapper"
import { Footer } from "@/components/footer"

export default function ScenariosPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="flex items-center text-muted-foreground mb-6 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til fagområdevalg
          </Link>

          <h1 className="text-3xl font-bold mb-8">Velg scenario-elementer</h1>

          <Suspense fallback={<div className="p-8 text-center">Laster scenarier...</div>}>
            <ScenarioSelectorWrapper />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}

