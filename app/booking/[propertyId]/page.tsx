import { redirect, notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { BookingForm } from "@/components/booking-form"

interface BookingPageProps {
  params: Promise<{ propertyId: string }>
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { propertyId } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect(`/login?redirect=/booking/${propertyId}`)
  }

  const supabase = await getSupabaseServerClient()

  const { data: property, error } = await supabase.from("properties").select("*").eq("id", propertyId).single()

  if (error || !property) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Complete Your Booking</h1>
        <BookingForm property={property} userId={user.id} />
      </div>
    </div>
  )
}
