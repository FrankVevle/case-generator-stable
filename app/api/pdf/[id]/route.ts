import { type NextRequest, NextResponse } from "next/server"
import PDFDocument from "pdfkit"
import { getCaseById } from "@/lib/data"
import { formatDate } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Mangler case ID" }, { status: 400 })
    }

    const caseItem = await getCaseById(id)

    if (!caseItem) {
      return NextResponse.json({ error: "Case ikke funnet" }, { status: 404 })
    }

    // Create a PDF document
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
      info: {
        Title: caseItem.title,
        Author: "Casegenerator",
        Subject: `Case-studie: ${caseItem.title}`,
        Keywords: caseItem.keywords,
      },
    })

    // Buffer to store PDF data
    const chunks: Buffer[] = []

    // Collect PDF data
    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)))

    // Set up fonts - using standard fonts to avoid font loading issues in serverless
    const titleFont = "Helvetica-Bold"
    const subtitleFont = "Helvetica-Oblique"
    const bodyFont = "Helvetica"
    const boldFont = "Helvetica-Bold"

    // Create PDF content
    doc.fontSize(20).font(titleFont).text(caseItem.title, { align: "center" })
    doc.moveDown()

    doc.fontSize(12).font(subtitleFont).text(caseItem.description)
    doc.moveDown()

    // Add metadata
    doc.fontSize(10).font(bodyFont).text(`Kategori: ${caseItem.category}`)
    doc.fontSize(10).text(`Kompleksitet: ${caseItem.complexity}`)
    doc.fontSize(10).text(`Dato: ${formatDate(caseItem.createdAt)}`)

    if (caseItem.isAiGenerated) {
      doc.fontSize(10).text(`Generert med: AI`)
    }

    doc.moveDown()

    // Remove the AI generation marker from the content if present
    let content = caseItem.content
    if (content.includes("---\n\n*Denne case-studien ble generert")) {
      content = content.split("---\n\n")[0].trim()
    }

    // Process markdown-like content
    const contentLines = content.split("\n")
    for (const line of contentLines) {
      if (line.startsWith("## ")) {
        // Section header
        doc.moveDown()
        doc.fontSize(14).font(boldFont).text(line.substring(3))
        doc.moveDown(0.5)
      } else if (line.startsWith("- ")) {
        // Bullet point
        doc.fontSize(12).font(bodyFont).text(line, { indent: 10 })
      } else if (line.trim() === "") {
        // Empty line
        doc.moveDown(0.5)
      } else {
        // Regular text
        doc.fontSize(12).font(bodyFont).text(line)
      }
    }

    doc.moveDown(2)

    // Add reflection question
    doc.fontSize(14).font(boldFont).text("Refleksjonsspørsmål:")
    doc.fontSize(12).font(subtitleFont).text(caseItem.reflectionQuestion)

    // Add footer with page numbers
    const pageCount = doc.bufferedPageRange().count
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i)
      doc
        .fontSize(8)
        .font(bodyFont)
        .text(`Casegenerator - Side ${i + 1} av ${pageCount}`, 50, doc.page.height - 50, { align: "center" })
    }

    // Finalize the PDF and collect all chunks
    doc.end()

    return new Promise<NextResponse>((resolve) => {
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks)

        // Set response headers
        const headers = new Headers()
        headers.set("Content-Type", "application/pdf")
        headers.set("Content-Disposition", `attachment; filename="case-${id}.pdf"`)
        headers.set("Content-Length", pdfBuffer.length.toString())

        resolve(
          new NextResponse(pdfBuffer, {
            status: 200,
            headers,
          }),
        )
      })
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Kunne ikke generere PDF" }, { status: 500 })
  }
}

