"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLocale } from "@/components/locale-provider"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { locale } = useLocale()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: locale === "en" ? "Error" : "Error",
        description: locale === "en" ? "Passwords do not match" : "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: locale === "en" ? "Error" : "Error",
        description:
          locale === "en" ? "Password must be at least 6 characters" : "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/profile`,
          data: {
            full_name: formData.fullName,
          },
        },
      })

      if (error) throw error

      toast({
        title: locale === "en" ? "Success!" : "¡Éxito!",
        description:
          locale === "en"
            ? "Account created successfully. Please check your email to verify your account."
            : "Cuenta creada exitosamente. Por favor revisa tu correo para verificar tu cuenta.",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: locale === "en" ? "Error" : "Error",
        description: error.message || (locale === "en" ? "Failed to create account" : "Error al crear la cuenta"),
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
            {locale === "en" ? "Create an account" : "Crear una cuenta"}
          </CardTitle>
          <CardDescription>
            {locale === "en" ? "Enter your information to get started" : "Ingresa tu información para comenzar"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{locale === "en" ? "Full Name" : "Nombre completo"}</Label>
              <Input
                id="fullName"
                type="text"
                placeholder={locale === "en" ? "John Doe" : "Juan Pérez"}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={loading}
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{locale === "en" ? "Confirm Password" : "Confirmar contraseña"}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {locale === "en" ? "Create Account" : "Crear cuenta"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {locale === "en" ? "Already have an account?" : "¿Ya tienes una cuenta?"}{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                {locale === "en" ? "Login" : "Iniciar sesión"}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
