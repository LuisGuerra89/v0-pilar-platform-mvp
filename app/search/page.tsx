import { getSupabaseServerClient } from "@/lib/supabase/server"
import { SearchFilters } from "@/components/search-filters"
import { PropertyCard } from "@/components/property-card"

interface SearchPageProps {
  searchParams: Promise<{
    query?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    city?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const supabase = await getSupabaseServerClient()

  // Build query
  let query = supabase.from("properties").select("*").eq("is_active", true)

  // Apply filters
  if (params.query) {
    query = query.or(`name.ilike.%${params.query}%,city.ilike.%${params.query}%,description.ilike.%${params.query}%`)
  }

  if (params.type && params.type !== "all") {
    query = query.eq("type", params.type)
  }

  if (params.minPrice) {
    query = query.gte("price_per_night", Number.parseFloat(params.minPrice))
  }

  if (params.maxPrice) {
    query = query.lte("price_per_night", Number.parseFloat(params.maxPrice))
  }

  if (params.city) {
    query = query.ilike("city", `%${params.city}%`)
  }

  // Execute query
  const { data: properties, error } = await query.order("rating", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Search Properties</h1>
        <p className="text-muted-foreground">Find the perfect stay for you and your pet</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Filters Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <SearchFilters />
        </aside>

        {/* Results */}
        <div>
          {error ? (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
              Error loading properties. Please try again.
            </div>
          ) : properties && properties.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Found {properties.length} {properties.length === 1 ? "property" : "properties"}
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 p-12 text-center">
              <p className="mb-2 text-lg font-medium text-foreground">No properties found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
