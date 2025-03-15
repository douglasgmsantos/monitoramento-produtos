import { Sidebar } from "@/components/sidebar"
import MainNav from "@/components/main-nav"
import { Toaster } from "@/components/ui/toaster"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <div className="md:ml-64">
        <MainNav />
        <main className="p-8">
          {children}
        </main>
      </div>
      <Toaster />
    </>
  )
} 