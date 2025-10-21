"use client"

import Link from "next/link"
import { useLocale } from "@/components/locale-provider"
import { getTranslations } from "@/lib/i18n"

export function Footer() {
  const { locale } = useLocale()
  const t = getTranslations(locale)

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">Pilar</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {locale === "en"
                ? "Your trusted platform for booking hotels and canine residences."
                : "Tu plataforma de confianza para reservar hoteles y residencias caninas."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              {locale === "en" ? "Quick Links" : "Enlaces Rápidos"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.search}
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.myBookings}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">{locale === "en" ? "Company" : "Empresa"}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">{locale === "en" ? "Legal" : "Legal"}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pilar Platform. {t.footer.rights}.
          </p>
        </div>
      </div>
    </footer>
  )
}
