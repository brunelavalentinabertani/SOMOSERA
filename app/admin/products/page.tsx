import { supabaseServer } from "../../../lib/supabaseServer"
import AdminProductsClient from "./admin-products.client"

export default async function AdminProductsPage() {
  const supabase = await supabaseServer()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
  id,
  name,
  price_usd,
  category,
  Featured,
  product_variants (
    id,
    price_usd,
    color_name,
    storage_gb
  )
`)
    .order("created_at", { ascending: false })

  if (error) {
    return <p>Error cargando productos</p>
  }

  return <AdminProductsClient products={products ?? []} />
}
