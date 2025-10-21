"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, PawPrint, ExternalLink } from "lucide-react"
import type { Booking } from "@/lib/types"
import { useLocale } from "@/components/locale-provider"

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const { locale } = useLocale()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "completed":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      default:
        return ""
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; es: string }> = {
      confirmed: { en: "Confirmed", es: "Confirmada" },
      pending: { en: "Pending", es: "Pendiente" },
      cancelled: { en: "Cancelled", es: "Cancelada" },
      completed: { en: "Completed", es: "Completada" },
    }
    return labels[status]?.[locale] || status
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateNights = () => {
    const checkIn = new Date(booking.check_in)
    const checkOut = new Date(booking.check_out)
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  if (!booking.properties) return null

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid gap-4 md:grid-cols-[200px_1fr]">
          {/* Property Image */}
          <div className="relative aspect-video md:aspect-square">
            <Image
              src={booking.properties.images[0] || "/placeholder.svg?height=200&width=200"}
              alt={booking.properties.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Booking Details */}
          <div className="flex flex-col justify-between p-4">
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{booking.properties.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {booking.properties.city}, {booking.properties.country}
                    </span>
                  </div>
                </div>
                <Badge className={getStatusColor(booking.status)}>{getStatusLabel(booking.status)}</Badge>
              </div>

              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>
                    {calculateNights()} {locale === "en" ? "nights" : "noches"}
                  </span>
                </div>
                {booking.guests > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {booking.guests} {locale === "en" ? "guests" : "huéspedes"}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PawPrint className="h-4 w-4" />
                  <span>
                    {booking.pets} {locale === "en" ? "pets" : "mascotas"}
                  </span>
                </div>
              </div>

              {booking.special_requests && (
                <div className="mt-3 rounded-md bg-muted p-2">
                  <p className="text-xs text-muted-foreground">
                    {locale === "en" ? "Special Requests:" : "Solicitudes Especiales:"}
                  </p>
                  <p className="text-sm">{booking.special_requests}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">{locale === "en" ? "Total Price" : "Precio Total"}</p>
                <p className="text-2xl font-bold text-foreground">${booking.total_price}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/properties/${booking.property_id}`}>
                  {locale === "en" ? "View Property" : "Ver Propiedad"}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
