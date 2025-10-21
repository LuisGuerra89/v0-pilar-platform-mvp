"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLocale } from "@/components/locale-provider"
import { Loader2 } from "lucide-react"
import type { Profile } from "@/lib/types"

interface ProfileFormProps {
  profile: Profile | null
  userId: string
}

export function ProfileForm({ profile, userId }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { locale } = useLocale()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    country: profile?.country || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        ...formData,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: locale === "en" ? "Success!" : "¡Éxito!",
        description: locale === "en" ? "Profile updated successfully" : "Perfil actualizado correctamente",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: locale === "en" ? "Error" : "Error",
        description: error.message || (locale === "en" ? "Failed to update profile" : "Error al actualizar el perfil"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{locale === "en" ? "Personal Information" : "Información Personal"}</CardTitle>
        <CardDescription>
          {locale === "en" ? "Update your personal details" : "Actualiza tus datos personales"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">{locale === "en" ? "Full Name" : "Nombre completo"}</Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{locale === "en" ? "Phone" : "Teléfono"}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{locale === "en" ? "Address" : "Dirección"}</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">{locale === "en" ? "City" : "Ciudad"}</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">{locale === "en" ? "Country" : "País"}</Label>
              <Input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {locale === "en" ? "Save Changes" : "Guardar cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
