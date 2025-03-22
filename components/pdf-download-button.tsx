"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface PdfDownloadButtonProps {
  caseId: string
}

export function PdfDownloadButton({ caseId }: PdfDownloadButtonProps) {
  const [pdfUrl, setPdfUrl] = useState<string>(`/api/pdf/${caseId}`)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Get API URL from environment variables
  useEffect(() => {
    // @ts-ignore - getConfig() is available in the browser
    const config = typeof window !== "undefined" ? window.__NEXT_DATA__?.runtimeConfig?.publicRuntimeConfig : {}
    const apiUrl = config?.apiUrl || process.env.NEXT_PUBLIC_API_URL || ""

    if (apiUrl) {
      setPdfUrl(`${apiUrl}/api/pdf/${caseId}`)
    }
  }, [caseId])

  const handleDownload = async () => {
    setIsLoading(true)

    try {
      // Create a link element
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = `case-${caseId}.pdf`
      link.target = "_blank"

      // Append to the document and click
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast({
        title: "Feil",
        description: "Kunne ikke laste ned PDF. Prøv igjen senere.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Laster ned...
        </>
      ) : (
        <>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Last ned som PDF
        </>
      )}
    </Button>
  )
}

