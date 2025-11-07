"use client"

import { useEffect, useState } from "react"
import { ProductList } from "@/components/product-list"
import { ProductDetail } from "@/components/product-detail"
import { ProductCreate } from "@/components/product-create"
import type { ProductoResponseDTO } from "@/types/producto"
import { Categoria } from "@/types/producto"

// Cambia esta URL por la ruta de tu API
const API_BASE_URL = "https://apirest-gestionproductos.onrender.com"

export default function AdminPage() {
  const [productos, setProductos] = useState<ProductoResponseDTO[]>([])
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoResponseDTO | null>(null)
  const [modoCrear, setModoCrear] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null)

  const cargarProductos = async (categoria?: string) => {
    try {
      setIsLoading(true)
      let url = `${API_BASE_URL}/api/productos`
      
      if (categoria) {
        url = `${API_BASE_URL}/api/productos/categoria/${categoria}`
      }
      
      const response = await fetch(url)
      if (!response.ok) throw new Error("Error al cargar productos")
      const data = await response.json()
      setProductos(data)
    } catch (error) {
      console.error("[v0] Error cargando productos:", error)
      alert("No se pudieron cargar los productos. Verifica que la URL de la API esté correcta.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const handleProductoClick = (producto: ProductoResponseDTO) => {
    setProductoSeleccionado(producto)
  }

  const handleVolver = () => {
    setProductoSeleccionado(null)
    setModoCrear(false)
  }

  const handleActualizado = () => {
    cargarProductos(categoriaSeleccionada || undefined)
    setProductoSeleccionado(null)
    setModoCrear(false)
  }

  const handleCrearNuevo = () => {
    setModoCrear(true)
    setProductoSeleccionado(null)
  }

  const handleFiltroCategoria = (categoria: string | null) => {
    setCategoriaSeleccionada(categoria)
    cargarProductos(categoria || undefined)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-2xl font-medium text-foreground">Gestión de Productos</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {modoCrear ? (
          <ProductCreate onVolver={handleVolver} onCreado={handleActualizado} apiBaseUrl={API_BASE_URL} />
        ) : productoSeleccionado ? (
          <ProductDetail
            producto={productoSeleccionado}
            onVolver={handleVolver}
            onActualizado={handleActualizado}
            apiBaseUrl={API_BASE_URL}
          />
        ) : (
          <ProductList
            productos={productos}
            onProductoClick={handleProductoClick}
            onCrearNuevo={handleCrearNuevo}
            isLoading={isLoading}
            categoriaSeleccionada={categoriaSeleccionada}
            onFiltroCategoria={handleFiltroCategoria}
          />
        )}
      </main>
    </div>
  )
}
