"use client"

import { useParams } from "next/navigation"
import ProductForm from "@/components/product-form"

export default function EditProductPage() {
  const params = useParams()
  const productId = params.id as string

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Produto</h1>
      <ProductForm productId={productId} />
    </div>
  )
} 