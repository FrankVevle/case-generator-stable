import { Footer } from "@/components/footer"

export default function KontaktPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Kontakt</h1>

          <div className="prose max-w-none dark:prose-invert">
            <div className="bg-card p-8 rounded-lg border shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Om utvikleren</h2>

              <div className="mb-6">
                <p className="text-lg">
                  Jeg er en ekspert i simulering av realistiske treningscaser innen flere fagområder i offentlig sektor.
                </p>
                <p className="mt-4">
                  Min ekspertise omfatter utvikling av realistiske scenarioer og treningscaser for:
                </p>

                <ul className="mt-4 space-y-3">
                  <li>
                    <strong>Politi:</strong> Kriminalsaker, krisehåndtering, etterforskning og rettsprosedyrer
                  </li>
                  <li>
                    <strong>Barnevern:</strong> Barnets beste, omsorgsovertakelse og samarbeid med andre instanser
                  </li>
                  <li>
                    <strong>Helse:</strong> Pasienthåndtering, medisinske dilemmaer og psykisk helse
                  </li>
                  <li>
                    <strong>Forsvar:</strong> Taktiske operasjoner, beslutningstaking under press og etiske
                    problemstillinger
                  </li>
                  <li>
                    <strong>NAV:</strong> Sosialtjenester, trygdeytelser og arbeidsrett
                  </li>
                </ul>

                <p className="mt-4">
                  Casegeneratoren er utviklet for å tilby realistiske, men fiktive scenarioer som kan brukes til
                  opplæring, refleksjon og diskusjon innen disse fagområdene. Verktøyet kombinerer min fagkunnskap med
                  moderne AI-teknologi for å skape skreddersydde case-studier.
                </p>
              </div>

              <h3 className="text-xl font-medium mb-2">Kontaktinformasjon</h3>
              <p className="mb-2">
                Har du spørsmål om Casegeneratoren eller ønsker å diskutere hvordan verktøyet kan tilpasses dine behov?
                Ta gjerne kontakt:
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>E-post:</strong>{" "}
                  <a href="mailto:kontakt@casegenerator.no" className="text-primary hover:underline">
                    kontakt@casegenerator.no
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

