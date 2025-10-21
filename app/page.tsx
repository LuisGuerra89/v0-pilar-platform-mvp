"use client"

import { Search, Shield, CreditCard, HeadphonesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"
import { getTranslations } from "@/lib/i18n"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { locale } = useLocale()
  const t = getTranslations(locale)
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push("/search")
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
              {t.home.hero.title}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl text-balance">{t.home.hero.subtitle}</p>

            {/* Search Bar */}
            <div className="mx-auto flex max-w-2xl gap-2">
              <Input
                type="text"
                placeholder={t.home.hero.searchPlaceholder}
                className="h-12 flex-1 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button size="lg" className="h-12 px-8" onClick={handleSearch}>
                <Search className="mr-2 h-5 w-5" />
                {t.home.hero.searchButton}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">{t.home.features.title}</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <Card className="border-border">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{t.home.features.verified.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.home.features.verified.description}</p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-border">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                  <CreditCard className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{t.home.features.secure.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.home.features.secure.description}</p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-border">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <HeadphonesIcon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{t.home.features.support.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.home.features.support.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl text-balance">
            {locale === "en" ? "Ready to Find Your Perfect Stay?" : "¿Listo para Encontrar tu Estancia Perfecta?"}
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/90 text-balance">
            {locale === "en"
              ? "Join thousands of happy pet owners who trust Pilar Platform"
              : "Únete a miles de dueños de mascotas felices que confían en Pilar Platform"}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">{t.nav.register}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
