"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, PawPrint } from "lucide-react"
import type { Property } from "@/lib/types"
import { useLocale } from "@/components/locale-provider"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { locale } = useLocale()

  const getTypeLabel = (type: string) => {
    return type === "hotel"
      ? locale === "en"
        ? "Hotel"
        : "Hotel"
      : locale === "en"
        ? "Canine Residence"
        : "Residencia Canina"
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={property.images[0] || "/placeholder.svg?height=400&width=600"}
            alt={property.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <Badge className="absolute right-2 top-2 bg-background/90 text-foreground">
            {getTypeLabel(property.type)}
          </Badge>
        </div>

        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-lg font-semibold text-foreground">{property.name}</h3>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span>{property.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {property.city}, {property.country}
            </span>
          </div>

          {property.description && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed">{property.description}</p>
          )}

          <div className="flex gap-4 text-sm text-muted-foreground">
            {property.max_guests > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{property.max_guests}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <PawPrint className="h-4 w-4" />
              <span>{property.max_pets}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border bg-muted/30 p-4">
          <div className="flex w-full items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">${property.price_per_night}</p>
              <p className="text-xs text-muted-foreground">{locale === "en" ? "per night" : "por noche"}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              {property.total_reviews} {locale === "en" ? "reviews" : "reseñas"}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
