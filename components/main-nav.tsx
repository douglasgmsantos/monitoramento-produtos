"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Bell, LogOut } from "lucide-react"
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
      } else {
        setUser(null)
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
        <div className="flex items-center gap-2 font-semibold">
          <Bell className="h-5 w-5" />
          <span>Notificações de Produtos</span>
        </div>

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

