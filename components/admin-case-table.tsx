"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, FileIcon, TrashIcon, EyeIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Case } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

interface AdminCaseTableProps {
  cases: Case[]
}

export function AdminCaseTable({ cases }: AdminCaseTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [pdfBaseUrl, setPdfBaseUrl] = useState<string>("/api/pdf")

  // Get API URL from environment variables
  useEffect(() => {
    // @ts-ignore - getConfig() is available in the browser
    const config = typeof window !== "undefined" ? window.__NEXT_DATA__?.runtimeConfig?.publicRuntimeConfig : {}
    const apiUrl = config?.apiUrl || process.env.NEXT_PUBLIC_API_URL || ""

    if (apiUrl) {
      setPdfBaseUrl(`${apiUrl}/api/pdf`)
    }
  }, [])

  const categoryColors = {
    helse: "bg-teal text-white",
    barnevern: "bg-charcoal text-white",
    politi: "bg-teal text-white",
    forsvaret: "bg-amber-600 text-white",
    nav: "bg-sky-600 text-white",
  }

  async function deleteCase(id: string) {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Kunne ikke slette case.")
      }

      toast({
        title: "Case slettet",
        description: "Case-studien er nå slettet.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting case:", error)
      toast({
        title: "Feil",
        description: "Kunne ikke slette case. Prøv igjen senere.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tittel</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Opprettet</TableHead>
            <TableHead className="text-right">Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                Ingen case-studier funnet.
              </TableCell>
            </TableRow>
          ) : (
            cases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium">{caseItem.title}</TableCell>
                <TableCell>
                  <Badge className={`${categoryColors[caseItem.category as keyof typeof categoryColors]} rounded-full`}>
                    {caseItem.category}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(caseItem.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Åpne meny</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/case/${caseItem.id}`}>
                          <EyeIcon className="mr-2 h-4 w-4" />
                          <span>Vis</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`${pdfBaseUrl}/${caseItem.id}`} download target="_blank" rel="noopener noreferrer">
                          <FileIcon className="mr-2 h-4 w-4" />
                          <span>Last ned PDF</span>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteCase(caseItem.id)}
                        disabled={isDeleting === caseItem.id}
                        className="text-destructive focus:text-destructive"
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        <span>{isDeleting === caseItem.id ? "Sletter..." : "Slett"}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

