"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ProductoResponseDTO, ProductoDTO, ActualizarStockDTO } from "@/types/producto"
import { Categoria } from "@/types/producto"

interface ProductDetailProps {
  producto: ProductoResponseDTO
  onVolver: () => void
  onActualizado: () => void
  apiBaseUrl: string
}

export function ProductDetail({ producto, onVolver, onActualizado, apiBaseUrl }: ProductDetailProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProductoDTO>({
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    stock: producto.stock,
    categoria: producto.categoria,
  })
  const [stockActualizar, setStockActualizar] = useState(producto.stock)

  const handleChange = (field: keyof ProductoDTO, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleActualizarCompleto = async () => {
    try {
      setIsLoading(true)
      console.log("[v0] Actualizando producto completo:", formData)

      const response = await fetch(`${apiBaseUrl}/api/productos/${producto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.log("[v0] Error response:", errorData)
        throw new Error("Error al actualizar")
      }

      console.log("[v0] Producto actualizado exitosamente")
      toast({
        title: "Producto actualizado",
        description: "Todos los datos se actualizaron correctamente",
      })
      onActualizado()
    } catch (error) {
      console.error("[v0] Error actualizando producto:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleActualizarStock = async () => {
    try {
      setIsLoading(true)
      const stockDTO: ActualizarStockDTO = { stock: stockActualizar }
      console.log("[v0] Actualizando stock:", stockDTO)

      const response = await fetch(`${apiBaseUrl}/api/productos/${producto.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockDTO),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.log("[v0] Error response:", errorData)
        throw new Error("Error al actualizar stock")
      }

      console.log("[v0] Stock actualizado exitosamente")
      toast({
        title: "Stock actualizado",
        description: `Nuevo stock: ${stockActualizar}`,
      })
      onActualizado()
    } catch (error) {
      console.error("[v0] Error actualizando stock:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el stock",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEliminar = async () => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    try {
      setIsLoading(true)
      console.log("[v0] Eliminando producto ID:", producto.id)

      const response = await fetch(`${apiBaseUrl}/api/productos/${producto.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.log("[v0] Error response:", errorData)
        throw new Error("Error al eliminar")
      }

      console.log("[v0] Producto eliminado exitosamente")
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó correctamente",
      })
      onActualizado()
    } catch (error) {
      console.error("[v0] Error eliminando producto:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onVolver} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Volver a la lista
      </Button>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Detalles del Producto</h2>
            <p className="text-sm text-muted-foreground">ID: {producto.id}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select value={formData.categoria} onValueChange={(value) => handleChange("categoria", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Categoria).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.precio}
                onChange={(e) => handleChange("precio", Number.parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange("stock", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="col-span-full space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                rows={4}
                maxLength={500}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleActualizarCompleto} disabled={isLoading}>
              Actualizar Todo
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Actualizar Stock</h3>
            <div className="space-y-2">
              <Label htmlFor="stock-update">Nuevo Stock</Label>
              <Input
                id="stock-update"
                type="number"
                min="0"
                value={stockActualizar}
                onChange={(e) => setStockActualizar(Number.parseInt(e.target.value))}
              />
            </div>
            <Button onClick={handleActualizarStock} disabled={isLoading} className="w-full">
              Actualizar Stock
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Zona de Peligro</h3>
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
            </p>
            <Button variant="destructive" onClick={handleEliminar} disabled={isLoading} className="w-full">
              Eliminar Producto
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
