"use client"

import Link from "next/link"
import { Moon, Sun, Globe, Menu, X, UserIcon, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { useLocale } from "@/components/locale-provider"
import { getTranslations } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { locale, setLocale } = useLocale()
  const t = getTranslations(locale)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        // Check if user is admin
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === "admin")
          })
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === "admin")
          })
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    toast({
      title: locale === "en" ? "Logged out" : "Sesión cerrada",
      description: locale === "en" ? "You have been logged out successfully" : "Has cerrado sesión correctamente",
    })
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">Pilar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t.nav.home}
            </Link>
            <Link href="/search" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t.nav.search}
            </Link>
            {user && (
              <>
                <Link
                  href="/bookings"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t.nav.myBookings}
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {t.nav.admin}
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocale("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("es")}>Español</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <UserIcon className="mr-2 h-4 w-4" />
                      {user.user_metadata?.full_name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">{t.nav.profile}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bookings">{t.nav.myBookings}</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <Shield className="mr-2 h-4 w-4" />
                            {t.nav.admin}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t.nav.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">{t.nav.login}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">{t.nav.register}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.home}
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.search}
              </Link>
              {user && (
                <>
                  <Link
                    href="/bookings"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.nav.myBookings}
                  </Link>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.nav.profile}
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t.nav.admin}
                    </Link>
                  )}
                </>
              )}
              <div className="flex gap-2 pt-2">
                {user ? (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    {t.nav.logout}
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        {t.nav.login}
                      </Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        {t.nav.register}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
