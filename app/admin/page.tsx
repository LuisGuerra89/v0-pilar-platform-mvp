import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Calendar, DollarSign } from "lucide-react"

export default async function AdminDashboardPage() {
  const admin = await isAdmin()

  if (!admin) {
    redirect("/")
  }

  const supabase = await getSupabaseServerClient()

  // Fetch statistics
  const [{ count: usersCount }, { count: propertiesCount }, { count: bookingsCount }, { data: bookings }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("properties").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("total_price"),
    ])

  const totalRevenue = bookings?.reduce((sum, booking) => sum + Number(booking.total_price), 0) || 0

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your platform and view statistics</p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{usersCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{propertiesCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{bookingsCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <a href="/admin/users">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Manage Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View and manage user accounts and profiles</p>
            </CardContent>
          </a>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <a href="/admin/properties">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Manage Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Add, edit, and manage property listings</p>
            </CardContent>
          </a>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <a href="/admin/bookings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Manage Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View and manage all platform bookings</p>
            </CardContent>
          </a>
        </Card>
      </div>
    </div>
  )
}
