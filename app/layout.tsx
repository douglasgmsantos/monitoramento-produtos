import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import RouteGuard from "@/components/RouteGuard"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Notificações de Produtos",
  description: "Aplicação para gerenciar notificações de produtos",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RouteGuard>
            {children}
          </RouteGuard>
        </ThemeProvider>
      </body>
    </html>
  )
}
          