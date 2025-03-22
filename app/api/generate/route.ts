import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { saveCase } from "@/lib/data"
import { generateId } from "@/lib/utils"

// Sample templates for different categories (for fallback only)
const templates = {
  helse: {
    titles: [
      "Etiske dilemmaer i helsetjenesten: {keyword1}",
      "Når {keyword1} møter {keyword2}: En case fra helsesektoren",
      "Utfordringer med {keyword1} i pasientbehandling",
      "Balansering av {keyword1} og {keyword2} i helsearbeid",
      "Helsepersonell i møte med {keyword1}: Etiske refleksjoner",
    ],
    introductions: [
      "Denne casen omhandler en situasjon hvor helsepersonell må navigere komplekse etiske dilemmaer knyttet til {keyword1} og {keyword2}.",
      "I denne case-studien utforsker vi utfordringer knyttet til {keyword1} i helsetjenesten, og hvordan fagpersoner kan håndtere dette.",
      "Helsepersonell møter daglig situasjoner hvor {keyword1} står sentralt. Denne casen belyser slike utfordringer.",
    ],
    scenarios: [
      "En pasient i 60-årene kommer til sykehuset med komplekse symptomer. Helsepersonellet står overfor utfordringer knyttet til {keyword1} og må samtidig ta hensyn til {keyword2}.",
      "På en travel avdeling oppstår det en situasjon hvor {keyword1} blir en sentral problemstilling. Personalet må raskt ta beslutninger som involverer {keyword2}.",
      "En kronisk syk pasient uttrykker ønsker som skaper dilemmaer for helsepersonellet, særlig med tanke på {keyword1} og {keyword2}.",
    ],
    reflectionQuestions: [
      "Hvordan kan helsepersonell balansere hensynet til {keyword1} med faglige vurderinger?",
      "Hvilke etiske prinsipper bør veilede beslutninger når {keyword1} står sentralt?",
      "Hvordan kan man sikre at {keyword1} ivaretas samtidig som man opprettholder faglig forsvarlighet?",
    ],
  },
  barnevern: {
    titles: [
      "Barnets beste når {keyword1} er en faktor",
      "Utfordringer i barnevernet: {keyword1} og {keyword2}",
      "Når barnevernet møter familier med {keyword1}",
      "Balansering av {keyword1} og {keyword2} i barnevernsarbeid",
      "Komplekse vurderinger: {keyword1} i barnevernssaker",
    ],
    introductions: [
      "Denne casen omhandler en barnevernssak hvor {keyword1} og {keyword2} skaper komplekse utfordringer for tjenesten.",
      "I denne case-studien ser vi på hvordan barnevernet håndterer situasjoner hvor {keyword1} står sentralt i vurderingen av barnets beste.",
      "Barnevernet møter familier hvor {keyword1} påvirker omsorgssituasjonen. Denne casen belyser slike utfordringer.",
    ],
    scenarios: [
      "En familie med tre barn kommer i kontakt med barnevernet etter bekymringsmeldinger knyttet til {keyword1}. Barnevernet må vurdere situasjonen med fokus på {keyword2}.",
      "Barnevernet mottar en bekymringsmelding om et barn hvor {keyword1} er en sentral problemstilling. Tjenesten må navigere komplekse vurderinger knyttet til {keyword2}.",
      "I en familie med sammensatte utfordringer blir {keyword1} et sentralt tema. Barnevernet må balansere hensynet til barnets beste med fokus på {keyword2}.",
    ],
    reflectionQuestions: [
      "Hvordan kan barnevernet sikre barnets beste når {keyword1} er en sentral faktor?",
      "Hvilke avveininger må gjøres når {keyword1} og {keyword2} påvirker barnets omsorgssituasjon?",
      "Hvordan kan barnevernet arbeide med familier hvor {keyword1} er en utfordring, samtidig som man ivaretar barnets rettigheter?",
    ],
  },
  politi: {
    titles: [
      "Politiarbeid i møte med {keyword1}",
      "Når politiet håndterer {keyword1}: Etiske dilemmaer",
      "Balansering av {keyword1} og {keyword2} i politiets arbeid",
      "Utfordringer ved {keyword1} i politiets operative arbeid",
      "Politiets rolle når {keyword1} står sentralt",
    ],
    introductions: [
      "Denne casen omhandler en situasjon hvor politiet må håndtere utfordringer knyttet til {keyword1} og samtidig ta hensyn til {keyword2}.",
      "I denne case-studien utforsker vi hvordan politiet navigerer komplekse situasjoner hvor {keyword1} står sentralt.",
      "Politiet møter daglig situasjoner hvor {keyword1} skaper utfordringer. Denne casen belyser slike dilemmaer.",
    ],
    scenarios: [
      "Politiet blir tilkalt til en situasjon hvor {keyword1} er en sentral faktor. Betjentene må raskt ta beslutninger som involverer {keyword2}.",
      "Under en rutinekontroll oppdager politiet forhold knyttet til {keyword1}. Dette skaper en kompleks situasjon hvor {keyword2} må vurderes nøye.",
      "Politiet mottar en melding om en hendelse hvor {keyword1} står sentralt. Håndteringen av situasjonen krever avveininger knyttet til {keyword2}.",
    ],
    reflectionQuestions: [
      "Hvordan kan politiet balansere hensynet til {keyword1} med andre samfunnshensyn?",
      "Hvilke etiske vurderinger bør politiet gjøre når de står overfor situasjoner med {keyword1}?",
      "Hvordan kan politiet best håndtere situasjoner hvor {keyword1} og {keyword2} skaper komplekse dilemmaer?",
    ],
  },
  forsvaret: {
    titles: [
      "Forsvaret i møte med {keyword1}",
      "Når {keyword1} påvirker militære operasjoner",
      "Balansering av {keyword1} og {keyword2} i Forsvaret",
      "Utfordringer ved {keyword1} i militær kontekst",
      "Forsvarets rolle når {keyword1} står sentralt",
    ],
    introductions: [
      "Denne casen omhandler en situasjon hvor Forsvaret må håndtere utfordringer knyttet til {keyword1} og samtidig ta hensyn til {keyword2}.",
      "I denne case-studien utforsker vi hvordan militært personell navigerer komplekse situasjoner hvor {keyword1} står sentralt.",
      "Forsvaret møter situasjoner hvor {keyword1} skaper utfordringer. Denne casen belyser slike dilemmaer.",
    ],
    scenarios: [
      "Under en militær operasjon oppstår det en situasjon hvor {keyword1} er en sentral faktor. Personellet må raskt ta beslutninger som involverer {keyword2}.",
      "I forbindelse med en øvelse oppstår det utfordringer knyttet til {keyword1}. Dette skaper en kompleks situasjon hvor {keyword2} må vurderes nøye.",
      "Forsvaret står overfor en situasjon hvor {keyword1} står sentralt. Håndteringen krever avveininger knyttet til {keyword2}.",
    ],
    reflectionQuestions: [
      "Hvordan kan Forsvaret balansere hensynet til {keyword1} med operasjonelle krav?",
      "Hvilke etiske vurderinger bør militært personell gjøre når de står overfor situasjoner med {keyword1}?",
      "Hvordan kan Forsvaret best håndtere situasjoner hvor {keyword1} og {keyword2} skaper komplekse dilemmaer?",
    ],
  },
  nav: {
    titles: [
      "NAV i møte med {keyword1}",
      "Når {keyword1} påvirker brukeroppfølging",
      "Balansering av {keyword1} og {keyword2} i NAVs arbeid",
      "Utfordringer ved {keyword1} i velferdstjenester",
      "NAVs rolle når {keyword1} står sentralt",
    ],
    introductions: [
      "Denne casen omhandler en situasjon hvor NAV må håndtere utfordringer knyttet til {keyword1} og samtidig ta hensyn til {keyword2}.",
      "I denne case-studien utforsker vi hvordan NAV-ansatte navigerer komplekse situasjoner hvor {keyword1} står sentralt.",
      "NAV møter daglig situasjoner hvor {keyword1} skaper utfordringer. Denne casen belyser slike dilemmaer.",
    ],
    scenarios: [
      "En bruker kommer til NAV med en kompleks situasjon hvor {keyword1} er en sentral faktor. Veilederne må ta beslutninger som involverer {keyword2}.",
      "I forbindelse med saksbehandling oppstår det utfordringer knyttet til {keyword1}. Dette skaper en situasjon hvor {keyword2} må vurderes nøye.",
      "NAV står overfor en situasjon hvor {keyword1} står sentralt. Håndteringen krever avveininger knyttet til {keyword2}.",
    ],
    reflectionQuestions: [
      "Hvordan kan NAV balansere hensynet til {keyword1} med regelverk og retningslinjer?",
      "Hvilke etiske vurderinger bør NAV-ansatte gjøre når de står overfor situasjoner med {keyword1}?",
      "Hvordan kan NAV best håndtere situasjoner hvor {keyword1} og {keyword2} skaper komplekse dilemmaer?",
    ],
  },
}

