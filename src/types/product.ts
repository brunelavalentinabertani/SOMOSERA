export type ProductVariant = {
  id: string
  color_name: string 
  color_hex: string 
  storage_gb: number 
  ram_gb?: number | null
  screen_inches?: number | null
  price_usd: number | null
  image_url?: string
}

export type Product = {
  id: string
  name: string
  brand: string              // 👈 NUEVO (obligatorio)
  category: string 
  price_usd: number | null
  description: string
  image_url?: string | null
  usd_rate?: number | null
  product_variants: ProductVariant[]
  products_colors?: ProductColor[]
}
export type ProductColor = {
  id: string
  name: string
  hex: string
  image_url?: string | null
}
