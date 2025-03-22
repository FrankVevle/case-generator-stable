import Link from "next/link"
import { ModeToggle } from "./mode-toggle"

export function Navbar() {
  return (
    <header className="border-b border-border/40">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Casegenerator
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/om" className="text-sm font-medium hover:underline">
            Om Casegeneratoren
          </Link>
          <Link href="/kontakt" className="text-sm font-medium hover:underline">
            Kontakt
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

