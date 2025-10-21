"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLocale } from "@/components/locale-provider"
import { Loader2, Calendar, Users, PawPrint } from "lucide-react"
import type { Property } from "@/lib/types"

interface BookingFormProps {
  property: Property
  userId: string
}

export function BookingForm({ property, userId }: BookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { locale } = useLocale()
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    checkIn: today,
    checkOut: tomorrow,
    guests: property.max_guests > 0 ? 1 : 0,
    pets: 1,
    specialRequests: "",
  })

  const calculateNights = () => {
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : 0
  }

  const calculateTotal = () => {
    return calculateNights() * property.price_per_night
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      toast({
        title: locale === "en" ? "Error" : "Error",
        description:
          locale === "en"
            ? "Check-out date must be after check-in date"
            : "La fecha de salida debe ser posterior a la fecha de entrada",
        variant: "destructive",
      })
      return
    }

    if (formData.guests > property.max_guests) {
      toast({
        title: locale === "en" ? "Error" : "Error",
        description:
          locale === "en"
            ? `Maximum ${property.max_guests} guests allowed`
            : `Máximo ${property.max_guests} huéspedes permitidos`,
        variant: "destructive",
      })
      return
    }

    if (formData.pets > property.max_pets) {
      toast({
        title: locale === "en" ? "Error" : "Error",
        description:
          locale === "en"
            ? `Maximum ${property.max_pets} pets allowed`
            : `Máximo ${property.max_pets} mascotas permitidas`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: userId,
          property_id: property.id,
          check_in: formData.checkIn,
          check_out: formData.checkOut,
          guests: formData.guests,
          pets: formData.pets,
          total_price: calculateTotal(),
          status: "pending",
          special_requests: formData.specialRequests || null,
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      // In a real app, you would create a Stripe payment intent here
      // For now, we'll simulate a successful payment
      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          payment_intent_id: `sim_${Date.now()}`,
        })
        .eq("id", booking.id)

      if (updateError) throw updateError

      toast({
        title: locale === "en" ? "Success!" : "¡Éxito!",
        description: locale === "en" ? "Booking confirmed successfully" : "Reserva confirmada exitosamente",
      })

      router.push("/bookings")
    } catch (error: any) {
      toast({
        title: locale === "en" ? "Error" : "Error",
        description: error.message || (locale === "en" ? "Failed to create booking" : "Error al crear la reserva"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Property Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{property.name}</CardTitle>
          <CardDescription>
            {property.city}, {property.country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{locale === "en" ? "Price per night" : "Precio por noche"}</span>
            <span className="text-2xl font-bold text-foreground">${property.price_per_night}</span>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>{locale === "en" ? "Booking Details" : "Detalles de la Reserva"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="checkIn">
                <Calendar className="mr-2 inline h-4 w-4" />
                {locale === "en" ? "Check-in" : "Entrada"}
              </Label>
              <Input
                id="checkIn"
                type="date"
                min={today}
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut">
                <Calendar className="mr-2 inline h-4 w-4" />
                {locale === "en" ? "Check-out" : "Salida"}
              </Label>
              <Input
                id="checkOut"
                type="date"
                min={formData.checkIn}
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Guests and Pets */}
          <div className="grid gap-4 md:grid-cols-2">
            {property.max_guests > 0 && (
              <div className="space-y-2">
                <Label htmlFor="guests">
                  <Users className="mr-2 inline h-4 w-4" />
                  {locale === "en" ? "Guests" : "Huéspedes"}
                </Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={property.max_guests}
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: Number.parseInt(e.target.value) })}
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="pets">
                <PawPrint className="mr-2 inline h-4 w-4" />
                {locale === "en" ? "Pets" : "Mascotas"}
              </Label>
              <Input
                id="pets"
                type="number"
                min="1"
                max={property.max_pets}
                value={formData.pets}
                onChange={(e) => setFormData({ ...formData, pets: Number.parseInt(e.target.value) })}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">
              {locale === "en" ? "Special Requests (Optional)" : "Solicitudes Especiales (Opcional)"}
            </Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              disabled={loading}
              rows={3}
              placeholder={
                locale === "en"
                  ? "Any special requirements or requests..."
                  : "Cualquier requisito o solicitud especial..."
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{locale === "en" ? "Price Summary" : "Resumen de Precio"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${property.price_per_night} × {calculateNights()} {locale === "en" ? "nights" : "noches"}
            </span>
            <span className="font-medium text-foreground">${calculateTotal()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{locale === "en" ? "Service fee" : "Tarifa de servicio"}</span>
            <span className="font-medium text-foreground">{locale === "en" ? "Included" : "Incluido"}</span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-foreground">{locale === "en" ? "Total" : "Total"}</span>
              <span className="text-2xl font-bold text-foreground">${calculateTotal()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full" disabled={loading || calculateNights() === 0}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {locale === "en" ? "Confirm and Pay" : "Confirmar y Pagar"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        {locale === "en"
          ? "By confirming, you agree to our terms and conditions"
          : "Al confirmar, aceptas nuestros términos y condiciones"}
      </p>
    </form>
  )
}
