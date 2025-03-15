"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

export default function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<{ name: string | null } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ name: firebaseUser.displayName })
        // Set auth cookie when user is logged in
        document.cookie = `auth=${firebaseUser.uid}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
      } else {
        setUser(null)
        // Remove auth cookie when user logs out
        document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      }
    })

    return () => unsubscribe()
  }, [])

  // Não renderizar nada até o componente estar montado no cliente
  if (!mounted) {
    return null
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // Remove auth cookie
      document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar",
        variant: "destructive",
      })
    }
  }

  // Não mostrar a navegação na página de login ou cadastro
  if (pathname === "/" || pathname === "/cadastro") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">

        <nav className="flex flex-1 items-center justify-end space-x-4">
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Olá, {user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

