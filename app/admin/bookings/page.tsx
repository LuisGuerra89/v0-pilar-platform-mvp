import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminBookingsPage() {
  const admin = await isAdmin()

  if (!admin) {
    redirect("/")
  }

  const supabase = await getSupabaseServerClient()

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, properties(name, city), profiles(full_name)")
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Booking Management</h1>
        <p className="text-muted-foreground">View and manage all platform bookings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Guests/Pets</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings?.map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.properties?.name || "N/A"}
                      <div className="text-xs text-muted-foreground">{booking.properties?.city || ""}</div>
                    </TableCell>
                    <TableCell>{booking.profiles?.full_name || "N/A"}</TableCell>
                    <TableCell>{new Date(booking.check_in).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.check_out).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {booking.guests}/{booking.pets}
                    </TableCell>
                    <TableCell className="font-medium">${booking.total_price}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
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
