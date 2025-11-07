export enum Categoria {
  ELECTRONICA = "ELECTRONICA",
  ROPA = "ROPA",
  ALIMENTOS = "ALIMENTOS",
  HOGAR = "HOGAR",
  DEPORTES = "DEPORTES",
}

export interface ProductoDTO {
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria: string
}

export interface ProductoResponseDTO {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria: string
}

export interface ActualizarStockDTO {
  stock: number
}
