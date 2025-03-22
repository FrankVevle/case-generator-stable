export interface Case {
  id: string
  title: string
  description: string
  content: string
  reflectionQuestion: string
  category: string
  complexity: string
  keywords: string
  createdAt: string
  isAiGenerated?: boolean
}

export type MainCategory = "helse" | "barnevern" | "politi" | "forsvaret" | "nav"

