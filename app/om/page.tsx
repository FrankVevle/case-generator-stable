import { Footer } from "@/components/footer"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Om Casegeneratoren</h1>

          <div className="prose max-w-none dark:prose-invert">
            <div className="bg-amber-100 dark:bg-amber-900 border-l-4 border-amber-500 p-4 mb-6">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                <strong>Viktig:</strong> Dette er kun en testversjon og ikke en fungerende modell for offentlig sektor.
                Applikasjonen er utviklet som en prototype og er ikke ment for produksjonsbruk.
              </p>
            </div>

            <p className="text-lg mb-4">
              Casegeneratoren er et verktøy som bruker kunstig intelligens for å lage fiktive, men realistiske scenarier
              innen helse, barnevern, politi, forsvar og NAV. Verktøyet er utviklet for å hjelpe fagpersoner med å
              reflektere over og utforske handlingsrommet i møte med ulike faglige utfordringer.
            </p>

            <p className="text-lg mb-4">
              Ved å generere realistiske case-studier, gir Casegeneratoren mulighet for å trene på situasjoner som kan
              oppstå i virkeligheten, uten å bruke faktiske hendelser som kan være identifiserbare. Dette gjør det
              enklere å diskutere sensitive temaer og utforske ulike tilnærminger til komplekse problemstillinger.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Fagområder</h2>

            <p className="text-lg mb-4">Casegeneratoren dekker følgende fagområder med spesialisert ekspertise:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Politi</h3>
                <p>Kriminalsaker, krisehåndtering, etterforskning og rettsprosedyrer</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Barnevern</h3>
                <p>Barnets beste, omsorgsovertakelse og samarbeid med andre instanser</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Helse</h3>
                <p>Pasienthåndtering, medisinske dilemmaer og psykisk helse</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Forsvar</h3>
                <p>Taktiske operasjoner, beslutningstaking under press og etiske problemstillinger</p>
              </div>

              <div className="bg-muted p-4 rounded-lg md:col-span-2">
                <h3 className="font-bold text-lg mb-2">NAV</h3>
                <p>Sosialtjenester, trygdeytelser og arbeidsrett</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Hvordan fungerer det?</h2>

            <p className="text-lg mb-4">
              Casegeneratoren bruker avanserte språkmodeller for å skape realistiske scenarier basert på dine valg av
              kategori, kompleksitet og nøkkelord. Du kan også legge til spesifikke detaljer eller temaer du ønsker
              inkludert i case-studien.
            </p>

            <p className="text-lg mb-4">Hver genererte case-studie inkluderer:</p>

            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">En beskrivende tittel</li>
              <li className="mb-2">En kort sammendrag av situasjonen</li>
              <li className="mb-2">Detaljert innhold med bakgrunn og situasjonsbeskrivelse</li>
              <li className="mb-2">Et refleksjonsspørsmål for å stimulere til kritisk tenkning</li>
            </ul>

            <p className="text-lg mb-4">
              Case-studiene kan lastes ned som PDF-filer for enkel deling og bruk i undervisning, teamdiskusjoner eller
              personlig refleksjon.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Om utvikleren</h2>

            <p className="text-lg mb-4">
              Casegeneratoren er utviklet av en ekspert i simulering av realistiske treningscaser innen offentlig
              sektor. Med spesialisert kunnskap innen politi, barnevern, helse, forsvar og NAV, er verktøyet designet
              for å skape virkelighetsnære scenarioer som kan brukes til opplæring og faglig utvikling.
            </p>

            <p className="text-lg mb-4">
              For mer informasjon eller henvendelser, besøk{" "}
              <Link href="/kontakt" className="text-primary hover:underline">
                kontaktsiden
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

