"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLocale } from "@/components/locale-provider"
import { Loader2 } from "lucide-react"

interface AddPetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPetDialog({ open, onOpenChange }: AddPetDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { locale } = useLocale()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    species: "dog" as "dog" | "cat" | "other",
    breed: "",
    age: "",
    weight: "",
    special_needs: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("pets").insert({
        user_id: user.id,
        name: formData.name,
        species: formData.species,
        breed: formData.breed || null,
        age: formData.age ? Number.parseInt(formData.age) : null,
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        special_needs: formData.special_needs || null,
      })

      if (error) throw error

      toast({
        title: locale === "en" ? "Success!" : "¡Éxito!",
        description: locale === "en" ? "Pet added successfully" : "Mascota agregada correctamente",
      })

      setFormData({
        name: "",
        species: "dog",
        breed: "",
        age: "",
        weight: "",
        special_needs: "",
      })
      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: locale === "en" ? "Error" : "Error",
        description: error.message || (locale === "en" ? "Failed to add pet" : "Error al agregar la mascota"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{locale === "en" ? "Add Pet" : "Agregar Mascota"}</DialogTitle>
          <DialogDescription>
            {locale === "en" ? "Add a new pet to your profile" : "Agrega una nueva mascota a tu perfil"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{locale === "en" ? "Name" : "Nombre"} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="species">{locale === "en" ? "Species" : "Especie"} *</Label>
            <Select
              value={formData.species}
              onValueChange={(value: any) => setFormData({ ...formData, species: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">{locale === "en" ? "Dog" : "Perro"}</SelectItem>
                <SelectItem value="cat">{locale === "en" ? "Cat" : "Gato"}</SelectItem>
                <SelectItem value="other">{locale === "en" ? "Other" : "Otro"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">{locale === "en" ? "Breed" : "Raza"}</Label>
            <Input
              id="breed"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">{locale === "en" ? "Age (years)" : "Edad (años)"}</Label>
              <Input
                id="age"
                type="number"
                min="0"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">{locale === "en" ? "Weight (kg)" : "Peso (kg)"}</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_needs">{locale === "en" ? "Special Needs" : "Necesidades Especiales"}</Label>
            <Textarea
              id="special_needs"
              value={formData.special_needs}
              onChange={(e) => setFormData({ ...formData, special_needs: e.target.value })}
              disabled={loading}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              {locale === "en" ? "Cancel" : "Cancelar"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {locale === "en" ? "Add Pet" : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
