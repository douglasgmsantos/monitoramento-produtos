"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Menu, 
  X,
  Bell,
  PlusCircle
} from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (pathname === "/" || pathname === "/cadastro") {
    return null
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Botão do menu mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-background border-r transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center mb-8 mt-4">
            <Package className="h-6 w-6 mr-2" />
            <span className="text-lg font-bold">Monitor de Produtos</span>
          </div>

          <nav className="space-y-2 flex-1">
            <Link href="/notificacoes">
              <Button
                variant={pathname === "/notificacoes" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notificações
              </Button>
            </Link>
            <Link href="/produtos/novo">
              <Button
                variant={pathname === "/produtos/novo" ? "secondary" : "ghost"}
                className="w-full justify-start mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Cadastrar Produto
              </Button>
            </Link>
            <Link href="/produtos">
              <Button
                variant={pathname === "/produtos" ? "secondary" : "ghost"}
                className="w-full justify-start mt-2"
              >
                <Package className="h-4 w-4 mr-2" />
                Meus Produtos
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
} 