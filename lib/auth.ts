import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function isAdmin() {
  const user = await getCurrentUser()
  if (!user) return false

  const supabase = await getSupabaseServerClient()
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  return profile?.role === "admin"
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error("Admin access required")
  }
}