// Function to generate detailed content based on templates (for fallback only)
function generateCaseContent(category: string, complexity: string, keywordsList: string[], additionalInfo?: string) {
  // Select the appropriate template
  const template = templates[category as keyof typeof templates] || templates.helse

  // Get random elements from templates
  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

  // Replace keyword placeholders
  const replacePlaceholders = (text: string) => {
    let result = text
    keywordsList.forEach((keyword, index) => {
      result = result.replace(`{keyword${index + 1}}`, keyword)
    })
    // Replace any remaining placeholders with the first keyword
    for (let i = keywordsList.length + 1; i <= 5; i++) {
      result = result.replace(`{keyword${i}}`, keywordsList[0] || "etiske dilemmaer")
    }
    return result
  }

  // Generate title
  const title = replacePlaceholders(getRandomElement(template.titles))

  // Generate description
  const description = `En ${complexity} case-studie om ${keywordsList.join(", ")} innen ${category}.`

  // Generate introduction
  const introduction = replacePlaceholders(getRandomElement(template.introductions))

  // Generate scenario based on complexity
  let scenario = replacePlaceholders(getRandomElement(template.scenarios))

  // Add complexity-specific content
  if (complexity === "middels" || complexity === "kompleks") {
    scenario += `\n\nSituasjonen kompliseres ytterligere av flere faktorer. `

    if (category === "helse") {
      scenario += `Pasientens helsetilstand er ustabil, og det er ulike faglige vurderinger om beste behandlingsforløp. `
      scenario += `Pårørende har også sterke meninger om situasjonen, noe som skaper ytterligere utfordringer for helsepersonellet.`
    } else if (category === "barnevern") {
      scenario += `Familien har en kompleks historie med tidligere kontakt med hjelpeapparatet. `
      scenario += `Det er også kulturelle faktorer som påvirker situasjonen, og ulike faginstanser har forskjellige vurderinger av risikofaktorene.`
    } else {
      scenario += `Situasjonen involverer flere parter med motstridende interesser. `
      scenario += `Det er også juridiske gråsoner som politiet må navigere, samtidig som de skal ivareta både sikkerhet og rettssikkerhet.`
    }
  }

  if (complexity === "kompleks") {
    scenario += `\n\nYtterligere kompliserende faktorer inkluderer: `

    if (category === "helse") {
      scenario += `\n- Ressursmangel i helsetjenesten som påvirker mulige tiltak`
      scenario += `\n- Uklare retningslinjer for håndtering av denne spesifikke situasjonen`
      scenario += `\n- Etiske dilemmaer knyttet til pasientens autonomi versus faglige vurderinger`
      scenario += `\n- Kommunikasjonsutfordringer mellom ulike deler av helsetjenesten`
    } else if (category === "barnevern") {
      scenario += `\n- Motstridende informasjon fra ulike kilder`
      scenario += `\n- Komplekse familiestrukturer som påvirker barnets omsorgssituasjon`
      scenario += `\n- Utfordringer med samarbeid mellom ulike instanser`
      scenario += `\n- Begrensede ressurser for å implementere ideelle tiltak`
    } else {
      scenario += `\n- Medienes interesse for saken skaper press på håndteringen`
      scenario += `\n- Uklare jurisdiksjonsgrenser mellom ulike myndigheter`
      scenario += `\n- Etiske dilemmaer knyttet til maktbruk og personvern`
      scenario += `\n- Politiske føringer som påvirker operasjonelle beslutninger`
    }
  }

  // Add additional information if provided
  if (additionalInfo && additionalInfo.trim()) {
    scenario += `\n\nTilleggsinformasjon: ${additionalInfo}`
  }

  // Generate possible approaches
  let approaches = "\n\n## Mulige tilnærminger\n\n"

  if (category === "helse") {
    approaches +=
      "1. **Pasientsentrert tilnærming**: Fokusere på pasientens ønsker og behov, samtidig som man sikrer faglig forsvarlighet.\n"
    approaches +=
      "2. **Tverrfaglig samarbeid**: Involvere ulike faggrupper for å få et helhetlig bilde av situasjonen.\n"
    approaches +=
      "3. **Etisk refleksjon**: Gjennomføre en strukturert etisk refleksjon med kollegaer for å belyse ulike perspektiver.\n"
    approaches +=
      "4. **Dialog med pårørende**: Etablere god kommunikasjon med pårørende for å skape felles forståelse.\n"
  } else if (category === "barnevern") {
    approaches +=
      "1. **Barnets beste i fokus**: Sikre at alle vurderinger og tiltak har barnets beste som grunnleggende hensyn.\n"
    approaches += "2. **Familieorientert tilnærming**: Arbeide med hele familien for å styrke omsorgskompetansen.\n"
    approaches += "3. **Tverrfaglig samarbeid**: Koordinere innsats med andre relevante tjenester.\n"
    approaches += "4. **Medvirkning**: Sikre at barn og foreldre får mulighet til å medvirke i prosessen.\n"
  } else {
    approaches += "1. **Forebyggende tilnærming**: Fokusere på å forebygge eskalering av situasjonen.\n"
    approaches += "2. **Dialogbasert løsning**: Bruke kommunikasjon og dialog som primært verktøy.\n"
    approaches +=
      "3. **Samarbeid med andre etater**: Involvere relevante samarbeidspartnere for en helhetlig tilnærming.\n"
    approaches += "4. **Juridisk vurdering**: Sikre at alle handlinger har solid juridisk forankring.\n"
  }

  // Generate reflection question
  const reflectionQuestion = replacePlaceholders(getRandomElement(template.reflectionQuestions))

  // Combine all parts into content
  const content = `## Introduksjon\n\n${introduction}\n\n## Situasjonsbeskrivelse\n\n${scenario}${approaches}`

  return {
    title,
    description,
    content,
    reflectionQuestion,
  }
}

