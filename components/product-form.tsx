"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { getAuth } from "firebase/auth"
import app from "@/lib/firebase"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { getDatabase, ref, push, set, get } from "firebase/database"

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  url: z.string().url("URL inválida"),
  soldBy: z.enum(["Amazon"]),
  expirationDate: z.string().min(1, "A data de vencimento é obrigatória"),
})

type FormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  productId?: string
}

export default function ProductForm({ productId }: ProductFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const auth = getAuth(app)
  const user = auth.currentUser
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      soldBy: "Amazon",
      expirationDate: "",
    },
  })

  useEffect(() => {
    if (productId && user) {
      const loadProduct = async () => {
        const db = getDatabase()
        const productRef = ref(db, `products/${user.uid}/${productId}`)
        const snapshot = await get(productRef)
        
        if (snapshot.exists()) {
          const productData = snapshot.val()
          form.reset({
            name: productData.name,
            url: productData.url,
            soldBy: productData.soldBy,
            expirationDate: productData.expirationDate,
          })
        }
      }
      
      loadProduct()
    }
  }, [productId, user, form])

  async function onSubmit(data: FormValues) {
    if (!user) return

    setIsLoading(true)
    try {
      const db = getDatabase()
      const productRef = productId 
        ? ref(db, `products/${user.uid}/${productId}`)
        : ref(db, `products/${user.uid}`)

      if (productId) {
        // Atualizar produto existente
        await set(productRef, {
          ...data,
          createdAt: new Date().toISOString() // Mantém a data original se desejar
        })
      } else {
        // Criar novo produto
        await push(productRef, {
          ...data,
          createdAt: new Date().toISOString()
        })
      }
      
      toast({
        title: productId ? "Produto atualizado" : "Produto cadastrado",
        description: productId ? "O produto foi atualizado com sucesso" : "O produto foi cadastrado com sucesso",
      })
      
      router.push("/produtos")
    } catch (error) {
      console.error('Erro ao salvar no Firebase:', error)
      toast({
        title: "Erro",
        description: productId ? "Erro ao atualizar o produto" : "Erro ao cadastrar o produto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do produto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do Produto</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="soldBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendido por</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o vendedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Vencimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              "Cadastrar Produto"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
} 