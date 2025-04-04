import { CafeSidebar } from "@/components/app-sidebar"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex container">
      <CafeSidebar />
      <div className="p-2 w-full">
        {children}
      </div>
    </main>
  )
}
