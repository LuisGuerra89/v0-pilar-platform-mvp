"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/components/locale-provider"
import { Search, X } from "lucide-react"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale } = useLocale()

  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    type: searchParams.get("type") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    city: searchParams.get("city") || "",
  })

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (filters.query) params.set("query", filters.query)
    if (filters.type && filters.type !== "all") params.set("type", filters.type)
    if (filters.minPrice) params.set("minPrice", filters.minPrice)
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
    if (filters.city) params.set("city", filters.city)

    router.push(`/search?${params.toString()}`)
  }

  const handleClear = () => {
    setFilters({
      query: "",
      type: "all",
      minPrice: "",
      maxPrice: "",
      city: "",
    })
    router.push("/search")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{locale === "en" ? "Filters" : "Filtros"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="query">{locale === "en" ? "Search" : "Buscar"}</Label>
          <Input
            id="query"
            placeholder={locale === "en" ? "Property name or city..." : "Nombre o ciudad..."}
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label htmlFor="type">{locale === "en" ? "Property Type" : "Tipo de Propiedad"}</Label>
          <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{locale === "en" ? "All Types" : "Todos los Tipos"}</SelectItem>
              <SelectItem value="hotel">{locale === "en" ? "Hotels" : "Hoteles"}</SelectItem>
              <SelectItem value="canine_residence">
                {locale === "en" ? "Canine Residences" : "Residencias Caninas"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">{locale === "en" ? "City" : "Ciudad"}</Label>
          <Input
            id="city"
            placeholder={locale === "en" ? "Enter city..." : "Ingresa ciudad..."}
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>{locale === "en" ? "Price per Night" : "Precio por Noche"}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder={locale === "en" ? "Min" : "Mín"}
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Input
              type="number"
              placeholder={locale === "en" ? "Max" : "Máx"}
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="mr-2 h-4 w-4" />
            {locale === "en" ? "Search" : "Buscar"}
          </Button>
          <Button onClick={handleClear} variant="outline">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
