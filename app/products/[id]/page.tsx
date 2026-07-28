import { supabase } from "../../../lib/supabaseClient"
import { notFound } from "next/navigation"
import ProductDetail from "./ProductDetail"
import { Product } from "@/types/product"
export async function generateStaticParams() {
  const { data } = await supabase
    .from("products")
    .select("id")

  return (data ?? []).map((product) => ({
    id: product.id,
  }))
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params   // 👈 esto es la clave

  if (!id) {
    return notFound()
  }

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      brand,
      category,
      description,
      image_url,
      usd_rate,
      price_usd,
      product_variants (
        id,
        color_name,
        color_hex,
        storage_gb,
        ram_gb,
        screen_inches,
        price_usd,
        image_url
      ),
      products_colors (
        id,
        name,
        hex,
        image_url
      )
    `)
    .eq("id", id)
    .single<Product>()

  if (error || !data) {
    return notFound()
  }

  const { data: relatedProducts } = await supabase
    .from("products")
    .select(`
      id,
      name,
      brand,
      category,
      description,
      image_url,
      usd_rate,
      price_usd,
      product_variants (
        id,
        color_name,
        color_hex,
        storage_gb,
        ram_gb,
        screen_inches,
        price_usd,
        image_url
      ),
      products_colors (
        id,
        name,
        hex,
        image_url
      )
    `)
    .eq("category", data.category)
    .neq("id", data.id)
    .limit(5)

  return <ProductDetail product={data} relatedProducts={relatedProducts ?? []} />
}
