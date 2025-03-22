import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Casegenerator",
  description: "Et praktisk verktøy for generering av case-studier",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nb" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <Navbar />
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'