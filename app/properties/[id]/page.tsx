import { notFound } from "next/navigation"
import Image from "next/image"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, PawPrint, Wifi, Car, Droplet, UtensilsCrossed, Clock } from "lucide-react"
import Link from "next/link"

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const user = await getCurrentUser()

  const { data: property, error } = await supabase.from("properties").select("*").eq("id", id).single()

  if (error || !property) {
    notFound()
  }

  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    parking: Car,
    pool: Droplet,
    restaurant: UtensilsCrossed,
    "24_7_care": Clock,
  }

  const amenityLabels: Record<string, { en: string; es: string }> = {
    wifi: { en: "WiFi", es: "WiFi" },
    parking: { en: "Parking", es: "Estacionamiento" },
    pet_spa: { en: "Pet Spa", es: "Spa para Mascotas" },
    restaurant: { en: "Restaurant", es: "Restaurante" },
    pool: { en: "Pool", es: "Piscina" },
    outdoor_space: { en: "Outdoor Space", es: "Espacio Exterior" },
    grooming: { en: "Grooming", es: "Peluquería" },
    training: { en: "Training", es: "Entrenamiento" },
    vet_on_call: { en: "Vet on Call", es: "Veterinario Disponible" },
    beach_access: { en: "Beach Access", es: "Acceso a Playa" },
    hiking_trails: { en: "Hiking Trails", es: "Senderos" },
    "24_7_care": { en: "24/7 Care", es: "Cuidado 24/7" },
    webcam_access: { en: "Webcam Access", es: "Acceso a Cámara" },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Gallery */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg md:col-span-2">
          <Image
            src={property.images[0] || "/placeholder.svg?height=600&width=1200"}
            alt={property.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge>{property.type === "hotel" ? "Hotel" : "Canine Residence"}</Badge>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span>{property.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({property.total_reviews} reviews)</span>
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">{property.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>
                {property.address}, {property.city}, {property.country}
              </span>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-3 text-xl font-semibold text-foreground">About this property</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Capacity */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Capacity</h2>
              <div className="flex gap-6">
                {property.max_guests > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">
                      Up to {property.max_guests} {property.max_guests === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <PawPrint className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">
                    Up to {property.max_pets} {property.max_pets === 1 ? "pet" : "pets"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Amenities</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {property.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity]
                    const label = amenityLabels[amenity]?.en || amenity
                    return (
                      <div key={amenity} className="flex items-center gap-2">
                        {Icon ? <Icon className="h-5 w-5 text-muted-foreground" /> : null}
                        <span className="text-foreground">{label}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Card */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">${property.price_per_night}</span>
                  <span className="text-muted-foreground">per night</span>
                </div>
              </div>

              {user ? (
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/booking/${property.id}`}>Book Now</Link>
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/login?redirect=/booking/${property.id}`}>Login to Book</Link>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">You need to login to make a booking</p>
                </div>
              )}

              <div className="mt-6 space-y-2 border-t border-border pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="text-foreground">Included</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cancellation</span>
                  <span className="text-foreground">Free up to 24h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
