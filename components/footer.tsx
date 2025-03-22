import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-6 mt-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground">
              © 2025 Casegenerator. Utviklet av en ekspert i faglige treningscaser
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/om" className="text-muted-foreground hover:text-foreground transition-colors">
              Om Casegeneratoren
            </Link>
            <Link href="/kontakt" className="text-muted-foreground hover:text-foreground transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

