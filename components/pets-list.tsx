"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLocale } from "@/components/locale-provider"
import { Plus, Trash2, Edit } from "lucide-react"
import type { Pet } from "@/lib/types"
import { AddPetDialog } from "@/components/add-pet-dialog"
import { EditPetDialog } from "@/components/edit-pet-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PetsListProps {
  pets: Pet[]
}

export function PetsList({ pets }: PetsListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { locale } = useLocale()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)

  const handleDelete = async () => {
    if (!selectedPet) return

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("pets").delete().eq("id", selectedPet.id)

      if (error) throw error

      toast({
        title: locale === "en" ? "Success!" : "¡Éxito!",
        description: locale === "en" ? "Pet deleted successfully" : "Mascota eliminada correctamente",
      })

      router.refresh()
      setDeleteDialogOpen(false)
      setSelectedPet(null)
    } catch (error: any) {
      toast({
        title: locale === "en" ? "Error" : "Error",
        description: error.message || (locale === "en" ? "Failed to delete pet" : "Error al eliminar la mascota"),
        variant: "destructive",
      })
    }
  }

  const getSpeciesLabel = (species: string) => {
    const labels: Record<string, { en: string; es: string }> = {
      dog: { en: "Dog", es: "Perro" },
      cat: { en: "Cat", es: "Gato" },
      other: { en: "Other", es: "Otro" },
    }
    return labels[species]?.[locale] || species
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{locale === "en" ? "My Pets" : "Mis Mascotas"}</h2>
          <p className="text-sm text-muted-foreground">
            {locale === "en" ? "Manage your pet information" : "Gestiona la información de tus mascotas"}
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {locale === "en" ? "Add Pet" : "Agregar Mascota"}
        </Button>
      </div>

      {pets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-center text-muted-foreground">
              {locale === "en" ? "You haven't added any pets yet" : "Aún no has agregado ninguna mascota"}
            </p>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {locale === "en" ? "Add Your First Pet" : "Agrega tu Primera Mascota"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pets.map((pet) => (
            <Card key={pet.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{pet.name}</CardTitle>
                    <CardDescription>{getSpeciesLabel(pet.species)}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPet(pet)
                        setEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPet(pet)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {pet.breed && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{locale === "en" ? "Breed:" : "Raza:"}</span>
                    <span className="font-medium">{pet.breed}</span>
                  </div>
                )}
                {pet.age && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{locale === "en" ? "Age:" : "Edad:"}</span>
                    <span className="font-medium">
                      {pet.age} {locale === "en" ? "years" : "años"}
                    </span>
                  </div>
                )}
                {pet.weight && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{locale === "en" ? "Weight:" : "Peso:"}</span>
                    <span className="font-medium">{pet.weight} kg</span>
                  </div>
                )}
                {pet.special_needs && (
                  <div className="mt-2 rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">
                      {locale === "en" ? "Special Needs:" : "Necesidades Especiales:"}
                    </p>
                    <p className="text-sm">{pet.special_needs}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddPetDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      {selectedPet && <EditPetDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} pet={selectedPet} />}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{locale === "en" ? "Delete Pet" : "Eliminar Mascota"}</AlertDialogTitle>
            <AlertDialogDescription>
              {locale === "en"
                ? "Are you sure you want to delete this pet? This action cannot be undone."
                : "¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{locale === "en" ? "Cancel" : "Cancelar"}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {locale === "en" ? "Delete" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
