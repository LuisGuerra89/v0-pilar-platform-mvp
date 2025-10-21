import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { BookingCard } from "@/components/booking-card"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default async function BookingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/bookings")
  }

  const supabase = await getSupabaseServerClient()

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, properties(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-foreground">My Bookings</h1>

        {bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-2 text-center text-lg font-medium text-foreground">No bookings yet</p>
              <p className="text-center text-sm text-muted-foreground">
                Start exploring properties and make your first booking
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
