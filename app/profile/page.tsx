import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile-form"
import { PetsList } from "@/components/pets-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = await getSupabaseServerClient()

  // Fetch profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch pets
  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-foreground">My Profile</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Personal Information</TabsTrigger>
            <TabsTrigger value="pets">My Pets</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileForm profile={profile} userId={user.id} />
          </TabsContent>

          <TabsContent value="pets" className="mt-6">
            <PetsList pets={pets || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
