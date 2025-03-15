'use client'

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicRoute = ["/", "/cadastro"].includes(pathname)

  return isPublicRoute ? (
    <AuthLayout>{children}</AuthLayout>
  ) : (
    <AuthenticatedLayout>{children}</AuthenticatedLayout>
  )
} 