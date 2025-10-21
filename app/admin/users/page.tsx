import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminUsersPage() {
  const admin = await isAdmin()

  if (!admin) {
    redirect("/")
  }

  const supabase = await getSupabaseServerClient()

  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">View and manage all user accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.full_name || "N/A"}</TableCell>
                    <TableCell>{profile.id}</TableCell>
                    <TableCell>{profile.city || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                        {profile.role || "user"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
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
