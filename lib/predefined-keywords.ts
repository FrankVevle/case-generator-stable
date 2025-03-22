export const predefinedKeywords = {
  helse: [
    "etikk",
    "pasientrettigheter",
    "taushetsplikt",
    "samtykkekompetanse",
    "tverrfaglig samarbeid",
    "pårørende",
    "behandlingsnekt",
    "prioritering",
    "ressursmangel",
    "psykisk helse",
    "kronisk sykdom",
    "akuttmedisin",
    "rehabilitering",
    "palliativ behandling",
    "legemiddelhåndtering",
    "kommunikasjon",
    "kulturforskjeller",
    "digitalisering",
    "hjemmebehandling",
    "forebygging",
  ],
  barnevern: [
    "omsorgsovertakelse",
    "foreldresamarbeid",
    "barnets beste",
    "medvirkning",
    "tiltaksplan",
    "fosterhjem",
    "institusjon",
    "ettervern",
    "tilknytning",
    "omsorgssvikt",
    "vold",
    "rus",
    "psykisk helse",
    "kulturforskjeller",
    "tverrfaglig samarbeid",
    "meldeplikt",
    "undersøkelse",
    "akuttplassering",
    "samvær",
    "tilbakeføring",
  ],
  politi: [
    "maktbruk",
    "etterforskning",
    "avhør",
    "bevissikring",
    "pågripelse",
    "varetekt",
    "forebygging",
    "ungdomskriminalitet",
    "narkotika",
    "vold",
    "trusler",
    "hatkriminalitet",
    "økonomisk kriminalitet",
    "cyberkriminalitet",
    "trafikk",
    "ordensforstyrrelse",
    "psykiatri",
    "samarbeid med andre etater",
    "personvern",
    "etterretning",
  ],
  forsvaret: [
    "operativ tjeneste",
    "kommandolinjer",
    "internasjonale operasjoner",
    "beredskap",
    "sikkerhetsvurderinger",
    "etterretning",
    "samarbeid med sivile myndigheter",
    "krisehåndtering",
    "militær etikk",
    "lederskap",
    "stridsteknikk",
    "logistikk",
    "personellforvaltning",
    "veteraner",
    "psykisk helse",
    "taushetsplikt",
    "øvelser",
    "totalforsvaret",
    "cybersikkerhet",
    "folkerett",
  ],
  nav: [
    "saksbehandling",
    "ytelser",
    "arbeidsavklaringspenger",
    "uføretrygd",
    "dagpenger",
    "sykepenger",
    "arbeidsmarkedstiltak",
    "oppfølging",
    "aktivitetsplikt",
    "brukermedvirkning",
    "klagesaker",
    "veiledning",
    "digitale tjenester",
    "inkludering",
    "arbeidslivskriminalitet",
    "sosiale tjenester",
    "økonomisk rådgivning",
    "kvalifiseringsprogrammet",
    "innvandrere",
    "ungdom",
  ],
}

export function getRandomKeywords(category: keyof typeof predefinedKeywords, count = 3): string[] {
  const keywords = [...predefinedKeywords[category]]
  const result: string[] = []

  // Shuffle array using Fisher-Yates algorithm
  for (let i = keywords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[keywords[i], keywords[j]] = [keywords[j], keywords[i]]
  }

  // Take the first 'count' elements
  for (let i = 0; i < Math.min(count, keywords.length); i++) {
    result.push(keywords[i])
  }

  return result
}

