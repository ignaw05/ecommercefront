"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { ProductoResponseDTO } from "@/types/producto"

interface ProductListProps {
  productos: ProductoResponseDTO[]
  onProductoClick: (producto: ProductoResponseDTO) => void
  onCrearNuevo: () => void
  isLoading: boolean
}

export function ProductList({ productos, onProductoClick, onCrearNuevo, isLoading }: ProductListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No hay productos disponibles</p>
        <Button onClick={onCrearNuevo} className="mt-4">
          Agregar Primer Producto
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground">Todos los Productos</h2>
        <Button onClick={onCrearNuevo}>Agregar Producto</Button>
      </div>
      <div className="space-y-3">
        {productos.map((producto) => (
          <Card
            key={producto.id}
            className="cursor-pointer p-6 transition-colors hover:bg-accent"
            onClick={() => onProductoClick(producto)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-foreground">{producto.nombre}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{producto.descripcion}</p>
                <div className="flex gap-4 pt-1 text-sm">
                  <span className="text-muted-foreground">
                    Categoría: <span className="text-foreground">{producto.categoria}</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <p className="text-lg font-semibold text-foreground">${producto.precio.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Stock: {producto.stock}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
