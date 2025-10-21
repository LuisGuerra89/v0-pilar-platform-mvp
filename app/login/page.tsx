"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLocale } from "@/components/locale-provider"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { locale } = useLocale()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      toast({
        title: locale === "en" ? "Success!" : "¡Éxito!",
        description: locale === "en" ? "You have successfully logged in." : "Has iniciado sesión correctamente.",
      })

      const redirect = searchParams.get("redirect") || "/"
      router.push(redirect)
      router.refresh()
    } catch (error: any) {
      toast({
        title: locale === "en" ? "Error" : "Error",
        description: error.message || (locale === "en" ? "Failed to login" : "Error al iniciar sesión"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {locale === "en" ? "Welcome back" : "Bienvenido de nuevo"}
          </CardTitle>
          <CardDescription>
            {locale === "en"
              ? "Enter your credentials to access your account"
              : "Ingresa tus credenciales para acceder a tu cuenta"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{locale === "en" ? "Email" : "Correo electrónico"}</Label>
              <Input
                id="email"
                type="email"
                placeholder={locale === "en" ? "you@example.com" : "tu@ejemplo.com"}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{locale === "en" ? "Password" : "Contraseña"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {locale === "en" ? "Login" : "Iniciar sesión"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {locale === "en" ? "Don't have an account?" : "¿No tienes una cuenta?"}{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                {locale === "en" ? "Register" : "Registrarse"}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
