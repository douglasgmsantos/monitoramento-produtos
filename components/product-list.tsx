"use client"

import { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { getDatabase, ref, onValue, remove } from "firebase/database"
import app from "@/lib/firebase"
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Product {
  id: string
  name: string
  url: string
  soldBy: string
  createdAt: string
  maxPrice: number
  phoneNumber: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const auth = getAuth(app)
  const user = auth.currentUser

  useEffect(() => {
    if (!user) return

    const db = getDatabase()
    const productsRef = ref(db, `products/${user.uid}`)

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        // Converte o objeto do Firebase em um array de produtos
        const productsArray = Object.entries(data).map(([id, product]) => ({
          id,
          ...(product as Omit<Product, 'id'>)
        }))
        setProducts(productsArray)
      } else {
        setProducts([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleDeleteProduct = async (productId: string) => {
    if (!user) return
    
    try {
      const db = getDatabase()
      const productRef = ref(db, `products/${user.uid}/${productId}`)
      await remove(productRef)
    } catch (error) {
      console.error("Erro ao deletar produto:", error)
      // Aqui você pode adicionar uma notificação de erro se desejar
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Produtos</h1>
        <Link 
          href="/produtos/novo" 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Adicionar Produto
        </Link>
      </div>
      
      {products.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum produto cadastrado</p>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Preço Máximo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <a 
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Link do produto
                    </a>
                  </TableCell>
                  <TableCell>{product.soldBy}</TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {product.maxPrice ? 
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(product.maxPrice) : 
                      'Sem preço máximo'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link
                        href={`/produtos/editar/${product.id}`}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
} 