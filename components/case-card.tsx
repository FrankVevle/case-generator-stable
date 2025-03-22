"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, DownloadIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Case } from "@/lib/types"

interface CaseCardProps {
  caseItem: Case
}

export function CaseCard({ caseItem }: CaseCardProps) {
  const [pdfUrl, setPdfUrl] = useState<string>(`/api/pdf/${caseItem.id}`)

  // Get API URL from environment variables
  useEffect(() => {
    // @ts-ignore - getConfig() is available in the browser
    const config = typeof window !== "undefined" ? window.__NEXT_DATA__?.runtimeConfig?.publicRuntimeConfig : {}
    const apiUrl = config?.apiUrl || process.env.NEXT_PUBLIC_API_URL || ""

    if (apiUrl) {
      setPdfUrl(`${apiUrl}/api/pdf/${caseItem.id}`)
    }
  }, [caseItem.id])

  const categoryColors = {
    helse: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    barnevern: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    politi: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    forsvaret: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
    nav: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
  }

  const categoryColor =
    categoryColors[caseItem.category as keyof typeof categoryColors] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge className={categoryColor}>{caseItem.category}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            {formatDate(caseItem.createdAt)}
          </div>
        </div>
        <CardTitle className="mt-2">{caseItem.title}</CardTitle>
        <CardDescription>{caseItem.description.substring(0, 100)}...</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          <strong>Refleksjonsspørsmål:</strong> {caseItem.reflectionQuestion}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/case/${caseItem.id}`}>
          <Button variant="outline">Les mer</Button>
        </Link>
        <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="icon">
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
}

