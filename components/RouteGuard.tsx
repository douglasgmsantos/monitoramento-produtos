'use client'

import AuthLayout from '@/app/(auth)/layout'
import AuthenticatedLayout from '@/app/(authenticated)/layout'
import { usePathname } from 'next/navigation'

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicRoute = ["/", "/cadastro"].includes(pathname)

  return isPublicRoute ? (
    <AuthLayout>{children}</AuthLayout>
  ) : (
    <AuthenticatedLayout>{children}</AuthenticatedLayout>
  )
} 