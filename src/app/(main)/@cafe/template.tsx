import { CafeSidebar } from "@/components/app-sidebar"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex">
      <CafeSidebar />
      <div className="p-4 w-full">
        {children}
      </div>
    </main>
  )
}
