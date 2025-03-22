import { DomainSelector } from "@/components/domain-selector"
import { Footer } from "@/components/footer"

export default async function Home() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <section className="max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl font-bold mb-6">Et praktisk verktøy for håndtering av case-studier.</h1>
          <p className="text-lg mb-4">
            Casegeneratoren bruker kunstig intelligens for å lage fiktive, men realistiske scenarier. Verktøyet hjelper
            deg og ditt team til å reflektere og utforske handlingsrommet i møte med ulike faglige utfordringer. Målet
            er å gjøre det enklere å samarbeide og finne rett tiltak til rett tid.
          </p>
          <p className="text-md mb-6">
            Utviklet av en ekspert i simulering av realistiske treningscaser innen politi, barnevern, helse, forsvar og
            NAV.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-muted px-3 py-1 rounded-full">Politi</span>
            <span className="bg-muted px-3 py-1 rounded-full">Barnevern</span>
            <span className="bg-muted px-3 py-1 rounded-full">Helse</span>
            <span className="bg-muted px-3 py-1 rounded-full">Forsvar</span>
            <span className="bg-muted px-3 py-1 rounded-full">NAV</span>
          </div>
        </section>

        <section className="max-w-5xl mx-auto mb-16">
          <DomainSelector />
        </section>
      </main>

      <Footer />
    </div>
  )
}

