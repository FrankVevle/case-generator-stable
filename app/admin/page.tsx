import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCases } from "@/lib/data"
import { AdminCaseTable } from "@/components/admin-case-table"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin")
  }

  const cases = await getCases()

  // Group cases by category
  const casesByCategory = {
    helse: cases.filter((c) => c.category === "helse"),
    barnevern: cases.filter((c) => c.category === "barnevern"),
    politi: cases.filter((c) => c.category === "politi"),
    forsvaret: cases.filter((c) => c.category === "forsvaret"),
    nav: cases.filter((c) => c.category === "nav"),
  }

  // Get counts
  const totalCases = cases.length
  const categoryCounts = {
    helse: casesByCategory.helse.length,
    barnevern: casesByCategory.barnevern.length,
    politi: casesByCategory.politi.length,
    forsvaret: casesByCategory.forsvaret.length,
    nav: casesByCategory.nav.length,
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-4">
              <Link href="/">
                <Button variant="outline">Gå til forsiden</Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="outline">Logg ut</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Totalt antall case</p>
                <p className="text-3xl font-bold">{totalCases}</p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Helse</p>
                <p className="text-3xl font-bold">{categoryCounts.helse}</p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Barnevern</p>
                <p className="text-3xl font-bold">{categoryCounts.barnevern}</p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Politi</p>
                <p className="text-3xl font-bold">{categoryCounts.politi}</p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Forsvaret</p>
                <p className="text-3xl font-bold">{categoryCounts.forsvaret}</p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">NAV</p>
                <p className="text-3xl font-bold">{categoryCounts.nav}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Case-studier</h2>

              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Alle</TabsTrigger>
                  <TabsTrigger value="helse">Helse</TabsTrigger>
                  <TabsTrigger value="barnevern">Barnevern</TabsTrigger>
                  <TabsTrigger value="politi">Politi</TabsTrigger>
                  <TabsTrigger value="forsvaret">Forsvaret</TabsTrigger>
                  <TabsTrigger value="nav">NAV</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <AdminCaseTable cases={cases} />
                </TabsContent>

                <TabsContent value="helse">
                  <AdminCaseTable cases={casesByCategory.helse} />
                </TabsContent>

                <TabsContent value="barnevern">
                  <AdminCaseTable cases={casesByCategory.barnevern} />
                </TabsContent>

                <TabsContent value="politi">
                  <AdminCaseTable cases={casesByCategory.politi} />
                </TabsContent>

                <TabsContent value="forsvaret">
                  <AdminCaseTable cases={casesByCategory.forsvaret} />
                </TabsContent>

                <TabsContent value="nav">
                  <AdminCaseTable cases={casesByCategory.nav} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

