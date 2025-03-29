import Nav from "@/components/nav"
import { SidebarProvider } from "@/components/ui/sidebar"
import { IUser } from "@/interface/user"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Layout({
  church,
  cafe,
}: {
  church: React.ReactNode
  cafe: React.ReactNode
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  const { data: user } = await supabase.from('user').select('*').eq('id', data.user?.id).single<IUser>()
  if (!user) {
    redirect('/login')
  } return (
    <SidebarProvider>
      <div>
        <Nav user={user} />
        {user.type === 'church' ? church : cafe}
      </div>
    </SidebarProvider>
  )
}