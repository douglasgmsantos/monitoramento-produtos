export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Adicione aqui seu header, sidebar, etc */}
      <main className="container mx-auto py-6">{children}</main>
    </div>
  )
} 