// Function to clean the OpenAI response and extract valid JSON
function extractJsonFromResponse(text: string): any {
  try {
    // First, try direct parsing in case it's already valid JSON
    return JSON.parse(text)
  } catch (error) {
    console.log("Direct JSON parsing failed, attempting to extract JSON from text")

    // If direct parsing fails, try to extract JSON from markdown code blocks
    const jsonRegex = /```(?:json)?\s*({[\s\S]*?})\s*```/
    const match = text.match(jsonRegex)

    if (match && match[1]) {
      try {
        return JSON.parse(match[1])
      } catch (innerError) {
        console.error("Failed to parse extracted JSON:", innerError)
      }
    }

    // If that fails too, try to find anything that looks like JSON
    const possibleJson = text.match(/{[\s\S]*?}/)
    if (possibleJson) {
      try {
        return JSON.parse(possibleJson[0])
      } catch (innerError) {
        console.error("Failed to parse possible JSON:", innerError)
      }
    }

    // If all parsing attempts fail, throw an error
    throw new Error("Could not extract valid JSON from response")
  }
}

// Function to retry API calls with exponential backoff
async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let retries = 0
  let delay = initialDelay

  while (true) {
    try {
      return await fn()
    } catch (error) {
      retries++
      console.log(`API attempt ${retries} failed. ${maxRetries - retries} attempts remaining.`)

      if (retries >= maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts. Last error: ${error}`)
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, delay))
      delay *= 2 // Double the delay for next retry
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, complexity, keywords, additionalInfo } = body

    // Validate inputs
    if (!category || !complexity || !keywords) {
      return NextResponse.json({ error: "Manglende påkrevde felt" }, { status: 400 })
    }

    // Parse keywords
    const keywordsList = keywords.split(", ").filter(Boolean)

    try {
      console.log("Attempting to generate case using OpenAI API...")

      // Try to generate case study using OpenAI with retry logic
      const prompt = `
  Generer en case-studie innen fagområdet ${category} med ${complexity} kompleksitet.
  
  Nøkkelord: ${keywords}
  ${additionalInfo ? `Tilleggsinformasjon: ${additionalInfo}` : ""}
  
  Formater case-studien med følgende struktur:
  1. En tittel som er beskrivende og engasjerende
  2. En kort beskrivelse/sammendrag (maks 2 setninger)
  3. Selve case-studien med detaljer, bakgrunn, og situasjonsbeskrivelse som er spesifikt tilpasset fagområdet ${category}
  4. Et refleksjonsspørsmål som får leseren til å tenke kritisk om casen
  
  VIKTIG: 
  - Svar på norsk bokmål
  - Sørg for at innholdet er spesifikt tilpasset fagområdet ${category} med relevant terminologi og problemstillinger
  - Returner et rent JSON-objekt uten markdown-formatering, kodeblokker eller andre tegn
  
  JSON-objektet skal ha følgende struktur:
  {
    "title": "Tittel på case-studien",
    "description": "Kort beskrivelse/sammendrag",
    "content": "Selve innholdet i case-studien",
    "reflectionQuestion": "Et refleksjonsspørsmål"
  }
`

      const { text } = await retryWithBackoff(async () => {
        return await generateText({
          model: openai("gpt-4o"),
          prompt,
          temperature: 0.7,
          maxTokens: 3000,
        })
      }, 3)

      console.log("Raw API response:", text.substring(0, 200) + "...")

      // Parse the response with our robust JSON extraction
      let caseData
      try {
        caseData = extractJsonFromResponse(text)
        console.log("Successfully extracted JSON data")
      } catch (parseError) {
        console.error("JSON extraction failed:", parseError)
        throw new Error("Could not parse API response as JSON")
      }

      // Add a marker to indicate this was generated by AI
      const aiGeneratedContent =
        caseData.content + "\n\n---\n\n*Denne case-studien ble generert av kunstig intelligens.*"

      // Save to database
      const newCase = await saveCase({
        id: generateId(),
        title: caseData.title,
        description: caseData.description,
        content: aiGeneratedContent,
        reflectionQuestion: caseData.reflectionQuestion,
        category,
        complexity,
        keywords,
        createdAt: new Date().toISOString(),
        isAiGenerated: true,
      })

      return NextResponse.json(newCase)
    } catch (error) {
      console.error("Error with OpenAI API:", error)
      console.log("Falling back to template-based generation")

      // Fallback to template-based generation if OpenAI API fails
      const caseContent = generateCaseContent(category, complexity, keywordsList, additionalInfo)

      // Add a marker to indicate this was generated from templates
      const templateContent =
        caseContent.content + "\n\n---\n\n*Denne case-studien ble generert fra maler på grunn av API-begrensninger.*"

      // Save to database
      const newCase = await saveCase({
        id: generateId(),
        title: caseContent.title,
        description: caseContent.description,
        content: templateContent,
        reflectionQuestion: caseContent.reflectionQuestion,
        category,
        complexity,
        keywords,
        createdAt: new Date().toISOString(),
        isAiGenerated: false,
      })

      return NextResponse.json({
        ...newCase,
        usedFallback: true,
      })
    }
  } catch (error) {
    console.error("Error generating case:", error)
    return NextResponse.json({ error: "Kunne ikke generere case" }, { status: 500 })
  }
}

