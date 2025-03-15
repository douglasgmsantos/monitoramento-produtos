'use client'

import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import { usePathname } from 'next/navigation'
import AuthLayout from '@/app/(auth)/layout'
import AuthenticatedLayout from '@/app/(authenticated)/layout'

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const pathname = usePathname()
  const isPublicRoute = ["/", "/cadastro"].includes(pathname)

  return isPublicRoute ? (
    <AuthLayout>{children}</AuthLayout>
  ) : (
    <AuthenticatedLayout>{children}</AuthenticatedLayout>
  )
} 