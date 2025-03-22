import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { deleteCase } from "@/lib/data"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 })
    }

    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Mangler case ID" }, { status: 400 })
    }

    await deleteCase(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting case:", error)
    return NextResponse.json({ error: "Kunne ikke slette case" }, { status: 500 })
  }
}

