import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminPropertiesPage() {
  const admin = await isAdmin()

  if (!admin) {
    redirect("/")
  }

  const supabase = await getSupabaseServerClient()

  const { data: properties } = await supabase.from("properties").select("*").order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Property Management</h1>
          <p className="text-muted-foreground">View and manage all property listings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties?.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{property.type === "hotel" ? "Hotel" : "Canine Residence"}</Badge>
                    </TableCell>
                    <TableCell>
                      {property.city}, {property.country}
                    </TableCell>
                    <TableCell>${property.price_per_night}</TableCell>
                    <TableCell>{property.rating.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge variant={property.is_active ? "default" : "secondary"}>
                        {property.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/properties/${property.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
