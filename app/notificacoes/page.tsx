"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import app from "@/lib/firebase"
import NotificationList from "@/components/notification-list"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDatabase, ref, onValue } from "firebase/database"

export default function NotificationsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState("5")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    const auth = getAuth(app)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/")
      } else {
        setIsAuthenticated(true)
        // Buscar total de notificações quando usuário estiver autenticado
        const notificationsRef = ref(getDatabase(app), `notifications/${user.uid}/products`)
        onValue(notificationsRef, (snapshot) => {
          if (snapshot.exists()) {
            let count = 0;
            snapshot.forEach(() => {
              count++;
            });
            setTotalItems(count);
          } else {
            setTotalItems(0);
          }
        })
      }
    })

    return () => unsubscribe()
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto py-1 space-y-6">
      <Card>
        <CardHeader className="flex-row justify-between" >
          <div >
            <CardTitle>Notificações de Produtos</CardTitle>
            <CardDescription>Visualize as últimas atualizações dos produtos que você está acompanhando</CardDescription>
          </div>
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Itens por página:</span>
              <Select
                value={itemsPerPage}
                onValueChange={(value) => {
                  setItemsPerPage(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        
        </CardHeader>
        <CardContent>

        
          
        <NotificationList itemsPerPage={Number.parseInt(itemsPerPage)} currentPage={currentPage} />

          <div className="mt-4 flex justify-center">
            <Pagination
              totalItems={totalItems}
              itemsPerPage={Number.parseInt(itemsPerPage)}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

