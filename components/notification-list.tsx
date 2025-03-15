"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import app from "@/lib/firebase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { database } from "@/lib/firebase"
import { getAuth } from "firebase/auth"
import { ref, onValue, remove } from "firebase/database"

interface Notification {
  id: number
  productName: string
  status: "available" | "outOfStock"
  price: number
  productLink: string
  soldBy: string
  createdAt: string
}

interface NotificationListProps {
  itemsPerPage: number
  currentPage: number
}

export default function NotificationList({ itemsPerPage, currentPage }: NotificationListProps) {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const auth = getAuth(app)
  const user = auth.currentUser

  useEffect(() => {
    try {
      if (!user) {
        return
      }
      const notificationsRef = ref(database, `notifications/${user.uid}/products`)
      
      const unsubscribe = onValue(notificationsRef, (snapshot) => {
        setIsLoading(true)
        const data = snapshot.val()
        
        if (data) {
          // Converter o objeto em array e ordenar por createdAt
          const notificationsArray = Object.values(data) as Notification[]
          const sortedNotifications = notificationsArray.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          setNotifications(sortedNotifications)
        } else {
          setNotifications([])
        }
        setIsLoading(false)
      })

      // Cleanup subscription
      return () => unsubscribe()
    } catch (error) {
      console.log("#LOG", error)
    }

  }, [user])

  const deleteNotification = async (id: number) => {
    try {
      const notificationRef = ref(database, `notifications/${user.uid}/products/${id}`)
      await remove(notificationRef)
      
      toast({
        title: "Notificação removida",
        description: "A notificação foi removida com sucesso",
      })
    } catch (error) {
      console.log("#LOG", error)
      toast({
        title: "Erro",
        description: "Erro ao remover a notificação",
        variant: "destructive",
      })
    }
  }

  // Calcular paginação
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedNotifications = notifications.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {paginatedNotifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{notification.productName}</h3>
              <Badge variant={notification.status === "Disponível" ? "default" : "secondary"}>
                {notification.status}
              </Badge>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span>Preço: R$ {notification.price.toFixed(2)}</span>
                <span>Vendido por: {notification.soldBy}</span>
                <span>
                  Notificado em: {new Date(notification.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Link
              href={notification.productLink}
              target="_blank"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver produto
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteNotification(notification.id)}
              aria-label="Excluir notificação"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

