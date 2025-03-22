import type { Case } from "./types"

// In a real application, this would be a database connection
// For this example, we'll use localStorage in the browser and a simple in-memory store on the server
let cases: Case[] = []

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Initialize data from localStorage if in browser
if (isBrowser) {
  try {
    const storedCases = localStorage.getItem("cases")
    if (storedCases) {
      cases = JSON.parse(storedCases)
    }
  } catch (error) {
    console.error("Error loading cases from localStorage:", error)
  }
}

// Save data to localStorage if in browser
function saveToStorage() {
  if (isBrowser) {
    try {
      localStorage.setItem("cases", JSON.stringify(cases))
    } catch (error) {
      console.error("Error saving cases to localStorage:", error)
    }
  }
}

export async function getCases(): Promise<Case[]> {
  return [...cases].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getCaseById(id: string): Promise<Case | null> {
  return cases.find((c) => c.id === id) || null
}

export async function saveCase(caseData: Case): Promise<Case> {
  cases.push(caseData)
  saveToStorage()
  return caseData
}

export async function deleteCase(id: string): Promise<void> {
  cases = cases.filter((c) => c.id !== id)
  saveToStorage()
}

