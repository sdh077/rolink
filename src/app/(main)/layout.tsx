import CafeNav from "@/components/cafe-nav"
import ChurchNav from "@/components/church-nav"
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

        {user.type === 'church' ?
          <>
            <ChurchNav user={user} />
            {church}
          </>
          :
          <>
            <CafeNav user={user} />
            {cafe}
          </>
        }
      </div>
    </SidebarProvider>
  )
}